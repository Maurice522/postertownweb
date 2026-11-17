// Cloudflare Worker in front of the storefront build (the React app in build/).
// Static files (/static, /images) are served by Cloudflare directly; every page
// request comes here first, so before the app's HTML is sent we can:
// - give each page its own title, description, canonical link, link-preview tags and
//   schema.org data (search engines and WhatsApp/Instagram previews read these
//   before any JavaScript runs),
// - answer 404 for addresses that aren't pages and for deleted products,
// - keep cart, orders and sign-in out of search results,
// - build sitemap.xml from the live catalog.
// Product and collection data comes from the API, cached here for a few minutes, so a
// product added in the admin console shows up without a new deploy.
import { buildCollections, primaryCollectionFor } from "../src/data/collections.js";
import { collectionSeoFor } from "../src/data/collectionSeo.js";
import { normalizeProducts } from "../src/utils/productHelpers.js";
import { homeCopyIntro, homeCopySections } from "../src/data/homeCopy.js";
import { faqForPage } from "../src/data/faq.js";
import { aboutCopy } from "../src/data/aboutCopy.js";
import { POLICY_DATE, POLICY_UPDATED, policies, policyByPath } from "../src/data/policies.js";
import { GUIDES_UPDATED, guideBySlug, guides } from "../src/data/guides.js";
import { A4_BUNDLE_PRICE, A4_BUNDLE_SIZE, FREE_SHIPPING_MIN_ITEMS, SHIPPING_FEE } from "../src/utils/pricing.js";

const SITE_NAME = "Metal Poster Town";
const DEFAULT_DESCRIPTION =
  "Ultra HD metal posters for your wall from Metal Poster Town: anime, Demon Slayer, One Piece, Naruto, Gojo, Batman and more on 1 mm steel. Free shipping on 2+.";
// Link-preview image for pages without their own (public/og-image.jpg, 1200x630).
const SHARE_IMAGE_PATH = "/og-image.jpg";
// The home page h1, word for word as the app renders it (components/HeroSection.js).
const HOME_HEADING = "Ultra HD metal posters for your wall by Poster Town!";

// The catalog is re-read from the API when the cached copy is older than this. Older
// copies are still served (and refreshed in the background) so pages never wait.
const CATALOG_FRESH_MS = 5 * 60 * 1000;
// A sleeping Render backend takes ~25s to answer; don't hold a page for it.
const API_TIMEOUT_MS = 4000;
const CATALOG_CACHE_KEY = "https://catalog.internal/seo-index-v4";

// /contact shows the Orders page (App.js), so it stays out of search like /orders.
const PRIVATE_PATHS = new Set(["/cart", "/orders", "/contact", "/auth"]);
const STATIC_PAGES = {
  "/": {
    title: "Metal Posters for Wall – Ultra HD Anime | Metal Poster Town",
    description: DEFAULT_DESCRIPTION,
  },
  "/products": {
    title: "All Metal Posters: Anime & Superhero | Metal Poster Town",
    description:
      "Browse every Poster Town metal poster: ultra HD anime, superhero, car and gaming designs on 1 mm steel. Any 3 A4 for ₹1599 and free shipping on 2+ posters.",
  },
  "/collections": {
    title: "Metal Poster Collections by Fandom | Metal Poster Town",
    description:
      "Curated metal poster collections by fandom: Demon Slayer, Dragon Ball Z, One Piece, Naruto, cars and more. Build a wall that tells one story.",
  },
  "/about": {
    title: "About Us – Ultra HD Metal Poster Store | Metal Poster Town",
    description:
      "Metal Poster Town prints ultra HD metal posters of the anime, superheroes, games and cars you love on 1 mm steel, shipped across India.",
  },
};

// ---------- catalog ----------

