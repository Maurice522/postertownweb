import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiShoppingCart } from "react-icons/fi";
import { useCartContext } from "../context/cart_context";
import FormatPrice from "../Helpers/FormatPrice";

// Phones only: once the size picker and Add to Cart scroll out of view, a bar with the
// price and an Add to cart button sticks to the bottom of the screen (on mobile the
// buy section sits below the gallery, two screens down). Same cart action as AddToCart.
const MobileBuyBar = ({ product, price, sizeLabel, watchRef }) => {
  const { addToCart, cart } = useCartContext();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const itemKey = `${product.id}-${sizeLabel}`;
  const inCart = cart.some((item) => item.id === itemKey);

  useEffect(() => {
    const target = watchRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return undefined;
    // Show while the buy section is off screen (above or below the viewport).
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchRef]);

  // Lets the floating "Top" button move up out of the bar's way (ScrollToTop.js).
  const showing = visible && product.stock > 0;
  useEffect(() => {
    document.body.classList.toggle("buy-bar-open", showing);
    return () => document.body.classList.remove("buy-bar-open");
  }, [showing]);

  if (!(product.stock > 0)) return null;

  const onClick = () => {
    if (inCart) {
      navigate("/cart");
      return;
    }
    addToCart(product.id, sizeLabel, 1, { ...product, selectedSize: sizeLabel });
  };

  return (
    <Bar className={visible ? "visible" : ""} aria-hidden={!visible}>
      <div className="info">
        <strong>
          <FormatPrice price={price} />
        </strong>
        <span>{sizeLabel}</span>
      </div>
      <button type="button" onClick={onClick} tabIndex={visible ? 0 : -1}>
        <FiShoppingCart aria-hidden="true" /> {inCart ? "View cart" : "Add to cart"}
      </button>
    </Bar>
  );
};

const Bar = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    align-items: center;
    background: #fffaf3;
    border-top: 1px solid #eadfce;
    bottom: 0;
    box-shadow: 0 -8px 24px rgba(35, 31, 32, 0.12);
    display: flex;
    gap: 1.2rem;
    justify-content: space-between;
    left: 0;
    padding: 1rem 1.6rem calc(1rem + env(safe-area-inset-bottom));
    position: fixed;
    right: 0;
    transform: translateY(110%);
    transition: transform 0.25s ease;
    z-index: 40;

    &.visible {
      transform: translateY(0);
    }

    .info {
      display: grid;
      line-height: 1.2;
    }

    .info strong {
      color: #231f20;
      font-size: 2rem;
    }

    .info span {
      color: #8a7c70;
      font-size: 1.3rem;
    }

    button {
      align-items: center;
      background: #231f20;
      border: 0;
      border-radius: 999px;
      color: #fff;
      display: inline-flex;
      font-size: 1.6rem;
      font-weight: 700;
      gap: 0.8rem;
      min-height: 48px;
      padding: 0 2.4rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export default MobileBuyBar;
