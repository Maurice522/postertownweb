import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiBox, FiCheckCircle, FiClock, FiPhone, FiTruck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import PageNavigation from "./components/PageNavigation";
import FormatPrice from "./Helpers/FormatPrice";
import { useUserContext } from "./context/user_context";
import { createCustomerUserId, getStoredOrders, saveStoredOrders } from "./utils/orderStorage";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const PRATHAM_PHONE = "919953749307";
const ORDER_STATUS_META = {
  payment_verification: { label: "Payment Verification", tone: "verification", icon: "clock" },
  payment_not_verified: { label: "Payment Not Verified", tone: "alert", icon: "clock" },
  active: { label: "Active", tone: "active", icon: "check" },
  packing: { label: "Active", tone: "active", icon: "check" },
  product_packing: { label: "Active", tone: "active", icon: "check" },
  sending_to_transit: { label: "Active", tone: "active", icon: "check" },
  in_transit: { label: "Active", tone: "active", icon: "check" },
  product_dispatched: { label: "Active", tone: "active", icon: "check" },
  dispatched: { label: "Active", tone: "active", icon: "check" },
  completed: { label: "Active", tone: "active", icon: "check" },
  delivered: { label: "Active", tone: "active", icon: "check" },
  cancel_requested: { label: "Cancel Requested", tone: "alert", icon: "clock" },
  return_requested: { label: "Return Requested", tone: "alert", icon: "clock" },
  returned: { label: "Cancelled", tone: "alert", icon: "clock" },
  return_in_transit: { label: "Cancelled", tone: "alert", icon: "clock" },
  transit: { label: "Cancelled", tone: "alert", icon: "clock" },
  pickup: { label: "Cancelled", tone: "alert", icon: "clock" },
  pickup_in_transit: { label: "Cancelled", tone: "alert", icon: "clock" },
  refund: { label: "Refunded", tone: "alert", icon: "check" },
  refund_requested: { label: "Refund Requested", tone: "alert", icon: "clock" },
  cancelled: { label: "Cancelled", tone: "muted", icon: "clock" },
  refunded: { label: "Refunded", tone: "muted", icon: "check" },
};
const CURRENT_STATE_META = {
  payment_verification: { label: "Payment Verification", tone: "verification", icon: "clock" },
  payment_not_verified: { label: "Payment Not Verified", tone: "alert", icon: "clock" },
  active: { label: "Packing", tone: "active", icon: "clock" },
  packing: { label: "Packing", tone: "active", icon: "clock" },
  product_packing: { label: "Product Packing", tone: "active", icon: "clock" },
  sending_to_transit: { label: "Sending to Transit", tone: "active", icon: "clock" },
  in_transit: { label: "In Transit", tone: "active", icon: "clock" },
  product_dispatched: { label: "Dispatched", tone: "active", icon: "clock" },
  dispatched: { label: "Dispatched", tone: "active", icon: "clock" },
  completed: { label: "Completed", tone: "completed", icon: "check" },
  delivered: { label: "Delivered", tone: "completed", icon: "check" },
  cancel_requested: { label: "Requested Return", tone: "alert", icon: "clock" },
  return_requested: { label: "Requested Return", tone: "alert", icon: "clock" },
  cancelled: { label: "Requested Return", tone: "alert", icon: "clock" },
  returned: { label: "Requested Return", tone: "alert", icon: "clock" },
  return_in_transit: { label: "Product Pickup", tone: "alert", icon: "clock" },
  transit: { label: "Product Pickup", tone: "alert", icon: "clock" },
  pickup: { label: "Product Pickup", tone: "alert", icon: "clock" },
  pickup_in_transit: { label: "Product Pickup", tone: "alert", icon: "clock" },
  refund: { label: "Refund", tone: "alert", icon: "check" },
  refund_requested: { label: "Refund", tone: "alert", icon: "clock" },
  refunded: { label: "Refund", tone: "alert", icon: "check" },
};

