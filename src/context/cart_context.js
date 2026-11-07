import { createContext, useContext, useReducer, useEffect } from "react";
import reducer from "../reducer/cartReducer";
import { toGaItem, trackEcommerce } from "../utils/analytics";

const CartContext = createContext();

const getLocalCartData = () => {
  let localCartData = localStorage.getItem("thapaCart");
  if (!localCartData) return [];

  const parsedData = JSON.parse(localCartData);
  if (!Array.isArray(parsedData)) return [];

  return parsedData;
};

const initialState = {
  // cart: [],
  cart: getLocalCartData(),
  total_item: "",
  total_price: "",

};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Covers both the product page (AddToCart.js) and the quick-add on cards (Product.js).
  const addToCart = (id, color, amount, product) => {
    dispatch({ type: "ADD_TO_CART", payload: { id, color, amount, product } });
    trackEcommerce("add_to_cart", [toGaItem({ ...product, id, size: product.selectedSize }, amount)]);
  };

  // increment and decrement the product

  const setDecrease = (id) => {
    dispatch({ type: "SET_DECREMENT", payload: id });
  };

  const setIncrement = (id) => {
    dispatch({ type: "SET_INCREMENT", payload: id });
  };

  // to remove the individual item from cart
  const removeItem = (id) => {
    const item = state.cart.find((cartItem) => cartItem.id === id);
    dispatch({ type: "REMOVE_ITEM", payload: id });
    if (item) trackEcommerce("remove_from_cart", [toGaItem(item)]);
  };

  // to clear the cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // to add the data in localStorage
  // get vs set

  useEffect(() => {
    // dispatch({ type: "CART_TOTAL_ITEM" });
    // dispatch({ type: "CART_TOTAL_PRICE" });
    dispatch({ type: "CART_ITEM_PRICE_TOTAL" });

    localStorage.setItem("thapaCart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeItem,
        clearCart,
        setDecrease,
        setIncrement,
      }}>
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  return useContext(CartContext);
};

export { CartProvider, useCartContext };
