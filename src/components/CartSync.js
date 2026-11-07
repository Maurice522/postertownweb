import { useEffect, useRef } from "react";
import { useCartContext } from "../context/cart_context";
import { useUserContext } from "../context/user_context";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const SYNC_DELAY_MS = 2500;
const LAST_SYNC_KEY = "postertown:cart-synced";

// Saves a signed-in shopper's cart on the server (a few seconds after it changes), so
// the shop can see abandoned carts and send a reminder. Guests' carts stay in the
// browser only. An emptied cart (e.g. after ordering) clears the saved one.
export default function CartSync() {
  const { cart } = useCartContext();
  const { user } = useUserContext();
  const timer = useRef();

  useEffect(() => {
    if (!user?.id || !user?.email) return undefined;
    const items = (cart || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      size: item.size,
      price: item.price,
      amount: item.amount,
      image: item.image,
    }));
    const signature = `${user.id}:${JSON.stringify(items)}`;
    let lastSynced = "";
    try {
      lastSynced = sessionStorage.getItem(LAST_SYNC_KEY) || "";
    } catch {
      // Storage blocked; sync anyway.
    }
    if (signature === lastSynced) return undefined;

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch(`${API_BASE_URL}/api/auth/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email, items }),
        keepalive: true,
      })
        .then((response) => {
          if (!response.ok) return;
          try {
            sessionStorage.setItem(LAST_SYNC_KEY, signature);
          } catch {
            // Ignore.
          }
        })
        .catch(() => {});
    }, SYNC_DELAY_MS);
    return () => clearTimeout(timer.current);
  }, [cart, user?.id, user?.email]);

  return null;
}
