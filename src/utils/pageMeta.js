import { useEffect } from "react";

// Page title, description and link-preview (Open Graph / Twitter) tags for the page
// being viewed. The build also writes these into a static copy of each product page
// (scripts/product-pages.mjs) for WhatsApp/Instagram previews, which don't run JS;
// this keeps them right while customers move around the site.
export const SITE_NAME = "Poster Town";
export const SITE_URL = "https://metalpostertown.in";

const DEFAULTS = {
  title: SITE_NAME,
  description: "Poster Town - premium metal wall posters of anime, movies, games and cars, shipped across India.",
};

function setMeta(attribute, key, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!content) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function applyMeta({ title, description, image, url, type }) {
  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:image", image);
  setMeta("property", "og:url", url);
  setMeta("property", "og:type", type);
  setMeta("property", "og:site_name", SITE_NAME);
  setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
}

export function usePageMeta(meta) {
  const { title, description, image, url, type } = meta || {};
  useEffect(() => {
    if (!title) return undefined;
    applyMeta({ title, description: description || DEFAULTS.description, image, url, type: type || "website" });
    return () => applyMeta({ ...DEFAULTS, type: "website" });
  }, [title, description, image, url, type]);
}

// Title/description/image for a product, from the SEO fields written at upload.
export function productMeta(product) {
  if (!product) return null;
  const featured = product.media?.featuredImage || product.image || "";
  return {
    title: product.seo?.metaTitle || `${product.name} | ${SITE_NAME}`,
    description:
      product.seo?.metaDescription ||
      product.descriptionInfo?.short ||
      (typeof product.description === "string" ? product.description : product.description?.short) ||
      DEFAULTS.description,
    // A 1200px-wide JPEG: what link previews handle best.
    image: featured.includes("/upload/") ? featured.replace("/upload/", "/upload/c_limit,w_1200,f_jpg,q_auto/") : featured,
    url: `${SITE_URL}/singleproduct/${product.id}`,
    type: "product",
  };
}
