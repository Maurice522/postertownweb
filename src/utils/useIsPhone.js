import { useEffect, useState } from "react";

// Matches the theme's phone breakpoint (theme.media.mobile) and updates on resize.
const PHONE_QUERY = "(max-width: 768px)";

export default function useIsPhone() {
  const [isPhone, setIsPhone] = useState(() => window.matchMedia(PHONE_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const update = () => setIsPhone(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isPhone;
}
