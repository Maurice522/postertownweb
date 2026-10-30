import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useParams } from "react-router-dom";
import { MdSecurity } from "react-icons/md";
import { TbTruckDelivery, TbReplace } from "react-icons/tb";
import PageNavigation from "./components/PageNavigation";
import MyImage from "./components/MyImage";
import { Container } from "./styles/Container";
import FormatPrice from "./Helpers/FormatPrice";
import Star from "./components/Star";
import AddToCart from "./components/AddToCart";
import { useProductContext } from "./context/productcontex";
import { normalizeImagePath, paperSizeFor } from "./utils/productHelpers";

const defaultSizes = [
  { label: "Small", paper: "A4", dimensions: "12 x 9 inches" },
  { label: "Medium", paper: "A3", dimensions: "15.8 x 12 inches" },
  { label: "Large", paper: "A2", dimensions: "24 x 18 inches" },
];

const toSizeOption = (size) => ({
  label: size.type,
  paper: size.paper || paperSizeFor(size),
  dimensions: `${size.inches} inches`,
  price: size.price,
});
const RECENTLY_VIEWED_KEY = "postertown_recently_viewed";

const getProductImages = (product) => {
  if (!product) {
    return [];
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images.map((image, index) => ({
      ...image,
      url: normalizeImagePath(image.url),
      filename: image.filename || `${product.name || "product-image"}-${index + 1}`,
      label: image.label || `View ${index + 1}`,
      variant: image.variant || "poster",
    }));
  }

  if (product.image) {
    const normalizedUrl = normalizeImagePath(product.image);

    return [
      {
        url: normalizedUrl,
        filename: `${product.name || "product-image"}-poster`,
        label: "Poster",
        variant: "poster",
      },
      {
        url: normalizedUrl,
        filename: `${product.name || "product-image"}-closeup`,
        label: "Close-up",
        variant: "closeup",
      },
      {
        url: normalizedUrl,
        filename: `${product.name || "product-image"}-desk`,
        label: "Desk setup",
        variant: "desk",
      },
      {
        url: normalizedUrl,
        filename: `${product.name || "product-image"}-room`,
        label: "Room mockup",
        variant: "room",
      },
    ];
  }

  return [];
};

const getProductPrice = (product) => {
  if (!product) {
    return 0;
  }

  return Number(product.price || product.salePrice || 0);
};

const getProductOriginalPrice = (product) => {
  if (!product) {
    return 0;
  }

  return Number(product.originalPrice || Math.round(getProductPrice(product) * 1.62));
};

const getProductColors = (product) => {
  if (!product) {
    return ["#212121"];
  }

  if (Array.isArray(product.colors) && product.colors.length > 0) {
    return product.colors;
  }

  if (product.color) {
    return [product.color];
  }

  return ["#212121"];
};

const getProductImageUrl = (product) => normalizeImagePath(product?.image);

const getStoredRecentIds = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const parsed = JSON.parse(window.localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
  return Array.isArray(parsed) ? parsed : [];
};

const waitForImage = (src) =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !src) {
      resolve();
      return;
    }

    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });

