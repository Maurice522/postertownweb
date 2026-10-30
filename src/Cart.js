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
  FiX,
} from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import { useCartContext } from "./context/cart_context";
import CartItem from "./components/CartItem";
import FormatPrice from "./Helpers/FormatPrice";
import { useUserContext } from "./context/user_context";
import { createCustomerUserId, prependStoredOrder } from "./utils/orderStorage";

const SHIPPING_STORAGE_KEY = "postertown_shipping_info";
const PAYMENT_STORAGE_KEY = "postertown_payment_info";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const UPI_ID = "prathamgupta52043@okhdfcbank";
const UPI_PAYEE = "Poster Town";
const GST_RATE = 18;
const emptyPaymentInfo = {
  payerName: "",
  transactionId: "",
  screenshotName: "",
  screenshotDataUrl: "",
  note: "",
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union territories
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const createOrderId = () => `PT-${Date.now().toString().slice(-8)}`;

const Cart = () => {
  const navigate = useNavigate();
  const { cart, clearCart, total_price, shipping_fee, total_item } = useCartContext();
  const { isAuthenticated, user, saveAddress } = useUserContext();
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  // Google accounts store their profile photo as avatarUrl.
  const userAvatar = user?.avatarUrl || user?.picture || "";
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSubmitError, setOrderSubmitError] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState(createOrderId);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentInfo, setPaymentInfo] = useState(emptyPaymentInfo);
  const hasUserDetails = Boolean(isAuthenticated && (user?.name || user?.email));
  const hasAddress = Boolean(
    shippingInfo.addressLine1 &&
      shippingInfo.city &&
      shippingInfo.state &&
      shippingInfo.pincode
  );
  const visibleShippingFee = hasAddress ? shipping_fee : 0;
  const productSubtotalExGst = Math.round((total_price / (100 + GST_RATE)) * 100);
  const gstAmount = Math.max(total_price - productSubtotalExGst, 0);
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
      tn: `Poster Town ${pendingOrderId}`,
    });

    return `upi://pay?${params.toString()}`;
  }, [orderTotal, pendingOrderId]);

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

    const savedAddress =
      user.addresses?.find((address) => address.isDefault) || user.addresses?.[0];

    setShippingInfo((current) => ({
      ...current,
      ...(savedAddress
        ? Object.fromEntries(Object.keys(current).map((key) => [key, savedAddress[key] || current[key] || ""]))
        : {}),
      fullName: savedAddress?.fullName || current.fullName || user.name || "",
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

  const handleShippingSubmit = async (event) => {
    event.preventDefault();
    setAddressError("");
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(shippingInfo));
    }

    // Logged-in customers get the address saved to their account for next time.
    if (isAuthenticated && user?.id) {
      setIsSavingAddress(true);
      try {
        await saveAddress(shippingInfo);
      } catch (error) {
        setAddressError(error.message);
        return;
      } finally {
        setIsSavingAddress(false);
      }
    }

    setIsAddressModalOpen(false);
  };

  const handlePaymentChange = (event) => {
    const { name } = event.target;
    // UTRs are 12 digits; drop the spaces some UPI apps show between groups.
    const value = name === "transactionId" ? event.target.value.replace(/\D/g, "").slice(0, 12) : event.target.value;
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

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    setOrderSubmitError("");
    setIsSubmittingOrder(true);

    const orderId = pendingOrderId;
    const customerUserId = isAuthenticated ? createCustomerUserId(user) : "";
    const orderRecord = {
      id: orderId,
      userId: customerUserId || undefined,
      isGuest: !isAuthenticated,
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
        subtotalExGst: productSubtotalExGst,
        gst: gstAmount,
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
      source: {
        channel: "web",
        storage: isAuthenticated ? "account" : "guest_cookie",
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderRecord),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || `Order submission failed with ${response.status}`);
      }
      const savedOrder = data;

      if (typeof window !== "undefined") {
        prependStoredOrder(savedOrder, isAuthenticated);
        window.localStorage.removeItem(PAYMENT_STORAGE_KEY);
      }

      clearCart();
      setPendingOrderId(createOrderId());
      setPlacedOrder(savedOrder);
      setPaymentInfo(emptyPaymentInfo);
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error("Failed to save order to API", error);
      setOrderSubmitError(
        error.message || "Could not submit the order to the server. Please try again."
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleCopy = async (value, field) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      return;
    } catch {
      // Clipboard API is missing or blocked (e.g. some in-app browsers); fall back below.
    }

    const scratch = document.createElement("textarea");
    scratch.value = value;
    scratch.setAttribute("readonly", "");
    scratch.style.position = "fixed";
    scratch.style.opacity = "0";
    document.body.appendChild(scratch);
    scratch.select();
    try {
      if (document.execCommand("copy")) {
        setCopiedField(field);
      }
    } finally {
      scratch.remove();
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
              {userAvatar && !avatarFailed ? (
                <img
                  src={userAvatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                <span className="user-initial" aria-hidden="true">
                  {(user.name || user.email || "?").trim().charAt(0).toUpperCase()}
                </span>
              )}
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
                    <FormatPrice price={productSubtotalExGst} />
                  </strong>
                </div>
                <div>
                  <span>GST ({GST_RATE}%)</span>
                  <strong>
                    <FormatPrice price={gstAmount} />
                  </strong>
                </div>
                <div>
                  <span>Products total</span>
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
                      We use these details to confirm payment.
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
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    title="10-digit mobile number"
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
                  <select name="state" value={shippingInfo.state} onChange={handleShippingChange} required>
                    <option value="" disabled>
                      Select state
                    </option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Pincode
                  <input
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleShippingChange}
                    placeholder="6-digit pincode"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    title="6-digit pincode"
                    required
                  />
                </label>
              </div>

              {addressError && <p className="address-error">{addressError}</p>}
              {!isAuthenticated && (
                <p className="address-note">Log in to keep this address on your account for next time.</p>
              )}

              <div className="modal-actions">
                <button type="button" className="helper-btn secondary" onClick={() => setIsAddressModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="helper-btn" disabled={isSavingAddress}>
                  {isSavingAddress ? "Saving..." : "Save address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isPaymentModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsPaymentModalOpen(false)}>
          <div
            className="payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            onClick={(event) => event.stopPropagation()}>
            <div className="payment-head">
              <div>
                <span className="panel-kicker">UPI payment · Order {pendingOrderId}</span>
                <h3 id="payment-modal-title">
                  Pay <FormatPrice price={orderTotal} />
                </h3>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close payment"
                onClick={() => setIsPaymentModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <div className="payment-body">
              <section className="pay-step">
                <div className="pay-step-title">
                  <span className="pay-step-number">1</span>
                  <h4>Pay with any UPI app</h4>
                </div>

                <div className="pay-now">
                  <div className="qr-shell">
                    <QRCodeSVG value={upiLink} size={176} includeMargin={false} />
                  </div>

                  <div className="pay-details">
                    <p className="pay-hint">
                      Scan with Google Pay, PhonePe, Paytm or BHIM. The amount and order number are filled in for you.
                    </p>

                    <div className="pay-row">
                      <div>
                        <span className="copy-label">Amount</span>
                        <strong className="pay-amount">
                          <FormatPrice price={orderTotal} />
                        </strong>
                      </div>
                    </div>

                    <div className="pay-row">
                      <div>
                        <span className="copy-label">UPI ID</span>
                        <strong>{UPI_ID}</strong>
                      </div>
                      <button type="button" className="copy-btn" onClick={() => handleCopy(UPI_ID, "upi")}>
                        <FiCopy />
                        {copiedField === "upi" ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <a className="upi-link-btn" href={upiLink}>
                      Open UPI app
                    </a>
                  </div>
                </div>
              </section>

              <form id="payment-form" className="pay-step payment-form" onSubmit={handlePaymentSubmit}>
                <div className="pay-step-title">
                  <span className="pay-step-number">2</span>
                  <h4>Tell us which payment is yours</h4>
                </div>

                <div className="form-grid">
                  <label>
                    UTR number
                    <input
                      name="transactionId"
                      value={paymentInfo.transactionId}
                      onChange={handlePaymentChange}
                      placeholder="12-digit number"
                      inputMode="numeric"
                      pattern="[0-9]{12}"
                      title="The 12-digit UTR from your UPI app"
                      required
                    />
                    <small>
                      In your UPI app, open this payment. Google Pay calls it "UPI transaction ID", PhonePe "UTR", Paytm
                      "UPI Ref No.".
                    </small>
                  </label>
                  <label>
                    Name on your UPI account
                    <input
                      name="payerName"
                      value={paymentInfo.payerName}
                      onChange={handlePaymentChange}
                      placeholder="As shown in your UPI app"
                      required
                    />
                  </label>
                  <label className="full-width upload-field">
                    <span>
                      Payment screenshot <span className="optional">(optional)</span>
                    </span>
                    <div className="upload-shell">
                      <input type="file" accept="image/*" onChange={handleScreenshotChange} />
                      <div className="upload-visual">
                        <div className="upload-icon">
                          <FiImage />
                        </div>
                        <div className="upload-text">
                          <strong>{paymentInfo.screenshotName ? "Screenshot attached" : "Add a screenshot"}</strong>
                          <span>
                            {paymentInfo.screenshotName || "Helps us find your payment faster"}
                          </span>
                        </div>
                        <span className="upload-action">
                          {paymentInfo.screenshotName ? "Replace" : "Choose file"}
                        </span>
                      </div>
                    </div>
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
              </form>

              <section className="pay-step pay-next">
                <div className="pay-step-title">
                  <span className="pay-step-number">3</span>
                  <h4>What happens next</h4>
                </div>
                <ol>
                  <li>
                    We check our UPI account for a payment of <FormatPrice price={orderTotal} /> with your UTR.
                  </li>
                  <li>
                    Once we find it, your order is confirmed and you get a "Payment received" email. This usually takes
                    a few hours.
                  </li>
                  <li>If we can't find the payment, we email you before anything is shipped.</li>
                </ol>
                <p className="pay-ship-to">
                  Shipping to <strong>{shippingRecipient}</strong>, {shippingDestination}
                </p>
              </section>

              {orderSubmitError ? <div className="submit-error">{orderSubmitError}</div> : null}
            </div>

            <div className="payment-footer">
              <button type="button" className="helper-btn secondary" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" form="payment-form" className="helper-btn" disabled={isSubmittingOrder}>
                {isSubmittingOrder ? "Submitting..." : "I've paid, confirm order"}
              </button>
            </div>
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

  .user-chip img,
  .user-chip .user-initial {
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .user-chip .user-initial {
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #231f20 0%, #49372f 100%);
    color: #fff;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: none;
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

  .helper-btn:disabled {
    cursor: not-allowed;
    opacity: 0.65;
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

  /* Header and footer stay put; only the steps in between scroll. */
  .payment-modal {
    width: min(100%, 72rem);
    max-height: min(92vh, 96rem);
    display: flex;
    flex-direction: column;
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 2.4rem;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
    overflow: hidden;
  }

  .payment-head {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 1rem;
    padding: 2rem 2.2rem 1.4rem;
    border-bottom: 1px solid #efe3d5;
  }

  .payment-head h3 {
    font-size: 2.6rem;
    margin-top: 0.3rem;
  }

  .payment-head .modal-close {
    display: grid;
    place-items: center;
    font-size: 2rem;
  }

  .payment-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.8rem 2.2rem;
    display: grid;
    gap: 1.4rem;
  }

  .payment-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.4rem 2.2rem;
    border-top: 1px solid #efe3d5;
    background: #fffaf3;
  }

  .pay-step {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 1.8rem;
    padding: 1.6rem;
  }

  .pay-step-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.4rem;
  }

  .pay-step-title h4 {
    font-size: 1.7rem;
    color: #231f20;
  }

  .pay-step-number {
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    background: #231f20;
    color: #fff8f1;
    font-size: 1.35rem;
    font-weight: 700;
  }

  .pay-now {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 1.8rem;
    align-items: start;
  }

  .pay-details {
    display: grid;
    gap: 1rem;
  }

  .pay-hint {
    color: #5f554d;
    font-size: 1.4rem;
    line-height: 1.6;
  }

  .pay-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.2rem;
    border-radius: 1.2rem;
    background: #fbf6ef;
  }

  .pay-row strong {
    display: block;
    color: #231f20;
    font-size: 1.55rem;
    overflow-wrap: anywhere;
  }

  .pay-row .pay-amount {
    font-size: 2.2rem;
  }

  .form-grid small {
    color: #7a6c60;
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .form-grid .optional {
    color: #8a7b6e;
    font-weight: 500;
  }

  .pay-next ol {
    display: grid;
    gap: 0.9rem;
    padding-left: 2rem;
    color: #3f3833;
    font-size: 1.45rem;
    line-height: 1.6;
  }

  .pay-ship-to {
    margin-top: 1.4rem;
    padding-top: 1.2rem;
    border-top: 1px solid #f1e6da;
    color: #6b5f56;
    font-size: 1.3rem;
    line-height: 1.6;
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

  .qr-shell {
    background: #fff;
    border: 1px solid #eadfce;
    border-radius: 2rem;
    padding: 1.2rem;
    display: grid;
    place-items: center;
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

  .copy-label {
    display: block;
    color: #8a7b6e;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.35rem;
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

  .form-grid input,
  .form-grid select {
    max-width: none;
    width: 100%;
    background: #fff;
    border-radius: 1.4rem;
    border: 1px solid #e2d4c4;
    box-shadow: none;
    text-transform: none;
    padding: 1.2rem 1.4rem;
  }

  .form-grid select {
    font: inherit;
    font-weight: 500;
    color: #231f20;
    cursor: pointer;
  }

  .address-error,
  .address-note {
    margin-top: 1.2rem;
    font-size: 1.3rem;
  }

  .address-error {
    color: #c0392b;
    font-weight: 600;
  }

  .address-note {
    color: #7a6c60;
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

  .submit-error {
    margin-top: 1.2rem;
    background: #fff0ec;
    border: 1px solid #f0c2b1;
    color: #9f3e1d;
    border-radius: 1.3rem;
    padding: 1rem 1.2rem;
    font-size: 1.28rem;
    line-height: 1.5;
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

    .payment-head,
    .payment-body,
    .payment-footer {
      padding-left: 1.6rem;
      padding-right: 1.6rem;
    }

    .pay-now {
      grid-template-columns: 1fr;
      justify-items: center;
    }

    .pay-details {
      width: 100%;
    }

    .payment-footer .helper-btn {
      flex: 1;
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
