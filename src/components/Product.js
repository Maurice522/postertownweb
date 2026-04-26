import React from "react";
import { NavLink } from "react-router-dom";
import FormatPrice from "../Helpers/FormatPrice";
import { useCartContext } from "../context/cart_context";
import { FiShoppingCart } from "react-icons/fi";
import { FiShoppingBag } from "react-icons/fi";

const Product = (curElem) => {
  const { id, name, image, price, category } = curElem;
  const { addToCart } = useCartContext();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(curElem);
  };

  return (
    <NavLink to={`/singleproduct/${id}`}>
      <div className="card">
        <figure>
          <img src={image} alt={name} style={{borderRadius:"1.2rem"}}/>
          <figcaption className="caption">{category}</figcaption>
        </figure>

        <div className="card-data">
          <div className="card-data-flex">
            <h3>{name}</h3>
            <p className="card-data--price">{<FormatPrice price={price} />}</p>
          </div>
          <div className="card-buttons">
            <button className="btn add-to-cart" onClick={handleAddToCart}>
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="btn buy-now">
              <FiShoppingBag /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Product;