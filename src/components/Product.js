import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import FormatPrice from "../Helpers/FormatPrice";
import { useCartContext } from "../context/cart_context";
import { FiShoppingCart, FiShoppingBag } from "react-icons/fi";
import { normalizeProduct } from "../utils/productHelpers";

const Product = (curElem) => {
  const normalizedProduct = normalizeProduct(curElem);
  const { id, name, image, price, category, stock = 10, color, cardStyle = "portrait" } = normalizedProduct;
  const { addToCart } = useCartContext();
  const navigate = useNavigate();
  const imageUrl = image;
  const [isAdding, setIsAdding] = useState(false);
  const defaultSize = normalizedProduct.sizes?.[0]?.type || "Small";
  const addToCartWords = useMemo(() => ["Add", "to", "Cart"], []);

  const cartPayload = {
    ...normalizedProduct,
    image: [{ url: imageUrl, filename: name }],
    colors: normalizedProduct.colors?.length ? normalizedProduct.colors : [color || "#212121"],
    stock,
    selectedSize: defaultSize,
  };

  useEffect(() => {
    if (!isAdding) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsAdding(false);
    }, 1050);

    return () => window.clearTimeout(timer);
  }, [isAdding]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(id, color || "#212121", 1, cartPayload);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, color || "#212121", 1, cartPayload);
    navigate("/cart");
  };

  return (
    <CardLink to={`/singleproduct/${id}`} $cardStyle={cardStyle}>
      <article className={`product-card ${cardStyle === "landscape" ? "landscape-card" : ""}`}>
        <div className={`image-shell ${cardStyle === "landscape" ? "landscape-shell" : ""}`}>
          <span className="category-badge">{category}</span>
          <img src={imageUrl} alt={name} />
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
            <button className={isAdding ? "card-btn secondary is-adding" : "card-btn secondary"} onClick={handleAddToCart}>
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
            </button>
            <button className="card-btn primary" onClick={handleBuyNow}>
              <FiShoppingBag />
              Buy Now
            </button>
          </div>
        </div>
      </article>
    </CardLink>
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
    border-radius: 2.2rem;
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
    min-height: 34rem;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at top, #fff 0%, #f7ecdf 58%, #edd9c6 100%);
    padding: 2rem;
    overflow: hidden;
  }

  .image-shell img {
    width: 100%;
    max-width: 24rem;
    height: 30rem;
    object-fit: cover;
    border-radius: 1.6rem;
    box-shadow: 0 24px 26px rgba(0, 0, 0, 0.18);
    transition: transform 0.35s ease;
  }

  &:hover .image-shell img {
    transform: scale(1.04);
  }

  .landscape-shell {
    min-height: 26rem;
  }

  .landscape-shell img {
    max-width: 100%;
    width: 100%;
    height: 22rem;
    object-fit: cover;
  }

  .category-badge {
    position: absolute;
    top: 1.4rem;
    right: 1.4rem;
    background: rgba(35, 31, 32, 0.94);
    color: #fff;
    border-radius: 999px;
    padding: 0.55rem 0.95rem;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .card-copy {
    padding: 1.8rem;
  }

  .title-row {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 0.8rem;
  }

  h3 {
    font-size: 2rem;
    line-height: 1.3;
    color: #231f20;
  }

  .card-price {
    color: #cf6d3f;
    font-weight: 700;
    font-size: 1.9rem;
    white-space: nowrap;
  }

  .sub-copy {
    color: #6a5f56;
    font-size: 1.4rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .card-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .card-btn {
    border: none;
    border-radius: 1.2rem;
    padding: 1.1rem 1rem;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.55rem;
    font-size: 1.25rem;
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
    min-width: 8.8rem;
    justify-content: center;
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
    .image-shell {
      min-height: 30rem;
    }

    .image-shell img {
      max-width: 20rem;
      height: 26rem;
    }

    .landscape-shell {
      min-height: 22rem;
    }

    .landscape-shell img {
      max-width: 100%;
      height: 18rem;
    }

    .card-actions {
      grid-template-columns: 1fr;
    }
  }
`;

export default Product;
