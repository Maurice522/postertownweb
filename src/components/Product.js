import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoadingImage from "./LoadingImage";
import styled from "styled-components";
import FormatPrice from "../Helpers/FormatPrice";
import { useCartContext } from "../context/cart_context";
import { FiCheckCircle, FiShoppingCart, FiShoppingBag, FiX } from "react-icons/fi";
import { normalizeProduct } from "../utils/productHelpers";

const Product = (curElem) => {
  const normalizedProduct = normalizeProduct(curElem);
  const { id, name, image, price, category, stock = 10, color, cardStyle = "portrait" } = normalizedProduct;
  const { addToCart, cart } = useCartContext();
  const navigate = useNavigate();
  const imageUrl = image;
  const [isAdding, setIsAdding] = useState(false);
  const [artShape, setArtShape] = useState("tall");
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const sizeOptions = useMemo(
    () =>
      normalizedProduct.sizes?.length
        ? normalizedProduct.sizes
        : [
            {
              type: "Small",
              inches: "12 x 9",
              price,
              stock,
            },
          ],
    [normalizedProduct.sizes, price, stock]
  );
  const defaultSize = sizeOptions[0];
  const addToCartWords = useMemo(() => ["Add", "to", "Cart"], []);
  const isProductInCart = cart.some(
    (item) => item.productId === id || item.id === id || String(item.id).startsWith(`${id}-`)
  );

  const getCartPayload = (selectedSize = defaultSize) => ({
    ...normalizedProduct,
    image: [{ url: imageUrl, filename: name }],
    colors: normalizedProduct.colors?.length ? normalizedProduct.colors : [color || "#212121"],
    stock: selectedSize?.stock ?? stock,
    price: selectedSize?.price ?? price,
    selectedSize: selectedSize?.type || "Small",
  });

  useEffect(() => {
    if (!isAdding) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsAdding(false);
    }, 1050);

    return () => window.clearTimeout(timer);
  }, [isAdding]);

  const addSelectedSizeToCart = (selectedSize = defaultSize) => {
    setIsAdding(true);
    addToCart(id, selectedSize?.type || color || "#212121", 1, getCartPayload(selectedSize));
    setIsSizeModalOpen(false);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProductInCart) {
      return;
    }

    if (sizeOptions.length > 1) {
      setIsSizeModalOpen(true);
      return;
    }

    addSelectedSizeToCart(defaultSize);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, defaultSize?.type || color || "#212121", 1, getCartPayload(defaultSize));
    navigate("/cart");
  };

  return (
    <>
      <CardLink to={`/singleproduct/${id}`} $cardStyle={cardStyle}>
        <article className={`product-card ${cardStyle === "landscape" ? "landscape-card" : ""}`}>
          <div className={`image-shell ${cardStyle === "landscape" ? "landscape-shell" : ""}`}>
            <span className="category-badge">{category}</span>
            <LoadingImage
              src={imageUrl}
              alt={name}
              className={`${artShape}-art`}
              onLoad={(e) => setArtShape(e.currentTarget.naturalWidth > e.currentTarget.naturalHeight ? "wide" : "tall")}
            />
          </div>

          <div className="card-copy">
            <div className="title-row">
              <h3>{name}</h3>
              <p className="card-price">
                <FormatPrice price={price} />
              </p>
            </div>

            <p className="sub-copy">Premium wall-ready print with a clean finish and bold detail.</p>

            <div className="card-actions">
              <button
                className={isAdding ? "card-btn secondary is-adding" : "card-btn secondary"}
                onClick={handleAddToCart}
                disabled={isProductInCart}
              >
                {isProductInCart ? (
                  <>
                    <FiCheckCircle />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <span className="btn-icon-wrap" aria-hidden="true">
                      <FiShoppingCart className="btn-icon trail-icon" />
                      <FiShoppingCart className="btn-icon moving-icon" />
                    </span>
                    <span className="btn-label" aria-label="Add to Cart">
                      {addToCartWords.map((word) => (
                        <span key={word} className="btn-word">
                          {word}
                        </span>
                      ))}
                    </span>
                  </>
                )}
              </button>
              <button className="card-btn primary" onClick={handleBuyNow}>
                <FiShoppingBag />
                Buy Now
              </button>
            </div>
          </div>
        </article>
      </CardLink>

      {isSizeModalOpen && (
        <ModalOverlay
          role="dialog"
          aria-modal="true"
          aria-labelledby={`size-modal-title-${id}`}
          onClick={() => setIsSizeModalOpen(false)}
        >
          <div className="size-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <span className="modal-kicker">Choose size</span>
                <h3 id={`size-modal-title-${id}`}>{name}</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setIsSizeModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <div className="modal-size-grid">
              {sizeOptions.map((size) => (
                <button
                  key={size.id || size.type}
                  type="button"
                  className="size-option"
                  disabled={(size.stock ?? stock) <= 0}
                  onClick={() => addSelectedSizeToCart(size)}
                >
                  <span>
                    <strong>{size.type}</strong>
                    <small>
                      {size.paper ? `${size.paper} · ` : ""}
                      {size.inches} inches
                    </small>
                  </span>
                  <span className="size-price">
                    <FormatPrice price={size.price ?? price} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </ModalOverlay>
      )}
    </>
  );
};

const CardLink = styled(NavLink)`
  display: block;
  text-decoration: none;
  color: inherit;

  .product-card {
    height: 100%;
    background: linear-gradient(180deg, #fffaf3 0%, #f6ecdf 100%);
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    overflow: hidden;
    box-shadow: 0 16px 28px rgba(60, 38, 22, 0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  &:hover .product-card {
    transform: translateY(-6px);
    box-shadow: 0 24px 36px rgba(60, 38, 22, 0.12);
  }

  .image-shell {
    position: relative;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at top, #fff 0%, #f7ecdf 58%, #edd9c6 100%);
    /* Fixed-height frame so every card in a row lines up, whatever the art's shape. */
    height: 31rem;
    grid-template-rows: 100%;
    padding: 2.4rem 1.5rem;
    overflow: hidden;
  }

  /* Posters are A-size sheets (1 : 1.414); show the whole print at that ratio,
     sized to fit the frame both ways. */
  .image-shell img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 1 / 1.414;
    object-fit: cover;
    /* If the art doesn't match the frame, keep the top and trim from the bottom. */
    object-position: top;
    border-radius: 0.4rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16), 0 18px 30px rgba(60, 38, 22, 0.24);
    transition: transform 0.35s ease;
  }

  &:hover .image-shell img {
    transform: scale(1.04);
  }

  .image-shell img.wide-art {
    aspect-ratio: 1.414 / 1;
  }

  .landscape-shell {
    height: 30rem;
    padding: 2rem 1.5rem;
  }

  .category-badge {
    position: absolute;
    z-index: 1;
    top: 1.4rem;
    right: 1.4rem;
    background: rgba(35, 31, 32, 0.94);
    color: #fff;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .card-copy {
    padding: 1.25rem;
  }

  .title-row {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 0.6rem;
  }

  h3 {
    font-size: 1.65rem;
    line-height: 1.3;
    color: #231f20;
  }

  .card-price {
    color: #cf6d3f;
    font-weight: 700;
    font-size: 1.55rem;
    white-space: nowrap;
  }

  .sub-copy {
    color: #6a5f56;
    font-size: 1.25rem;
    line-height: 1.45;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Side by side when both labels fit, otherwise each button wraps to its own row. */
  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .card-actions .card-btn {
    flex: 1 1 auto;
  }

  .card-btn {
    border: none;
    border-radius: 1rem;
    padding: 0.9rem 0.8rem;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.55rem;
    font-size: 1.12rem;
    font-weight: 600;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .card-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.1);
  }

  .card-btn.secondary {
    background: #fff;
    color: #2a241f;
    border: 1px solid #dcc7b2;
  }

  .card-btn.secondary:disabled {
    cursor: default;
    background: #231f20;
    color: #fff;
    border-color: #231f20;
  }

  .btn-icon-wrap {
    position: relative;
    width: 1.8rem;
    height: 1.8rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .btn-icon {
    font-size: 1.45rem;
  }

  .moving-icon {
    position: absolute;
    left: 0;
    opacity: 0;
  }

  .btn-label {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    justify-content: center;
    white-space: nowrap;
  }

  .btn-word {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .is-adding .moving-icon {
    animation: buttonCartSweep 0.95s ease forwards;
  }

  .is-adding .trail-icon {
    opacity: 0.15;
  }

  .is-adding .btn-word:nth-child(1) {
    animation: wordFadeAway 0.22s ease forwards;
    animation-delay: 0.08s;
  }

  .is-adding .btn-word:nth-child(2) {
    animation: wordFadeAway 0.22s ease forwards;
    animation-delay: 0.18s;
  }

  .is-adding .btn-word:nth-child(3) {
    animation: wordFadeAway 0.22s ease forwards;
    animation-delay: 0.28s;
  }

  .card-btn.primary {
    background: linear-gradient(135deg, #231f20 0%, #49372f 100%);
    color: #fff;
  }

  @keyframes buttonCartSweep {
    0% {
      transform: translateX(-0.2rem) scale(0.9);
      opacity: 0;
    }

    18% {
      opacity: 1;
    }

    55% {
      transform: translateX(4.8rem) scale(1);
      opacity: 1;
    }

    100% {
      transform: translateX(8.8rem) scale(0.92);
      opacity: 0;
    }
  }

  @keyframes wordFadeAway {
    to {
      opacity: 0;
      transform: translateY(-0.6rem);
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    /* html drops to 1rem = 8px on phones, so the frames are given more rem. */
    .image-shell {
      height: 46rem;
      padding: 3rem;
    }

    .landscape-shell {
      height: 36rem;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(21, 17, 15, 0.48);
  display: grid;
  place-items: center;
  padding: 2rem;
  backdrop-filter: blur(3px);

  .size-modal {
    width: min(100%, 42rem);
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 1.8rem;
    padding: 1.8rem;
    box-shadow: 0 26px 70px rgba(0, 0, 0, 0.24);
  }

  .modal-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.2rem;
    margin-bottom: 1.4rem;
  }

  .modal-kicker {
    color: #8a5c43;
    font-size: 1.1rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h3 {
    font-size: 2rem;
    line-height: 1.25;
    margin-top: 0.35rem;
  }

  .modal-close {
    width: 3.6rem;
    height: 3.6rem;
    border: 1px solid #dfd1c2;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    display: grid;
    place-items: center;
    color: #332923;
  }

  .modal-size-grid {
    display: grid;
    gap: 0.9rem;
  }

  .size-option {
    border: 1px solid #dfd1c2;
    border-radius: 1.2rem;
    background: #fff;
    padding: 1.1rem 1.2rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.2rem;
    text-align: left;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .size-option:hover {
    transform: translateY(-2px);
    border-color: #231f20;
    box-shadow: 0 14px 24px rgba(61, 41, 22, 0.1);
  }

  .size-option:disabled {
    cursor: not-allowed;
    opacity: 0.52;
  }

  .size-option strong,
  .size-option small {
    display: block;
  }

  .size-option strong {
    font-size: 1.55rem;
  }

  .size-option small {
    color: #766b61;
    font-size: 1.2rem;
    margin-top: 0.25rem;
  }

  .size-price {
    color: #cf6d3f;
    font-size: 1.65rem;
    font-weight: 700;
    white-space: nowrap;
  }
`;

export default Product;
