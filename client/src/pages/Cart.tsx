import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingCart,
    Trash2,
    Loader2,
    ShoppingBag,
    ChevronRight,
    Truck,
    ShieldCheck,
    Tag,
    CreditCard,
    Gift
} from "lucide-react";

import {
    getCart,
    updateCartQuantity,
    removeCartItem,
    clearCart
} from "../api/cart";

import type {
    Cart
} from "../api/cart";

// =====================================================
// CART PAGE
// =====================================================

export default function Cart() {

    const navigate = useNavigate();

    // =================================================
    // STATE
    // =================================================

    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoError, setPromoError] = useState("");

    // =================================================
    // LOAD CART
    // =================================================

    useEffect(() => {

        let mounted = true;

        async function loadCart() {

            try {
                setLoading(true);
                setError("");

                const data = await getCart();

                if (mounted) {
                    setCart(data);
                }

            } catch (requestError: any) {
                console.error("Cart loading error:", requestError);

                if (mounted) {
                    setError(
                        requestError?.response?.data?.message ||
                        "Unable to load your cart."
                    );
                }

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

    // =================================================
    // FORMAT PRICE
    // =================================================

    function formatPrice(price: number | null | undefined, currency: string = "NGN") {

        if (price === null || price === undefined) {
            return "Contact seller";
        }

        try {
            return new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency,
                maximumFractionDigits: 0
            }).format(price);
        } catch {
            return `${currency} ${price.toLocaleString()}`;
        }

    }

    // =================================================
    // GET IMAGE URL
    // =================================================

    function getImageUrl(url?: string) {

        if (!url) return "";

        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }

        const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        return `${apiBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;

    }

    // =================================================
    // UPDATE QUANTITY
    // =================================================

    async function handleQuantityChange(itemId: string, quantity: number) {

        if (quantity < 1) return;

        try {
            setActionId(`quantity-${itemId}`);
            setError("");
            setSuccessMessage("");

            const response = await updateCartQuantity(itemId, quantity);
            setCart(response.cart);

        } catch (requestError: any) {
            console.error("Cart quantity error:", requestError);
            setError(
                requestError?.response?.data?.message ||
                "Unable to update quantity."
            );
        } finally {
            setActionId("");
        }

    }

    // =================================================
    // REMOVE ITEM
    // =================================================

    async function handleRemoveItem(itemId: string) {

        try {
            setActionId(`remove-${itemId}`);
            setError("");
            setSuccessMessage("");

            const response = await removeCartItem(itemId);
            setCart(response.cart);
            setSuccessMessage("Item removed from cart.");

        } catch (requestError: any) {
            console.error("Remove cart item error:", requestError);
            setError(
                requestError?.response?.data?.message ||
                "Unable to remove item."
            );
        } finally {
            setActionId("");
        }

    }

    // =================================================
    // CLEAR CART
    // =================================================

    async function handleClearCart() {

        if (!cart || cart.items.length === 0) return;

        const confirmed = window.confirm(
            "Are you sure you want to remove all items from your cart?"
        );

        if (!confirmed) return;

        try {
            setActionId("clear-cart");
            setError("");
            setSuccessMessage("");

            const response = await clearCart();
            setCart(response.cart);
            setSuccessMessage("Cart cleared successfully.");

        } catch (requestError: any) {
            console.error("Clear cart error:", requestError);
            setError(
                requestError?.response?.data?.message ||
                "Unable to clear cart."
            );
        } finally {
            setActionId("");
        }

    }

    // =================================================
    // APPLY PROMO CODE
    // =================================================

    function handleApplyPromo() {

        if (!promoCode.trim()) {
            setPromoError("Please enter a promo code.");
            return;
        }

        // Simulate promo code validation
        if (promoCode.trim().toUpperCase() === "SAVE10") {
            setPromoApplied(true);
            setPromoError("");
            setSuccessMessage("Promo code applied! 10% discount.");
        } else if (promoCode.trim().toUpperCase() === "FREESHIP") {
            setPromoApplied(true);
            setPromoError("");
            setSuccessMessage("Promo code applied! Free shipping.");
        } else {
            setPromoError("Invalid promo code. Please try again.");
            setPromoApplied(false);
        }

    }

    // =================================================
    // TOTAL ITEMS
    // =================================================

    const totalItems = useMemo(() => {

        return cart?.items.reduce(
            (total, item) => total + item.quantity,
            0
        ) || 0;

    }, [cart]);

    // =================================================
    // SUBTOTAL
    // =================================================

    const subtotal = useMemo(() => {

        return cart?.items.reduce(
            (total, item) => {
                const price = item.listing.price;

                if (price === null || price === undefined) {
                    return total;
                }

                return total + price * item.quantity;
            },
            0
        ) || 0;

    }, [cart]);

    // =================================================
    // DISCOUNT
    // =================================================

    const discount = useMemo(() => {

        if (promoApplied && promoCode.trim().toUpperCase() === "SAVE10") {
            return subtotal * 0.1;
        }
        return 0;

    }, [promoApplied, promoCode, subtotal]);

    // =================================================
    // DELIVERY FEE
    // =================================================

    const deliveryFee = useMemo(() => {

        if (promoApplied && promoCode.trim().toUpperCase() === "FREESHIP") {
            return 0;
        }
        return subtotal > 0 ? 2500 : 0;

    }, [promoApplied, promoCode, subtotal]);

    // =================================================
    // TOTAL
    // =================================================

    const total = subtotal - discount + deliveryFee;

    // =================================================
    // RECOMMENDED PRODUCTS (Static fallback)
    // =================================================

    const recommendedProducts = [
        { id: "rec1", title: "Popular Item 1", price: 15000, image: "" },
        { id: "rec2", title: "Popular Item 2", price: 25000, image: "" },
        { id: "rec3", title: "Popular Item 3", price: 35000, image: "" },
        { id: "rec4", title: "Popular Item 4", price: 45000, image: "" },
    ];

    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <main className="cart-page">

                <div className="cart-loading">
                    <div className="cart-loading-spinner">
                        <Loader2 size={40} className="spinning" />
                        <p>Loading your cart...</p>
                    </div>
                </div>

            </main>

        );

    }

    // =================================================
    // ERROR WITHOUT CART
    // =================================================

    if (error && !cart) {

        return (

            <main className="cart-page">

                <div className="cart-error">
                    <div className="cart-error-icon">⚠️</div>
                    <h2>Unable to load cart</h2>
                    <p>{error}</p>
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>

            </main>

        );

    }

    // =================================================
    // PAGE
    // =================================================

    return (

        <main className="cart-page">

            <div className="cart-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="cart-header">

                    <div className="cart-header-left">

                        <Link to="/marketplace" className="cart-continue-shopping">
                            <ArrowLeft size={18} />
                            Continue Shopping
                        </Link>

                        <div className="cart-header-title">
                            <ShoppingCart size={28} />
                            <h1>My Cart</h1>
                        </div>

                        <p className="cart-header-subtitle">
                            {totalItems === 0
                                ? "Your cart is empty."
                                : `${totalItems} ${totalItems === 1 ? "item" : "items"} in your cart.`}
                        </p>

                    </div>

                    {cart && cart.items.length > 0 && (

                        <button
                            type="button"
                            className="cart-clear-btn"
                            onClick={handleClearCart}
                            disabled={actionId === "clear-cart"}
                        >

                            {actionId === "clear-cart" ? (

                                <Loader2 size={17} className="spinning" />

                            ) : (

                                <Trash2 size={17} />

                            )}

                            Clear Cart

                        </button>

                    )}

                </div>

                {/* =================================================
                    MESSAGES
                ================================================= */}

                {error && (

                    <div className="cart-message cart-message-error" role="alert">
                        {error}
                    </div>

                )}

                {successMessage && (

                    <div className="cart-message cart-message-success" role="status">
                        <span>{successMessage}</span>
                    </div>

                )}

                {/* =================================================
                    EMPTY CART
                ================================================= */}

                {!cart || cart.items.length === 0 ? (

                    <div className="cart-empty">

                        <div className="cart-empty-icon">
                            <ShoppingBag size={52} />
                        </div>

                        <h2>Your cart is empty</h2>

                        <p>
                            Browse the marketplace and add products or services
                            you would like to purchase.
                        </p>

                        <div className="cart-empty-actions">

                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => navigate("/marketplace")}
                            >
                                <ShoppingBag size={18} />
                                Browse Marketplace
                            </button>

                        </div>

                        {/* Recommended Products */}
                        <div className="cart-recommended">

                            <h3>Recommended for You</h3>

                            <div className="cart-recommended-grid">

                                {recommendedProducts.map((product) => (

                                    <div
                                        key={product.id}
                                        className="cart-recommended-item"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >

                                        <div className="cart-recommended-image">
                                            <ShoppingBag size={24} />
                                        </div>

                                        <div className="cart-recommended-info">
                                            <strong>{product.title}</strong>
                                            <span>{formatPrice(product.price)}</span>
                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                ) : (

                    /* =================================================
                        CART CONTENT
                    ================================================= */

                    <div className="cart-content">

                        {/* =================================================
                            ITEMS LIST
                        ================================================= */}

                        <div className="cart-items">

                            {cart.items.map((item) => {

                                const image = item.listing.images?.[0]?.url;
                                const price = item.listing.price;
                                const currency = item.listing.currency || "NGN";
                                const itemTotal = price !== null && price !== undefined
                                    ? price * item.quantity
                                    : null;

                                const quantityAction = actionId === `quantity-${item.id}`;
                                const removeAction = actionId === `remove-${item.id}`;

                                return (

                                    <div key={item.id} className="cart-item">

                                        {/* Image */}
                                        <div
                                            className="cart-item-image"
                                            onClick={() => navigate(`/product/${item.listing.id}`)}
                                        >

                                            {image ? (

                                                <img
                                                    src={getImageUrl(image)}
                                                    alt={item.listing.title}
                                                />

                                            ) : (

                                                <div className="cart-item-image-placeholder">
                                                    <ShoppingBag size={28} />
                                                </div>

                                            )}

                                        </div>

                                        {/* Details */}
                                        <div className="cart-item-details">

                                            <button
                                                type="button"
                                                className="cart-item-title"
                                                onClick={() => navigate(`/product/${item.listing.id}`)}
                                            >
                                                {item.listing.title}
                                            </button>

                                            <p className="cart-item-meta">
                                                {item.listing.location || "Location not specified"}
                                            </p>

                                            <div className="cart-item-price-row">

                                                <strong className="cart-item-price">
                                                    {formatPrice(price, currency)}
                                                </strong>

                                                {itemTotal !== null && (

                                                    <span className="cart-item-total">
                                                        Total: {formatPrice(itemTotal, currency)}
                                                    </span>

                                                )}

                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="cart-item-quantity">

                                                <button
                                                    type="button"
                                                    className="cart-qty-btn"
                                                    disabled={item.quantity <= 1 || quantityAction}
                                                    onClick={() => handleQuantityChange(
                                                        item.id,
                                                        item.quantity - 1
                                                    )}
                                                >

                                                    {quantityAction ? (

                                                        <Loader2 size={14} className="spinning" />

                                                    ) : (

                                                        <Minus size={14} />

                                                    )}

                                                </button>

                                                <span className="cart-qty-value">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="cart-qty-btn"
                                                    disabled={quantityAction}
                                                    onClick={() => handleQuantityChange(
                                                        item.id,
                                                        item.quantity + 1
                                                    )}
                                                >

                                                    <Plus size={14} />

                                                </button>

                                            </div>

                                        </div>

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            className="cart-item-remove"
                                            disabled={removeAction}
                                            onClick={() => handleRemoveItem(item.id)}
                                        >

                                            {removeAction ? (

                                                <Loader2 size={16} className="spinning" />

                                            ) : (

                                                <Trash2 size={16} />

                                            )}

                                        </button>

                                    </div>

                                );

                            })}

                        </div>

                        {/* =================================================
                            ORDER SUMMARY
                        ================================================= */}

                        <div className="cart-summary">

                            <h2 className="cart-summary-title">Order Summary</h2>

                            {/* Item Count */}
                            <div className="cart-summary-row">
                                <span>Items</span>
                                <strong>{totalItems}</strong>
                            </div>

                            {/* Subtotal */}
                            <div className="cart-summary-row">
                                <span>Subtotal</span>
                                <strong>{formatPrice(subtotal)}</strong>
                            </div>

                            {/* Delivery */}
                            <div className="cart-summary-row">
                                <span>
                                    <Truck size={16} />
                                    Delivery
                                </span>
                                <strong>
                                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                                </strong>
                            </div>

                            {/* Discount */}
                            {discount > 0 && (

                                <div className="cart-summary-row cart-summary-discount">
                                    <span>
                                        <Tag size={16} />
                                        Discount (10%)
                                    </span>
                                    <strong>-{formatPrice(discount)}</strong>
                                </div>

                            )}

                            {/* Promo Code */}
                            <div className="cart-promo">

                                <div className="cart-promo-input">
                                    <Tag size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter promo code"
                                        value={promoCode}
                                        onChange={(e) => {
                                            setPromoCode(e.target.value);
                                            setPromoError("");
                                        }}
                                        disabled={promoApplied}
                                    />
                                    <button
                                        type="button"
                                        className="cart-promo-apply"
                                        onClick={handleApplyPromo}
                                        disabled={promoApplied}
                                    >
                                        Apply
                                    </button>
                                </div>

                                {promoError && (
                                    <span className="cart-promo-error">{promoError}</span>
                                )}

                                {promoApplied && (
                                    <span className="cart-promo-success">
                                        ✅ Promo applied successfully!
                                    </span>
                                )}

                            </div>

                            <hr className="cart-summary-divider" />

                            {/* Total */}
                            <div className="cart-summary-total">
                                <span>Total</span>
                                <strong>{formatPrice(total)}</strong>
                            </div>

                            {/* Checkout Button */}
                            <button
                                type="button"
                                className="cart-checkout-btn"
                                onClick={() => navigate("/checkout")}
                            >
                                <CreditCard size={18} />
                                Proceed to Checkout
                                <ChevronRight size={18} />
                            </button>

                            {/* Trust Badges */}
                            <div className="cart-trust-badges">

                                <div className="cart-trust-badge">
                                    <ShieldCheck size={16} />
                                    <span>Secure Checkout</span>
                                </div>

                                <div className="cart-trust-badge">
                                    <Truck size={16} />
                                    <span>Fast Delivery</span>
                                </div>

                                <div className="cart-trust-badge">
                                    <Gift size={16} />
                                    <span>Best Deals</span>
                                </div>

                            </div>

                            {/* Continue Shopping Link */}
                            <button
                                type="button"
                                className="cart-continue-btn"
                                onClick={() => navigate("/marketplace")}
                            >
                                Continue Shopping
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </main>

    );

}