const RETURN_JOURNEY_STATES = [
  "cancel_requested",
  "return_requested",
  "cancelled",
  "returned",
  "return_in_transit",
  "transit",
  "pickup",
  "pickup_in_transit",
  "refund",
  "refund_requested",
  "refunded",
];

const getCurrentState = (order) => {
  if (RETURN_JOURNEY_STATES.includes(order.status)) {
    return order.status;
  }

  return (
    order.currentState ||
    order.fulfillmentStatus ||
    order.shippingStatus ||
    (order.status === "active" ? "packing" : order.status)
  );
};

const isReturnJourney = (order) => {
  const currentState = getCurrentState(order);

  return Boolean(order.actions?.returnRequested) ||
    RETURN_JOURNEY_STATES.includes(currentState) ||
    RETURN_JOURNEY_STATES.includes(order.status);
};

const getCurrentStateMeta = (order) => {
  const currentState = getCurrentState(order);

  return CURRENT_STATE_META[currentState] || {
    label: currentState ? String(currentState).replace(/_/g, " ") : "Payment Verification",
    tone: "verification",
    icon: "clock",
  };
};

const getStatusSubtitle = (order) => {
  const currentState = getCurrentState(order);

  if (isReturnJourney(order)) {
    return ["refund", "refund_requested", "refunded"].includes(currentState) || ["refund", "refund_requested", "refunded"].includes(order.status)
      ? "Refunded"
      : "Cancelled";
  }

  if (
    ["packing", "product_packing", "sending_to_transit", "in_transit", "product_dispatched", "dispatched", "active"].includes(currentState) ||
    ["packing", "product_packing", "sending_to_transit", "in_transit", "product_dispatched", "dispatched", "active"].includes(order.status)
  ) {
    return "Active";
  }

  if (["completed", "delivered"].includes(currentState) || ["completed", "delivered"].includes(order.status)) {
    return "Delivered";
  }

  return "Verification";
};

const getJourneySteps = (order) => {
  const currentState = getCurrentState(order);
  const status = order.status;
  const terminalState = currentState || status;

  if (isReturnJourney(order)) {
    const returnProgressIndexByState = {
      cancel_requested: 0,
      return_requested: 0,
      cancelled: 0,
      returned: 0,
      return_in_transit: 1,
      transit: 1,
      pickup: 1,
      pickup_in_transit: 1,
      refund: 2,
      refund_requested: 2,
      refunded: 2,
    };
    const progressIndex = returnProgressIndexByState[terminalState] ?? returnProgressIndexByState[status] ?? 0;

    return ["Requested Return", "Product Pickup", "Refund"].map((label, index) => ({
      label,
      state: index < progressIndex ? "complete" : index === progressIndex ? "current" : "pending",
    }));
  }

  const progressIndexByState = {
    payment_verification: 0,
    active: 1,
    packing: 1,
    product_packing: 1,
    sending_to_transit: 1,
    in_transit: 2,
    product_dispatched: 2,
    dispatched: 2,
    completed: 3,
    delivered: 3,
  };
  const progressIndex = progressIndexByState[terminalState] ?? progressIndexByState[status] ?? 0;

  return ["Payment Verification", "Packed", "Dispatched", "Delivered"].map((label, index) => ({
    label,
    state: index < progressIndex ? "complete" : index === progressIndex ? "current" : "pending",
  }));
};

const formatPlacedDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const getDeliveryCompletedDate = (order) => {
  const completedValue = order.deliveredAt || order.completedAt || order.deliveryCompletedAt;

  if (completedValue) {
    return new Date(completedValue);
  }

  if (["completed", "delivered"].includes(getCurrentState(order)) || ["completed", "delivered"].includes(order.status)) {
    return new Date(order.updatedAt || order.createdAt);
  }

  return null;
};

