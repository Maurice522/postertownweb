// Runs after the build. WhatsApp, Instagram and Facebook link previews don't run
// JavaScript, so every product page would otherwise preview as plain "Poster Town".
// For each product in the catalog snapshot this writes build/singleproduct/<id>.html:
// the normal app page with that product's title, description and image in the head.
// Netlify serves it for /singleproduct/<id>; the app then starts as usual. Products
// added after the deploy fall back to the plain page until the next deploy.
// Also writes sitemap.xml. Keep the tags in step with src/utils/pageMeta.js.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const SITE_URL = "https://metalpostertown.in";
const buildDir = new URL("../build/", import.meta.url);

const escapeHtml = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let products;
try {
  products = JSON.parse(await readFile(new URL("catalog-snapshot.json", buildDir), "utf8")).products;
} catch {
  console.log("product pages: skipped (no catalog snapshot)");
  process.exit(0);
}

const template = await readFile(new URL("index.html", buildDir), "utf8");
await mkdir(new URL("singleproduct/", buildDir), { recursive: true });

const pageFor = (product) => {
  const url = `${SITE_URL}/singleproduct/${product.id}`;
  const title = product.seo?.metaTitle || `${product.name} | Metal Poster Town`;
  const description =
    product.seo?.metaDescription || product.description?.short || product.subtitle || "Premium metal wall poster from Poster Town.";
  const featured = product.media?.featuredImage || "";
  const image = featured.includes("/upload/") ? featured.replace("/upload/", "/upload/c_limit,w_1200,f_jpg,q_auto/") : featured;
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:site_name" content="Metal Poster Town" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    image && `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
  ]
    .filter(Boolean)
    .join("");

  return template
    .replace(/<meta name="description"[^>]*>/, "")
    .replace(/<title>[^<]*<\/title>/, tags);
};

let written = 0;
for (const product of products) {
  if (!product?.id || /[^\w-]/.test(product.id)) continue;
  await writeFile(new URL(`singleproduct/${product.id}.html`, buildDir), pageFor(product));
  written += 1;
}

const staticPaths = ["/", "/products", "/collections", "/about"];
const urls = [
  ...staticPaths.map((path) => `<url><loc>${SITE_URL}${path}</loc></url>`),
  ...products
    .filter((product) => product?.id)
    .map(
      (product) =>
        `<url><loc>${SITE_URL}/singleproduct/${product.id}</loc>${
          product.updatedAt ? `<lastmod>${String(product.updatedAt).slice(0, 10)}</lastmod>` : ""
        }</url>`
    ),
];
await writeFile(
  new URL("sitemap.xml", buildDir),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>\n`
);

console.log(`product pages: wrote ${written} pages and sitemap.xml`);
