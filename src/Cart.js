import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCopy,
  FiCreditCard,
  FiImage,
  FiShield,
  FiTrash2,
  FiTruck,
} from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import { useCartContext } from "./context/cart_context";
import CartItem from "./components/CartItem";
import FormatPrice from "./Helpers/FormatPrice";
import { useUserContext } from "./context/user_context";

const SHIPPING_STORAGE_KEY = "postertown_shipping_info";
const PAYMENT_STORAGE_KEY = "postertown_payment_info";
const ORDERS_STORAGE_KEY = "postertown_orders";
const UPI_ID = "mauricerana@okicici";
const UPI_PAYEE = "Poster Town";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, clearCart, total_price, shipping_fee, total_item } = useCartContext();
  const { isAuthenticated, user } = useUserContext();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    payerName: "",
    transactionId: "",
    screenshotName: "",
    screenshotDataUrl: "",
    note: "",
  });
  const hasUserDetails = Boolean(isAuthenticated && (user?.name || user?.email));
  const hasAddress = Boolean(
    shippingInfo.addressLine1 &&
      shippingInfo.city &&
      shippingInfo.state &&
      shippingInfo.pincode
  );
  const visibleShippingFee = hasAddress ? shipping_fee : 0;
  const orderTotal = total_price + visibleShippingFee;
  const canCheckout = hasAddress;
  const shippingRecipient = shippingInfo.fullName || user?.name || "Shipping address";
  const shippingDestination = [
    shippingInfo.addressLine1,
    shippingInfo.addressLine2,
    shippingInfo.city,
    shippingInfo.state,
    shippingInfo.pincode,
  ]
    .filter(Boolean)
    .join(", ");
  const hasPaymentSubmission = Boolean(paymentInfo.transactionId && paymentInfo.payerName);
  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: UPI_PAYEE,
      cu: "INR",
      am: String(orderTotal),
      tn: `Poster Town order for ${shippingRecipient}`,
    });

    return `upi://pay?${params.toString()}`;
  }, [orderTotal, shippingRecipient]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedInfo = window.localStorage.getItem(SHIPPING_STORAGE_KEY);
    if (storedInfo) {
      try {
        const parsed = JSON.parse(storedInfo);
        setShippingInfo((current) => ({ ...current, ...parsed }));
      } catch (error) {
        console.error("Failed to parse shipping info", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedPayment = window.localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (storedPayment) {
      try {
        const parsed = JSON.parse(storedPayment);
        setPaymentInfo((current) => ({ ...current, ...parsed }));
      } catch (error) {
        console.error("Failed to parse payment info", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    setShippingInfo((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
    }));
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!copiedField || typeof window === "undefined") {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopiedField(""), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copiedField]);

  const handleShippingChange = (event) => {
    const { name, value } = event.target;
    setShippingInfo((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleShippingSubmit = (event) => {
    event.preventDefault();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(shippingInfo));
    }
    setIsAddressModalOpen(false);
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;
    setPaymentInfo((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleScreenshotChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPaymentInfo((current) => ({
        ...current,
        screenshotName: "",
        screenshotDataUrl: "",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPaymentInfo((current) => ({
        ...current,
        screenshotName: file.name,
        screenshotDataUrl: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentSubmit = (event) => {
    event.preventDefault();

    const orderId = `PT-${Date.now().toString().slice(-8)}`;
    const orderRecord = {
      id: orderId,
      status: "payment_verification",
      statusLabel: "Payment Verification",
      createdAt: new Date().toISOString(),
      customer: {
        name: shippingRecipient,
        email: user?.email || "",
        phone: shippingInfo.phone || "",
      },
      shipping: {
        ...shippingInfo,
        recipient: shippingRecipient,
        destination: shippingDestination,
      },
      payment: {
        method: "UPI",
        receiverUpiId: UPI_ID,
        transactionId: paymentInfo.transactionId,
        screenshotName: paymentInfo.screenshotName,
        screenshotDataUrl: paymentInfo.screenshotDataUrl,
        note: paymentInfo.note,
        payerName: paymentInfo.payerName,
      },
      items: cart.map((item) => ({
        ...item,
      })),
      totals: {
        subtotal: total_price,
        shipping: visibleShippingFee,
        total: orderTotal,
      },
      notifications: {
        email: Boolean(user?.email),
        phone: Boolean(shippingInfo.phone),
      },
      actions: {
        cancellable: true,
        refundable: true,
      },
    };

    if (typeof window !== "undefined") {
      const existingOrders = JSON.parse(window.localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
      const nextOrders = Array.isArray(existingOrders) ? [orderRecord, ...existingOrders] : [orderRecord];
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
      window.localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(paymentInfo));
    }

    clearCart();
    setPlacedOrder(orderRecord);
    setIsPaymentModalOpen(false);
  };

  const handleCopy = async (value, field) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  if (placedOrder) {
    return (
      <ConfirmationState>
        <div className="confirmation-shell">
          <div className="success-badge">
            <div className="success-core">
              <FiCheckCircle />
            </div>
            <div className="success-ring success-ring-one" />
            <div className="success-ring success-ring-two" />
          </div>

          <span className="eyebrow">Order placed</span>
          <h1>Your order has been submitted.</h1>
          <p>
            We have created order <strong>{placedOrder.id}</strong> and moved it into
            <strong> Payment Verification</strong>. Once the payment is verified, the order will switch
            to <strong>Active</strong> status.
          </p>

          <div className="confirmation-summary">
            <div>
              <span>Status</span>
              <strong>{placedOrder.statusLabel}</strong>
            </div>
            <div>
              <span>Items</span>
              <strong>{placedOrder.items.length}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>
                <FormatPrice price={placedOrder.totals.total} />
              </strong>
            </div>
          </div>

          <div className="confirmation-note-grid">
            <div className="note-card">
              <h3>What happens next</h3>
              <p>
                As soon as the payment is verified against your UPI transaction ID and screenshot, we
                will mark the order as active.
              </p>
            </div>
            <div className="note-card">
              <h3>Notifications</h3>
              <p>
                You will get updates on email and phone once the order becomes active and moves forward in
                processing.
              </p>
            </div>
            <div className="note-card">
              <h3>Cancel or refund</h3>
              <p>
                You can still cancel the order while it is under payment verification, and refund handling
                can be processed if the payment has already gone through. Pratham will handle any payment-related
                issue directly at <strong>+91 9953749307</strong>.
              </p>
            </div>
          </div>

          <div className="confirmation-actions">
            <NavLink to="/products" className="primary-link">
              Continue shopping
            </NavLink>
            <button type="button" className="secondary-btn" onClick={() => setPlacedOrder(null)}>
              Back to cart
            </button>
          </div>
        </div>
      </ConfirmationState>
    );
  }

  if (cart.length === 0) {
    return (
      <EmptyState>
        <div className="empty-shell">
          <span className="eyebrow">Your cart</span>
          <h1>Your cart is feeling a little too clean.</h1>
          <p>Add a few posters and we’ll line them up here with totals, quantity controls, and checkout-ready details.</p>
          <NavLink to="/products" className="browse-link">
            <FiArrowLeft />
            Browse collection
          </NavLink>
        </div>
      </EmptyState>
    );
  }

  return (
    <Wrapper>
      <div className="cart-shell">
        <section className="cart-hero">
          <div className="hero-copy">
            <span className="eyebrow">Review your picks</span>
            <h1>Cart</h1>
            <p>{total_item} item{total_item > 1 ? "s" : ""} ready for checkout.</p>
          </div>

          <div className="hero-actions">
            <NavLink to="/products" className="ghost-link">
              <FiArrowLeft />
              Continue shopping
            </NavLink>

            <button type="button" className="clear-btn" onClick={clearCart}>
              <FiTrash2 />
              Clear cart
            </button>
          </div>
        </section>

        {isAuthenticated && user ? (
          <section className="user-strip">
            <div className="user-chip">
              <img src={user.picture || user.profile} alt={user.name} />
              <div>
                <span>Signed in</span>
                <strong>{user.name}</strong>
              </div>
            </div>
          </section>
        ) : null}

        <div className="cart-layout">
          <section className="cart-list-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">Items in cart</span>
                <h2>Almost there</h2>
              </div>
              <p>Adjust quantity, review size choices, or remove anything that doesn’t belong.</p>
            </div>

            <div className="cart-list">
              {cart.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>
          </section>

          <aside className="summary-panel">
            <div className="summary-card">
              <span className="panel-kicker">Order summary</span>
              <h3>Totals</h3>

              <div className="summary-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>
                    <FormatPrice price={total_price} />
                  </strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>
                    {hasAddress ? <FormatPrice price={shipping_fee} /> : "Add address to calculate"}
                  </strong>
                </div>
                <div className="total-line">
                  <span>Order total</span>
                  <strong>
                    <FormatPrice price={orderTotal} />
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className={canCheckout ? "checkout-btn" : "checkout-btn disabled"}
                disabled={!canCheckout}
                onClick={() => canCheckout && setIsPaymentModalOpen(true)}>
                Proceed to checkout
              </button>

              {hasAddress ? (
                <div className="shipping-destination-card">
                  <div className="shipping-destination-top">
                    <div>
                      <span className="shipping-label">Shipping to</span>
                      <strong>{shippingRecipient}</strong>
                    </div>
                    <button
                      type="button"
                      className="helper-btn secondary"
                      onClick={() => setIsAddressModalOpen(true)}>
                      Edit
                    </button>
                  </div>
                  <p>{shippingDestination}</p>
                </div>
              ) : (
                <div className="checkout-helper">
                  <p>
                    {!hasUserDetails
                      ? "Add your shipping details to continue to checkout. Logging in is optional, but it helps keep your order tied to your account."
                      : "Add your delivery details before checkout so we know where this order is headed."}
                  </p>
                  <div className="helper-actions">
                    {!hasUserDetails ? (
                      <button
                        type="button"
                        className="helper-btn"
                        onClick={() => navigate("/auth", { state: { redirectTo: "/cart", mode: "login" } })}>
                        Log in
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="helper-btn secondary"
                      onClick={() => setIsAddressModalOpen(true)}>
                      Add address
                    </button>
                  </div>
                </div>
              )}

              {hasPaymentSubmission ? (
                <div className="payment-status-card">
                  <div className="payment-status-top">
                    <div>
                      <span className="shipping-label">Payment submitted</span>
                      <strong>{paymentInfo.payerName}</strong>
                    </div>
                    <button
                      type="button"
                      className="helper-btn secondary"
                      onClick={() => setIsPaymentModalOpen(true)}>
                      Edit
                    </button>
                  </div>
                  <div className="payment-status-meta">
                    <div className="payment-status-line">
                      <span>Transaction ID</span>
                      <strong>{paymentInfo.transactionId}</strong>
                    </div>
                    {paymentInfo.screenshotDataUrl ? (
                      <div className="payment-status-proof">
                        <span>Payment proof</span>
                        <img src={paymentInfo.screenshotDataUrl} alt="Payment proof preview" />
                      </div>
                    ) : null}
                  </div>
                  <div className="verification-note">
                    <FiCheckCircle />
                    <span>
                      Payment can be confirmed by matching the transaction ID, amount, and incoming credit
                      received on <strong>{UPI_ID}</strong>.
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="trust-list">
                <div>
                  <FiShield />
                  <span>Secure checkout</span>
                </div>
                <div>
                  <FiTruck />
                  <span>Fast dispatch</span>
                </div>
                <div>
                  <FiCreditCard />
                  <span>Prepaid perks</span>
                </div>
              </div>
            </div>

            <div className="note-card">
              <h4>Why shoppers finish here</h4>
              <p>Premium prints, cleaner packaging, and a checkout flow that keeps the details simple.</p>
            </div>
          </aside>
        </div>
      </div>

      {isAddressModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsAddressModalOpen(false)}>
          <div className="address-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-top">
              <div>
                <span className="panel-kicker">Shipping details</span>
                <h3>Add delivery address</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setIsAddressModalOpen(false)}>
                x
              </button>
            </div>

            <form className="address-form" onSubmit={handleShippingSubmit}>
              <div className="form-grid">
                <label>
                  Full name
                  <input
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    placeholder="Your full name"
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </label>
                <label className="full-width">
                  Address line 1
                  <input
                    name="addressLine1"
                    value={shippingInfo.addressLine1}
                    onChange={handleShippingChange}
                    placeholder="House number, street, area"
                    required
                  />
                </label>
                <label className="full-width">
                  Address line 2
                  <input
                    name="addressLine2"
                    value={shippingInfo.addressLine2}
                    onChange={handleShippingChange}
                    placeholder="Apartment, landmark, optional"
                  />
                </label>
                <label>
                  City
                  <input
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    placeholder="City"
                    required
                  />
                </label>
                <label>
                  State
                  <input
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    placeholder="State"
                    required
                  />
                </label>
                <label>
                  Pincode
                  <input
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleShippingChange}
                    placeholder="Pincode"
                    required
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="helper-btn secondary" onClick={() => setIsAddressModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="helper-btn">
                  Save address
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isPaymentModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsPaymentModalOpen(false)}>
          <div className="payment-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-top">
              <div>
                <span className="panel-kicker">Payment</span>
                <h3>Pay with UPI</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setIsPaymentModalOpen(false)}>
                x
              </button>
            </div>

            <div className="payment-layout">
              <div className="qr-panel">
                <div className="qr-shell">
                  <QRCodeSVG value={upiLink} size={248} includeMargin />
                </div>
                <a className="upi-link-btn" href={upiLink}>
                  Open in UPI app
                </a>
              </div>

              <div className="payment-copy">
                <div className="payment-summary-card">
                  <span className="shipping-label">Amount to pay</span>
                  <strong>
                    <FormatPrice price={orderTotal} />
                  </strong>
                </div>

                <div className="copy-row">
                  <div>
                    <span className="copy-label">UPI ID</span>
                    <strong>{UPI_ID}</strong>
                  </div>
                  <button type="button" className="copy-btn" onClick={() => handleCopy(UPI_ID, "upi")}>
                    <FiCopy />
                    {copiedField === "upi" ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="copy-row">
                  <div>
                    <span className="copy-label">Ship to</span>
                    <strong>{shippingRecipient}</strong>
                    <p>{shippingDestination}</p>
                  </div>
                </div>

                <div className="payment-explainer">
                  <h4>How payment confirmation works</h4>
                  <p>
                    After paying, share the UPI transaction ID and upload the payment screenshot. That gives
                    a much cleaner manual trail to compare with the incoming payment received on the merchant account.
                  </p>
                  <p className="small-note">
                    For full automatic verification later, we would need a payment gateway or bank webhook.
                    Right now this is a manual-but-real confirmation path.
                  </p>
                </div>
              </div>
            </div>

            <form className="payment-form" onSubmit={handlePaymentSubmit}>
              <div className="form-grid">
                <label>
                  Your name
                  <input
                    name="payerName"
                    value={paymentInfo.payerName}
                    onChange={handlePaymentChange}
                    placeholder="Name used while paying"
                    required
                  />
                </label>
                <label>
                  UPI transaction ID
                  <input
                    name="transactionId"
                    value={paymentInfo.transactionId}
                    onChange={handlePaymentChange}
                    placeholder="Transaction / UTR / reference ID"
                    required
                  />
                </label>
                <label className="full-width upload-field">
                  Payment screenshot
                  <div className="upload-shell">
                    <input type="file" accept="image/*" onChange={handleScreenshotChange} />
                    <div className="upload-visual">
                      <div className="upload-icon">
                        <FiImage />
                      </div>
                      <div className="upload-text">
                        <strong>{paymentInfo.screenshotName ? "Screenshot attached" : "Upload payment screenshot"}</strong>
                        <span>
                          {paymentInfo.screenshotName
                            ? paymentInfo.screenshotName
                            : "PNG, JPG, or JPEG from your UPI app receipt"}
                        </span>
                      </div>
                      <span className="upload-action">
                        {paymentInfo.screenshotName ? "Replace" : "Choose file"}
                      </span>
                    </div>
                  </div>
                </label>
                <label className="full-width">
                  Note
                  <input
                    name="note"
                    value={paymentInfo.note}
                    onChange={handlePaymentChange}
                    placeholder="Optional note for this payment"
                  />
                </label>
              </div>

              {paymentInfo.screenshotDataUrl ? (
                <div className="payment-proof-preview">
                  <div className="payment-proof-preview-text">
                    <span className="copy-label">Attached screenshot</span>
                    <div className="payment-proof-preview-name">{paymentInfo.screenshotName}</div>
                  </div>
                  <img src={paymentInfo.screenshotDataUrl} alt="Uploaded payment screenshot" />
                </div>
              ) : null}

              <div className="modal-actions">
                <button type="button" className="helper-btn secondary" onClick={() => setIsPaymentModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="helper-btn">
                  Submit payment details
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </Wrapper>
  );
};

const EmptyState = styled.section`
  min-height: 70vh;
  display: grid;
  place-items: center;
  padding: 4rem 2rem 6rem;
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);

  .empty-shell {
    width: min(100%, 72rem);
    text-align: center;
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 3rem;
    padding: 4rem 3rem;
    box-shadow: 0 24px 44px rgba(61, 41, 22, 0.08);
  }

  .eyebrow {
    display: inline-block;
    color: #8a5c43;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 1.15rem;
    margin-bottom: 1.2rem;
  }

  h1 {
    font-size: clamp(3.2rem, 5vw, 5rem);
    line-height: 1.08;
    margin-bottom: 1rem;
  }

  p {
    color: #6b5f56;
    max-width: 56rem;
    margin: 0 auto 2rem;
    line-height: 1.8;
  }

  .browse-link {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    min-height: 4.8rem;
    padding: 0 1.8rem;
    border-radius: 999px;
    background: #231f20;
    color: #fff8f1;
    font-size: 1.35rem;
    font-weight: 700;
  }
`;

const ConfirmationState = styled.section`
  min-height: 78vh;
  display: grid;
  place-items: center;
  padding: 4rem 2rem 6rem;
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);

  .confirmation-shell {
    width: min(100%, 86rem);
    text-align: center;
    background: rgba(255, 250, 243, 0.97);
    border: 1px solid #eadfce;
    border-radius: 3rem;
    padding: 4rem 3rem;
    box-shadow: 0 24px 44px rgba(61, 41, 22, 0.08);
    animation: riseIn 500ms ease-out;
  }

  .success-badge {
    position: relative;
    width: 9rem;
    height: 9rem;
    margin: 0 auto 1.8rem;
    display: grid;
    place-items: center;
  }

  .success-core {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #fff7ef 0%, #f4cda8 34%, #cf6d3f 68%, #8e3b1f 100%);
    color: #fff;
    display: grid;
    place-items: center;
    font-size: 3rem;
    box-shadow: 0 18px 34px rgba(142, 59, 31, 0.24);
    position: relative;
    z-index: 2;
    animation: pulseGlow 1.5s ease-in-out infinite;
  }

  .success-ring {
    position: absolute;
    border: 1px solid rgba(207, 109, 63, 0.24);
    border-radius: 999px;
    animation: rippleOut 2s ease-out infinite;
  }

  .success-ring-one {
    width: 9rem;
    height: 9rem;
  }

  .success-ring-two {
    width: 12.6rem;
    height: 12.6rem;
    animation-delay: 0.45s;
  }

  .eyebrow {
    display: inline-block;
    color: #8a5c43;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 1.15rem;
    margin-bottom: 1.2rem;
  }

  h1 {
    font-size: clamp(3.2rem, 5vw, 4.8rem);
    line-height: 1.08;
    margin-bottom: 1rem;
  }

  p {
    color: #6b5f56;
    line-height: 1.8;
    max-width: 68rem;
    margin: 0 auto;
  }

  p strong {
    color: #231f20;
  }

  .confirmation-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.2rem;
    margin: 2.4rem 0;
  }

  .confirmation-summary div,
  .note-card {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 1.6rem;
  }

  .confirmation-summary span {
    display: block;
    color: #8a7b6e;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.45rem;
  }

  .confirmation-summary strong {
    color: #231f20;
    font-size: 2rem;
  }

  .confirmation-note-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.2rem;
    text-align: left;
    margin-bottom: 2.4rem;
  }

  .note-card h3 {
    font-size: 1.7rem;
    margin-bottom: 0.8rem;
  }

  .note-card p {
    margin: 0;
    max-width: none;
    font-size: 1.4rem;
  }

  .confirmation-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .primary-link,
  .secondary-btn {
    min-height: 4.8rem;
    padding: 0 1.8rem;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.32rem;
    font-weight: 700;
  }

  .primary-link {
    background: #231f20;
    color: #fff8f1;
  }

  .secondary-btn {
    border: 1px solid #e2d3c2;
    background: #fff7ee;
    color: #2a241f;
    cursor: pointer;
  }

  @keyframes riseIn {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseGlow {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 18px 34px rgba(142, 59, 31, 0.24);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 22px 40px rgba(142, 59, 31, 0.32);
    }
  }

  @keyframes rippleOut {
    0% {
      opacity: 0;
      transform: scale(0.74);
    }
    25% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(1.16);
    }
  }

  @media (max-width: 800px) {
    .confirmation-summary,
    .confirmation-note-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const Wrapper = styled.section`
  background: linear-gradient(180deg, #f8f5ef 0%, #efe4d6 100%);
  min-height: 100vh;
  padding: 4rem 0 7rem;

  .cart-shell {
    width: min(100%, 156rem);
    margin: 0 auto;
    padding: 0 2.4rem;
  }

  .cart-hero {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: end;
    margin-bottom: 2rem;
  }

  .eyebrow,
  .panel-kicker {
    display: inline-block;
    color: #8a5c43;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .hero-copy h1 {
    font-size: clamp(3.2rem, 4.8vw, 5.2rem);
    line-height: 1.04;
    margin-bottom: 0.8rem;
  }

  .hero-copy p,
  .panel-header p,
  .note-card p {
    color: #6b5f56;
    line-height: 1.8;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-end;
  }

  .ghost-link,
  .clear-btn {
    min-height: 4.8rem;
    padding: 0 1.6rem;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    border: 1px solid #e0d2c2;
    background: rgba(255, 250, 243, 0.94);
    color: #2a241f;
    font-size: 1.3rem;
    font-weight: 700;
    cursor: pointer;
  }

  .clear-btn {
    color: #c85c49;
  }

  .user-strip {
    margin-bottom: 2rem;
  }

  .user-chip {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 999px;
    padding: 0.9rem 1.2rem 0.9rem 0.9rem;
    box-shadow: 0 10px 20px rgba(61, 41, 22, 0.05);
  }

  .user-chip img {
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-chip span {
    display: block;
    color: #8a7b6e;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.2rem;
  }

  .user-chip strong {
    color: #231f20;
    font-size: 1.45rem;
  }

  .cart-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 34rem;
    gap: 2.2rem;
    align-items: start;
  }

  .cart-list-panel,
  .summary-card,
  .note-card {
    background: rgba(255, 250, 243, 0.96);
    border: 1px solid #eadfce;
    border-radius: 2.8rem;
    box-shadow: 0 18px 38px rgba(61, 41, 22, 0.06);
  }

  .cart-list-panel {
    padding: 2.4rem;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: end;
    margin-bottom: 1.8rem;
  }

  .panel-header h2 {
    font-size: 3rem;
  }

  .panel-header p {
    max-width: 42rem;
    text-align: right;
  }

  .cart-list {
    display: grid;
    gap: 1.4rem;
  }

  .summary-panel {
    position: sticky;
    top: 11rem;
    display: grid;
    gap: 1.4rem;
  }

  .summary-card,
  .note-card {
    padding: 2rem;
  }

  .summary-card h3,
  .note-card h4 {
    font-size: 2.3rem;
    margin-bottom: 1.4rem;
  }

  .summary-lines {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.8rem;
  }

  .summary-lines div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    color: #6b5f56;
  }

  .summary-lines strong {
    color: #231f20;
    font-size: 1.55rem;
  }

  .total-line {
    margin-top: 0.5rem;
    padding-top: 1.2rem;
    border-top: 1px solid #e7dacc;
  }

  .total-line span,
  .total-line strong {
    font-size: 1.8rem;
    font-weight: 700;
    color: #231f20;
  }

  .checkout-btn {
    width: 100%;
    min-height: 5.2rem;
    border: none;
    border-radius: 1.6rem;
    background: linear-gradient(135deg, #231f20 0%, #4a372f 100%);
    color: #fff8f1;
    font-size: 1.45rem;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 1.8rem;
  }

  .checkout-btn.disabled {
    background: linear-gradient(135deg, #c9c0b7 0%, #b2a79c 100%);
    color: rgba(255, 248, 241, 0.9);
    cursor: not-allowed;
    box-shadow: none;
  }

  .checkout-helper {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 1.4rem;
    margin-bottom: 1.8rem;
  }

  .shipping-destination-card {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 1.4rem;
    margin-bottom: 1.8rem;
  }

  .payment-status-card {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 1.4rem;
    margin-bottom: 1.8rem;
  }

  .payment-status-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
    margin-bottom: 0.8rem;
  }

  .shipping-destination-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
    margin-bottom: 0.8rem;
  }

  .shipping-label {
    display: block;
    color: #8a7b6e;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.3rem;
  }

  .shipping-destination-card strong {
    color: #231f20;
    font-size: 1.55rem;
  }

  .shipping-destination-card p {
    color: #6b5f56;
    line-height: 1.7;
  }

  .payment-status-card p {
    color: #6b5f56;
    line-height: 1.7;
    margin-top: 0.4rem;
  }

  .payment-status-meta {
    display: grid;
    gap: 1rem;
  }

  .payment-status-line span,
  .payment-status-proof span {
    display: block;
    color: #8a7b6e;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.45rem;
  }

  .payment-status-line strong {
    display: block;
    color: #231f20;
    font-size: 1.55rem;
    line-height: 1.5;
    word-break: break-word;
  }

  .payment-status-proof {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .payment-status-proof img {
    width: 7.2rem;
    height: 7.2rem;
    object-fit: cover;
    border-radius: 1.2rem;
    border: 1px solid #eadfce;
    background: #fff;
  }

  .verification-note {
    display: flex;
    gap: 0.8rem;
    align-items: start;
    margin-top: 1rem;
    background: #faf2e8;
    border: 1px solid #ecdcc9;
    border-radius: 1.3rem;
    padding: 1rem;
    color: #5f554d;
    font-size: 1.22rem;
    line-height: 1.6;
  }

  .verification-note svg {
    flex-shrink: 0;
    color: #cf6d3f;
    font-size: 1.6rem;
    margin-top: 0.15rem;
  }

  .checkout-helper p {
    color: #6b5f56;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  .helper-btn {
    min-height: 4.4rem;
    padding: 0 1.5rem;
    border-radius: 1.2rem;
    border: none;
    background: #231f20;
    color: #fff8f1;
    font-size: 1.28rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .helper-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
  }

  .helper-btn.secondary {
    background: #f7ede1;
    color: #2a241f;
    border: 1px solid #e2d3c2;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(18, 14, 13, 0.62);
    display: grid;
    place-items: center;
    padding: 2rem;
    z-index: 90;
  }

  .address-modal {
    width: min(100%, 68rem);
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 2.6rem;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
    padding: 2.2rem;
  }

  .payment-modal {
    width: min(100%, 82rem);
    max-height: min(88vh, 92rem);
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 2.6rem;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
    padding: 2.2rem;
    overflow-y: auto;
  }

  .modal-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
    margin-bottom: 1.8rem;
  }

  .modal-top h3 {
    font-size: 2.4rem;
  }

  .modal-close {
    width: 4rem;
    height: 4rem;
    border: none;
    border-radius: 1.2rem;
    background: #f6eadf;
    color: #2a241f;
    cursor: pointer;
    font-size: 1.6rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.2rem;
  }

  .payment-layout {
    display: grid;
    grid-template-columns: 28rem minmax(0, 1fr);
    gap: 1.8rem;
    margin-bottom: 1.8rem;
  }

  .qr-panel {
    display: grid;
    gap: 1rem;
    align-content: start;
  }

  .qr-shell {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 1.6rem;
    display: grid;
    place-items: center;
    min-height: 31rem;
  }

  .upi-link-btn {
    min-height: 4.8rem;
    border-radius: 1.4rem;
    background: linear-gradient(135deg, #231f20 0%, #4a372f 100%);
    color: #fff8f1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.32rem;
    font-weight: 700;
    text-decoration: none;
  }

  .payment-copy {
    display: grid;
    gap: 1.2rem;
    align-content: start;
  }

  .payment-summary-card,
  .copy-row,
  .payment-explainer {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 1.4rem;
  }

  .payment-summary-card strong {
    display: block;
    font-size: 2.3rem;
    color: #231f20;
  }

  .copy-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
  }

  .copy-label {
    display: block;
    color: #8a7b6e;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.35rem;
  }

  .copy-row strong {
    display: block;
    color: #231f20;
    font-size: 1.6rem;
  }

  .copy-row p {
    color: #6b5f56;
    line-height: 1.7;
    margin-top: 0.5rem;
  }

  .copy-btn {
    min-height: 4rem;
    padding: 0 1.2rem;
    border-radius: 1.2rem;
    border: 1px solid #e2d3c2;
    background: #f7ede1;
    color: #2a241f;
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    cursor: pointer;
    font-size: 1.22rem;
    font-weight: 700;
  }

  .payment-explainer h4 {
    font-size: 1.7rem;
    margin-bottom: 0.8rem;
  }

  .payment-explainer p {
    color: #6b5f56;
    line-height: 1.7;
  }

  .payment-explainer .small-note {
    margin-top: 0.9rem;
    font-size: 1.2rem;
  }

  .form-grid label {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    color: #5f554d;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .form-grid label.full-width {
    grid-column: 1 / -1;
  }

  .form-grid input {
    max-width: none;
    width: 100%;
    background: #fff;
    border-radius: 1.4rem;
    border: 1px solid #e2d4c4;
    box-shadow: none;
    text-transform: none;
    padding: 1.2rem 1.4rem;
  }

  .upload-shell {
    position: relative;
  }

  .upload-field input[type="file"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  .upload-visual {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    background: linear-gradient(180deg, #fffdf9 0%, #f8eee1 100%);
    border: 1px dashed #d8b796;
    border-radius: 1.6rem;
    padding: 1.4rem 1.5rem;
    transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  }

  .upload-shell:hover .upload-visual {
    border-color: #cf6d3f;
    transform: translateY(-1px);
    box-shadow: 0 14px 26px rgba(90, 58, 31, 0.08);
  }

  .upload-icon {
    width: 4.6rem;
    height: 4.6rem;
    border-radius: 1.4rem;
    background: #fff;
    border: 1px solid #eadfce;
    display: grid;
    place-items: center;
    color: #cf6d3f;
    font-size: 1.9rem;
    flex-shrink: 0;
  }

  .upload-text {
    flex: 1;
    min-width: 0;
  }

  .upload-text strong {
    display: block;
    color: #231f20;
    font-size: 1.35rem;
    margin-bottom: 0.35rem;
  }

  .upload-text span {
    display: block;
    color: #7a6c60;
    font-size: 1.18rem;
    line-height: 1.5;
    word-break: break-word;
  }

  .upload-action {
    min-height: 4rem;
    padding: 0 1.3rem;
    border-radius: 999px;
    background: #231f20;
    color: #fff8f1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.18rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .payment-proof-preview {
    margin-top: 1.4rem;
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    padding: 1.2rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 14rem;
    gap: 1.2rem;
    align-items: start;
  }

  .payment-proof-preview img {
    display: block;
    width: 100%;
    max-width: 14rem;
    max-height: 14rem;
    object-fit: cover;
    margin-top: 0;
    border-radius: 1.2rem;
    border: 1px solid #eadfce;
    justify-self: end;
  }

  .payment-proof-preview .copy-label {
    margin-bottom: 0.5rem;
  }

  .payment-proof-preview-text {
    min-width: 0;
  }

  .payment-proof-preview-name {
    color: #231f20;
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.5;
    word-break: break-word;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.4rem;
    flex-wrap: wrap;
    position: sticky;
    bottom: 0;
    padding-top: 1rem;
    background: linear-gradient(180deg, rgba(255, 250, 243, 0) 0%, #fffaf3 24%);
  }

  .trust-list {
    display: grid;
    gap: 0.9rem;
  }

  .trust-list div {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: #6a5f56;
    font-size: 1.32rem;
  }

  .trust-list svg {
    color: #cf6d3f;
    font-size: 1.7rem;
  }

  @media (max-width: ${({ theme }) => theme.media.tab}) {
    .cart-layout {
      grid-template-columns: 1fr;
    }

    .summary-panel {
      position: static;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 3rem 0 5rem;

    .cart-shell {
      padding: 0 1.4rem;
    }

    .cart-hero,
    .panel-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .hero-actions,
    .panel-header p {
      justify-content: flex-start;
      text-align: left;
    }

    .cart-list-panel,
    .summary-card,
    .note-card {
      padding: 1.8rem;
      border-radius: 2.2rem;
    }

    .ghost-link,
    .clear-btn {
      width: 100%;
      justify-content: center;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .payment-layout {
      grid-template-columns: 1fr;
    }

    .payment-proof-preview {
      grid-template-columns: 1fr;
    }

    .payment-proof-preview img {
      justify-self: start;
    }
  }
`;

export default Cart;
