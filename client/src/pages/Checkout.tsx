import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
  ReactNode,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Phone,
  Package,
  ChevronRight,
  AlertCircle
} from "lucide-react";

import {
  getCart,
} from "../api/cart";

import type {
  Cart,
} from "../api/cart";

import {
  checkout,
} from "../api/orders";

import type {
  OrderPaymentMethod,
} from "../api/orders";

import {
  initializeMarketplacePayment,
} from "../api/marketplace-payment";

// =====================================================
// TYPES
// =====================================================

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
};

type PaymentOptionProps = {
  value: OrderPaymentMethod;
  icon: ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
  selected: boolean;
  onSelect: (value: OrderPaymentMethod) => void;
};

// =====================================================
// HELPERS
// =====================================================

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  const requestError = error as ApiError;

  return (
    requestError?.response?.data?.message ||
    requestError?.message ||
    fallback
  );
}

function formatPrice(
  price: number,
): string {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(price);
}

function getImageUrl(
  url?: string | null,
): string {
  if (!url) return "";

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "";

  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://") ||
    trimmedUrl.startsWith("data:") ||
    trimmedUrl.startsWith("blob:")
  ) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith("//")) {
    return `https:${trimmedUrl}`;
  }

  const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

  if (apiBaseUrl) {
    return `${apiBaseUrl.replace(/\/$/, "")}${
      trimmedUrl.startsWith("/") ? trimmedUrl : `/${trimmedUrl}`
    }`;
  }

  return `http://localhost:5000${
    trimmedUrl.startsWith("/") ? trimmedUrl : `/${trimmedUrl}`
  }`;
}

function getStoredUserEmail(): string {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return "";

  try {
    const parsedUser: unknown = JSON.parse(storedUser);
    if (typeof parsedUser !== "object" || parsedUser === null) return "";
    const user = parsedUser as { email?: unknown };
    return typeof user.email === "string" ? user.email.trim() : "";
  } catch {
    return "";
  }
}

function normalizePhoneNumber(value: string): string {
  return value.replace(/[\s\-()]/g, "");
}

function isValidNigerianPhone(value: string): boolean {
  const normalized = normalizePhoneNumber(value);
  return /^(?:\+234|234|0)[789][01]\d{8}$/.test(normalized);
}

// =====================================================
// PAYMENT OPTION COMPONENT
// =====================================================

