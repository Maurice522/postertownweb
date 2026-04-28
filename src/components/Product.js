import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import FormatPrice from "../Helpers/FormatPrice";
import { useCartContext } from "../context/cart_context";
import { FiShoppingCart, FiShoppingBag } from "react-icons/fi";

const normalizeImagePath = (path) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
};

const Product = (curElem) => {
  const { id, name, image, price, category, stock = 10, color, cardStyle = "portrait" } = curElem;
  const { addToCart } = useCartContext();
  const navigate = useNavigate();
  const imageUrl = normalizeImagePath(image);

  const cartPayload = {
    ...curElem,
    image: [{ url: imageUrl, filename: name }],
    colors: [color || "#212121"],
    stock,
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
            <button className="card-btn secondary" onClick={handleAddToCart}>
              <FiShoppingCart />
              Add to Cart
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

  .card-btn.primary {
    background: linear-gradient(135deg, #231f20 0%, #49372f 100%);
    color: #fff;
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
