import { useState } from "react";
import styled from "styled-components";
import CartAmountToggle from "./CartAmountToggle";
import { useNavigate } from "react-router-dom";
import { Button } from "../styles/Button";
import { useCartContext } from "../context/cart_context";

const AddToCart = ({ product }) => {
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const { id, colors = [], color, stock } = product;
  const purchaseVariant = colors[0] || color || "default";
  const [amount, setAmount] = useState(1);

  const setDecrease = () => {
    amount > 1 ? setAmount(amount - 1) : setAmount(1);
  };

  const setIncrease = () => {
    amount < stock ? setAmount(amount + 1) : setAmount(stock);
  };

  const handleAddToCart = () => {
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
        <Button className="btn secondary-btn" onClick={handleAddToCart}>
          Add To Cart
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

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .purchase-actions {
      grid-template-columns: 1fr;
    }
  }
`;
export default AddToCart;
