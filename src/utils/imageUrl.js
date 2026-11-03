// Cloudinary resizes on request: a card showing a 300px poster only needs a 600px
// image (2x for sharp screens), not the 2500px original. f_auto serves WEBP or AVIF
// where the browser supports it, q_auto picks the compression.
export function sizedImageUrl(url, width) {
  if (!url || !width || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  // Leave URLs that already carry transformations alone.
  if (/\/upload\/[a-z]_[^/]*\//.test(url)) return url;
  return url.replace("/upload/", `/upload/c_limit,f_auto,q_auto,w_${Math.round(width)}/`);
}
