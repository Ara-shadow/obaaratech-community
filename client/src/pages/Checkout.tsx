import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    Banknote,
    Check,
    CheckCircle2,
    CreditCard,
    Loader2,
    MapPin,
    ShieldCheck,
    ShoppingBag,
    Truck
} from "lucide-react";

import {
    getCart
} from "../api/cart";

import type {
    Cart
} from "../api/cart";

import {
    checkout
} from "../api/orders";

import type {
    OrderPaymentMethod
} from "../api/orders";

import {
    initializeMarketplacePayment
} from "../api/marketplace-payment";


// =====================================================
// CHECKOUT PAGE
// =====================================================

export default function Checkout() {

    const navigate =
        useNavigate();


    // =================================================
    // STATE
    // =================================================

    const [
        cart,
        setCart
    ] = useState<Cart | null>(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        deliveryAddress,
        setDeliveryAddress
    ] = useState("");


    const [
        phone,
        setPhone
    ] = useState("");


    const [
        note,
        setNote
    ] = useState("");


    const [
        paymentMethod,
        setPaymentMethod
    ] =
        useState<OrderPaymentMethod>(
            "CASH_ON_DELIVERY"
        );


    // =================================================
// LOAD CART
// =================================================

useEffect(() => {

    let mounted = true;


    async function loadCart() {

        try {

            setLoading(true);

            setError("");


            const data =
                await getCart();


            if (!mounted) {

                return;

            }


            setCart(data);


        } catch (requestError: any) {

            console.error(
                "FULL CHECKOUT ERROR",
                requestError
            );


            console.error(
                "SERVER RESPONSE",
                requestError?.response?.data
            );


            setError(
                requestError?.response?.data?.message ||
                requestError?.message ||
                "Unable to load checkout. Please try again."
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

    // =================================================
    // FORMAT PRICE
    // =================================================

    function formatPrice(
        price: number
    ) {

        return new Intl.NumberFormat(
            "en-NG",
            {
                style: "currency",
                currency: "NGN",
                maximumFractionDigits: 0
            }
        ).format(price);

    }


    // =================================================
    // IMAGE URL
    // =================================================

    function getImageUrl(
        url?: string
    ) {

        if (!url) {

            return "";

        }


        if (
            url.startsWith("http")
        ) {

            return url;

        }


        return `http://localhost:5000${url}`;

    }


    // =================================================
    // TOTAL ITEMS
    // =================================================

    const totalItems =
        useMemo(
            () =>
                cart?.items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.quantity,
                    0
                ) || 0,
            [cart]
        );


    // =================================================
    // SUBTOTAL
    // =================================================

    const subtotal =
        useMemo(
            () =>
                cart?.items.reduce(
                    (
                        total,
                        item
                    ) => {

                        const price =
                            item.listing.price;


                        if (
                            price === null ||
                            price === undefined
                        ) {

                            return total;

                        }


                        return (
                            total +
                            price *
                            item.quantity
                        );

                    },
                    0
                ) || 0,
            [cart]
        );


    // =================================================
    // DELIVERY FEE
    // =================================================

    const deliveryFee = 0;


    // =================================================
    // TOTAL
    // =================================================

    const total =
        subtotal +
        deliveryFee;


    // =================================================
    // GET USER EMAIL
    // =================================================

    function getUserEmail(): string {

        const storedUser =
            localStorage.getItem(
                "user"
            );


        if (!storedUser) {

            return "";

        }


        try {

            const parsedUser =
                JSON.parse(
                    storedUser
                );


            return (
                parsedUser?.email ||
                ""
            );

        } catch {

            return "";

        }

    }


    // =================================================
    // SUBMIT CHECKOUT
    // =================================================

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();


        setError("");


        // =================================================
        // VALIDATE CART
        // =================================================

        if (
            !cart ||
            cart.items.length === 0
        ) {

            setError(
                "Your cart is empty."
            );

            return;

        }


        // =================================================
        // VALIDATE ADDRESS
        // =================================================

        if (
            !deliveryAddress.trim()
        ) {

            setError(
                "Please enter your delivery address."
            );

            return;

        }


        // =================================================
        // VALIDATE PHONE
        // =================================================

        if (
            !phone.trim()
        ) {

            setError(
                "Please enter your phone number."
            );

            return;

        }


        try {

            setSubmitting(true);


            // =================================================
            // STEP 1 — CREATE ORDER
            // =================================================

            const response =
                await checkout({

                    deliveryAddress:
                        deliveryAddress.trim(),

                    phone:
                        phone.trim(),

                    note:
                        note.trim() ||
                        undefined,

                    paymentMethod

                });


            const order =
                response.order;


            // =================================================
            // STEP 2 — ONLINE PAYMENT
            // =================================================

            if (
                paymentMethod ===
                "FLUTTERWAVE"
            ) {

                // ---------------------------------------------
                // GET LOGGED-IN USER EMAIL
                // ---------------------------------------------

                const email =
                    getUserEmail();


                if (!email) {

                    setError(
                        "We could not determine your account email. Please log in again and try again."
                    );

                    return;

                }


                // ---------------------------------------------
                // INITIALIZE FLUTTERWAVE PAYMENT
                // ---------------------------------------------

                const payment =
                    await initializeMarketplacePayment({

                        orderId:
                            order.id,

                        email,

                        paymentMethod:
                            "FLUTTERWAVE",

                        callbackUrl:
                            `${window.location.origin}/orders/${order.id}/payment/callback`

                    });


                // ---------------------------------------------
                // GET PAYMENT URL
                // ---------------------------------------------

                const paymentUrl =
                    payment.checkoutUrl ||
                    payment.authorizationUrl;


                if (!paymentUrl) {

                    throw new Error(
                        "Flutterwave payment link was not returned."
                    );

                }


                // ---------------------------------------------
                // REDIRECT TO FLUTTERWAVE
                // ---------------------------------------------

                window.location.href =
                    paymentUrl;


                return;

            }


            // =================================================
            // STEP 3 — CASH / BANK TRANSFER
            // =================================================

            navigate(
                `/orders/${order.id}`,
                {
                    replace: true,
                    state: {
                        orderCreated: true
                    }
                }
            );


        } catch (requestError: any) {

            console.error(
                "Checkout/payment error:",
                requestError
            );


            setError(
                requestError?.response?.data?.message ||
                requestError?.message ||
                "Unable to place your order. Please try again."
            );


        } finally {

            setSubmitting(false);

        }

    }


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <main className="page-container">

                <div
                    className="my-listings-loading"
                >

                    <Loader2
                        size={30}
                        className="spinning"
                    />

                    <p>
                        Preparing checkout...
                    </p>

                </div>

            </main>

        );

    }


    // =================================================
    // ERROR WITHOUT CART
    // =================================================

    if (
        error &&
        !cart
    ) {

        return (

            <main className="page-container">

                <div className="empty-state">

                    <h2>
                        Unable to load checkout
                    </h2>


                    <p>
                        {error}
                    </p>


                    <button
                        type="button"
                        className="create-listing-button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >

                        Try Again

                    </button>

                </div>

            </main>

        );

    }


    // =================================================
    // EMPTY CART
    // =================================================

    if (
        !cart ||
        cart.items.length === 0
    ) {

        return (

            <main className="page-container">

                <div className="empty-state">

                    <ShoppingBag
                        size={52}
                    />


                    <h2>
                        Your cart is empty
                    </h2>


                    <p>
                        Add products to your cart
                        before proceeding to checkout.
                    </p>


                    <Link
                        to="/marketplace"
                        className="create-listing-button"
                        style={{
                            marginTop: "15px"
                        }}
                    >

                        Browse Marketplace

                    </Link>

                </div>

            </main>

        );

    }


    // =================================================
    // PAYMENT OPTION
    // =================================================

    function PaymentOption({
        value,
        icon,
        title,
        description
    }: {
        value: OrderPaymentMethod;
        icon: React.ReactNode;
        title: string;
        description: string;
    }) {

        const selected =
            paymentMethod === value;


        return (

            <label
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "17px",
                    border:
                        selected
                            ? "2px solid #2563eb"
                            : "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background:
                        selected
                            ? "#eff6ff"
                            : "#ffffff",
                    cursor:
                        submitting
                            ? "not-allowed"
                            : "pointer",
                    transition:
                        "all 0.2s ease",
                    opacity:
                        submitting
                            ? 0.7
                            : 1
                }}
            >

                <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={selected}
                    onChange={() =>
                        setPaymentMethod(value)
                    }
                    disabled={submitting}
                    style={{
                        position: "absolute",
                        opacity: 0
                    }}
                />


                <div
                    style={{
                        width: "42px",
                        height: "42px",
                        minWidth: "42px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            selected
                                ? "#2563eb"
                                : "#f3f4f6",
                        color:
                            selected
                                ? "#ffffff"
                                : "#374151"
                    }}
                >

                    {icon}

                </div>


                <div
                    style={{
                        flex: 1,
                        minWidth: 0
                    }}
                >

                    <strong
                        style={{
                            display: "block",
                            fontSize: "15px",
                            marginBottom: "4px"
                        }}
                    >

                        {title}

                    </strong>


                    <p
                        style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "13px",
                            lineHeight: 1.5
                        }}
                    >

                        {description}

                    </p>

                </div>


                {selected && (

                    <div
                        style={{
                            width: "24px",
                            height: "24px",
                            minWidth: "24px",
                            borderRadius: "50%",
                            background: "#2563eb",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >

                        <Check
                            size={15}
                        />

                    </div>

                )}

            </label>

        );

    }


    // =================================================
    // PAGE
    // =================================================

    return (

        <main className="page-container">

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    marginBottom: "25px"
                }}
            >

                <Link
                    to="/cart"
                    className="back-marketplace"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        marginBottom: "12px"
                    }}
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back to Cart

                </Link>


                <h1>
                    Checkout
                </h1>


                <p>
                    Complete your order and provide
                    your delivery details.
                </p>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    className="listing-form-message error"
                    role="alert"
                    style={{
                        marginBottom: "20px"
                    }}
                >

                    {error}

                </div>

            )}


            {/* =================================================
                CHECKOUT LAYOUT
            ================================================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(0, 1fr) 360px",
                    gap: "25px",
                    alignItems: "start"
                }}
            >

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                    }}
                >

                    {/* =================================================
                        DELIVERY DETAILS
                    ================================================= */}

                    <section
                        className="listing-form-card"
                    >

                        <div
                            className="listing-form-section-heading"
                        >

                            <div>

                                <span>
                                    01
                                </span>


                                <div>

                                    <h2>
                                        Delivery Details
                                    </h2>


                                    <p>
                                        Where should we deliver
                                        your order?
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ADDRESS */}

                        <div
                            className="form-field"
                        >

                            <label
                                htmlFor="delivery-address"
                            >

                                <MapPin
                                    size={17}
                                    style={{
                                        verticalAlign:
                                            "middle",
                                        marginRight:
                                            "5px"
                                    }}
                                />

                                Delivery Address

                                <span>
                                    *
                                </span>

                            </label>


                            <textarea
                                id="delivery-address"
                                value={
                                    deliveryAddress
                                }
                                onChange={event =>
                                    setDeliveryAddress(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your full delivery address"
                                rows={5}
                                maxLength={500}
                                disabled={
                                    submitting
                                }
                            />


                            <small>
                                {deliveryAddress.length}/500
                            </small>

                        </div>


                        {/* PHONE */}

                        <div
                            className="form-field"
                        >

                            <label
                                htmlFor="checkout-phone"
                            >

                                Phone Number

                                <span>
                                    *
                                </span>

                            </label>


                            <input
                                id="checkout-phone"
                                type="tel"
                                value={phone}
                                onChange={event =>
                                    setPhone(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. 08012345678"
                                maxLength={30}
                                disabled={
                                    submitting
                                }
                            />

                        </div>


                        {/* NOTE */}

                        <div
                            className="form-field"
                        >

                            <label
                                htmlFor="checkout-note"
                            >

                                Order Note

                                <span
                                    style={{
                                        fontWeight: 400
                                    }}
                                >
                                    {" "}
                                    (Optional)
                                </span>

                            </label>


                            <textarea
                                id="checkout-note"
                                value={note}
                                onChange={event =>
                                    setNote(
                                        event.target.value
                                    )
                                }
                                placeholder="Any special instructions for the seller?"
                                rows={4}
                                maxLength={500}
                                disabled={
                                    submitting
                                }
                            />


                            <small>
                                {note.length}/500
                            </small>

                        </div>

                    </section>


                    {/* =================================================
                        PAYMENT
                    ================================================= */}

                    <section
                        className="listing-form-card"
                    >

                        <div
                            className="listing-form-section-heading"
                        >

                            <div>

                                <span>
                                    02
                                </span>


                                <div>

                                    <h2>
                                        Payment Method
                                    </h2>


                                    <p>
                                        Select how you want
                                        to pay for this order.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px"
                            }}
                        >

                            {/* CASH */}

                            <PaymentOption
                                value="CASH_ON_DELIVERY"
                                icon={
                                    <Banknote
                                        size={21}
                                    />
                                }
                                title="Cash on Delivery"
                                description="Pay when your order is delivered."
                            />


                            {/* BANK TRANSFER */}

                            <PaymentOption
                                value="BANK_TRANSFER"
                                icon={
                                    <Banknote
                                        size={21}
                                    />
                                }
                                title="Bank Transfer"
                                description="Receive payment instructions after placing your order."
                            />


                            {/* FLUTTERWAVE */}

                            <PaymentOption
                                value="FLUTTERWAVE"
                                icon={
                                    <CreditCard
                                        size={21}
                                    />
                                }
                                title="Pay Online with Flutterwave"
                                description="Securely pay online using your card, bank transfer, USSD or supported payment method."
                            />

                        </div>


                        {/* PAYMENT SECURITY */}

                        {paymentMethod ===
                            "FLUTTERWAVE" && (

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "flex-start",
                                    marginTop: "15px",
                                    padding: "13px",
                                    borderRadius: "10px",
                                    background: "#f8fafc",
                                    border:
                                        "1px solid #e5e7eb"
                                }}
                            >

                                <ShieldCheck
                                    size={20}
                                    style={{
                                        color: "#2563eb",
                                        minWidth: "20px"
                                    }}
                                />


                                <div>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            fontSize:
                                                "13px",
                                            marginBottom:
                                                "3px"
                                        }}
                                    >

                                        Secure Online Payment

                                    </strong>


                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize:
                                                "12px",
                                            color:
                                                "#6b7280",
                                            lineHeight:
                                                1.5
                                        }}
                                    >

                                        Your payment is processed
                                        securely through Flutterwave.
                                        We never store your card details.

                                    </p>

                                </div>

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <button
                        type="submit"
                        className="create-listing-button"
                        disabled={
                            submitting
                        }
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            padding: "14px",
                            fontSize: "15px"
                        }}
                    >

                        {submitting ? (

                            <>

                                <Loader2
                                    size={19}
                                    className="spinning"
                                />

                                {paymentMethod ===
                                "FLUTTERWAVE"
                                    ? "Preparing Secure Payment..."
                                    : "Placing Order..."}

                            </>

                        ) : (

                            <>

                                <CheckCircle2
                                    size={19}
                                />

                                {paymentMethod ===
                                "FLUTTERWAVE"
                                    ? "Continue to Payment"
                                    : "Place Order"}

                            </>

                        )}

                    </button>

                </form>


                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <aside
                    style={{
                        padding: "22px",
                        borderRadius: "12px",
                        border:
                            "1px solid #e5e7eb",
                        background:
                            "#ffffff",
                        position:
                            "sticky",
                        top: "90px"
                    }}
                >

                    <h2
                        style={{
                            marginTop: 0
                        }}
                    >

                        Order Summary

                    </h2>


                    {/* ITEMS */}

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                            margin: "20px 0"
                        }}
                    >

                        {cart.items.map(
                            item => {

                                const image =
                                    item.listing.images?.[0]?.url;


                                const price =
                                    item.listing.price;


                                const itemTotal =
                                    price !== null &&
                                    price !== undefined
                                        ? price *
                                          item.quantity
                                        : 0;


                                return (

                                    <div
                                        key={item.id}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "55px minmax(0,1fr) auto",
                                            gap: "10px",
                                            alignItems:
                                                "center"
                                        }}
                                    >

                                        {/* IMAGE */}

                                        {image ? (

                                            <img
                                                src={
                                                    getImageUrl(
                                                        image
                                                    )
                                                }
                                                alt={
                                                    item.listing.title
                                                }
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    objectFit:
                                                        "cover",
                                                    borderRadius:
                                                        "8px"
                                                }}
                                            />

                                        ) : (

                                            <div
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    background:
                                                        "#f3f4f6",
                                                    borderRadius:
                                                        "8px"
                                                }}
                                            >

                                                <ShoppingBag
                                                    size={23}
                                                />

                                            </div>

                                        )}


                                        {/* DETAILS */}

                                        <div
                                            style={{
                                                minWidth: 0
                                            }}
                                        >

                                            <strong
                                                style={{
                                                    display:
                                                        "block",
                                                    overflow:
                                                        "hidden",
                                                    textOverflow:
                                                        "ellipsis",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >

                                                {
                                                    item.listing.title
                                                }

                                            </strong>


                                            <small
                                                style={{
                                                    color:
                                                        "#6b7280"
                                                }}
                                            >

                                                Qty:{" "}
                                                {
                                                    item.quantity
                                                }

                                            </small>

                                        </div>


                                        {/* PRICE */}

                                        <strong>

                                            {
                                                formatPrice(
                                                    itemTotal
                                                )
                                            }

                                        </strong>

                                    </div>

                                );

                            }
                        )}

                    </div>


                    <hr
                        style={{
                            border: 0,
                            borderTop:
                                "1px solid #e5e7eb",
                            margin: "15px 0"
                        }}
                    />


                    {/* ITEM COUNT */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            marginBottom: "10px"
                        }}
                    >

                        <span>
                            Items
                        </span>


                        <strong>
                            {totalItems}
                        </strong>

                    </div>


                    {/* SUBTOTAL */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            marginBottom: "10px"
                        }}
                    >

                        <span>
                            Subtotal
                        </span>


                        <strong>
                            {
                                formatPrice(
                                    subtotal
                                )
                            }
                        </strong>

                    </div>


                    {/* DELIVERY */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            marginBottom: "15px"
                        }}
                    >

                        <span
                            style={{
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: "5px"
                            }}
                        >

                            <Truck
                                size={16}
                            />

                            Delivery

                        </span>


                        <strong>

                            {deliveryFee === 0
                                ? "Free"
                                : formatPrice(
                                    deliveryFee
                                )}

                        </strong>

                    </div>


                    <hr
                        style={{
                            border: 0,
                            borderTop:
                                "1px solid #e5e7eb",
                            margin: "15px 0"
                        }}
                    />


                    {/* TOTAL */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            gap: "15px",
                            fontSize: "20px"
                        }}
                    >

                        <strong>
                            Total
                        </strong>


                        <strong>
                            {
                                formatPrice(
                                    total
                                )
                            }
                        </strong>

                    </div>


                    {/* TRUST MESSAGE */}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            marginTop: "20px",
                            paddingTop: "15px",
                            borderTop:
                                "1px solid #f1f5f9",
                            color: "#64748b",
                            fontSize: "12px",
                            lineHeight: 1.5
                        }}
                    >

                        <ShieldCheck
                            size={17}
                            style={{
                                minWidth: "17px"
                            }}
                        />

                        <span>
                            Your order information is
                            securely handled by the
                            Obaaratech Marketplace.
                        </span>

                    </div>

                </aside>

            </div>

        </main>

    );

}