function PaymentOption({
  value,
  icon,
  title,
  description,
  disabled = false,
  selected,
  onSelect,
}: PaymentOptionProps) {
  return (
    <label
      className={`checkout-payment-option ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
    >
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        disabled={disabled}
      />

      <div className="checkout-payment-option-icon">
        {icon}
      </div>

      <div className="checkout-payment-option-content">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      {selected && (
        <div className="checkout-payment-option-check">
          <Check size={15} />
        </div>
      )}
    </label>
  );
}

// =====================================================
// CHECKOUT PAGE
// =====================================================

export default function Checkout() {
  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>("FLUTTERWAVE");

  // ===================================================
  // LOAD CART
  // ===================================================

  useEffect(() => {
    let mounted = true;

    async function loadCart() {
      try {
        setLoading(true);
        setError("");

        const data = await getCart();

        if (!mounted) return;

        setCart(data);
      } catch (requestError) {
        console.error("Checkout cart loading error:", requestError);

        if (!mounted) return;

        setError(
          getErrorMessage(
            requestError,
            "Unable to load your checkout. Please try again.",
          ),
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      mounted = false;
    };
  }, []);

  // ===================================================
  // CALCULATIONS
  // ===================================================

  const totalItems = useMemo(() => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce(
      (total, item) => total + Math.max(0, Number(item.quantity) || 0),
      0,
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce(
      (total, item) => {
        const price = Number(item.listing.price);
        const quantity = Math.max(0, Number(item.quantity) || 0);
        if (!Number.isFinite(price) || price < 0 || quantity <= 0) return total;
        return total + price * quantity;
      },
      0,
    );
  }, [cart]);

  const deliveryFee = 0;
  const total = subtotal + deliveryFee;
  const addressLength = deliveryAddress.length;
  const noteLength = note.length;

  // ===================================================
  // VALIDATION
  // ===================================================

  function validateForm(): boolean {
    setError("");

    if (!cart || !cart.items || cart.items.length === 0) {
      setError("Your cart is empty. Please add a product before checking out.");
      return false;
    }

    if (!deliveryAddress.trim()) {
      setError("Please enter your delivery address.");
      return false;
    }

    if (deliveryAddress.trim().length < 10) {
      setError("Please enter a more complete delivery address.");
      return false;
    }

    if (deliveryAddress.trim().length > 500) {
      setError("Your delivery address is too long.");
      return false;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return false;
    }

    if (!isValidNigerianPhone(phone)) {
      setError("Please enter a valid Nigerian phone number, e.g. 08012345678.");
      return false;
    }

    if (note.trim().length > 500) {
      setError("Your order note is too long.");
      return false;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return false;
    }

    return true;
  }

  // ===================================================
  // SUBMIT CHECKOUT
  // ===================================================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError("");

      // STEP 1 — CREATE ORDER
      const order = await checkout({
        deliveryAddress: deliveryAddress.trim(),
        phone: phone.trim(),
        note: note.trim() || undefined,
        paymentMethod,
      });

      if (!order || !order.id) {
        throw new Error("The order was created but no order ID was returned.");
      }

      // STEP 2 — FLUTTERWAVE PAYMENT
      if (paymentMethod === "FLUTTERWAVE") {
        const email = getStoredUserEmail();

        if (!email) {
          throw new Error(
            "We could not determine your account email. Please log in again and try again.",
          );
        }

        const callbackUrl = `${window.location.origin}/orders/${order.id}/payment/callback`;

        const payment = await initializeMarketplacePayment({
          orderId: order.id,
          email,
          paymentMethod: "FLUTTERWAVE",
          callbackUrl,
        });

        const paymentUrl = payment?.checkoutUrl || payment?.authorizationUrl;

        if (!paymentUrl) {
          throw new Error(
            "Flutterwave payment link was not returned. Your order was created, but payment could not be initialized.",
          );
        }

        // REDIRECT TO FLUTTERWAVE
        window.location.assign(paymentUrl);
        return;
      }

      // STEP 3 — NON-ONLINE PAYMENT
      navigate(`/orders/${order.id}`, {
        replace: true,
        state: { orderCreated: true },
      });

    } catch (requestError) {
      console.error("Checkout/payment error:", requestError);
      setError(
        getErrorMessage(
          requestError,
          "Unable to place your order. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ===================================================
  // LOADING STATE
  // ===================================================

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="checkout-loading">
          <Loader2 size={40} className="checkout-loading-spinner" />
          <p>Preparing checkout...</p>
        </div>
      </main>
    );
  }

  // ===================================================
  // ERROR / EMPTY CART
  // ===================================================

  if ((error && !cart) || !cart || !cart.items || cart.items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <ShoppingBag size={52} />
          <h2>{error ? "Unable to load checkout" : "Your cart is empty"}</h2>
          <p>
            {error || "Add products to your cart before proceeding to checkout."}
          </p>
          <Link to="/marketplace" className="btn-primary">
            Browse Marketplace
          </Link>
        </div>
      </main>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="checkout-header">

          <Link to="/cart" className="checkout-back">
            <ArrowLeft size={18} />
            Back to Cart
          </Link>

          <div className="checkout-title">
            <CreditCard size={28} />
            <div>
              <h1>Checkout</h1>
              <p>Complete your order and provide delivery details</p>
            </div>
          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="checkout-message error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            CHECKOUT LAYOUT
        ================================================= */}

        <div className="checkout-layout">

          {/* =================================================
              FORM
          ================================================= */}

          <form className="checkout-form" onSubmit={handleSubmit}>

            {/* Delivery Details */}
            <div className="checkout-card">

              <div className="checkout-card-header">
                <span className="checkout-step">01</span>
                <div>
                  <h2>Delivery Details</h2>
                  <p>Where should we deliver your order?</p>
                </div>
              </div>

              <div className="checkout-card-body">

                <div className="checkout-field">
                  <label htmlFor="delivery-address">
                    <MapPin size={16} />
                    Delivery Address <span className="required">*</span>
                  </label>
                  <textarea
                    id="delivery-address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    rows={4}
                    maxLength={500}
                    disabled={submitting}
                    required
                  />
                  <small>{addressLength}/500</small>
                </div>

                <div className="checkout-field">
                  <label htmlFor="checkout-phone">
                    <Phone size={16} />
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    maxLength={30}
                    disabled={submitting}
                    required
                  />
                  <small>We'll use this number to contact you about delivery.</small>
                </div>

                <div className="checkout-field">
                  <label htmlFor="checkout-note">
                    <Package size={16} />
                    Order Note <span className="optional">(Optional)</span>
                  </label>
                  <textarea
                    id="checkout-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special instructions for the seller?"
                    rows={3}
                    maxLength={500}
                    disabled={submitting}
                  />
                  <small>{noteLength}/500</small>
                </div>

              </div>

            </div>

            {/* Payment Method */}
            <div className="checkout-card">

              <div className="checkout-card-header">
                <span className="checkout-step">02</span>
                <div>
                  <h2>Payment Method</h2>
                  <p>Select how you want to pay for this order</p>
                </div>
              </div>

              <div className="checkout-card-body">

                <div className="checkout-payment-options">
                  <PaymentOption
                    value="FLUTTERWAVE"
                    icon={<CreditCard size={20} />}
                    title="Pay Online with Flutterwave"
                    description="Securely pay using your card, bank transfer, USSD, or other methods"
                    disabled={submitting}
                    selected={paymentMethod === "FLUTTERWAVE"}
                    onSelect={setPaymentMethod}
                  />
                </div>

                {/* Security Notice */}
                <div className="checkout-security">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Secure Online Payment</strong>
                    <p>
                      Your payment is processed securely through Flutterwave.
                      Obaaratech does not store your card details.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="checkout-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="checkout-spinner" />
                  {paymentMethod === "FLUTTERWAVE"
                    ? "Preparing Secure Payment..."
                    : "Placing Order..."}
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  {paymentMethod === "FLUTTERWAVE"
                    ? "Continue to Payment"
                    : "Place Order"}
                </>
              )}
            </button>

          </form>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="checkout-summary">

            <h2 className="checkout-summary-title">Order Summary</h2>

            {/* Items */}
            <div className="checkout-summary-items">
              {cart.items.map((item) => {
                const image = item.listing.images?.[0]?.url;
                const price = Number(item.listing.price);
                const quantity = Math.max(0, Number(item.quantity) || 0);
                const itemTotal = Number.isFinite(price) && price >= 0 ? price * quantity : 0;

                return (
                  <div key={item.id} className="checkout-summary-item">
                    <div className="checkout-summary-item-image">
                      {image ? (
                        <img src={getImageUrl(image)} alt="" />
                      ) : (
                        <ShoppingBag size={20} />
                      )}
                    </div>
                    <div className="checkout-summary-item-info">
                      <strong>{item.listing.title}</strong>
                      <small>Qty: {quantity}</small>
                    </div>
                    <span className="checkout-summary-item-price">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>
                );
              })}
            </div>

            <hr className="checkout-summary-divider" />

            {/* Totals */}
            <div className="checkout-summary-row">
              <span>Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>
                <Truck size={16} />
                Delivery
              </span>
              <strong>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</strong>
            </div>

            <hr className="checkout-summary-divider" />

            <div className="checkout-summary-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            {/* Trust Badges */}
            <div className="checkout-summary-trust">
              <div className="checkout-trust-badge">
                <ShieldCheck size={14} />
                <span>Secure Checkout</span>
              </div>
              <div className="checkout-trust-badge">
                <Truck size={14} />
                <span>Fast Delivery</span>
              </div>
            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}