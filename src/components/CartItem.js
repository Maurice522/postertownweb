import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import FormatPrice from "../Helpers/FormatPrice";
import CartAmountToggle from "./CartAmountToggle";
import { FiTrash2 } from "react-icons/fi";
import { useCartContext } from "../context/cart_context";

const CartItem = ({ id, productId, name, subtitle, category, image, color, size, price, originalPrice, badges = [], rating, amount }) => {
  const { removeItem, setDecrease, setIncrement } = useCartContext();
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Wrapper>
      <Link
        to={`/singleproduct/${productId || id}`}
        state={size ? { selectedSize: size } : undefined}
        className="item-media item-link">
        <div className="image-shell">
          <div className="image-frame">
            <img src={image} alt={name} />
          </div>
        </div>

        <div className="item-copy">
          <div className="top-tags">
            {category ? <span className="category-tag">{category}</span> : null}
            {badges.slice(0, 2).map((badge) => (
              <span key={badge} className="badge-tag">{badge}</span>
            ))}
          </div>
          <h3>{name}</h3>
          {subtitle ? <p className="subtitle">{subtitle}</p> : null}
          {size ? (
            <p className="selected-size">
              <span>Selected size:</span> {size}
            </p>
          ) : null}
          <div className="item-meta">
            {color && color !== "default" ? <span className="color-tag">{color}</span> : null}
            {rating ? <span className="rating-tag">Rating {Number(rating).toFixed(1)}</span> : null}
          </div>
          <div className="pricing-row">
            {originalPrice > price ? (
              <span className="compare-price">
                <FormatPrice price={originalPrice} />
              </span>
            ) : null}
            <p className="unit-price">
              <FormatPrice price={price} />
            </p>
            {discount > 0 ? <span className="discount-tag">Save {discount}%</span> : null}
          </div>
        </div>
      </Link>

      <div className="item-qty">
        <span className="mobile-label">Quantity</span>
        <CartAmountToggle
          amount={amount}
          setDecrease={() => setDecrease(id)}
          setIncrease={() => setIncrement(id)}
        />
      </div>

      <div className="item-total">
        <span className="mobile-label">Subtotal</span>
        <strong>
          <FormatPrice price={price * amount} />
        </strong>
      </div>

      <button type="button" className="remove-btn" onClick={() => removeItem(id)} aria-label={`Remove ${name}`}>
        <FiTrash2 />
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) auto auto auto;
  gap: 1.8rem;
  align-items: center;
  padding: 2rem;
  background: rgba(255, 250, 243, 0.96);
  border: 1px solid #eadfce;
  border-radius: 2.2rem;
  box-shadow: 0 14px 26px rgba(61, 41, 22, 0.06);

  .item-media {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    min-width: 0;
  }

  .item-link {
    text-decoration: none;
    color: inherit;
    transition: transform 0.22s ease;
  }

  .item-link:hover {
    transform: translateY(-2px);
  }

  .image-shell {
    width: 10rem;
    height: 12rem;
    border-radius: 1.8rem;
    background: linear-gradient(180deg, #fff 0%, #f2e7da 100%);
    border: 1px solid #ead8c3;
    display: grid;
    place-items: center;
    padding: 0.8rem;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
  }

  .image-frame {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 1.2rem;
    display: grid;
    place-items: center;
  }

  .image-shell img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }

  .item-copy {
    min-width: 0;
  }

  h3 {
    font-size: 2rem;
    line-height: 1.25;
    margin-bottom: 0.45rem;
    color: #231f20;
  }

  .top-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 0.8rem;
  }

  .category-tag,
  .badge-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.8rem;
    padding: 0 0.9rem;
    border-radius: 999px;
    font-size: 1.08rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .category-tag {
    background: #231f20;
    color: #fff;
  }

  .badge-tag {
    background: #f7e6d5;
    color: #8d5f45;
    border: 1px solid #ecd4bc;
  }

  .subtitle {
    color: #76695f;
    font-size: 1.35rem;
    line-height: 1.55;
    margin-bottom: 0.75rem;
  }

  .selected-size {
    color: #5f554d;
    font-size: 1.35rem;
    line-height: 1.5;
    margin-bottom: 0.75rem;
  }

  .selected-size span {
    color: #8a5c43;
    font-weight: 700;
  }

  .item-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
    margin-bottom: 0.8rem;
  }

  .item-meta span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3.2rem;
    padding: 0 1rem;
    border-radius: 999px;
    background: #fff;
    border: 1px solid #eadfce;
    color: #6a5f56;
    font-size: 1.2rem;
    text-transform: capitalize;
  }

  .rating-tag {
    font-weight: 600;
  }

  .pricing-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.8rem;
  }

  .compare-price {
    color: #9c8d7f;
    font-size: 1.3rem;
    text-decoration: line-through;
  }

  .unit-price {
    color: #cf6d3f;
    font-weight: 700;
    font-size: 1.55rem;
  }

  .discount-tag {
    background: #fff0e7;
    color: #c85d2c;
    border: 1px solid #f0cfbd;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    font-size: 1.12rem;
    font-weight: 700;
  }

  .item-qty,
  .item-total {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.8rem;
  }

  .item-total strong {
    color: #231f20;
    font-size: 1.75rem;
  }

  .mobile-label {
    display: none;
    color: #8a7b6e;
    font-size: 1.15rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .remove-btn {
    width: 4.6rem;
    height: 4.6rem;
    border: none;
    border-radius: 1.4rem;
    background: #fff0ee;
    color: #d05c4a;
    display: grid;
    place-items: center;
    font-size: 1.9rem;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .remove-btn:hover {
    transform: translateY(-2px);
    background: #ffe5e0;
  }

  .amount-toggle {
    display: inline-flex;
    margin: 0;
    gap: 1.2rem;
    padding: 0.7rem 0.9rem;
    border-radius: 1.4rem;
    background: #fff;
    border: 1px solid #eadfce;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
  }

  .cart-button {
    display: inline-flex;
  }

  .amount-toggle button {
    border: none;
    background: transparent;
    cursor: pointer;
    color: #4b4038;
    width: 2.8rem;
    height: 2.8rem;
    display: grid;
    place-items: center;
  }

  .amount-style {
    min-width: 2.8rem;
    text-align: center;
    font-size: 1.9rem;
    color: #231f20;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    grid-template-columns: 1fr;
    gap: 1.4rem;

    .item-media {
      align-items: flex-start;
    }

    .item-qty,
    .item-total {
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .mobile-label {
      display: inline-flex;
    }

    .remove-btn {
      width: 100%;
      height: 4.8rem;
      border-radius: 1.2rem;
    }
  }
`;

export default CartItem;
