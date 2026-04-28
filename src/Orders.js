import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FiBox, FiCheckCircle, FiClock, FiPhone, FiTruck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import PageNavigation from "./components/PageNavigation";
import FormatPrice from "./Helpers/FormatPrice";

const ORDERS_STORAGE_KEY = "postertown_orders";
const PRATHAM_PHONE = "919953749307";
const ORDER_STATUS_META = {
  payment_verification: { label: "Payment Verification", tone: "verification", icon: "clock" },
  active: { label: "Active", tone: "active", icon: "check" },
  cancel_requested: { label: "Cancel Requested", tone: "alert", icon: "clock" },
  refund_requested: { label: "Refund Requested", tone: "alert", icon: "clock" },
  cancelled: { label: "Cancelled", tone: "muted", icon: "clock" },
  refunded: { label: "Refunded", tone: "muted", icon: "check" },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedOrders = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!storedOrders) {
      setOrders([]);
      return;
    }

    try {
      const parsed = JSON.parse(storedOrders);
      setOrders(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Failed to parse orders", error);
      setOrders([]);
    }
  }, []);

  const updateOrderStatus = (orderId, nextStatus) => {
    const nextOrders = orders.map((order) => {
      if (order.id !== orderId) {
        return order;
      }

      const statusMeta = ORDER_STATUS_META[nextStatus] || {};

      return {
        ...order,
        status: nextStatus,
        statusLabel: statusMeta.label || nextStatus,
        updatedAt: new Date().toISOString(),
      };
    });

    setOrders(nextOrders);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
    }
  };

  const renderStatusIcon = (status) => {
    const iconType = ORDER_STATUS_META[status]?.icon;
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
      "Please help with payment / cancellation / refund support.",
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
            {orders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-top">
                  <div>
                    <span className="order-label">Order ID</span>
                    <h2>{order.id}</h2>
                  </div>
                  <div className={`status-pill status-${ORDER_STATUS_META[order.status]?.tone || order.status}`}>
                    {renderStatusIcon(order.status)}
                    <span>{order.statusLabel || ORDER_STATUS_META[order.status]?.label || order.status}</span>
                  </div>
                </div>

                <div className="order-meta-grid">
                  <div className="meta-card">
                    <span>Placed on</span>
                    <strong>{new Date(order.createdAt).toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="meta-card">
                    <span>Total</span>
                    <strong>
                      <FormatPrice price={order.totals?.total || 0} />
                    </strong>
                  </div>
                  <div className="meta-card">
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
                      {["payment_verification", "active"].includes(order.status) ? (
                        <button
                          type="button"
                          className="order-action-btn secondary"
                          onClick={() => updateOrderStatus(order.id, "cancel_requested")}>
                          Request cancel
                        </button>
                      ) : null}

                      {["active", "cancel_requested", "cancelled"].includes(order.status) ? (
                        <button
                          type="button"
                          className="order-action-btn"
                          onClick={() => updateOrderStatus(order.id, "refund_requested")}>
                          Request refund
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
                        For payment, cancellation, or refund questions, Pratham will help you directly.
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
            ))}
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
  .meta-card span,
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

  .status-payment_verification {
    background: #fff3e3;
    color: #9b5c21;
    border: 1px solid #f0d2aa;
  }

  .status-active {
    background: #ebf8ef;
    color: #2c7a4b;
    border: 1px solid #c9e8d2;
  }

  .status-alert {
    background: #fff0ec;
    color: #b14d29;
    border: 1px solid #f0c2b1;
  }

  .status-muted {
    background: #f3efe9;
    color: #7b6f64;
    border: 1px solid #e0d4c7;
  }

  .order-meta-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
