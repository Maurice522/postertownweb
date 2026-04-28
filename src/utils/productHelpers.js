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

const getColors = (product) => {
  if (Array.isArray(product?.filters?.colorPalette) && product.filters.colorPalette.length > 0) {
    return product.filters.colorPalette.map((color) => String(color).toLowerCase());
  }

  if (Array.isArray(product?.colors) && product.colors.length > 0) {
    return product.colors.map((color) => String(color).toLowerCase());
  }

  if (product?.color) {
    return [String(product.color).toLowerCase()];
  }

  return [];
};

export const normalizeProduct = (product = {}) => {
  const price = Number(product?.pricing?.price ?? product?.price ?? 0);
  const originalPrice = Number(
    product?.pricing?.compareAtPrice ??
      product?.originalPrice ??
      (price > 0 ? Math.round(price * 1.3) : 0)
  );
  const categoryMain = product?.category?.main || product?.category || "";
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
          price: Number(size.price ?? normalizedVariants[index]?.price ?? price),
          stock: Number(size.stock ?? normalizedVariants[index]?.stock ?? product?.inventory?.stock ?? 0),
          sku: size.sku || normalizedVariants[index]?.sku || product.sku,
          variantId: size.variantId || normalizedVariants[index]?.id || `${product.id || "product"}-variant-${index + 1}`,
        }))
      : normalizedVariants.map((variant, index) => ({
          id: `${product.id || "product"}-size-${index + 1}`,
          type: variant.sizeType || `Size ${index + 1}`,
          inches: variant.size || "12 x 9",
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
    images: gallery.map((image, index) => ({
      url: normalizeImagePath(image),
      filename: `${product.name || "product"}-${index + 1}`,
      label:
        index === 0
          ? "Poster"
          : index === 1
          ? "Close-up"
          : index === 2
          ? "Desk setup"
          : index === 3
          ? "Room mockup"
          : `View ${index + 1}`,
      variant:
        index === 0
          ? "poster"
          : index === 1
          ? "closeup"
          : index === 2
          ? "desk"
          : index === 3
          ? "room"
          : "poster",
    })),
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