const isReturnWindowOpen = (order) => {
  const deliveryDate = getDeliveryCompletedDate(order);

  if (!deliveryDate || Number.isNaN(deliveryDate.getTime())) {
    return false;
  }

  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - deliveryDate.getTime();

  return elapsed >= 0 && elapsed <= sevenDaysInMs;
};

const Orders = () => {
  const { isAuthenticated, user } = useUserContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedOrders = getStoredOrders(isAuthenticated);
    setOrders(storedOrders);
    const controller = new AbortController();

    if (!isAuthenticated) {
      const guestUserIds = [...new Set(storedOrders.map((order) => order.userId).filter(Boolean))];
      const orderIds = storedOrders.map((order) => order.id).filter(Boolean);

      if (guestUserIds.length === 0 && orderIds.length === 0) {
        return;
      }

      const guestRequests = guestUserIds.length > 0
        ? guestUserIds.map((userId) =>
            fetch(`${API_BASE_URL}/api/orders?userId=${encodeURIComponent(userId)}`, {
              signal: controller.signal,
            })
              .then((response) => (response.ok ? response.json() : []))
              .catch(() => [])
          )
        : orderIds.map((orderId) =>
            fetch(`${API_BASE_URL}/api/orders/${encodeURIComponent(orderId)}`, {
              signal: controller.signal,
            })
              .then((response) => (response.ok ? response.json() : null))
              .catch(() => null)
          );

      Promise.all(guestRequests)
        .then((serverResults) => {
          const latestOrders = serverResults
            .flat()
            .filter(Boolean)
            .filter((order, index, allOrders) => allOrders.findIndex((item) => item.id === order.id) === index);

          if (latestOrders.length === 0) {
            return;
          }

          setOrders(latestOrders);
          saveStoredOrders(latestOrders, false);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Failed to load guest server orders", error);
          }
        });

      return () => controller.abort();
    }

    if (!user?.email) {
      return;
    }

    const userId = createCustomerUserId(user);

    fetch(`${API_BASE_URL}/api/orders?userId=${encodeURIComponent(userId)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load orders with ${response.status}`);
        }
        return response.json();
      })
      .then((serverOrders) => {
        const nextOrders = Array.isArray(serverOrders) ? serverOrders : [];
        setOrders(nextOrders);
        saveStoredOrders(nextOrders, true);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Failed to load server orders", error);
        }
      });

    return () => controller.abort();
  }, [isAuthenticated, user]);

  const updateOrderStatus = (orderId, nextStatus) => {
    const previousOrders = orders;
    const nextOrders = orders.map((order) => {
      if (order.id !== orderId) {
        return order;
      }

      const statusMeta = ORDER_STATUS_META[nextStatus] || {};
      const currentStateMeta = CURRENT_STATE_META[nextStatus] || {};

      return {
        ...order,
        status: nextStatus,
        statusLabel: statusMeta.label || nextStatus,
        currentState: nextStatus,
        currentStateLabel: currentStateMeta.label || statusMeta.label || nextStatus,
        updatedAt: new Date().toISOString(),
      };
    });

    setOrders(nextOrders);

    if (typeof window !== "undefined") {
      saveStoredOrders(nextOrders, isAuthenticated);
    }

    fetch(`${API_BASE_URL}/api/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        statusLabel: ORDER_STATUS_META[nextStatus]?.label || nextStatus,
        currentState: nextStatus,
        currentStateLabel: CURRENT_STATE_META[nextStatus]?.label || ORDER_STATUS_META[nextStatus]?.label || nextStatus,
        updatedAt: new Date().toISOString(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Order update failed with ${response.status}`);
        }
      })
      .catch((error) => {
        // Put the order back the way it was so the page never shows a request we didn't record.
        console.error("Failed to update server order status", error);
        setOrders(previousOrders);
        saveStoredOrders(previousOrders, isAuthenticated);
        window.alert("We couldn't send your request. Please try again or message us on WhatsApp.");
      });
  };

  const renderStatusIcon = (status) => {
    const iconType = ORDER_STATUS_META[status]?.icon || CURRENT_STATE_META[status]?.icon;
    return iconType === "check" ? <FiCheckCircle /> : <FiClock />;
  };

  const buildWhatsappMessage = (order) => {
    const itemSummary = (order.items || [])
      .map((item) => `${item.name}${item.size ? ` (${item.size})` : ""} x${item.amount || 1}`)
      .join(", ");

    const lines = [
      "Hi Pratham, I need help with my order.",
      `Order ID: ${order.id}`,
      `Status: ${order.statusLabel || ORDER_STATUS_META[order.status]?.label || order.status}`,
      `Transaction ID: ${order.payment?.transactionId || "Not shared"}`,
      `Order Total: INR ${order.totals?.total || 0}`,
      `Items: ${itemSummary || "No items found"}`,
      "",
      "Please help with payment or cancellation support.",
    ];

    return encodeURIComponent(lines.join("\n"));
  };

  return (
    <Wrapper>
      <PageNavigation title="Orders" />

      <div className="orders-shell">
        <section className="orders-hero">
          <div>
            <span className="eyebrow">Your orders</span>
            <h1>Track placed orders in one calm place.</h1>
            <p>
              Review payment verification orders, active orders, shipping details, and the products already
              submitted for checkout.
            </p>
          </div>
          <div className="orders-hero-card">
            <span>Total orders</span>
            <strong>{orders.length}</strong>
          </div>
        </section>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <FiBox />
            <h2>No orders yet</h2>
            <p>
              Once an order is submitted from checkout, it will appear here with payment status and the
              products inside it.
            </p>
            <Link to="/products" className="browse-link">
              Browse collection
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const currentState = getCurrentState(order);
              const currentStateMeta = getCurrentStateMeta(order);
              const isDelivered = ["completed", "delivered"].includes(currentState);
              const canReturnOrder = isDelivered && isReturnWindowOpen(order);
              const isCancellationAvailable = ![
                "cancel_requested",
                "cancelled",
                "completed",
                "refunded",
                "refund_requested",
                "return_requested",
                "returned",
                "transit",
                "pickup",
                "pickup_in_transit",
                "refund",
              ].includes(currentState);

              return (
                <article key={order.id} className="order-card">
                  <div className="order-top">
                    <div>
                      <span className="order-label">Order ID</span>
                      <h2>{order.id}</h2>
                    </div>
                    <div className="placed-date">
                      <span>Placed on</span>
                      <strong>{formatPlacedDate(order.createdAt)}</strong>
                    </div>
                  </div>

                  <div className="order-meta-grid">
                  <div className="meta-card status-meta-card">
                    <span className="status-title">
                      Order status -{" "}
                      <strong className={`subtitle-${currentStateMeta.tone}`}>{getStatusSubtitle(order)}</strong>
                    </span>
                    <div className={`state-pill state-${currentStateMeta.tone}`}>
                      {renderStatusIcon(getCurrentState(order))}
                      <span>{isReturnJourney(order) ? currentStateMeta.label : order.currentStateLabel || currentStateMeta.label}</span>
                    </div>
                    <div className="journey-track">
                      {getJourneySteps(order).map((step) => (
                        <div key={step.label} className={`journey-step journey-${step.state}`}>
                          <span className="journey-dot" />
                          <span>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="meta-card metric-card">
                    <span>Total</span>
                    <strong>
                      <FormatPrice price={order.totals?.total || 0} />
                    </strong>
                  </div>
                  <div className="meta-card metric-card">
                    <span>Items</span>
                    <strong>{order.items?.length || 0}</strong>
                  </div>
                </div>

                <div className="order-main-grid">
                  <div className="order-items">
                    <div className="section-top">
                      <h3>Products in this order</h3>
                      <span>{order.items?.length || 0} item{order.items?.length > 1 ? "s" : ""}</span>
                    </div>

                    <div className="items-list">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="order-item">
                          <img src={Array.isArray(item.image) ? item.image?.[0]?.url || item.image?.[0] : item.image} alt={item.name} />
                          <div className="order-item-copy">
                            <strong>{item.name}</strong>
                            {item.subtitle ? <p>{item.subtitle}</p> : null}
                            <div className="order-item-meta">
                              {item.size ? <span>Size: {item.size}</span> : null}
                              <span>Qty: {item.amount}</span>
                            </div>
                          </div>
                          <div className="order-item-price">
                            <FormatPrice price={(item.price || 0) * (item.amount || 1)} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-actions">
                      {isCancellationAvailable ? (
                        <button
                          type="button"
                          className="order-action-btn secondary"
                          onClick={() => {
                            if (window.confirm(`Request cancellation of order ${order.id}?`)) {
                              updateOrderStatus(order.id, "cancel_requested");
                            }
                          }}>
                          Request cancel
                        </button>
                      ) : null}
                      {canReturnOrder ? (
                        <button
                          type="button"
                          className="order-action-btn secondary"
                          onClick={() => {
                            if (window.confirm(`Request a return for order ${order.id}?`)) {
                              updateOrderStatus(order.id, "return_requested");
                            }
                          }}>
                          Return order
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <aside className="order-sidebar">
                    <div className="sidebar-card">
                      <div className="section-top">
                        <h3>Shipping</h3>
                        <FiTruck />
                      </div>
                      <strong>{order.shipping?.recipient || order.customer?.name || "Customer"}</strong>
                      <p>{order.shipping?.destination || "Address not available"}</p>
                    </div>

                    <div className="sidebar-card">
                      <div className="section-top">
                        <h3>Payment</h3>
                        <FiCheckCircle />
                      </div>
                      <p>
                        <span className="inline-label">Transaction ID</span>
                        <strong>{order.payment?.transactionId || "Not shared"}</strong>
                      </p>
                      {order.payment?.screenshotDataUrl ? (
                        <div className="proof-thumb">
                          <img src={order.payment.screenshotDataUrl} alt="Payment proof" />
                        </div>
                      ) : null}
                    </div>

                    <div className="sidebar-card support-card">
                      <div className="section-top">
                        <h3>Need help?</h3>
                        <FiPhone />
                      </div>
                      <p>
                        For payment or cancellation questions, Pratham will help you directly.
                      </p>
                      <div className="support-actions">
                        <a href="tel:+919953749307" className="support-call-link">+91 9953749307</a>
                        <a
                          href={`https://wa.me/${PRATHAM_PHONE}?text=${buildWhatsappMessage(order)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="support-whatsapp-link">
                          <FaWhatsapp />
                          Chat on WhatsApp
                        </a>
                      </div>
                    </div>
                  </aside>
                </div>
              </article>
              );
            })}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);
  min-height: 100vh;

  .orders-shell {
    width: min(100%, 156rem);
    margin: 0 auto;
    padding: 3rem 2.4rem 7rem;
  }

  .orders-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 24rem;
    gap: 2rem;
    align-items: end;
    margin-bottom: 2.4rem;
  }

  .eyebrow,
  .order-label {
    display: inline-block;
    color: #8a5c43;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  h1 {
    font-size: clamp(3.2rem, 4.8vw, 5rem);
    line-height: 1.08;
    margin-bottom: 0.8rem;
  }

  .orders-hero p,
  .empty-orders p,
  .sidebar-card p,
  .order-item-copy p {
    color: #6b5f56;
    line-height: 1.8;
  }

  .orders-hero-card {
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 2.4rem;
    padding: 2rem;
    box-shadow: 0 18px 38px rgba(61, 41, 22, 0.06);
  }

  .orders-hero-card span,
  .meta-card > span,
  .inline-label {
    display: block;
    color: #8a7b6e;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.45rem;
  }

  .orders-hero-card strong {
    font-size: 4rem;
    color: #231f20;
  }

  .empty-orders,
  .order-card {
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 2.8rem;
    box-shadow: 0 18px 38px rgba(61, 41, 22, 0.06);
  }

  .empty-orders {
    text-align: center;
    padding: 4rem 3rem;
  }

  .empty-orders svg {
    font-size: 4.4rem;
    color: #cf6d3f;
    margin-bottom: 1rem;
  }

  .empty-orders h2 {
    font-size: 3rem;
    margin-bottom: 0.8rem;
  }

  .browse-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 4.8rem;
    padding: 0 1.8rem;
    border-radius: 999px;
    background: #231f20;
    color: #fff8f1;
    font-size: 1.35rem;
    font-weight: 700;
    margin-top: 1.8rem;
  }

  .orders-list {
    display: grid;
    gap: 1.8rem;
  }

  .order-card {
    padding: 2.2rem;
  }

  .order-top,
  .section-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
  }

  .order-top {
    margin-bottom: 1.8rem;
  }

  .order-top h2 {
    font-size: 2.8rem;
  }

  .placed-date {
    text-align: right;
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.4rem;
    padding: 0.9rem 1.2rem;
    min-width: 18rem;
  }

  .placed-date span {
    display: block;
    color: #8a7b6e;
    font-size: 1.05rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.25rem;
  }

  .placed-date strong {
    color: #231f20;
    font-size: 1.28rem;
    white-space: nowrap;
  }

  .status-meta-card {
    display: grid;
    align-content: center;
    gap: 0.8rem;
  }

  .status-meta-card > span {
    color: #a24b22;
  }

  .status-title {
    display: inline-flex;
    align-items: baseline;
    gap: 0.35rem;
  }

  .status-meta-card .status-title strong {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: inherit;
    line-height: inherit;
  }

  .status-title .subtitle-active,
  .status-title .subtitle-completed {
    color: #2c7a4b;
  }

  .status-title .subtitle-alert,
  .status-title .subtitle-muted {
    color: #b14d29;
  }

  .status-title .subtitle-verification {
    color: #9b5c21;
  }

  .metric-card {
    display: grid;
    align-content: center;
  }

  .metric-card strong {
    font-size: 2.2rem;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    min-height: 4rem;
    padding: 0 1.4rem;
    border-radius: 999px;
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .state-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    width: fit-content;
    min-height: 3.4rem;
    padding: 0 1.1rem;
    border-radius: 999px;
    font-size: 1.12rem;
    font-weight: 700;
    text-transform: capitalize;
    letter-spacing: 0.02em;
  }

  .state-pill svg {
    color: currentColor;
  }

  .journey-track {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 0.8rem;
    margin-top: 0.5rem;
  }

  .journey-step {
    position: relative;
    display: grid;
    gap: 0.45rem;
    color: #8a7b6e;
    font-size: 1.08rem;
    line-height: 1.35;
  }

  .journey-step::before {
    content: "";
    position: absolute;
    top: 0.55rem;
    left: 1.3rem;
    right: -0.8rem;
    height: 0.2rem;
    background: #eadfce;
  }

  .journey-step:last-child::before {
    display: none;
  }

  .journey-dot {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 999px;
    background: #eadfce;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px #ddcbb8;
    position: relative;
    z-index: 1;
  }

  .journey-complete,
  .journey-current {
    color: #2c7a4b;
    font-weight: 700;
  }

  .journey-complete::before {
    background: #9dd4ac;
  }

  .journey-complete .journey-dot,
  .journey-current .journey-dot {
    background: #2c7a4b;
    box-shadow: 0 0 0 1px #9dd4ac;
  }

  .journey-current .journey-dot {
    background: #fff;
    border-color: #2c7a4b;
  }

  .status-payment_verification,
  .status-verification,
  .state-verification {
    background: #fff3e3;
    color: #9b5c21;
    border: 1px solid #f0d2aa;
  }

  .status-active,
  .state-active,
  .state-completed {
    background: #ebf8ef;
    color: #2c7a4b;
    border: 1px solid #c9e8d2;
  }

  .status-alert,
  .state-alert {
    background: #fff0ec;
    color: #b14d29;
    border: 1px solid #f0c2b1;
  }

  .status-muted,
  .state-muted {
    background: #f3efe9;
    color: #7b6f64;
    border: 1px solid #e0d4c7;
  }

  .order-meta-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(16rem, 0.7fr) minmax(16rem, 0.7fr);
    gap: 1.2rem;
    margin-bottom: 1.8rem;
  }

  .meta-card,
  .sidebar-card {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 1.5rem;
  }

  .meta-card strong {
    color: #231f20;
    font-size: 1.9rem;
  }

  .order-main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(28rem, 0.7fr);
    gap: 1.6rem;
    align-items: start;
  }

  .order-items {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 1.6rem;
  }

  .section-top h3 {
    font-size: 1.9rem;
  }

  .section-top span,
  .section-top svg {
    color: #8a7b6e;
    font-size: 1.3rem;
  }

  .items-list {
    display: grid;
    gap: 1rem;
    margin-top: 1.4rem;
  }

  .order-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.6rem;
    padding-top: 1.4rem;
    border-top: 1px solid #f0e4d7;
  }

  .order-action-btn {
    min-height: 4.4rem;
    padding: 0 1.5rem;
    border-radius: 999px;
    border: none;
    background: #231f20;
    color: #fff8f1;
    font-size: 1.22rem;
    font-weight: 700;
    cursor: pointer;
  }

  .order-action-btn.secondary {
    background: #f7ede1;
    color: #2a241f;
    border: 1px solid #e2d3c2;
  }

  .order-item {
    display: grid;
    grid-template-columns: 7rem minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem 0;
    border-top: 1px solid #f0e4d7;
  }

  .order-item:first-child {
    border-top: none;
    padding-top: 0;
  }

  .order-item img {
    width: 7rem;
    height: 8.6rem;
    object-fit: cover;
    border-radius: 1.2rem;
    background: #fff7ee;
    border: 1px solid #eadfce;
  }

  .order-item-copy strong,
  .sidebar-card strong {
    display: block;
    color: #231f20;
    font-size: 1.55rem;
    margin-bottom: 0.3rem;
  }

  .order-item-meta {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }

  .order-item-meta span {
    background: #f8ebdc;
    color: #81553d;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    font-size: 1.1rem;
  }

  .order-item-price {
    color: #231f20;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .order-sidebar {
    display: grid;
    gap: 1rem;
  }

  .proof-thumb {
    margin-top: 1rem;
  }

  .proof-thumb img {
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    border-radius: 1.2rem;
    border: 1px solid #eadfce;
  }

  .support-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 1rem;
  }

  .support-card a {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    min-height: 4.2rem;
    padding: 0 1.2rem;
    border-radius: 999px;
    font-size: 1.28rem;
    font-weight: 700;
  }

  .support-call-link {
    background: #231f20;
    color: #fff8f1;
  }

  .support-whatsapp-link {
    background: #e9f9ef;
    color: #138a45;
    border: 1px solid #bfe8ce;
  }

  .support-whatsapp-link svg {
    font-size: 1.6rem;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .orders-hero,
    .order-main-grid,
    .order-meta-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .orders-shell {
      padding: 2rem 1.4rem 5rem;
    }

    .order-top {
      flex-direction: column;
    }

    .placed-date {
      text-align: left;
      width: 100%;
    }

    .order-card,
    .empty-orders {
      padding: 1.8rem;
      border-radius: 2.2rem;
    }

    .order-item {
      grid-template-columns: 6rem minmax(0, 1fr);
    }

    .order-item-price {
      grid-column: 2;
    }
  }
`;

export default Orders;
