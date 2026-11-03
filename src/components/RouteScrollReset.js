import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Opening a new page starts at its top (without this, clicking "Shop now" lands the
// products page part way down). Back and forward keep the browser's own scroll position.
const RouteScrollReset = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP") window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
};

export default RouteScrollReset;