const SingleProduct = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(defaultSizes[0]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { products: catalogProducts, isLoading: catalogLoading } = useProductContext();

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    // Wait for the live catalog before deciding the product doesn't exist.
    if (catalogLoading) {
      return undefined;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    const matchedProduct =
      catalogProducts.find((product) => String(product.id) === String(id)) || null;

    const requestedSize = location.state?.selectedSize;
    const matchedSize = matchedProduct?.sizes?.find(
      (size) => size.type === requestedSize || `${size.inches} inches` === requestedSize || size.inches === requestedSize
    );

    const nextSelectedSize = matchedSize
      ? toSizeOption(matchedSize)
      : matchedProduct?.sizes?.[0]
      ? toSizeOption(matchedProduct.sizes[0])
      : defaultSizes[0];

    const leadImage = getProductImages(matchedProduct)?.[0]?.url;

    Promise.all([waitForImage(leadImage), new Promise((resolve) => setTimeout(resolve, 320))]).then(() => {
      if (!isActive) {
        return;
      }

      setCurrentProduct(matchedProduct);
      setSelectedSize(nextSelectedSize);
      setIsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [id, location.state, catalogProducts, catalogLoading]);

  useEffect(() => {
    if (!currentProduct || typeof window === "undefined") {
      return;
    }

    const previousIds = getStoredRecentIds();
    const updatedIds = [currentProduct.id, ...previousIds.filter((productId) => productId !== currentProduct.id)].slice(
      0,
      8
    );

    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedIds));

    const products = updatedIds
      .filter((productId) => productId !== currentProduct.id)
      .map((productId) => catalogProducts.find((product) => product.id === productId))
      .filter(Boolean)
      .slice(0, 4);

    setRecentlyViewed(products);
  }, [currentProduct, catalogProducts]);

  if (isLoading) {
    return (
      <Wrapper>
        <div className="page_loading_shell">
          <div className="page_loading">
            <div className="loader-orb" />
            <div className="loader-ring loader-ring-one" />
            <div className="loader-ring loader-ring-two" />
            <p>Loading poster details</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (!currentProduct) {
    return (
      <Wrapper>
        <div className="page_loading_shell">
          <div className="page_loading page_loading_text_only">Product not found.</div>
        </div>
      </Wrapper>
    );
  }

  const {
    name,
    description,
    company,
    category,
    stars = 4.8,
    stock = 12,
    shipping = true,
  } = currentProduct;

  // Price follows the chosen size (Small/Medium/Large cost different amounts); the
  // struck-through price keeps the product's usual discount ratio.
  const basePrice = getProductPrice(currentProduct);
  const price = Number(selectedSize?.price) || basePrice;
  const originalPrice = basePrice > 0
    ? Math.round((getProductOriginalPrice(currentProduct) * price) / basePrice)
    : getProductOriginalPrice(currentProduct);
  const savings = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const sizes = currentProduct.sizes?.length
    ? currentProduct.sizes.map(toSizeOption)
    : defaultSizes;
  const images = getProductImages(currentProduct);
  const colors = getProductColors(currentProduct);
  const reviewCount = Array.isArray(currentProduct.reviews)
    ? currentProduct.reviews.length
    : Number(currentProduct.reviews || 0);
  const ratingValue = Number(currentProduct.stars || currentProduct.rating || stars || 0);
  const { fullDescription, specifications = {} } = currentProduct;
  const features = currentProduct.descriptionInfo?.features || [];
  const specRows = [
    ["Material", specifications.material],
    ["Finish", specifications.finish],
    ["Thickness", specifications.thickness],
    ["Weight", specifications.weight],
    ["Orientation", specifications.orientation],
    ["Mounting", specifications.mountType],
  ].filter(([, value]) => value);
  const infoRows = [
    ["Category", category || "Anime"],
    ["Series", currentProduct.subCategory],
    ["Collection", currentProduct.collection],
    ["Brand", currentProduct.brand || company || "Poster Town"],
    ["SKU", currentProduct.sku],
    [
      "Selected size",
      `${selectedSize?.label || ""}${selectedSize?.paper ? ` · ${selectedSize.paper}` : ""}`,
    ],
  ].filter(([, value]) => value);
  const careInstructions =
    Array.isArray(currentProduct.careInstructions) && currentProduct.careInstructions.length > 0
      ? currentProduct.careInstructions
      : ["Wipe with a soft dry cloth", "Avoid direct moisture"];
  const selectedSizeDimensions = selectedSize?.dimensions || defaultSizes[0].dimensions;
  const cartReadyProduct = {
    ...currentProduct,
    price,
    originalPrice,
    colors,
    image: images,
  };
  const recommendedProducts = catalogProducts
    .filter((product) => product.category === currentProduct.category && product.id !== currentProduct.id)
    .slice(0, 2);
  const similarProducts = catalogProducts
    .filter((product) => product.id !== currentProduct.id)
    .map((product) => ({
      ...product,
      score:
        (product.category === currentProduct.category ? 2 : 0) +
        (product.color && product.color === currentProduct.color ? 1 : 0),
    }))
    .filter((product) => product.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  // Newly uploaded products have no ratings yet; don't show stars or sample reviews for them.
  const hasRatings = ratingValue > 0;
  const hasSidebar = recentlyViewed.length > 0 || recommendedProducts.length > 0;
  const reviews = Array.isArray(currentProduct.reviews) && currentProduct.reviews.length > 0
    ? currentProduct.reviews
    : !hasRatings
    ? []
    : [
        {
          user: "PosterTown Buyer",
          comment: "Sharp print quality, clean finish, and the colors look great in person.",
          rating: Number(currentProduct.stars || currentProduct.rating || 5),
          date: "2026-04-01",
        },
        {
          user: "Anime Wall Decor Fan",
          comment: "Looks premium on the wall and arrived in good condition.",
          rating: 5,
          date: "2026-03-14",
        },
      ];

  return (
    <Wrapper>
      <PageNavigation title={name} />

      <Container className="single-product-shell">
        <div className="promo-strip">
          <span>India's premium anime wall art collection</span>
          <span>Fade-resistant finish</span>
          <span>Prepaid perks available</span>
        </div>

        <div className={hasSidebar ? "desktop-shell" : "desktop-shell no-sidebar"}>
          <div className="product-main">
            <div className="product-layout grid grid-two-column">
              <div className="product_images">
                <MyImage imgs={images} />
              </div>

              <div className="product-data">
                <div className="eyebrow-row">
                  <span className="product-badge">Best in Class | Top in Market</span>
                  <span className="category-tag">{category || "Anime"}</span>
                </div>
                <h1>{name}</h1>

                {hasRatings && (
                  <div className="product-data-rating">
                    <Star stars={ratingValue} reviews={reviewCount} />
                    <p>{Math.max(reviewCount, 1)}+ happy buyers</p>
                  </div>
                )}

                <div className="product-data-pricing">
                  <p className="product-data-price product-data-old-price">
                    <FormatPrice price={originalPrice} />
                  </p>
                  <p className="product-data-price product-data-real-price">
                    <FormatPrice price={price} />
                  </p>
                  {savings > 0 && <span className="save-badge">Save {savings}%</span>}
                </div>

                <div className="offer-panel">
                  <div>
                    <strong>Currently in demand</strong>
                    <p className="stock-copy">
                      {stock > 0 ? "Currently, this item has stock" : "This item is currently sold out"}
                    </p>
                  </div>
                  <div className="delivery-pill">Estimated dispatch in 24-48 hours</div>
                </div>

                <div className="size-section">
                  <h3>Size</h3>
                  <div className="size-options">
                    {sizes.map((size) => (
                      <button
                        key={size.label}
                        type="button"
                        className={selectedSize?.label === size.label ? "size-chip active" : "size-chip"}
                        onClick={() => setSelectedSize(size)}
                      >
                        <span>{size.label}</span>
                        <small>
                          {size.paper ? `${size.paper} · ` : ""}
                          {size.dimensions.replace(" inches", " in")}
                        </small>
                      </button>
                    ))}
                  </div>
                </div>

                {stock > 0 && <AddToCart product={{ ...cartReadyProduct, selectedSize: selectedSize?.label }} />}

                <div className="selected-spec">
                  <div className="spec-card">
                    <span>Selected size</span>
                    <strong>
                      {selectedSize?.label}
                      {selectedSize?.paper ? ` · ${selectedSize.paper}` : ""}
                    </strong>
                    <p>{selectedSizeDimensions}</p>
                  </div>
                  <div className="spec-card">
                    <span>Material</span>
                    <strong>HD Metal Print</strong>
                    <p>Gloss-rich modern finish</p>
                  </div>
                  <div className="spec-card">
                    <span>Mounting</span>
                    <strong>Wall-ready</strong>
                    <p>Sticker + magnet setup</p>
                  </div>
                </div>

                <p className="product-data-description">
                  {description ||
                    "Premium HD metal print with rich colors, sharp detail, and a clean modern finish for bedroom, desk, or studio walls."}
                </p>

                <div className="product-data-warranty">
                  <div className="product-warranty-data">
                    <TbTruckDelivery className="warranty-icon" />
                    <p>Fast Shipping</p>
                  </div>
                  <div className="product-warranty-data">
                    <MdSecurity className="warranty-icon" />
                    <p>Assured Quality</p>
                  </div>
                  <div className="product-warranty-data">
                    <TbReplace className="warranty-icon" />
                    <p>7 Days Return</p>
                  </div>
                </div>

                {shipping && (
                  <p className="shipping-copy">
                    Free shipping available on prepaid orders. Carefully packed for safe delivery.
                  </p>
                )}

                <div className="buy-note">
                  <span>Secure checkout</span>
                  <span>Scratch-resistant print surface</span>
                  <span>Ideal for bedrooms, desks, and anime corners</span>
                </div>
              </div>
            </div>

            <div className="product-details-panel">
              <h2>Product Details</h2>
              <div className="details-grid">
                <details open className="details-card">
                  <summary>About this poster</summary>
                  <p>{fullDescription || description}</p>
                  {features.length > 0 && (
                    <ul className="feature-list">
                      {features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </details>
                <details open className="details-card">
                  <summary>Specifications</summary>
                  <dl className="spec-list">
                    {specRows.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                    {sizes.map((size) => (
                      <div key={size.label}>
                        <dt>{size.label}</dt>
                        <dd>
                          {size.paper ? `${size.paper} · ` : ""}
                          {size.dimensions.replace(" inches", " in")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </details>
                <details className="details-card">
                  <summary>How to Mount</summary>
                  <p>
                    {specifications.mountType ? `Comes with ${String(specifications.mountType).toLowerCase()} mounting. ` : ""}
                    Small and medium prints use the sticker plus magnet setup. Larger sizes can use a back frame for a
                    stronger wall fit.
                  </p>
                </details>
                <details className="details-card">
                  <summary>Care Instructions</summary>
                  <ul className="feature-list">
                    {careInstructions.map((instruction) => (
                      <li key={instruction}>{instruction}</li>
                    ))}
                  </ul>
                </details>
                <details className="details-card">
                  <summary>Why Print on Metal?</summary>
                  <p>
                    Artwork is infused onto coated metal for sharper contrast, stronger durability, and a cleaner
                    finish than regular paper posters or lightweight prints.
                  </p>
                </details>
                <details className="details-card">
                  <summary>Product Info</summary>
                  <dl className="spec-list">
                    {infoRows.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </div>
            </div>

            {similarProducts.length > 0 && (
              <div className="similar-products-panel">
                <div className="section-heading">
                  <div>
                    <h2>Similar Products</h2>
                    <p>
                      More picks from <span>{category}</span>
                      {currentProduct.color ? (
                        <>
                          {" "}
                          with a matching <span>{currentProduct.color}</span> vibe
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>

                <div className="similar-grid">
                  {similarProducts.map((product) => (
                    <Link key={product.id} to={`/singleproduct/${product.id}`} className="similar-card">
                      <div className="similar-image-shell">
                        <img src={getProductImageUrl(product)} alt={product.name} />
                        <span className="similar-category">{product.category}</span>
                      </div>
                      <div className="similar-copy">
                        <div className="similar-tags">
                          {product.color ? <span>{product.color}</span> : null}
                          {product.orientation ? <span>{product.orientation}</span> : null}
                        </div>
                        <h3>{product.name}</h3>
                        <div className="similar-price">
                          <span className="similar-old-price">
                            <FormatPrice price={getProductOriginalPrice(product)} />
                          </span>
                          <span className="similar-new-price">
                            <FormatPrice price={getProductPrice(product)} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="reviews-panel">
              <div className="section-heading">
                <div>
                  <h2>Customer Reviews</h2>
                  <p>
                    Real feedback from buyers who picked up this <span>{category}</span> design.
                  </p>
                </div>
              </div>

              {reviews.length === 0 && (
                <p className="reviews-empty">No reviews yet. Be the first to share how it looks on your wall.</p>
              )}
              <div className="reviews-grid">
                {reviews.map((review, index) => (
                  <article key={`${review.user}-${index}`} className="review-card">
                    <div className="review-top">
                      <div>
                        <h3>{review.user}</h3>
                        <span>{review.date}</span>
                      </div>
                      <div className="review-rating">
                        {"*".repeat(Math.max(1, Math.min(5, Math.round(review.rating || 0))))}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="faq-panel">
              <div className="section-heading">
                <div>
                  <h2>FAQ</h2>
                  <p>Quick answers before you place the order.</p>
                </div>
              </div>

              <div className="faq-list">
                <details open className="faq-card">
                  <summary>Will the print look exactly like the photo?</summary>
                  <p>
                    The artwork and overall finish stay very close to the product preview. Minor color variation can happen
                    because of screen brightness and display settings.
                  </p>
                </details>
                <details className="faq-card">
                  <summary>Is it ready to hang on the wall?</summary>
                  <p>
                    Yes. The print is designed for easy wall display, and the recommended mounting style depends on the size
                    you choose.
                  </p>
                </details>
                <details className="faq-card">
                  <summary>How long does shipping usually take?</summary>
                  <p>
                    Most orders are dispatched within 24 to 48 hours, and delivery timing depends on your location.
                  </p>
                </details>
                <details className="faq-card">
                  <summary>What if the product arrives damaged?</summary>
                  <p>
                    Reach out with photos right away and we can help with a replacement or resolution based on the issue.
                  </p>
                </details>
              </div>
            </div>

            <div className="page-outro">
              <div className="page-outro-copy">
                <span className="outro-eyebrow">Finish Strong</span>
                <h2>Ready to make your wall setup feel complete?</h2>
                <p>
                  You have the size, the style, and the details. Lock in your favorite <span>{category}</span> print and
                  keep exploring artwork that matches your room and color vibe.
                </p>
              </div>
              <div className="outro-pills">
                <span>Premium wall art</span>
                <span>Fast dispatch</span>
                <span>Room-ready finish</span>
              </div>
            </div>
          </div>

          {hasSidebar && (
          <aside className="recently-viewed-panel">
            {recentlyViewed.length > 0 && (
            <>
            <h3>Recently Viewed</h3>
            <div className="recent-list">
              {recentlyViewed.map((product) => (
                  <Link key={product.id} to={`/singleproduct/${product.id}`} className="recent-card">
                    <img src={getProductImageUrl(product)} alt={product.name} />
                    <div>
                      <h4>{product.name}</h4>
                      <p>
                        <span className="recent-old-price">
                          <FormatPrice price={getProductOriginalPrice(product)} />
                        </span>
                        <span className="recent-new-price">
                          <FormatPrice price={getProductPrice(product)} />
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
            </>
            )}

            {recommendedProducts.length > 0 && (
              <div className="you-may-like">
                <h4>You may like</h4>
                {recommendedProducts.map((product) => (
                  <Link key={product.id} to={`/singleproduct/${product.id}`} className="recommend-card">
                    <div className="recommend-image-shell">
                      <img src={getProductImageUrl(product)} alt={product.name} />
                    </div>
                    <strong>{product.name}</strong>
                    <span>
                      {product.sizes?.[0]
                        ? `${product.sizes[0].paper || paperSizeFor(product.sizes[0])} · ${product.sizes[0].inches} in`
                        : "A4 · 12 x 9 in"}{" "}
                      -{" "}
                      <FormatPrice price={product.price} />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </aside>
          )}
        </div>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: #f7f1e8;
  color: #1d1d1d;
  min-height: 100vh;

  .single-product-shell {
    width: min(100%, 156rem);
    max-width: 156rem;
    margin: 0 auto;
    padding: 3rem 2.4rem 7rem;
    animation: pageRise 0.55s ease;
  }

  .promo-strip {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .promo-strip span {
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid #eadfce;
    border-radius: 999px;
    padding: 0.8rem 1.2rem;
    font-size: 1.25rem;
    color: #5f574d;
    animation: softFloat 5s ease-in-out infinite;
  }

  .desktop-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 28rem;
    gap: 2rem;
    align-items: start;
  }

  .desktop-shell.no-sidebar {
    grid-template-columns: minmax(0, 1fr);
  }

  .product-main {
    min-width: 0;
  }

  .product-layout {
    /* minmax(0, …) lets both columns shrink; plain 1fr grew to fit long titles and
       pushed the details under the sidebar. */
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: 3.2rem;
    align-items: start;
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 18px 45px rgba(93, 63, 24, 0.08);
  }

  .product_images {
    position: sticky;
    top: 2rem;
  }

  .product-data {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.6rem;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(248, 238, 226, 0.92) 100%);
    border: 1px solid #efe3d5;
    border-radius: 2.4rem;
    padding: 2.4rem;
  }

  .product-data > * {
    animation: fadeSlide 0.5s ease both;
  }

  .product-data > *:nth-child(2) {
    animation-delay: 0.04s;
  }

  .product-data > *:nth-child(3) {
    animation-delay: 0.08s;
  }

  .product-data > *:nth-child(4) {
    animation-delay: 0.12s;
  }

  .eyebrow-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .product-badge {
    background: #231f20;
    color: #fff;
    padding: 0.7rem 1.2rem;
    border-radius: 999px;
    font-size: 1.2rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .category-tag {
    color: #85573f;
    background: #f5e5d4;
    border: 1px solid #eccdb1;
    border-radius: 999px;
    padding: 0.7rem 1.2rem;
    font-size: 1.25rem;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(2.6rem, 2.4vw, 3.4rem);
    line-height: 1.15;
    margin: 0;
    overflow-wrap: break-word;
    max-width: 100%;
  }

  h2,
  h3,
  p {
    margin: 0;
  }

  .product-data-rating {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    flex-wrap: wrap;
  }

  .product-data-rating p {
    color: #6a6258;
    font-size: 1.4rem;
  }

  .product-data-pricing {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    flex-wrap: wrap;
  }

  .product-data-price {
    font-weight: 700;
    font-size: 2.4rem;
  }

  .product-data-old-price {
    color: #8b8074;
    text-decoration: line-through;
    font-size: 1.8rem;
  }

  .product-data-real-price {
    color: #8e3b1f;
  }

  .save-badge {
    background: #d86b35;
    color: #fff;
    border-radius: 999px;
    padding: 0.6rem 1rem;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .offer-panel {
    width: 100%;
    background: #fff;
    border: 1px solid #eedfce;
    border-radius: 1.8rem;
    padding: 1.4rem 1.6rem;
    display: flex;
    justify-content: space-between;
    gap: 1.6rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .offer-panel strong {
    font-size: 1.5rem;
  }

  .delivery-pill {
    background: #1f1d1d;
    color: #fff;
    border-radius: 999px;
    padding: 0.85rem 1.2rem;
    font-size: 1.25rem;
  }

  .stock-copy,
  .shipping-copy,
  .product-data-description {
    color: #51483f;
    font-size: 1.6rem;
    line-height: 1.7;
  }

  .size-section {
    width: 100%;
  }

  .size-section h3 {
    margin-bottom: 1rem;
    font-size: 1.7rem;
  }

  .size-options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .size-chip {
    border: 1px solid #cfbfa9;
    background: #fff;
    color: #2a241f;
    padding: 1rem 1.4rem;
    border-radius: 1.6rem;
    font-size: 1.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 11rem;
    gap: 0.35rem;
  }

  .size-chip small {
    font-size: 1.15rem;
    color: #766e65;
  }

  .size-chip.active {
    background: #231f20;
    color: #fff;
    border-color: #231f20;
    transform: translateY(-2px);
  }

  .size-chip:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .size-chip.active small {
    color: rgba(255, 255, 255, 0.8);
  }

  .selected-spec {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .spec-card {
    background: #fff;
    border: 1px solid #ecdfd2;
    border-radius: 1.8rem;
    padding: 1.4rem;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .spec-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(85, 58, 35, 0.08);
  }

  .spec-card span {
    display: block;
    font-size: 1.2rem;
    color: #866d59;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .spec-card strong {
    display: block;
    font-size: 1.7rem;
    margin-bottom: 0.5rem;
  }

  .product-data-warranty {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    padding: 1.6rem 0;
    border-top: 1px solid #eadfce;
    border-bottom: 1px solid #eadfce;
  }

  .product-warranty-data {
    text-align: center;
    background: #fff;
    border: 1px solid #efe4d5;
    border-radius: 8px;
    padding: 1.4rem 1rem;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .product-warranty-data:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(85, 58, 35, 0.08);
  }

  .warranty-icon {
    background: #f2e8da;
    color: #8e3b1f;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    padding: 0.8rem;
  }

  .product-warranty-data p {
    font-size: 1.3rem;
    padding-top: 0.8rem;
  }

  .recently-viewed-panel {
    position: sticky;
    top: 1.6rem;
    background: rgba(255, 250, 243, 0.98);
    border: 1px solid #e6d7c6;
    border-radius: 1.6rem;
    padding: 1.8rem;
    box-shadow: 0 12px 28px rgba(61, 41, 22, 0.06);
  }

  .recently-viewed-panel h3,
  .you-may-like h4 {
    font-size: 2.1rem;
    margin: 0 0 1.4rem;
  }

  .recent-list {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.8rem;
  }

  .recent-card {
    display: grid;
    grid-template-columns: 6.2rem minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px dashed #e7d8c7;
    padding-bottom: 1rem;
  }

  .recent-card:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .recent-card img {
    width: 6.2rem;
    height: 7.8rem;
    object-fit: cover;
    border-radius: 1rem;
    background: #fff;
  }

  .recent-card h4 {
    font-size: 1.4rem;
    line-height: 1.35;
    margin: 0 0 0.35rem;
  }

  .recent-card p {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
  }

  .recent-old-price {
    color: #988c80;
    text-decoration: line-through;
    font-size: 1.25rem;
  }

  .recent-new-price {
    color: #cf6d3f;
    font-weight: 700;
    font-size: 1.3rem;
  }

  .recent-empty {
    color: #76695d;
    font-size: 1.35rem;
    line-height: 1.6;
  }

  .you-may-like {
    border-top: 1px solid #eadccb;
    padding-top: 1.6rem;
  }

  .recommend-card {
    display: block;
    text-decoration: none;
    color: inherit;
    margin-bottom: 1.4rem;
  }

  .recommend-card:last-child {
    margin-bottom: 0;
  }

  .recommend-image-shell {
    background: linear-gradient(180deg, #2c2623 0%, #4d3f34 100%);
    border-radius: 1.4rem;
    padding: 1.2rem;
    margin-bottom: 0.9rem;
    min-height: 16rem;
    display: grid;
    place-items: center;
  }

  .recommend-image-shell img {
    max-width: 82%;
    max-height: 14rem;
    object-fit: contain;
    filter: drop-shadow(0 14px 18px rgba(0, 0, 0, 0.28));
  }

  .recommend-card strong {
    display: block;
    font-size: 1.55rem;
    line-height: 1.4;
    margin-bottom: 0.4rem;
  }

  .recommend-card span {
    color: #7d7268;
    font-size: 1.28rem;
    line-height: 1.5;
  }

  .product-details-panel {
    margin-top: 3rem;
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 3rem;
  }

  .similar-products-panel {
    margin-top: 3rem;
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 3rem;
  }

  .section-heading {
    display: flex;
    justify-content: space-between;
    gap: 1.6rem;
    align-items: end;
    margin-bottom: 2rem;
  }

  .section-heading p {
    color: #6d6156;
    margin-top: 0.4rem;
  }

  .section-heading span {
    color: #cf6d3f;
    font-weight: 600;
    text-transform: capitalize;
  }

  .similar-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.6rem;
  }

  .similar-card {
    display: block;
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.8rem;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .similar-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 30px rgba(58, 38, 24, 0.08);
  }

  .similar-image-shell {
    position: relative;
    background: linear-gradient(180deg, #f6ecde 0%, #efe0cd 100%);
    padding: 1.6rem;
    min-height: 23rem;
    display: grid;
    place-items: center;
  }

  .similar-image-shell img {
    max-width: 80%;
    max-height: 20rem;
    object-fit: contain;
    filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.18));
  }

  .similar-category {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(35, 31, 32, 0.92);
    color: #fff;
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    font-size: 1.1rem;
    text-transform: uppercase;
  }

  .similar-copy {
    padding: 1.4rem;
  }

  .similar-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 0.9rem;
  }

  .similar-tags span {
    background: #f8ebdc;
    color: #81553d;
    border-radius: 999px;
    padding: 0.4rem 0.8rem;
    font-size: 1.1rem;
    text-transform: capitalize;
  }

  .similar-copy h3 {
    font-size: 1.8rem;
    line-height: 1.35;
    margin-bottom: 1rem;
  }

  .similar-price {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .similar-old-price {
    color: #9e9184;
    text-decoration: line-through;
    font-size: 1.25rem;
  }

  .similar-new-price {
    color: #cf6d3f;
    font-size: 1.6rem;
    font-weight: 700;
  }

  .reviews-panel,
  .faq-panel {
    margin-top: 3rem;
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 3rem;
  }

  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.6rem;
  }

  .review-card {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.8rem;
    padding: 1.8rem;
    box-shadow: 0 10px 22px rgba(58, 38, 24, 0.05);
  }

  .review-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
    margin-bottom: 1rem;
  }

  .review-top h3 {
    font-size: 1.7rem;
    margin-bottom: 0.2rem;
  }

  .review-top span {
    color: #8d8176;
    font-size: 1.2rem;
  }

  .review-rating {
    color: #f0b400;
    font-size: 1.6rem;
    letter-spacing: 0.08em;
    font-family: Arial, sans-serif;
  }

  .review-card p {
    color: #5b5047;
    line-height: 1.7;
  }

  .faq-list {
    display: grid;
    gap: 1.2rem;
  }

  .faq-card {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 1.6rem 1.8rem;
  }

  .faq-card summary {
    cursor: pointer;
    list-style: none;
    font-size: 1.65rem;
    font-weight: 600;
  }

  .faq-card summary::-webkit-details-marker {
    display: none;
  }

  .faq-card p {
    color: #645950;
    margin-top: 1rem;
    line-height: 1.7;
  }

  .page-outro {
    margin-top: 3rem;
    padding: 3.2rem 0 1rem;
    border-top: 1px solid rgba(207, 109, 63, 0.14);
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
  }

  .page-outro-copy {
    max-width: 72rem;
  }

  .outro-eyebrow {
    display: inline-block;
    background: #f8ebdc;
    color: #8c5d42;
    border-radius: 999px;
    padding: 0.55rem 0.95rem;
    font-size: 1.15rem;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .page-outro h2 {
    font-size: 2.8rem;
    margin-bottom: 0.8rem;
  }

  .page-outro p {
    color: #6a5e54;
    line-height: 1.75;
  }

  .page-outro p span {
    color: #cf6d3f;
    font-weight: 600;
    text-transform: capitalize;
  }

  .outro-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    justify-content: flex-end;
  }

  .outro-pills span {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 999px;
    padding: 0.8rem 1.15rem;
    font-size: 1.2rem;
    color: #6a5f56;
  }

  .product-details-panel h2 {
    font-size: 2.8rem;
    margin-bottom: 2rem;
  }

  .reviews-empty {
    color: #6a5e54;
    font-size: 1.5rem;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
    /* Collapsed cards keep their own height instead of stretching to an open neighbour. */
    align-items: start;
  }

  .details-card {
    background: #fff;
    border: 1px solid #ecdfd2;
    border-radius: 1.8rem;
    padding: 1.6rem;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .details-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 30px rgba(71, 48, 29, 0.07);
  }

  .details-card summary {
    cursor: pointer;
    list-style: none;
    font-size: 1.8rem;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  /* Plus/minus so it's clear the card opens. */
  .details-card summary::after {
    content: "+";
    flex-shrink: 0;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #f6ece0;
    color: #8a5c43;
    font-size: 2rem;
    font-weight: 500;
    line-height: 1;
  }

  .details-card[open] summary::after {
    content: "\\2212";
  }

  .details-card summary::-webkit-details-marker {
    display: none;
  }

  .details-card p,
  .details-card ul {
    margin-top: 1.2rem;
  }

  .details-grid p,
  .product-meta-list {
    color: #3f3833;
    font-size: 1.6rem;
    line-height: 1.7;
  }

  .details-card .feature-list {
    list-style: none;
    padding: 0;
    margin-top: 1.2rem;
    display: grid;
    gap: 0.8rem;
  }

  .feature-list li {
    position: relative;
    padding-left: 2.8rem;
    color: #3f3833;
    font-size: 1.55rem;
    line-height: 1.5;
  }

  .feature-list li::before {
    content: "\\2713";
    position: absolute;
    left: 0;
    top: 0.1rem;
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #f3e3d3;
    color: #8a5c43;
    font-size: 1.1rem;
    font-weight: 700;
  }

  .spec-list {
    margin-top: 1rem;
  }

  .spec-list div {
    display: flex;
    justify-content: space-between;
    gap: 1.6rem;
    padding: 0.9rem 0;
    border-bottom: 1px solid #f1e6da;
    font-size: 1.5rem;
    line-height: 1.4;
  }

  .spec-list div:last-child {
    border-bottom: none;
  }

  .spec-list dt {
    color: #6f6257;
  }

  .spec-list dd {
    margin: 0;
    color: #231f20;
    font-weight: 600;
    text-align: right;
  }

  .product-meta-list {
    padding-left: 1.8rem;
  }

  .buy-note {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .buy-note span {
    background: #fff;
    border: 1px solid #ebdfd2;
    border-radius: 999px;
    padding: 0.8rem 1.15rem;
    font-size: 1.2rem;
    color: #645950;
  }

  .page_loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.4rem;
    text-align: center;
    font-size: 2rem;
    color: #3b312b;
    position: relative;
  }

  .page_loading_shell {
    min-height: calc(100vh - 18rem);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem 2.4rem 6rem;
  }

  .page_loading p {
    font-size: 1.55rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #7d6d61;
  }

  .page_loading_text_only {
    font-size: 2.4rem;
    font-weight: 700;
  }

  .loader-orb {
    width: 7.6rem;
    height: 7.6rem;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #fff7ef 0%, #f2c7a3 36%, #d86b35 68%, #8e3b1f 100%);
    box-shadow: 0 18px 36px rgba(142, 59, 31, 0.24);
    animation: pulseGlow 1.4s ease-in-out infinite;
    position: relative;
  }

  .loader-ring {
    position: absolute;
    border: 1px solid rgba(216, 107, 53, 0.25);
    border-radius: 999px;
    animation: rippleOut 1.9s ease-out infinite;
  }

  .loader-ring-one {
    width: 11rem;
    height: 11rem;
  }

  .loader-ring-two {
    width: 15rem;
    height: 15rem;
    animation-delay: 0.42s;
  }

  @keyframes pageRise {
    from {
      opacity: 0;
      transform: translateY(16px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeSlide {
    from {
      opacity: 0;
      transform: translateY(12px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes softFloat {
    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-2px);
    }
  }

  @keyframes pulseGlow {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 18px 36px rgba(142, 59, 31, 0.24);
    }

    50% {
      transform: scale(1.06);
      box-shadow: 0 22px 42px rgba(142, 59, 31, 0.32);
    }
  }

  @keyframes rippleOut {
    0% {
      opacity: 0;
      transform: scale(0.72);
    }

    25% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: scale(1.16);
    }
  }

  /* The sidebar only fits beside the product on very wide screens; below that it
     moves under the product so the details keep their full width. */
  @media (max-width: 1500px) {
    .desktop-shell {
      grid-template-columns: minmax(0, 1fr);
    }

    .recently-viewed-panel {
      position: static;
    }

    .recent-list,
    .you-may-like {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(26rem, 1fr));
      gap: 1.2rem;
    }

    .you-may-like h4 {
      grid-column: 1 / -1;
    }
  }

  /* Image above details once two columns would be too narrow. */
  @media (max-width: 1100px) {
    .product-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .product_images {
      position: static;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .single-product-shell {
      padding: 2rem 1.4rem 5rem;
    }

    .desktop-shell {
      grid-template-columns: 1fr;
    }

    .product-layout,
    .product-details-panel,
    .similar-products-panel,
    .reviews-panel,
    .faq-panel,
    .recently-viewed-panel {
      padding: 2rem;
    }

    .product-data,
    .offer-panel,
    .selected-spec {
      grid-template-columns: 1fr;
    }

    .page-outro {
      display: block;
      padding-top: 2.4rem;
    }

    .outro-pills {
      justify-content: flex-start;
      margin-top: 1.4rem;
    }

    .product-data-warranty,
    .details-grid,
    .similar-grid,
    .reviews-grid {
      grid-template-columns: 1fr;
    }

    .recently-viewed-panel {
      position: static;
    }

    h1 {
      font-size: 2.6rem;
    }
  }
`;

export default SingleProduct;

