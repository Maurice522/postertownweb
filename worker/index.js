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
import { buildCollections } from "../src/data/collections.js";
import { normalizeProducts } from "../src/utils/productHelpers.js";

const SITE_NAME = "Poster Town";
const DEFAULT_DESCRIPTION =
  "Premium 1 mm metal posters of anime, cars, games and movies in A4, A3 and A2. Free shipping on 2+ posters across India.";

// The catalog is re-read from the API when the cached copy is older than this. Older
// copies are still served (and refreshed in the background) so pages never wait.
const CATALOG_FRESH_MS = 5 * 60 * 1000;
// A sleeping Render backend takes ~25s to answer; don't hold a page for it.
const API_TIMEOUT_MS = 4000;
const CATALOG_CACHE_KEY = "https://catalog.internal/seo-index-v1";

const PRIVATE_PATHS = new Set(["/cart", "/orders", "/contact", "/auth"]);
const STATIC_PAGES = {
  "/": {
    title: "Metal Posters Online in India – Anime, Car & Gaming Wall Art | Poster Town",
    description: DEFAULT_DESCRIPTION,
  },
  "/products": {
    title: "Shop All Metal Posters – A4, A3 & A2 | Poster Town",
    description:
      "Browse every Poster Town metal poster: anime, cars, games, superheroes and movies on 1 mm metal. Any 3 A4 for ₹1599 and free shipping on 2+ posters.",
  },
  "/collections": {
    title: "Metal Poster Collections – Demon Slayer, Dragon Ball & More | Poster Town",
    description:
      "Curated metal poster collections by fandom: Demon Slayer, Dragon Ball Z, One Piece, Naruto, cars and more. Build a wall that tells one story.",
  },
  "/about": {
    title: "About Poster Town – Premium Metal Wall Posters",
    description: "Poster Town prints premium metal wall posters of the anime, games, cars and films you love, shipped across India.",
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
    };
  }
  const collections = {};
  for (const collection of buildCollections(products)) {
    collections[collection.slug] = {
      title: collection.title,
      description: collection.description,
      count: collection.count,
      fromPrice: collection.fromPrice,
      image: collection.products[0]?.media?.featuredImage || "",
    };
  }
  return { savedAt: Date.now(), products: byId, collections };
}

async function fetchCatalog(env) {
  const res = await fetch(`${env.API_BASE_URL}/api/products`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const products = await res.json();
  if (!Array.isArray(products) || !products.length) throw new Error("empty catalog");
  return seoIndex(products);
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

// A 1200px JPEG: what link previews and Google handle best.
const shareImage = (url = "") =>
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
    }));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [...new Set([product.image, ...product.gallery].filter(Boolean))].map(shareImage),
    ...(product.sku ? { sku: product.sku } : {}),
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

// What to put in the page's head for this address, or null when it isn't a page.
async function pageFor(url, env, ctx) {
  const { pathname } = url;
  // Links in tags always name the real domain, whichever address served the page.
  const origin = env.SITE_URL;
  const canonical = `${origin}${pathname}`;

  if (STATIC_PAGES[pathname]) {
    const page = STATIC_PAGES[pathname];
    const schema =
      pathname === "/"
        ? [
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: origin,
              logo: `${origin}/logo512.png`,
            },
            { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: origin },
          ]
        : [breadcrumbs(origin, [["Home", "/"], [page.title.split(" – ")[0].split(" | ")[0], pathname]])];
    return { ...page, canonical, schema };
  }

  if (PRIVATE_PATHS.has(pathname)) {
    return { title: SITE_NAME, description: DEFAULT_DESCRIPTION, canonical, noindex: true };
  }

  const productMatch = pathname.match(/^\/singleproduct\/([\w-]+)$/);
  if (productMatch) {
    const id = productMatch[1];
    let catalog = await getCatalog(env, ctx, url);
    // Added in the last few minutes? Check the API before calling it missing.
    if (!catalog.products[id]) catalog = await getCatalog(env, ctx, url, { forceFresh: true });
    const product = catalog.products[id];
    if (!product) return null;
    return {
      title: product.title,
      description: product.description,
      canonical,
      image: shareImage(product.image),
      type: "product",
      price: product.price,
      schema: [
        productSchema(origin, id, product),
        breadcrumbs(origin, [["Home", "/"], ["Products", "/products"], [product.name, pathname]]),
      ],
    };
  }

  const collectionMatch = pathname.match(/^\/collections\/([\w-]+)$/);
  if (collectionMatch) {
    const catalog = await getCatalog(env, ctx, url);
    const collection = catalog.collections[collectionMatch[1]];
    if (!collection) return null;
    const from = collection.fromPrice > 0 ? ` From ₹${collection.fromPrice}.` : "";
    return {
      title: `${collection.title} Metal Posters | ${SITE_NAME}`,
      description: `${collection.description} ${collection.count} designs in A4, A3 and A2.${from}`,
      canonical,
      image: shareImage(collection.image),
      schema: [
        breadcrumbs(origin, [["Home", "/"], ["Collections", "/collections"], [collection.title, pathname]]),
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
  if (page.image) tags.push(`<meta property="og:image" content="${escapeHtml(page.image)}" />`);
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
    .transform(shell);

  const headers = new Headers(rewritten.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.delete("ETag");
  headers.set("Strict-Transport-Security", "max-age=31536000");
  // The workers.dev test address must never compete with the real domain in search.
  if (head.noindex || new URL(request.url).hostname !== new URL(env.SITE_URL).hostname) {
    headers.set("X-Robots-Tag", "noindex");
  }
  return new Response(rewritten.body, { status, headers });
}

async function sitemap(url, env, ctx) {
  const catalog = await getCatalog(env, ctx, url);
  const entry = (path, lastmod) =>
    `<url><loc>${env.SITE_URL}${path}</loc>${lastmod ? `<lastmod>${String(lastmod).slice(0, 10)}</lastmod>` : ""}</url>`;
  const body = [
    ...Object.keys(STATIC_PAGES).map((path) => entry(path)),
    ...Object.keys(catalog.collections).map((slug) => entry(`/collections/${slug}`)),
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
    if (url.protocol === "http:" && url.hostname !== "localhost") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    // www.metalpostertown.in → metalpostertown.in, one address for search engines.
    if (url.hostname === `www.${new URL(env.SITE_URL).hostname}`) {
      return Response.redirect(`${env.SITE_URL}${url.pathname}${url.search}`, 301);
    }
    if (!["GET", "HEAD"].includes(request.method)) return env.ASSETS.fetch(request);

    if (url.pathname === "/sitemap.xml") return sitemap(url, env, ctx);

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
