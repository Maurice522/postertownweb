import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import reducer from "../reducer/productReducer";
import localProducts from "../data/products.json";
import { normalizeProducts } from "../utils/productHelpers";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const AppContext = createContext();

const initialState = {
  isLoading: true,
  isError: false,
  products: [],
  featureProducts: [],
  isSingleLoading: false,
  singleProduct: {},
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Live catalog from the backend (what the admin console manages). The bundled
  // products.json is only a fallback for when the API can't be reached.
  const getProducts = async () => {
    dispatch({ type: "SET_LOADING" });
    try {
      // Render's free plan can take ~50s to wake the backend after a quiet spell.
      const res = await axios.get(`${API_BASE_URL}/api/products`, { timeout: 60000 });
      const live = Array.isArray(res.data) ? res.data : [];
      dispatch({ type: "SET_API_DATA", payload: normalizeProducts(live.length ? live : localProducts) });
    } catch (error) {
      console.error("Could not load products from the API; showing the bundled catalog", error);
      dispatch({ type: "SET_API_DATA", payload: normalizeProducts(localProducts) });
    }
  };

  // my 2nd api call for single product

  const getSingleProduct = async (url) => {
    dispatch({ type: "SET_SINGLE_LOADING" });
    try {
      const res = await axios.get(url);
      const singleProduct = await res.data;
      dispatch({ type: "SET_SINGLE_PRODUCT", payload: singleProduct });
    } catch (error) {
      dispatch({ type: "SET_SINGLE_ERROR" });
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <AppContext.Provider value={{ ...state, getSingleProduct }}>
      {children}
    </AppContext.Provider>
  );
};

// custom hooks
const useProductContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext, useProductContext };
