export const normalizeImagePath = (path) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
};

const toTitleCase = (value = "") =>
  String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getFeaturedImage = (product) =>
  product?.media?.featuredImage || product?.media?.thumbnail || product?.image || "";

const getGalleryImages = (product) => {
  const featuredImage = getFeaturedImage(product);
  const gallery = Array.isArray(product?.media?.gallery) ? product.media.gallery : [];
  return [featuredImage, ...gallery].filter(Boolean);
};

// Nearest A-series paper size for a "W x H" inches string, by its long side.
export const paperSizeFor = (size = {}) => {
  if (size.paper) {
    return size.paper;
  }

  const sides = String(size.inches || size.size || "")
    .split(/x/i)
    .map((value) => parseFloat(value))
    .filter((value) => value > 0);
  if (!sides.length) {
    return "";
  }

  const longSide = Math.max(...sides);
  if (longSide <= 9.5) return "A5";
  if (longSide <= 13) return "A4";
  if (longSide <= 18) return "A3";
  if (longSide <= 26) return "A2";
  return "";
};

// Older admin uploads used broader category names. Map them onto the store's own
// categories (the ones the filters and collections use), using the subcategory
// when the broad name covers more than one.
const storeCategory = (main = "", subCategory = "") => {
  const key = String(main).trim().toLowerCase();
  const sub = String(subCategory).toLowerCase();
  if (key === "anime & manga") return "Anime";
  if (key === "movies & tv") return "Movie";
  if (key === "comics & superheroes") {
    if (/\bdc\b|batman|superman|wonder woman|joker|flash/.test(sub)) return "DC";
    return "Marvel";
  }
  return main;
};

const SCENE_VIEWS = [
  { label: "Close-up", variant: "closeup" },
  { label: "Desk setup", variant: "desk" },
  { label: "Room mockup", variant: "room" },
];

// Captions saved by the admin for generated mockups: [{ url, label }].
const getGalleryLabel = (product, url) => {
  const labels = Array.isArray(product?.media?.galleryLabels) ? product.media.galleryLabels : [];
  return labels.find((entry) => entry?.url === url)?.label || "";
};

// Basic colours the colour filter offers. Descriptive names from older uploads
// ("Lime Green", "Neon Pink", "Bright Red", "Dark") map onto these; anything that
// isn't a single colour (e.g. "Multi-color") is left out.
const BASE_COLORS = ["black", "white", "grey", "red", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "brown", "gold", "silver"];
const COLOR_ALIASES = { gray: "grey", dark: "black", violet: "purple", magenta: "pink", cyan: "teal", navy: "blue", crimson: "red", maroon: "red", lime: "green", beige: "brown" };

const toBaseColor = (value) => {
  const words = String(value).toLowerCase().split(/[\s-]+/).map((word) => COLOR_ALIASES[word] || word);
  // The colour word usually comes last ("neon pink", "lime green").
  return [...words].reverse().find((word) => BASE_COLORS.includes(word)) || "";
};

const getColors = (product) => {
  const source =
    Array.isArray(product?.filters?.colorPalette) && product.filters.colorPalette.length > 0
      ? product.filters.colorPalette
      : Array.isArray(product?.colors) && product.colors.length > 0
      ? product.colors
      : product?.color
      ? [product.color]
      : [];

  return [...new Set(source.map(toBaseColor).filter(Boolean))];
};