// Everything a page's tags need, kept small so each request stays cheap.
function seoIndex(rawProducts) {
  const products = normalizeProducts(rawProducts);
  const byId = {};
  for (const product of products) {
    const sizes = (product.sizes || []).filter((size) => size.price > 0);
    byId[product.id] = {
      name: product.name,
      title: product.seo?.metaTitle || `${product.name} | ${SITE_NAME}`,
      description:
        product.seo?.metaDescription || product.descriptionInfo?.short || product.subtitle || DEFAULT_DESCRIPTION,
      fullDescription: product.fullDescription || "",
      features: (product.descriptionInfo?.features || []).slice(0, 8),
      image: product.media?.featuredImage || product.image || "",
      gallery: (product.media?.gallery || []).slice(0, 4),
      sku: product.sku || "",
      category: product.category || "",
      updatedAt: product.updatedAt || product.createdAt || "",
      inStock: Number(product.stock) > 0,
      sizes: sizes.map((size) => ({
        name: [size.type, size.paper, size.inches && `${size.inches} in`].filter(Boolean).join(" · "),
        sku: size.sku || "",
        price: size.price,
        inStock: Number(size.stock) > 0,
      })),
      price: product.price,
      ratings: product.ratings?.count > 0 ? product.ratings : null,
      collection: (({ slug, title } = {}) => (slug ? { slug, title } : null))(primaryCollectionFor(product) || {}),
    };
  }
  const collections = {};
  for (const collection of buildCollections(products)) {
    const seo = collectionSeoFor(collection);
    collections[collection.slug] = {
      title: collection.title,
      seoTitle: seo.title,
      seoDescription: seo.description,
      description: collection.description,
      count: collection.count,
      fromPrice: collection.fromPrice,
      image: collection.products[0]?.media?.featuredImage || "",
      heading: seo.heading || "",
      intro: seo.intro || "",
      products: collection.products
        .slice(0, 40)
        .map((product) => ({ id: product.id, name: product.name, price: product.price })),
    };
  }
  return { savedAt: Date.now(), products: byId, collections };
}

// The full product list, as the storefront app uses it. Kept at the edge so shoppers
// never wait for the Render API (2–3 s, or ~50 s when it wakes from sleep).
const RAW_CATALOG_KEY = "https://catalog.internal/raw-v1";

async function storeRaw(products) {
  await caches.default.put(
    RAW_CATALOG_KEY,
    new Response(JSON.stringify({ savedAt: Date.now(), products }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=604800" },
    })
  );
}

async function fetchCatalog(env) {
  const res = await fetch(`${env.API_BASE_URL}/api/products`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const products = await res.json();
  if (!Array.isArray(products) || !products.length) throw new Error("empty catalog");
  await storeRaw(products);
  return seoIndex(products);
}

// GET /catalog.json: the edge copy of the catalog (refreshed in the background when
// older than 5 minutes), else the live API, else the copy shipped with the build.
async function catalogJson(request, env, ctx, url) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=60" };
  const cached = await caches.default.match(RAW_CATALOG_KEY);
  if (cached) {
    const body = await cached.text();
    const savedAt = Number((body.match(/^\{"savedAt":(\d+)/) || [])[1]) || 0;
    if (Date.now() - savedAt > CATALOG_FRESH_MS) ctx.waitUntil(fetchCatalog(env).then(storeIndex).catch(() => {}));
    return new Response(body, { headers });
  }
  try {
    await storeIndex(await fetchCatalog(env));
    const fresh = await caches.default.match(RAW_CATALOG_KEY);
    if (fresh) return new Response(await fresh.text(), { headers });
  } catch {
    // API asleep or slow: fall through to the build's copy and refresh in the background.
    ctx.waitUntil(fetchCatalog(env).then(storeIndex).catch(() => {}));
  }
  const snapshot = await env.ASSETS.fetch(new URL("/catalog-snapshot.json", url));
  return new Response(snapshot.body, { status: snapshot.status, headers: { ...headers, "Cache-Control": "no-store" } });
}

async function storeIndex(index) {
  await caches.default.put(
    CATALOG_CACHE_KEY,
    new Response(JSON.stringify(index), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=604800" },
    })
  );
  return index;
}

// The build ships a copy of the catalog; used when the API is asleep and nothing is
// cached yet.
async function snapshotIndex(env, url) {
  const res = await env.ASSETS.fetch(new URL("/catalog-snapshot.json", url));
  if (!res.ok) return null;
  const snapshot = await res.json();
  return Array.isArray(snapshot?.products) ? seoIndex(snapshot.products) : null;
}

