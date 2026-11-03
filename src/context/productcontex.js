import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import reducer from "../reducer/productReducer";
import { normalizeProducts } from "../utils/productHelpers";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// The last catalog this browser received. Shown straight away on the next visit while
// a fresh copy loads, so returning visitors don't wait for the backend to wake up.
const CATALOG_CACHE_KEY = "postertown:catalog:v1";

function readCachedCatalog() {
  try {
    const cached = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    return Array.isArray(cached?.products) && cached.products.length ? cached.products : null;
  } catch {
    return null;
  }
}

function saveCachedCatalog(products) {
  try {
    localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), products }));
  } catch {
    // Storage full or blocked (private mode): the site still works, just uncached.
  }
}

// The bundled products.json is only a fallback for when the API can't be reached, so
// it's loaded on demand instead of being part of every visitor's download.
async function bundledCatalog() {
  const module = await import("../data/products.json");
  return module.default;
}

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const cached = readCachedCatalog();
    return {
      isLoading: !cached,
      isError: false,
      products: cached ? normalizeProducts(cached) : [],
      featureProducts: [],
      isSingleLoading: false,
      singleProduct: {},
    };
  });

  // Live catalog from the backend (what the admin console manages).
  const getProducts = async () => {
    let cached = readCachedCatalog();
    let gotLive = false;
    if (!cached) {
      dispatch({ type: "SET_LOADING" });
      // First visit in this browser: show the catalog saved at build time while the
      // live API (possibly waking up) catches up.
      axios
        .get("/catalog-snapshot.json", { timeout: 15000 })
        .then((res) => {
          const snapshot = res.data?.products;
          if (gotLive || !Array.isArray(snapshot) || !snapshot.length) return;
          cached = snapshot;
          dispatch({ type: "SET_API_DATA", payload: normalizeProducts(snapshot) });
        })
        .catch(() => {});
    }
    try {
      // Render's free plan can take ~50s to wake the backend after a quiet spell.
      const res = await axios.get(`${API_BASE_URL}/api/products`, { timeout: 60000 });
      const live = Array.isArray(res.data) ? res.data : [];
      if (live.length) {
        gotLive = true;
        saveCachedCatalog(live);
        dispatch({ type: "SET_API_DATA", payload: normalizeProducts(live) });
      } else if (!cached) {
        dispatch({ type: "SET_API_DATA", payload: normalizeProducts(await bundledCatalog()) });
      }
    } catch (error) {
      if (cached) return;
      console.error("Could not load products from the API; showing the bundled catalog", error);
      dispatch({ type: "SET_API_DATA", payload: normalizeProducts(await bundledCatalog()) });
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
