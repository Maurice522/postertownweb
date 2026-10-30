import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const CartAmountToggle = ({ amount, setDecrease, setIncrease }) => {
  return (
    <div className="cart-button">
      <div className="amount-toggle">
        <button type="button" aria-label="Decrease quantity" onClick={() => setDecrease()}>
          <FaMinus />
        </button>
        <div className="amount-style" aria-live="polite">{amount}</div>
        <button type="button" aria-label="Increase quantity" onClick={() => setIncrease()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default CartAmountToggle;