async function getCatalog(env, ctx, url, { forceFresh = false } = {}) {
  const cached = await caches.default.match(CATALOG_CACHE_KEY);
  const index = cached ? await cached.json() : null;
  const stale = !index || Date.now() - index.savedAt > CATALOG_FRESH_MS;

  if (index && !forceFresh) {
    if (stale) ctx.waitUntil(fetchCatalog(env).then(storeIndex).catch(() => {}));
    return index;
  }
  try {
    return await storeIndex(await fetchCatalog(env));
  } catch {
    if (index) return index;
    const fallback = await snapshotIndex(env, url);
    // Try the API again in the background; meanwhile the build's copy is used.
    ctx.waitUntil(fetchCatalog(env).then(storeIndex).catch(() => {}));
    return fallback || { savedAt: 0, products: {}, collections: {} };
  }
}

// ---------- tags ----------

const escapeHtml = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// JSON inside <script>: stop "</script>" in a product name from ending the tag.
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

// Link previews want a 1200x630 JPEG. Posters are portrait, so pad them onto a dark
// background instead of cropping.
const SHARE_WIDTH = 1200;
const SHARE_HEIGHT = 630;
const shareImage = (url = "") =>
  url.includes("/upload/")
    ? url.replace("/upload/", `/upload/c_pad,w_${SHARE_WIDTH},h_${SHARE_HEIGHT},b_rgb:1c1715,f_jpg,q_auto/`)
    : url;
// Google wants the full-size images in Product data.
const largeImage = (url = "") =>
  url.includes("/upload/") ? url.replace("/upload/", "/upload/c_limit,w_1200,f_jpg,q_auto/") : url;

function breadcrumbs(origin, trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${origin}${path}`,
    })),
  };
}

// The store's published terms (FAQ, Services.js, utils/pricing.js): ₹100 shipping on a
// single poster (free on 2+), dispatch within 2 days, 3–7 days in transit, and 7 days
// to report a problem.
const SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: SHIPPING_FEE, currency: "INR" },
  shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "DAY" },
  },
};
const RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "IN",
  returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 7,
};

function productSchema(origin, id, product) {
  const url = `${origin}/singleproduct/${id}`;
  const offers = (product.sizes.length ? product.sizes : [{ name: "", sku: product.sku, price: product.price, inStock: product.inStock }])
    .filter((size) => size.price > 0)
    .map((size) => ({
      "@type": "Offer",
      ...(size.name ? { name: size.name } : {}),
      ...(size.sku ? { sku: size.sku } : {}),
      price: size.price,
      priceCurrency: "INR",
      availability: `https://schema.org/${size.inStock ? "InStock" : "OutOfStock"}`,
      itemCondition: "https://schema.org/NewCondition",
      url,
      shippingDetails: SHIPPING_DETAILS,
      hasMerchantReturnPolicy: RETURN_POLICY,
    }));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    material: "Galvanised steel",
    name: product.name,
    description: product.description,
    image: [...new Set([product.image, ...product.gallery].filter(Boolean))].map(largeImage),
    ...(product.sku ? { sku: product.sku.replace(/-{2,}/g, "-") } : {}),
    ...(product.category ? { category: product.category } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers,
    ...(product.ratings
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratings.average,
            reviewCount: product.ratings.count,
          },
        }
      : {}),
  };
}

// Plain text and links for the page, served inside #root below the loading screen.
// Search engines read it straight away instead of a near-empty page; shoppers never
// see it (the loader fills the screen and the app replaces it within a second).
function crawlerHtml({ heading, paragraphs = [], sections = [], links = [], faq = false }) {
  // A paragraph is a string, or a list of pieces: text, or [link text, path].
  const paragraph = (value) => {
    const pieces = Array.isArray(value) ? value : [value];
    const html = pieces
      .map((piece) =>
        Array.isArray(piece) ? `<a href="${escapeHtml(piece[1])}">${escapeHtml(piece[0])}</a>` : escapeHtml(piece)
      )
      .join("");
    return html.trim() ? `<p>${html}</p>` : "";
  };
  const list = (items) =>
    items.length
      ? `<ul>${items
          .map((item) =>
            Array.isArray(item)
              ? `<li><a href="${escapeHtml(item[1])}">${escapeHtml(item[0])}</a></li>`
              : `<li>${escapeHtml(item)}</li>`
          )
          .join("")}</ul>`
      : "";
  const parts = [`<h1>${escapeHtml(heading)}</h1>`, ...paragraphs.filter(Boolean).map(paragraph)];
  for (const section of sections) {
    const body = (section.paragraphs || []).filter(Boolean).map(paragraph).join("") + list(section.list || []);
    if (body) parts.push(`<h2>${escapeHtml(section.heading)}</h2>${body}`);
  }
  if (faq) {
    parts.push("<h2>Frequently asked questions</h2>");
    for (const item of faqForPage[faq] || faqForPage.home) parts.push(`<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`);
  }
  if (links.length) parts.push(list(links));
  return `<div class="pt-seo">${parts.join("")}</div>`;
}

