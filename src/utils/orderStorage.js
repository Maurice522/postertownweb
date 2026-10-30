export const ORDERS_STORAGE_KEY = "postertown_orders";
export const GUEST_ORDERS_COOKIE_KEY = "postertown_guest_orders";
const TWO_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 2;

export const createCustomerUserId = (user) => {
  const email = String(user?.email || "").trim().toLowerCase();

  if (!email) {
    return "";
  }

  return `user-${email.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
};

const parseJson = (value, fallback = []) => {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error("Failed to parse stored orders", error);
    return fallback;
  }
};

const getCookie = (name) => {
  if (typeof document === "undefined") {
    return "";
  }

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=") || "";
};

const setCookie = (name, value) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${value}; max-age=${TWO_YEARS_IN_SECONDS}; path=/; SameSite=Lax`;
};

const compactOrderForCookie = (order) => ({
  ...order,
  payment: {
    ...order.payment,
    screenshotDataUrl: "",
  },
  items: (order.items || []).map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.name,
    subtitle: item.subtitle,
    category: item.category,
    size: item.size,
    amount: item.amount,
    image: item.image,
    price: item.price,
  })),
});

export const getStoredOrders = (isAuthenticated) => {
  if (typeof window === "undefined") {
    return [];
  }

  if (isAuthenticated) {
    return parseJson(window.localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
  }

  const cookieValue = getCookie(GUEST_ORDERS_COOKIE_KEY);
  return parseJson(decodeURIComponent(cookieValue || "[]"));
};

export const saveStoredOrders = (orders, isAuthenticated) => {
  if (typeof window === "undefined") {
    return;
  }

  if (isAuthenticated) {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    return;
  }

  const compactOrders = orders.map(compactOrderForCookie);
  setCookie(GUEST_ORDERS_COOKIE_KEY, encodeURIComponent(JSON.stringify(compactOrders)));
};

export const prependStoredOrder = (order, isAuthenticated) => {
  const existingOrders = getStoredOrders(isAuthenticated);
  const nextOrders = [order, ...existingOrders.filter((storedOrder) => storedOrder.id !== order.id)];
  saveStoredOrders(nextOrders, isAuthenticated);
  return nextOrders;
};
