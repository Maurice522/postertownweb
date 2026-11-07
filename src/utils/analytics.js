// GA4 events for Google Tag Manager (GTM-5PHL7HRW, loaded in public/index.html).
// Uses GA4's recommended event names so the ecommerce reports fill on their own.
// Never put a customer's name, email, phone or address in an event (Google's terms).
// Refunds are sent by the backend (postertown_backend/src/services/analytics.js).
const CURRENCY = "INR";

// Cart items and catalog products have slightly different shapes.
export const toGaItem = (product, quantity = 1) => ({
  item_id: String(product.productId || product.id),
  item_name: product.name,
  item_category: product.category || product.categoryInfo?.main || "",
  item_variant: product.size || product.selectedSize || undefined,
  price: Number(product.price) || 0,
  quantity: Number(product.amount ?? quantity) || 1,
});

const push = (event, params) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Clear the previous ecommerce object so its fields don't leak into this event.
  if (params.ecommerce) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ...params });
};

const sum = (items) => items.reduce((total, item) => total + item.price * item.quantity, 0);

// extra can override value (purchase uses the server's order total).
export const trackEcommerce = (event, items, extra = {}) =>
  push(event, { ecommerce: { currency: CURRENCY, value: sum(items), items, ...extra } });

export const trackAuth = (event, method) => push(event, { method });

// GA4's client id from the _ga cookie, saved on the order so backend refunds join the
// same user as the purchase.
export const getGaClientId = () => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/);
  return match ? match[1] : undefined;
};
