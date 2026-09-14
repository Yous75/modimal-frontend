import { useEffect, useState } from "react";
import "./Cart.css";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../api/orders";
import { useNavigate } from "react-router-dom";

const TAX_RATE = 0.08;
const CHECKOUT_STEPS = ["Cart", "Info", "Shipping", "Payment"];

const EMPTY_ADDRESS = {
  firstName: "",
  lastName: "",
  company: "",
  address: "",
  apartment: "",
  postalCode: "",
  city: "",
  phone: "",
};

function currency(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

function Cart({ isOpen, onClose, onItemCountChange }) {
  const [view, setView] = useState("drawer");
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart } = useCart();

  const [orderError, setOrderError] = useState("");

  // Contact information
  const [email, setEmail] = useState("");
  const [newsOptIn, setNewsOptIn] = useState(false);

  // Shipping address
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [country, setCountry] = useState("");

  // Save information checkbox
  const [saveInfo, setSaveInfo] = useState(false);

  // Shipping
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [guaranteedDelivery, setGuaranteedDelivery] = useState(false);

  // Payment
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [securityCode, setSecurityCode] = useState("");

  // ------------------------------------------------------------
  // CART CALCULATIONS
  // ------------------------------------------------------------

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.qty,
    0
  );

  const tax = subtotal * TAX_RATE;

  const baseShippingFee = deliverySpeed === "express" ? 15 : 5;

  const guaranteedFee = guaranteedDelivery ? 24 : 0;

  const deliveryFee = baseShippingFee + guaranteedFee;

  const total = subtotal + tax + deliveryFee;

  // ------------------------------------------------------------
  // EFFECTS
  // ------------------------------------------------------------

  useEffect(() => {
    if (isOpen) {
      setView("drawer");
      setOrderError("");
    }
  }, [isOpen]);

  useEffect(() => {
    onItemCountChange?.(itemCount);
  }, [itemCount, onItemCountChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleFullClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  // ------------------------------------------------------------
  // GENERAL FUNCTIONS
  // ------------------------------------------------------------

  const handleFullClose = () => {
    setView("drawer");
    setOrderError("");
    onClose?.();
  };

  const goTo = (nextView) => (e) => {
    e?.preventDefault?.();
    setView(nextView);
  };

  // ------------------------------------------------------------
  // PAYMENT / PLACE ORDER
  // ------------------------------------------------------------

  const handlePayment = async (e) => {
    e.preventDefault();

    setOrderError("");

    // Remove spaces from the card number.
    const digitsOnly = cardNumber.replace(/\s/g, "");

    // Basic demo payment validation.
    const isValid =
      digitsOnly.length === 16 &&
      expiryMonth.trim() !== "" &&
      expiryYear.trim() !== "" &&
      securityCode.length >= 3;

    if (!isValid) {
      setOrderError("Please enter valid payment information.");
      setView("failure");
      return;
    }

    // Make sure the cart isn't empty.
    if (items.length === 0) {
      setOrderError("Your cart is empty.");
      setView("failure");
      return;
    }

    // Make sure every cart item has a real product ID.
    const invalidItem = items.find((item) => !item.id);

    if (invalidItem) {
      setOrderError("One of the products in your cart is invalid.");
      setView("failure");
      return;
    }

    try {
      /*
       * IMPORTANT:
       *
       * Card information is NOT sent to the backend.
       * This project uses simulated payment validation.
       *
       * The important part here is:
       *
       * product: item.id
       *
       * CartContext normalizes backend cart items into:
       * {
       *   id,
       *   name,
       *   image,
       *   price,
       *   size,
       *   color,
       *   qty
       * }
       *
       * Therefore item.id is the MongoDB Product ObjectId
       * that the Order backend expects.
       */

      const orderData = {
        email,

        items: items.map((item) => ({
          product: item.id,
          title: item.name,
          image: item.image,
          size: item.size,
          color: item.color,
          price: Number(item.price),
          qty: Number(item.qty),
        })),

        shippingAddress: {
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          apartment: address.apartment,
          city: address.city,
          postalCode: address.postalCode,
          phone: address.phone,
        },

        deliverySpeed,
      };

      /*
       * The backend calculates:
       * - subtotal
       * - shippingFee
       * - total
       *
       * We do not send those values from the frontend.
       */

      await createOrder(orderData);

      // Clear the cart only after the order was successfully created.
      await clearCart();

      setView("success");
    } catch (err) {
      setOrderError(
        err?.message || "Something went wrong while placing your order."
      );

      setView("failure");
    }
  };

  // ------------------------------------------------------------
  // BREADCRUMBS
  // ------------------------------------------------------------

  const Breadcrumbs = ({ current }) => (
    <nav className="cart-breadcrumbs" aria-label="Checkout progress">
      {CHECKOUT_STEPS.map((step, idx) => {
        const stepView = step.toLowerCase();

        const isActive = stepView === current;

        const isClickable = stepView === "cart";

        return (
          <span key={step} className="cart-breadcrumb-item">
            {isClickable ? (
              <a
                href="#cart"
                onClick={goTo("cartPage")}
                className={isActive ? "active" : ""}
              >
                {step}
              </a>
            ) : (
              <span className={isActive ? "active" : ""}>{step}</span>
            )}

            {idx < CHECKOUT_STEPS.length - 1 && (
              <span className="cart-breadcrumb-sep">/</span>
            )}
          </span>
        );
      })}
    </nav>
  );

  // ------------------------------------------------------------
  // ORDER SUMMARY SIDEBAR
  // ------------------------------------------------------------

  const OrderSummarySidebar = () => (
    <aside className="cart-order-summary" aria-label="Order summary">
      <h2>Your Cart</h2>

      <ul className="cart-summary-list">
        {items.map((item) => (
          <li key={item.id} className="cart-summary-row">
            <div className="cart-summary-thumb">
              <img src={item.image} alt={item.name} />

              <span className="cart-summary-qty-badge">
                {item.qty}
              </span>
            </div>

            <div className="cart-summary-details">
              <p className="cart-item-name">{item.name}</p>

              <p className="cart-item-meta">
                Size: {item.size}
              </p>

              <p className="cart-item-meta">
                Color: {item.color}
              </p>

              <div className="cart-qty-stepper small">
                <button
                  type="button"
                  onClick={() => updateQty(item.id, -1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  &minus;
                </button>

                <span>{item.qty}</span>

                <button
                  type="button"
                  onClick={() => updateQty(item.id, 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="cart-remove-btn"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <span className="cart-summary-price">
              {currency(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="cart-totals">
        <div className="cart-totals-row">
          <span>Subtotal ({itemCount})</span>
          <span>{currency(subtotal)}</span>
        </div>

        <div className="cart-totals-row">
          <span>Tax</span>
          <span>{currency(tax)}</span>
        </div>

        <div className="cart-totals-row">
          <span>Shipping</span>
          <span>{currency(deliveryFee)}</span>
        </div>

        <div className="cart-totals-row cart-totals-total">
          <span>Total Orders:</span>
          <span>{currency(total)}</span>
        </div>

        <p className="cart-totals-note">
          The total amount you pay includes all applicable customs duties
          &amp; taxes. We guarantee no additional charges on delivery.
        </p>
      </div>
    </aside>
  );

  // ------------------------------------------------------------
  // HEADER REPLICA
  // ------------------------------------------------------------

  const SiteHeaderReplica = () => (
    <header className="cart-site-header-replica">
      <div className="cart-shipping-banner">
        Enjoy Free Shipping On All Orders
      </div>

      <div className="cart-mini-header">
        <span className="cart-mini-logo">
          modimal
          <span className="cart-mini-logo-dot">.</span>
        </span>

        <nav className="cart-mini-nav">
          <span>Collection</span>
          <span>New In</span>
          <span>Modiweek</span>
          <span>Plus Size</span>
          <span>Sustainability</span>
        </nav>

        <div className="cart-mini-icons">
          <i className="fa-solid fa-magnifying-glass"></i>
          <i className="fa-solid fa-user"></i>
          <i className="fa-solid fa-heart"></i>
          <i className="fa-solid fa-bag-shopping"></i>
        </div>
      </div>
    </header>
  );

  // ============================================================
  // DRAWER
  // ============================================================

  const renderDrawer = () => (
    <>
      <div
        className="cart-overlay"
        onClick={handleFullClose}
        aria-hidden="true"
      ></div>

      <div
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <button
              type="button"
              className="cart-drawer-close"
              onClick={handleFullClose}
              aria-label="Close cart"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="cart-drawer-empty-content">
              <h2>Your Shopping Bag Is Empty</h2>

              <p>
                Discover Modimal
                <br />
                And Add Products To Your Bag
              </p>

              <div className="cart-empty-actions">
                <button onClick={() => navigate("/shop-all")} type="button" >
                  Shop All
                </button>

                <button onClick={() => navigate("/new-in")} type="button" >
                  New In
                </button>

                <button onClick={() => navigate("/best-seller")} type="button" >
                  Best Sellers
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="cart-drawer-filled">
            <div className="cart-drawer-header">
              <h2>Your Cart</h2>

              <button
                type="button"
                className="cart-drawer-close"
                onClick={handleFullClose}
                aria-label="Close cart"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <ul className="cart-drawer-list">
              {items.map((item) => (
                <li key={item.id} className="cart-drawer-item">
                  <img src={item.image} alt={item.name} />

                  <div className="cart-drawer-item-info">
                    <div className="cart-drawer-item-top">
                      <p className="cart-item-name">{item.name}</p>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    <p className="cart-item-meta">
                      Size: {item.size}
                    </p>

                    <p className="cart-item-meta">
                      Color: {item.color}
                    </p>

                    <div className="cart-drawer-item-bottom">
                      <div className="cart-qty-stepper">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          &minus;
                        </button>

                        <span>{item.qty}</span>

                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      <span className="cart-item-price">
                        {currency(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={goTo("cartPage")}
            >
              Check Out
            </button>
          </div>
        )}
      </div>
    </>
  );

  // ============================================================
  // CART PAGE
  // ============================================================

  const renderCartPage = () => (
    <div className="cart-fullpage">
      <div className="cart-fullpage-inner cart-page-view">
        <div className="cart-page-topbar">
          <a
            href="#back"
            className="cart-link-muted"
            onClick={handleFullClose}
          >
            &lsaquo; Back
          </a>

          <h1>Your Cart</h1>

          <a
            href="#continue"
            className="cart-link-muted"
            onClick={handleFullClose}
          >
            Continue Shopping
          </a>
        </div>

        <div className="cart-table">
          <div className="cart-table-head">
            <span>Order Summary</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {items.map((item) => (
            <div key={item.id} className="cart-table-row">
              <div className="cart-table-product">
                <img src={item.image} alt={item.name} />

                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>

                <div>
                  <p className="cart-item-name">{item.name}</p>

                  <p className="cart-item-meta">
                    Size: {item.size}
                  </p>

                  <p className="cart-item-meta">
                    Color: {item.color}
                  </p>
                </div>
              </div>

              <span className="cart-table-price">
                {currency(item.price)}
              </span>

              <div className="cart-qty-stepper">
                <button
                  type="button"
                  onClick={() => updateQty(item.id, -1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  &minus;
                </button>

                <span>{item.qty}</span>

                <button
                  type="button"
                  onClick={() => updateQty(item.id, 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>

              <span className="cart-table-total">
                {currency(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>

        <div className="cart-page-totals">
          <div className="cart-totals-row">
            <span>Subtotal ({itemCount})</span>
            <span>{currency(subtotal)}</span>
          </div>

          <div className="cart-totals-row">
            <span>Tax</span>
            <span>{currency(tax)}</span>
          </div>

          <div className="cart-totals-row">
            <span>Shipping</span>
            <span>{currency(deliveryFee)}</span>
          </div>

          <div className="cart-totals-row cart-totals-total">
            <span>Total Orders:</span>
            <span>{currency(total)}</span>
          </div>

          <p className="cart-totals-note">
            The total amount you pay includes all applicable customs duties
            &amp; taxes. We guarantee no additional charges on delivery.
          </p>

          <button
            type="button"
            className="cart-checkout-btn cart-next-btn"
            onClick={goTo("info")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // INFORMATION
  // ============================================================

  const renderInfo = () => (
    <div className="cart-fullpage">
      <div className="cart-fullpage-inner cart-checkout-layout">
        <div className="cart-checkout-main">
          <span className="cart-mini-logo cart-checkout-logo">
            modimal
            <span className="cart-mini-logo-dot">.</span>
          </span>

          <Breadcrumbs current="info" />

          <div className="cart-form-header">
            <h2>Contact</h2>

            <span>
              Have An Account? <a href="#login">Log In</a>
            </span>
          </div>

          <label className="cart-input">
            <i className="fa-solid fa-envelope"></i>

            <input
              id="checkout-email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="cart-checkbox-row">
            <input
              id="news-opt-in"
              name="newsOptIn"
              type="checkbox"
              checked={newsOptIn}
              onChange={(e) => setNewsOptIn(e.target.checked)}
            />

            Email Me With News And Offers
          </label>

          <h2>Shipping Address</h2>

          <div className="cart-input">
            <select
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="" disabled>
                Country/Region
              </option>

              <option value="Algeria">Algeria</option>
              <option value="United States">United States</option>
              <option value="France">France</option>
            </select>
          </div>

          <div className="cart-form-grid two">
            <input
              id="first-name"
              name="firstName"
              className="cart-input plain"
              placeholder="First Name"
              value={address.firstName}
              onChange={(e) =>
                setAddress({
                  ...address,
                  firstName: e.target.value,
                })
              }
              required
            />

            <input
              id="last-name"
              name="lastName"
              className="cart-input plain"
              placeholder="Last Name"
              value={address.lastName}
              onChange={(e) =>
                setAddress({
                  ...address,
                  lastName: e.target.value,
                })
              }
              required
            />
          </div>

          <input
            id="company"
            name="company"
            className="cart-input plain"
            placeholder="Company (Optional)"
            value={address.company}
            onChange={(e) =>
              setAddress({
                ...address,
                company: e.target.value,
              })
            }
          />

          <label className="cart-input">
            <input
              id="address"
              name="address"
              placeholder="Address"
              value={address.address}
              onChange={(e) =>
                setAddress({
                  ...address,
                  address: e.target.value,
                })
              }
              required
            />

            <i className="fa-solid fa-magnifying-glass"></i>
          </label>

          <input
            id="apartment"
            name="apartment"
            className="cart-input plain"
            placeholder="Apartment, Suite, Etc. (Optional)"
            value={address.apartment}
            onChange={(e) =>
              setAddress({
                ...address,
                apartment: e.target.value,
              })
            }
          />

          <div className="cart-form-grid two">
            <input
              id="postal-code"
              name="postalCode"
              className="cart-input plain"
              placeholder="Postal Code"
              value={address.postalCode}
              onChange={(e) =>
                setAddress({
                  ...address,
                  postalCode: e.target.value,
                })
              }
              required
            />

            <input
              id="city"
              name="city"
              className="cart-input plain"
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress({
                  ...address,
                  city: e.target.value,
                })
              }
              required
            />
          </div>

          <label className="cart-input">
            <input
              id="phone"
              name="phone"
              placeholder="Phone"
              value={address.phone}
              onChange={(e) =>
                setAddress({
                  ...address,
                  phone: e.target.value,
                })
              }
              required
            />

            <i className="fa-solid fa-mobile-screen"></i>
          </label>

          <label className="cart-checkbox-row">
            <input
              id="save-info"
              name="saveInfo"
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
            />

            Save This Information For Next Time
          </label>

          <div className="cart-form-actions">
            <a
              href="#cart"
              className="cart-link-muted"
              onClick={goTo("cartPage")}
            >
              &lsaquo; Return To Cart
            </a>

            <button
              type="button"
              className="cart-checkout-btn cart-inline-btn"
              onClick={goTo("shipping")}
              disabled={
                !email ||
                !country ||
                !address.firstName ||
                !address.lastName ||
                !address.address ||
                !address.city ||
                !address.postalCode ||
                !address.phone
              }
            >
              Continue To Shipping
            </button>
          </div>
        </div>

        <OrderSummarySidebar />
      </div>
    </div>
  );

  // ============================================================
  // SHIPPING
  // ============================================================

  const renderShipping = () => (
    <div className="cart-fullpage">
      <div className="cart-fullpage-inner cart-checkout-layout">
        <div className="cart-checkout-main">
          <span className="cart-mini-logo cart-checkout-logo">
            modimal
            <span className="cart-mini-logo-dot">.</span>
          </span>

          <Breadcrumbs current="shipping" />

          <h2>Delivery Method</h2>

          <label
            className={`cart-option-card ${
              deliverySpeed === "express" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="delivery-speed"
              checked={deliverySpeed === "express"}
              onChange={() => setDeliverySpeed("express")}
            />

            <div>
              <p className="cart-option-title">
                Express Courier (Air)
              </p>

              <p className="cart-item-meta">
                Arrives in 3–5 business days
              </p>
            </div>

            <span className="cart-option-price">$15.00</span>
          </label>

          <label
            className={`cart-option-card ${
              deliverySpeed === "standard" ? "selected" : ""
            }`}
          >
            <input
              type="radio"
              name="delivery-speed"
              checked={deliverySpeed === "standard"}
              onChange={() => setDeliverySpeed("standard")}
            />

            <div>
              <p className="cart-option-title">
                Standard Delivery
              </p>

              <p className="cart-item-meta">
                Arrives in 5–10 business days
              </p>
            </div>

            <span className="cart-option-price">$5.00</span>
          </label>

          <h2>Expected Delivery Date</h2>

          <div className="cart-form-grid two">
            <label className="cart-option-card compact">
              <input
                type="radio"
                name="delivery-date"
                defaultChecked
              />

              <div>
                <p className="cart-option-title">
                  Mon, Aug 31
                </p>

                <p className="cart-item-meta">
                  Standard window
                </p>
              </div>
            </label>

            <label className="cart-option-card compact">
              <input
                type="radio"
                name="delivery-date"
              />

              <div>
                <p className="cart-option-title">
                  Fri, Aug 28
                </p>

                <p className="cart-item-meta">
                  Priority window
                </p>
              </div>
            </label>
          </div>

          <h2>Guaranteed By</h2>

          <label
            className={`cart-option-card ${
              guaranteedDelivery ? "selected" : ""
            }`}
          >
            <input
              type="checkbox"
              name="guaranteed-delivery"
              checked={guaranteedDelivery}
              onChange={(e) =>
                setGuaranteedDelivery(e.target.checked)
              }
            />

            <div>
              <p className="cart-option-title">
                Guaranteed Delivery
              </p>

              <p className="cart-item-meta">
                Locks in a delivery date with priority handling
              </p>
            </div>

            <span className="cart-option-price">$24.00</span>
          </label>

          <div className="cart-form-actions">
            <a
              href="#info"
              className="cart-link-muted"
              onClick={goTo("info")}
            >
              &lsaquo; Return To Info
            </a>

            <button
              type="button"
              className="cart-checkout-btn cart-inline-btn"
              onClick={goTo("payment")}
            >
              Continue To Payment
            </button>
          </div>
        </div>

        <OrderSummarySidebar />
      </div>
    </div>
  );

  // ============================================================
  // PAYMENT
  // ============================================================

  const renderPayment = () => (
    <div className="cart-fullpage">
      <div className="cart-fullpage-inner cart-page-view">
        <span className="cart-mini-logo cart-checkout-logo">
          modimal
          <span className="cart-mini-logo-dot">.</span>
        </span>

        <Breadcrumbs current="payment" />

        <div className="cart-payment-grid">
          <div>
            <h2>Billing Address</h2>

            <label className="cart-checkbox-row">
              <input
                type="checkbox"
                name="same-billing-address"
                defaultChecked
              />

              Default (Same As Billing Address)
            </label>

            <label className="cart-checkbox-row">
              <input
                type="checkbox"
                name="alternative-delivery-address"
              />

              Add An Alternative Delivery Address
            </label>

            <label className="cart-input">
              <i className="fa-solid fa-user"></i>

              <input
                id="billing-name"
                name="billingName"
                placeholder="Name"
                value={`${address.firstName} ${address.lastName}`.trim()}
                readOnly
              />
            </label>

            <label className="cart-input">
              <i className="fa-solid fa-envelope"></i>

              <input
                id="billing-email"
                name="billingEmail"
                placeholder="Email"
                value={email}
                readOnly
              />
            </label>

            <label className="cart-input">
              <i className="fa-solid fa-flag"></i>

              <input
                id="billing-country"
                name="billingCountry"
                placeholder="Country"
                value={country}
                readOnly
              />
            </label>

            <label className="cart-input">
              <i className="fa-solid fa-house"></i>

              <input
                id="billing-address"
                name="billingAddress"
                placeholder="Address Line 1"
                value={address.address}
                readOnly
              />
            </label>

            <label className="cart-input">
              <i className="fa-solid fa-house"></i>

              <input
                id="billing-address-2"
                name="billingAddress2"
                placeholder="Address Line 2"
                value={address.apartment}
                readOnly
              />
            </label>

            <label className="cart-input">
              <i className="fa-solid fa-city"></i>

              <input
                id="billing-city"
                name="billingCity"
                placeholder="City / Suburb"
                value={address.city}
                readOnly
              />
            </label>

            <label className="cart-input">
              <i className="fa-regular fa-calendar"></i>

              <input
                id="billing-postcode"
                name="billingPostcode"
                placeholder="Zip / Postcode"
                value={address.postalCode}
                readOnly
              />
            </label>

            <label className="cart-input">
              <i className="fa-solid fa-mobile-screen"></i>

              <input
                id="billing-phone"
                name="billingPhone"
                placeholder="Phone"
                value={address.phone}
                readOnly
              />
            </label>
          </div>

          <form onSubmit={handlePayment}>
            <h2>Payment</h2>

            <p className="cart-payment-subhead">
              Please Choose Your Payment Method
            </p>

            <div className="cart-payment-brands">
              <i className="fa-brands fa-cc-amex"></i>
              <i className="fa-brands fa-cc-visa"></i>
              <i className="fa-brands fa-cc-mastercard"></i>
              <i className="fa-brands fa-cc-paypal"></i>
            </div>

            <label className="cart-field-label">
              Card Number*

              <input
                id="card-number"
                name="cardNumber"
                className="cart-input plain"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                required
              />
            </label>

            <div className="cart-form-grid two">
              <label className="cart-field-label">
                Expiry Date*

                <input
                  id="expiry-month"
                  name="expiryMonth"
                  className="cart-input plain"
                  placeholder="Month"
                  value={expiryMonth}
                  onChange={(e) =>
                    setExpiryMonth(e.target.value)
                  }
                  maxLength={2}
                  required
                />
              </label>

              <label className="cart-field-label">
                &nbsp;

                <input
                  id="expiry-year"
                  name="expiryYear"
                  className="cart-input plain"
                  placeholder="Year"
                  value={expiryYear}
                  onChange={(e) =>
                    setExpiryYear(e.target.value)
                  }
                  maxLength={4}
                  required
                />
              </label>
            </div>

            <label className="cart-field-label">
              Security Code*

              <input
                id="security-code"
                name="securityCode"
                className="cart-input plain"
                placeholder="CVC"
                value={securityCode}
                onChange={(e) =>
                  setSecurityCode(e.target.value)
                }
                maxLength={4}
                required
              />

              <span className="cart-what-is-this">
                What Is This?
              </span>
            </label>

            <button
              type="submit"
              className="cart-checkout-btn cart-pay-btn"
            >
              Pay And Place Order
            </button>

            <p className="cart-terms-note">
              By Clicking On &lsquo;Pay And Place Order&rsquo;, You
              Agree (I) To Make Your Purchase From Global-E As
              Merchant Of Record For This Transaction, Subject To
              Global-E&rsquo;s Term Of Sale (II) That Your Information
              Will Be Handled By Global-E In Accordance With The
              Global-E Privacy Policy; And (III) That Global-E Will
              Share Your Information (Excluding The Payment Details)
              With Modimal.
            </p>
          </form>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // SUCCESS
  // ============================================================

  const renderSuccess = () => (
    <div className="cart-fullpage cart-status-page">
      <SiteHeaderReplica />

      <div className="cart-status-content">
        <div className="cart-status-icon success">
          <i className="fa-solid fa-check"></i>
        </div>

        <h1 className="cart-status-title success">
          Payment Successful
        </h1>

        <p>
          Thank You For Choosing Modimal, Your Order Will Be
          Generated Based On Your Delivery Request.
        </p>

        <p>
          The Receipt Has Been Sent To Your Email
        </p>

        <p className="cart-status-contact">
          Please Contact Us For Any Query
          <br />
          +1 (929) 460-3208
          <br />
          OR
          <br />
          Hello@Modimal.Com
        </p>

        <button
          type="button"
          className="cart-checkout-btn cart-inline-btn"
          onClick={handleFullClose}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  // ============================================================
  // FAILURE
  // ============================================================

  const renderFailure = () => (
    <div className="cart-fullpage cart-status-page">
      <SiteHeaderReplica />

      <div className="cart-status-content">
        <div className="cart-status-icon failure">
          <i className="fa-solid fa-exclamation"></i>
        </div>

        <h1 className="cart-status-title failure">
          Sorry, Payment Failed
        </h1>

        <p>
          Unfortunately. Your Order Cannot Be Completed.
        </p>

        {orderError && (
          <p className="cart-order-error">
            {orderError}
          </p>
        )}

        <p>
          Please Ensure That The Billing Address You Provided Is
          The Same One Where Your Debit/Credit Card Is Registered.
        </p>

        <p>
          Alternatively, Please Try A Different Payment Method.
        </p>

        <button
          type="button"
          className="cart-checkout-btn cart-inline-btn cart-pay-now-btn"
          onClick={goTo("payment")}
        >
          Pay Now
        </button>

        <a
          href="#orders"
          className="cart-link-muted"
          onClick={handleFullClose}
        >
          &lsaquo; Back To My Orders
        </a>
      </div>
    </div>
  );

  // ============================================================
  // VIEW SWITCH
  // ============================================================

  switch (view) {
    case "cartPage":
      return renderCartPage();

    case "info":
      return renderInfo();

    case "shipping":
      return renderShipping();

    case "payment":
      return renderPayment();

    case "success":
      return renderSuccess();

    case "failure":
      return renderFailure();

    case "drawer":
    default:
      return renderDrawer();
  }
}

export default Cart;