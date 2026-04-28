import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import CartAmountToggle from "./CartAmountToggle";
import { useNavigate } from "react-router-dom";
import { Button } from "../styles/Button";
import { useCartContext } from "../context/cart_context";
import { FiShoppingCart } from "react-icons/fi";

const AddToCart = ({ product }) => {
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const { id, colors = [], color, stock, selectedSize = "Small" } = product;
  const purchaseVariant = selectedSize || colors[0] || color || "default";
  const [amount, setAmount] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addToCartWords = useMemo(() => ["Add", "To", "Cart"], []);

  useEffect(() => {
    if (!isAdding) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsAdding(false);
    }, 1050);

    return () => window.clearTimeout(timer);
  }, [isAdding]);

  const setDecrease = () => {
    amount > 1 ? setAmount(amount - 1) : setAmount(1);
  };

  const setIncrease = () => {
    amount < stock ? setAmount(amount + 1) : setAmount(stock);
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(id, purchaseVariant, amount, product);
  };

  const handleBuyNow = () => {
    addToCart(id, purchaseVariant, amount, product);
    navigate("/cart");
  };

  return (
    <Wrapper>
      <CartAmountToggle
        amount={amount}
        setDecrease={setDecrease}
        setIncrease={setIncrease}
      />

      <div className="purchase-actions">
        <Button className={isAdding ? "btn secondary-btn is-adding" : "btn secondary-btn"} onClick={handleAddToCart}>
          <span className="btn-icon-wrap" aria-hidden="true">
            <FiShoppingCart className="btn-icon trail-icon" />
            <FiShoppingCart className="btn-icon moving-icon" />
          </span>
          <span className="btn-label" aria-label="Add To Cart">
            {addToCartWords.map((word) => (
              <span key={word} className="btn-word">
                {word}
              </span>
            ))}
          </span>
        </Button>
        <Button className="btn primary-btn" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .purchase-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 1.6rem;
  }

  .btn {
    width: 100%;
    font-size: 1.4rem;
    letter-spacing: 0.04em;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
  }

  .primary-btn {
    background: linear-gradient(135deg, #111 0%, #3b3129 100%);
    isolation: isolate;
  }

  .primary-btn::after {
    content: "";
    position: absolute;
    top: -20%;
    left: -35%;
    width: 32%;
    height: 140%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.08) 30%,
      rgba(255, 255, 255, 0.55) 50%,
      rgba(255, 255, 255, 0.08) 70%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-22deg);
    animation: buyNowGlare 2.8s ease-in-out infinite;
    pointer-events: none;
  }

  .secondary-btn {
    background: #fff;
    color: #1f1d1d;
    border: 1px solid #d7c1aa;
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
    justify-content: center;
    gap: 0.35rem;
    min-width: 8.8rem;
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

  /* we can use it as a global one too  */
  .amount-toggle {
    margin-top: 3rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 1.4rem;

    button {
      border: none;
      background-color: #fff;
      cursor: pointer;
    }

    .amount-style {
      font-size: 2.4rem;
      color: ${({ theme }) => theme.colors.btn};
    }
  }

  @keyframes buyNowGlare {
    0% {
      left: -40%;
      opacity: 0;
    }

    12% {
      opacity: 1;
    }

    45% {
      left: 108%;
      opacity: 0.95;
    }

    100% {
      left: 108%;
      opacity: 0;
    }
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
    .purchase-actions {
      grid-template-columns: 1fr;
    }
  }
`;
export default AddToCart;