export const normalizeProduct = (product = {}) => {
  const price = Number(product?.pricing?.price ?? product?.price ?? 0);
  const originalPrice = Number(
    product?.pricing?.compareAtPrice ??
      product?.originalPrice ??
      (price > 0 ? Math.round(price * 1.3) : 0)
  );
  const categoryMain = storeCategory(product?.category?.main || product?.category || "", product?.category?.subCategory);
  const subCategory = product?.category?.subCategory || "";
  const collection = product?.category?.collection || "";
  const colors = getColors(product);
  const gallery = getGalleryImages(product);
  const featuredImage = normalizeImagePath(getFeaturedImage(product));
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const productSizes = Array.isArray(product?.sizes) ? product.sizes : [];
  const normalizedVariants =
    variants.length > 0
      ? variants.map((variant) => ({
          ...variant,
          size: variant.size || variant.label || "Standard",
          sizeType: variant.sizeType || variant.type || "Standard",
          price: Number(variant.price ?? price),
          stock: Number(variant.stock ?? product?.inventory?.stock ?? product?.stock ?? 0),
        }))
      : [
          {
            id: `${product.id || "variant"}-default`,
            sku: product.sku || `${product.id || "variant"}-default`,
            size: "12x18",
            sizeType: "Standard",
            price,
            stock: Number(product?.inventory?.stock ?? product?.stock ?? 0),
          },
        ];
  const normalizedSizes =
    productSizes.length > 0
      ? productSizes.map((size, index) => ({
          id: size.id || `${product.id || "product"}-size-${index + 1}`,
          type: size.type || size.label || size.sizeType || `Size ${index + 1}`,
          inches: size.inches || size.size || "12 x 9",
          paper: paperSizeFor(size),
          price: Number(size.price ?? normalizedVariants[index]?.price ?? price),
          stock: Number(size.stock ?? normalizedVariants[index]?.stock ?? product?.inventory?.stock ?? 0),
          sku: size.sku || normalizedVariants[index]?.sku || product.sku,
          variantId: size.variantId || normalizedVariants[index]?.id || `${product.id || "product"}-variant-${index + 1}`,
        }))
      : normalizedVariants.map((variant, index) => ({
          id: `${product.id || "product"}-size-${index + 1}`,
          type: variant.sizeType || `Size ${index + 1}`,
          inches: variant.size || "12 x 9",
          paper: paperSizeFor({ inches: variant.size }),
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku || product.sku,
          variantId: variant.id,
        }));
  const reviews = Array.isArray(product?.reviews) ? product.reviews : [];
  const ratingAverage = Number(product?.ratings?.average ?? product?.stars ?? product?.rating ?? 0);
  const ratingCount = Number(product?.ratings?.count ?? reviews.length ?? 0);
  const featured = Boolean(product?.flags?.featured ?? product?.featured);
  const orientation = String(
    product?.specifications?.orientation ??
      product?.filterableAttributes?.orientation ??
      product?.orientation ??
      "portrait"
  ).toLowerCase();
  const material =
    product?.specifications?.material ||
    product?.filterableAttributes?.material ||
    "Metal";
  const stock = Number(product?.inventory?.stock ?? product?.stock ?? product?.quantity ?? 0);

  return {
    ...product,
    slug: product.slug || product.id,
    company: product.vendor || product.company || product.brand || "Poster Town",
    brand: product.brand || "Poster Town",
    vendor: product.vendor || product.company || product.brand || "Poster Town",
    categoryInfo: {
      main: categoryMain,
      subCategory,
      collection,
    },
    category: categoryMain,
    subCategory,
    collection,
    descriptionInfo: {
      short: product?.description?.short || product?.description || "",
      full: product?.description?.full || product?.description || "",
      features: Array.isArray(product?.description?.features) ? product.description.features : [],
    },
    description: product?.description?.short || product?.description?.full || product?.description || "",
    fullDescription: product?.description?.full || product?.description || "",
    image: featuredImage,
    images: gallery.map((image, index) => {
      const galleryLabel = getGalleryLabel(product, image);
      // Generated mockups are real photos: show them as uploaded. Older products repeat
      // the poster image in the gallery, so those still get the styled CSS scenes.
      if (index > 0 && image !== gallery[0]) {
        return {
          url: normalizeImagePath(image),
          filename: `${product.name || "product"}-${index + 1}`,
          label: galleryLabel || `View ${index + 1}`,
          variant: "photo",
        };
      }

      return {
        url: normalizeImagePath(image),
        filename: `${product.name || "product"}-${index + 1}`,
        label: index === 0 ? "Poster" : SCENE_VIEWS[index - 1]?.label || `View ${index + 1}`,
        variant: index === 0 ? "poster" : SCENE_VIEWS[index - 1]?.variant || "poster",
      };
    }),
    media: {
      ...product.media,
      featuredImage,
      gallery: gallery.map(normalizeImagePath),
    },
    price,
    originalPrice,
    pricing: {
      ...product.pricing,
      price,
      compareAtPrice: originalPrice,
      currency: product?.pricing?.currency || "INR",
      discountPercent:
        product?.pricing?.discountPercent ??
        (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0),
    },
    stock,
    quantity: stock,
    inventory: {
      ...product.inventory,
      stock,
      status: product?.inventory?.status || (stock > 0 ? "in_stock" : "out_of_stock"),
    },
    stars: ratingAverage,
    rating: ratingAverage,
    ratings: {
      ...product.ratings,
      average: ratingAverage,
      count: ratingCount,
    },
    reviews,
    reviewCount: ratingCount,
    featured,
    orientation,
    shape: product?.specifications?.shape || product?.shape || "Rectangle",
    specifications: {
      ...product.specifications,
      material,
      orientation: toTitleCase(orientation),
      shape: product?.specifications?.shape || product?.shape || "Rectangle",
      finish: product?.specifications?.finish || "Matte",
      mountType: product?.specifications?.mountType || "Magnetic",
    },
    colors,
    color: colors[0] || "black",
    sizes: normalizedSizes,
    variants: normalizedVariants,
    tags: product.tags || product.badges || [],
    shipping:
      product?.shipping?.freeShipping ??
      product?.shipping ??
      false,
  };
};

export const normalizeProducts = (products = []) =>
  Array.isArray(products) ? products.map(normalizeProduct) : [];
