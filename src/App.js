import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AppErrorBoundary from "./components/AppErrorBoundary";
import PageLoader from "./components/PageLoader";
import Home from "./Home";
import { GlobalStyle } from "./GlobalStyle";
import { ThemeProvider } from "styled-components";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import RouteScrollReset from "./components/RouteScrollReset";
import { AppProvider } from "./context/productcontex";
import { FilterContextProvider } from "./context/filter_context";
import { CartProvider } from "./context/cart_context";
import { UserProvider } from "./context/user_context";
import CartSync from "./components/CartSync";

// Every page except Home loads as its own file the first time it's opened, so the
// home page doesn't wait for the cart, checkout or account code. The pages people
// usually open next are fetched in the background once the browser is idle.
const Products = lazy(() => import(/* webpackPrefetch: true */ "./Products"));
const SingleProduct = lazy(() => import(/* webpackPrefetch: true */ "./SingleProduct"));
const Collections = lazy(() => import(/* webpackPrefetch: true */ "./Collections"));
const CollectionPage = lazy(() => import("./CollectionPage"));
const About = lazy(() => import("./About"));
const Orders = lazy(() => import("./Orders"));
const Cart = lazy(() => import("./Cart"));
const Auth = lazy(() => import("./Auth"));
const ErrorPage = lazy(() => import("./ErrorPage"));

// The page area resets its error when the route changes, so one broken page
// doesn't stick while customers move on.
const RouteErrorBoundary = ({ children }) => {
  const location = useLocation();
  return <AppErrorBoundary resetKey={location.pathname}>{children}</AppErrorBoundary>;
};

const App = () => {
  const theme = {
    colors: {
      heading: "rgb(24 24 29)",
      text: "rgba(29 ,29, 29, .8)",
      white: "#fff",
      black: " #212529",
      helper: "#8490ff",
      navbg: "#2E2E2E",
      charcoal: "2E2E2E",
      navtxt: "#ffffff",
      bg: "#F6F8FA",
      footer_bg: "#0a1435",
      btn: "rgb(98 84 243)",
      border: "rgba(98, 84, 243, 0.5)",
      hr: "#ffffff",
      red: "#FF4C4C",
      red2: "#FF1C1C",
      gradient:
        "linear-gradient(0deg, rgb(132 144 255) 0%, rgb(98 189 252) 100%)",
      shadow:
        "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;",
      shadowSupport: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
    },
    media: {
      mobile: "768px",
      tab: "998px",
    },
  };

  // useEffect(()=>{
  //   tailwindcss();
  //   console.log("appconsole")
  // },[])

  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <FilterContextProvider>
          <CartProvider>
            <UserProvider>
              <Router>
                <GlobalStyle />
                <RouteScrollReset />
                <CartSync />
                <Header />
                <RouteErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/collections" element={<Collections />} />
                      <Route path="/collections/:slug" element={<CollectionPage />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/contact" element={<Orders />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/singleproduct/:id" element={<SingleProduct />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="*" element={<ErrorPage />} />
                    </Routes>
                  </Suspense>
                </RouteErrorBoundary>
                <ScrollToTop />
                <Footer />
              </Router>
            </UserProvider>
          </CartProvider>
        </FilterContextProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