// Matches the per-size availability in the Product schema (poster-003 had A3/A2 out
// of stock while the text said "in stock").
function stockSentence(sizes = [], inStock) {
  if (!sizes.length) return inStock ? "In stock and ready to ship across India." : "Currently out of stock.";
  const name = (size) => size.name.split(" · ").slice(0, 2).join(" ");
  const available = sizes.filter((size) => size.inStock).map(name);
  const missing = sizes.filter((size) => !size.inStock).map(name);
  if (!available.length) return "Currently out of stock in every size.";
  if (!missing.length) return "All sizes in stock and ready to ship across India.";
  return `In stock: ${available.join(", ")}. Currently out of stock: ${missing.join(", ")}.`;
}

// A guide's blocks as plain HTML for the server-rendered text (same words as GuidePage.js).
function guideHtml(guide, catalog) {
  const esc = escapeHtml;
  const pieces = (value) =>
    (Array.isArray(value) ? value : [value])
      .map((piece) => (Array.isArray(piece) ? `<a href="${esc(piece[1])}">${esc(piece[0])}</a>` : esc(piece)))
      .join("");
  const table = (head, rows) =>
    `<table><thead><tr>${head.map((cell) => `<th>${esc(cell)}</th>`).join("")}</tr></thead><tbody>${rows
      .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
  const parts = [`<h1>${esc(guide.title)}</h1>`, `<p>${esc(guide.intro)}</p>`];
  for (const block of guide.blocks) {
    if (block.h2) parts.push(`<h2>${esc(block.h2)}</h2>`);
    else if (block.p) parts.push(`<p>${pieces(block.p)}</p>`);
    else if (block.list) parts.push(`<ul>${block.list.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`);
    else if (block.steps) parts.push(`<ol>${block.steps.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>`);
    else if (block.table) parts.push(table(block.table.head, block.table.rows));
    else if (block.priceTable && catalog) {
      const rows = [["A4", "Small (A4), 12 x 9 in"], ["A3", "Medium (A3), 15.8 x 12 in"], ["A2", "Large (A2), 24 x 18 in"]]
        .map(([paper, label]) => {
          const prices = Object.values(catalog.products).flatMap((product) =>
            (product.sizes || []).filter((size) => size.name.includes(` ${paper} `) || size.name.includes(`· ${paper}`)).map((size) => size.price)
          );
          if (!prices.length) return null;
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          return [label, min === max ? money(min) : `${money(min)} – ${money(max)}`];
        })
        .filter(Boolean);
      if (rows.length) parts.push(table(["Size", "Price range"], rows));
    }
  }
  parts.push(
    `<h2>More guides</h2><ul>${guides
      .filter((item) => item.slug !== guide.slug)
      .map((item) => `<li><a href="/guides/${item.slug}">${esc(item.title)}</a></li>`)
      .join("")}</ul>`
  );
  return `<div class="pt-seo">${parts.join("")}</div>`;
}

// Up to 6 other posters, from the same collection first, then the same category.
function relatedProducts(catalog, id, product) {
  const others = Object.entries(catalog.products).filter(([otherId]) => otherId !== id);
  const same = (other) =>
    (product.collection && other.collection?.slug === product.collection.slug ? 2 : 0) + (other.category === product.category ? 1 : 0);
  return others
    .map((entry) => [entry, same(entry[1])])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([entry]) => entry);
}

const posterCount = (count) => `${count} ${count === 1 ? "poster" : "posters"}`;
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

function collectionLinks(catalog) {
  return Object.entries(catalog.collections).map(([slug, item]) => [item.heading || item.title, `/collections/${slug}`]);
}

// What to put in the page's head for this address, or null when it isn't a page.
async function pageFor(url, env, ctx) {
  const { pathname } = url;
  // Links in tags always name the real domain, whichever address served the page.
  const origin = env.SITE_URL;
  const canonical = `${origin}${pathname}`;

  // Buying guides (src/data/guides.js), with Article schema.
  if (pathname === "/guides") {
    return {
      title: "Metal Poster Guides – Hanging, Sizes & Prices | Metal Poster Town",
      description: "Guides to metal posters: what they are, how to hang one without drilling, how they compare with canvas and paper, and prices in India.",
      canonical,
      image: `${origin}${SHARE_IMAGE_PATH}`,
      schema: [breadcrumbs(origin, [["Home", "/"], ["Guides", "/guides"]])],
      body: crawlerHtml({
        heading: "Metal poster guides",
        paragraphs: ["Everything to know before you buy: what metal posters are, how to hang them, how they compare and what they cost."],
        sections: guides.map((guide) => ({ heading: guide.title, paragraphs: [[guide.description + " ", ["Read the guide", `/guides/${guide.slug}`]]] })),
      }),
    };
  }
  const guideMatch = pathname.match(/^\/guides\/([\w-]+)$/);
  if (guideMatch) {
    const guide = guideBySlug[guideMatch[1]];
    if (!guide) return null;
    const catalog = guide.blocks.some((block) => block.priceTable) ? await getCatalog(env, ctx, url) : null;
    return {
      title: guide.metaTitle,
      description: guide.description,
      canonical,
      type: "article",
      image: `${origin}${SHARE_IMAGE_PATH}`,
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          url: canonical,
          datePublished: GUIDES_UPDATED,
          dateModified: GUIDES_UPDATED,
          image: `${origin}${SHARE_IMAGE_PATH}`,
          author: { "@type": "Organization", name: SITE_NAME, url: origin },
          publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${origin}/logo512.png` } },
        },
        breadcrumbs(origin, [["Home", "/"], ["Guides", "/guides"], [guide.title, pathname]]),
      ],
      body: guideHtml(guide, catalog),
    };
  }

  // Shipping, refund, privacy and terms pages (src/data/policies.js).
  const policy = policyByPath[pathname];
  if (policy) {
    return {
      title: policy.metaTitle,
      description: policy.description,
      canonical,
      image: `${origin}${SHARE_IMAGE_PATH}`,
      schema: [breadcrumbs(origin, [["Home", "/"], [policy.title, pathname]])],
      body: crawlerHtml({
        heading: policy.title,
        paragraphs: [policy.intro],
        sections: [...policy.sections, { heading: "Last updated", paragraphs: [POLICY_UPDATED] }],
        links: policies.filter((item) => item.path !== pathname).map((item) => [item.title, item.path]),
      }),
    };
  }

  if (STATIC_PAGES[pathname]) {
    const page = STATIC_PAGES[pathname];
    const schema =
      pathname === "/"
        ? [
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              alternateName: "Poster Town",
              url: origin,
              logo: `${origin}/logo512.png`,
              email: "Official@metalpostertown.in",
              sameAs: [
                "https://www.instagram.com/metalpostertown/",
                "https://www.facebook.com/profile.php?id=61566400029644",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                telephone: "+91-9953749307",
                email: "Official@metalpostertown.in",
                areaServed: "IN",
              },
            },
            { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, alternateName: "Poster Town", url: origin },
          ]
        : [breadcrumbs(origin, [["Home", "/"], [page.title.split(" – ")[0].split(" | ")[0], pathname]])];
    const catalog = ["/", "/collections", "/products"].includes(pathname) ? await getCatalog(env, ctx, url) : null;
    const links =
      pathname === "/products"
        ? Object.entries(catalog.products).map(([id, item]) => [item.name, `/singleproduct/${id}`])
        : catalog
          ? collectionLinks(catalog)
          : [["Shop all metal posters", "/products"], ["Collections", "/collections"]];
    const sections = [];
    if (pathname === "/") {
      sections.push({ heading: homeCopyIntro.heading, paragraphs: [homeCopyIntro.paragraph] });
      for (const section of homeCopySections) sections.push({ heading: section.heading, paragraphs: [section.paragraph] });
    }
    if (pathname === "/about") {
      for (const section of aboutCopy.sections) sections.push({ heading: section.heading, paragraphs: [section.paragraph] });
    }
    if (pathname === "/collections") {
      sections.push({
        heading: "Every collection",
        list: Object.entries(catalog.collections).map(([slug, item]) => [
          `${item.heading || item.title} – ${posterCount(item.count)} from ${money(item.fromPrice)}. ${item.description || ""}`.trim(),
          `/collections/${slug}`,
        ]),
      });
    }
    const body = crawlerHtml({
      heading: pathname === "/" ? HOME_HEADING : pathname === "/about" ? aboutCopy.heading : page.title.split(" | ")[0],
      paragraphs: pathname === "/about" ? [aboutCopy.intro] : [page.description],
      sections,
      faq: { "/": "home", "/about": "about", "/collections": "collections" }[pathname] || false,
      links: pathname === "/collections" ? [] : links,
    });
    return { ...page, canonical, schema, body, image: `${origin}${SHARE_IMAGE_PATH}`, imageAlt: "Metal Poster Town – ultra HD metal posters" };
  }

  if (PRIVATE_PATHS.has(pathname)) {
    return { title: SITE_NAME, description: DEFAULT_DESCRIPTION, canonical, noindex: true, image: `${origin}${SHARE_IMAGE_PATH}` };
  }

  const productMatch = pathname.match(/^\/singleproduct\/([\w-]+)$/);
  if (productMatch) {
    const id = productMatch[1];
    let catalog = await getCatalog(env, ctx, url);
    // Added in the last few minutes? Check the API before calling it missing.
    if (!catalog.products[id]) catalog = await getCatalog(env, ctx, url, { forceFresh: true });
    const product = catalog.products[id];
    if (!product) return null;
    const prices = product.sizes.map((size) => size.price);
    const body = crawlerHtml({
      heading: product.name,
      paragraphs: [
        product.description,
        prices.length ? `Ultra HD metal poster from ${money(Math.min(...prices))}.` : "",
        stockSentence(product.sizes, product.inStock),
      ],
      sections: [
        {
          heading: "Product details",
          paragraphs:
            product.fullDescription && product.fullDescription !== product.description
              ? product.fullDescription.split(/\n\s*\n/)
              : [],
        },
        { heading: "Highlights", list: product.features || [] },
        { heading: "Sizes and prices", list: product.sizes.map((size) => `${size.name}: ${money(size.price)}`) },
        {
          heading: "Offers and delivery",
          paragraphs: [
            `Free shipping when you buy ${FREE_SHIPPING_MIN_ITEMS} or more posters, and any ${A4_BUNDLE_SIZE} A4 metal posters for ${money(A4_BUNDLE_PRICE)}. Orders are dispatched within 24 to 48 hours and reach most of India in 3 to 7 days. Pay with any UPI app.`,
          ],
        },
      ],
      faq: "product",
      links: [
        ...relatedProducts(catalog, id, product).map(([otherId, other]) => [other.name, `/singleproduct/${otherId}`]),
        ...(product.collection ? [[`More ${product.collection.title} posters`, `/collections/${product.collection.slug}`]] : []),
        ["Shop all metal posters", "/products"],
      ],
    });
    return {
      title: product.title,
      description: product.description,
      body,
      canonical,
      image: shareImage(product.image),
      imageAlt: product.name,
      type: "product",
      price: product.price,
      schema: [
        productSchema(origin, id, product),
        breadcrumbs(origin, [
          ["Home", "/"],
          product.collection
            ? [product.collection.title, `/collections/${product.collection.slug}`]
            : ["Products", "/products"],
          [product.name, pathname],
        ]),
      ],
    };
  }

  const collectionMatch = pathname.match(/^\/collections\/([\w-]+)$/);
  if (collectionMatch) {
    const catalog = await getCatalog(env, ctx, url);
    const collection = catalog.collections[collectionMatch[1]];
    if (!collection) return null;
    const body = crawlerHtml({
      heading: collection.heading || collection.title,
      paragraphs: [collection.seoDescription, collection.description, `${posterCount(collection.count)} from ${money(collection.fromPrice)}.`],
      sections: [
        {
          heading: `${collection.title} posters in this collection`,
          list: (collection.products || []).map((item) => [
            item.price ? `${item.name} – from ${money(item.price)}` : item.name,
            `/singleproduct/${item.id}`,
          ]),
        },
        { heading: `About our ${collection.heading || collection.title}`, paragraphs: [collection.intro] },
      ],
      faq: "collection",
    });
    return {
      title: collection.seoTitle,
      description: collection.seoDescription,
      body,
      canonical,
      image: collection.image ? shareImage(collection.image) : `${origin}${SHARE_IMAGE_PATH}`,
      imageAlt: collection.heading || collection.title,
      schema: [
        breadcrumbs(origin, [["Home", "/"], ["Collections", "/collections"], [collection.title, pathname]]),
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.heading || collection.title,
          url: canonical,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: (collection.products || []).length,
            itemListElement: (collection.products || []).map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${origin}/singleproduct/${item.id}`,
              name: item.name,
            })),
          },
        },
      ],
    };
  }

  return null;
}

function headTags(page) {
  const tags = [
    `<link rel="canonical" href="${escapeHtml(page.canonical)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${page.type || "website"}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(page.canonical)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="${page.image ? "summary_large_image" : "summary"}" />`,
  ];
  tags.push(`<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(page.description)}" />`);
  if (page.image) {
    tags.push(`<meta property="og:image" content="${escapeHtml(page.image)}" />`);
    tags.push(`<meta property="og:image:secure_url" content="${escapeHtml(page.image)}" />`);
    tags.push(`<meta property="og:image:type" content="image/jpeg" />`);
    tags.push(`<meta property="og:image:width" content="${SHARE_WIDTH}" />`);
    tags.push(`<meta property="og:image:height" content="${SHARE_HEIGHT}" />`);
    tags.push(`<meta property="og:image:alt" content="${escapeHtml(page.imageAlt || page.title)}" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(page.image)}" />`);
  }
  if (page.price) {
    tags.push(`<meta property="product:price:amount" content="${page.price}" />`);
    tags.push(`<meta property="product:price:currency" content="INR" />`);
  }
  if (page.noindex) tags.push(`<meta name="robots" content="noindex, follow" />`);
  for (const schema of page.schema || []) tags.push(jsonLd(schema));
  return tags.join("");
}

// ---------- responses ----------

async function renderApp(request, env, page, status) {
  // The app's HTML. "/" serves index.html (asking for /index.html would redirect).
  const shell = await env.ASSETS.fetch(new Request(new URL("/", request.url), { headers: request.headers }));
  const head = page || {
    title: `Page not found | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    noindex: true,
    canonical: `${env.SITE_URL}${new URL(request.url).pathname}`,
  };

  const rewritten = new HTMLRewriter()
    .on("title", { element: (el) => el.setInnerContent(head.title) })
    .on('meta[name="description"]', { element: (el) => el.setAttribute("content", head.description) })
    .on("head", { element: (el) => el.append(headTags(head), { html: true }) })
    .on("#root", { element: (el) => head.body && el.append(head.body, { html: true }) })
    .transform(shell);

  const headers = new Headers(rewritten.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.delete("ETag");
  headers.set("Strict-Transport-Security", "max-age=31536000");
  // Basic security headers (no Content-Security-Policy yet: GTM and Google sign-in
  // load scripts from several Google domains, so it needs a report-only trial first).
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  // The workers.dev test address must never compete with the real domain in search.
  if (head.noindex || new URL(request.url).hostname !== new URL(env.SITE_URL).hostname) {
    headers.set("X-Robots-Tag", "noindex");
  }
  return new Response(rewritten.body, { status, headers });
}

// GET /merchant-feed.xml: Google Merchant Center product feed (RSS 2.0, g: namespace),
// one item per size, grouped by product. Shipping on 2+ posters is free; that rule is
// set in Merchant Center's shipping settings (a feed row can't express it).
async function merchantFeed(url, env, ctx) {
  const catalog = await getCatalog(env, ctx, url);
  const origin = env.SITE_URL;
  const x = (value = "") =>
    String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const items = [];
  for (const [id, product] of Object.entries(catalog.products)) {
    const link = `${origin}/singleproduct/${id}`;
    const images = [...new Set([product.image, ...product.gallery].filter(Boolean))].map(largeImage);
    const description = [product.description, product.fullDescription].filter(Boolean).join(" ").replace(/\s+/g, " ").slice(0, 4900);
    const sizes = product.sizes.length ? product.sizes : [{ name: "", sku: product.sku, price: product.price, inStock: product.inStock }];
    sizes.forEach((size, index) => {
      if (!(size.price > 0)) return;
      const label = size.name.split(" · ").slice(0, 2).join(" "); // "Small A4"
      items.push(`<item>
<g:id>${x(size.sku || `${id}-${index + 1}`)}</g:id>
<g:item_group_id>${x(id)}</g:item_group_id>
<g:title>${x(`${product.name}${label ? ` – ${label}` : ""}`.slice(0, 150))}</g:title>
<g:description>${x(description)}</g:description>
<g:link>${x(link)}</g:link>
<g:image_link>${x(images[0] || `${origin}${SHARE_IMAGE_PATH}`)}</g:image_link>
${images.slice(1, 10).map((image) => `<g:additional_image_link>${x(image)}</g:additional_image_link>`).join("\n")}
<g:availability>${size.inStock ? "in_stock" : "out_of_stock"}</g:availability>
<g:price>${Number(size.price).toFixed(2)} INR</g:price>
<g:brand>${x(SITE_NAME)}</g:brand>
<g:condition>new</g:condition>
<g:identifier_exists>no</g:identifier_exists>
<g:google_product_category>500044</g:google_product_category>
<g:product_type>${x(["Metal Posters", product.category, product.collection?.title].filter(Boolean).join(" > "))}</g:product_type>
${size.name ? `<g:size>${x(size.name.replace(/ · /g, " "))}</g:size>` : ""}
<g:material>Galvanised steel</g:material>
<g:shipping><g:country>IN</g:country><g:price>${SHIPPING_FEE}.00 INR</g:price></g:shipping>
</item>`);
    });
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>${x(SITE_NAME)}</title>
<link>${origin}</link>
<description>Ultra HD metal posters printed on 1 mm galvanised steel</description>
${items.join("\n")}
</channel>
</rss>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

async function sitemap(url, env, ctx) {
  const catalog = await getCatalog(env, ctx, url);
  const updated = (id) => catalog.products[id]?.updatedAt || "";
  const newest = Object.keys(catalog.products).map(updated).sort().pop();
  const newestIn = (collection) => (collection.products || []).map((item) => updated(item.id)).sort().pop();
  const entry = (path, lastmod) =>
    `<url><loc>${env.SITE_URL}${path}</loc>${lastmod ? `<lastmod>${String(lastmod).slice(0, 10)}</lastmod>` : ""}</url>`;
  const body = [
    ...Object.keys(STATIC_PAGES).map((path) => entry(path, ["/", "/products", "/collections"].includes(path) ? newest : null)),
    ...policies.map((policy) => entry(policy.path, POLICY_DATE)),
    entry("/guides", GUIDES_UPDATED),
    ...guides.map((guide) => entry(`/guides/${guide.slug}`, GUIDES_UPDATED)),
    ...Object.entries(catalog.collections).map(([slug, item]) => entry(`/collections/${slug}`, newestIn(item))),
    ...Object.entries(catalog.products).map(([id, product]) => entry(`/singleproduct/${id}`, product.updatedAt)),
  ].join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } }
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // Always HTTPS (Netlify used to do this for us).
    // http:// and www. both go straight to https://metalpostertown.in in one hop, so
    // search engines see a single address for every page.
    const siteHost = new URL(env.SITE_URL).hostname;
    if (url.hostname === `www.${siteHost}`) {
      return Response.redirect(`${env.SITE_URL}${url.pathname}${url.search}`, 301);
    }
    if (url.protocol === "http:" && url.hostname !== "localhost") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/index.html") return Response.redirect(`${url.origin}/${url.search}`, 301);
    if (!["GET", "HEAD"].includes(request.method)) return env.ASSETS.fetch(request);

    if (url.pathname === "/sitemap.xml") return sitemap(url, env, ctx);
    if (url.pathname === "/catalog.json") return catalogJson(request, env, ctx, url);
    if (url.pathname === "/merchant-feed.xml") return merchantFeed(url, env, ctx);

    // A file (has an extension): serve it, or a real 404 — never the app page, so a
    // tab from an older deploy notices its page files are gone (AppErrorBoundary).
    if (/\.[a-z0-9]+$/i.test(url.pathname)) {
      // Build-time product page copies are for Netlify only; pages are rendered here.
      if (url.pathname.startsWith("/singleproduct/")) return new Response("Not found", { status: 404 });
      return env.ASSETS.fetch(request);
    }

    // One address per page: drop a trailing slash.
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/+$/, "");
      return Response.redirect(url.toString(), 301);
    }

    const page = await pageFor(url, env, ctx);
    return renderApp(request, env, page, page ? 200 : 404);
  },
};
