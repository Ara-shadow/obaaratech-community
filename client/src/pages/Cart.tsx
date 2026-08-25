import {
    useEffect,
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
    ShoppingBag
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
        error,
        setError
    ] = useState("");


    const [
        actionId,
        setActionId
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage
    ] = useState("");


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


                if (mounted) {

                    setCart(data);

                }


            } catch (requestError: any) {

                console.error(
                    "Cart loading error:",
                    requestError
                );


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

   function formatPrice(
    price: number | null | undefined,
    currency: "NGN" | "USD" | "GBP" | "EUR" = "NGN"
) {
        if (
            price === null ||
            price === undefined
        ) {

            return "Contact seller";

        }


   return new Intl.NumberFormat(
    "en-NG",
    {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }
).format(price);

    }


    // =================================================
    // GET IMAGE URL
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
    // UPDATE QUANTITY
    // =================================================

    async function handleQuantityChange(
        itemId: string,
        quantity: number
    ) {

        if (quantity < 1) {

            return;

        }


        try {

            setActionId(
                `quantity-${itemId}`
            );

            setError("");

            setSuccessMessage("");


            const response =
                await updateCartQuantity(
                    itemId,
                    quantity
                );


            setCart(
                current => {

                    if (!current) {

                        return current;

                    }


                    return {

                        ...current,

                        items:
                            current.items.map(
                                item =>
                                    item.id === itemId
                                        ? {
                                            ...item,
                                            quantity:
                                                response.item.quantity
                                        }
                                        : item
                            )

                    };

                }
            );


        } catch (requestError: any) {

            console.error(
                "Cart quantity error:",
                requestError
            );


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

    async function handleRemoveItem(
        itemId: string
    ) {

        try {

            setActionId(
                `remove-${itemId}`
            );

            setError("");

            setSuccessMessage("");


            await removeCartItem(
                itemId
            );


            setCart(
                current => {

                    if (!current) {

                        return current;

                    }


                    return {

                        ...current,

                        items:
                            current.items.filter(
                                item =>
                                    item.id !== itemId
                            )

                    };

                }
            );


            setSuccessMessage(
                "Item removed from cart."
            );


        } catch (requestError: any) {

            console.error(
                "Remove cart item error:",
                requestError
            );


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

        if (
            !cart ||
            cart.items.length === 0
        ) {

            return;

        }


        const confirmed =
            window.confirm(
                "Are you sure you want to remove all items from your cart?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setActionId(
                "clear-cart"
            );

            setError("");

            setSuccessMessage("");


            await clearCart();


            setCart(
                current => {

                    if (!current) {

                        return current;

                    }


                    return {

                        ...current,

                        items: []

                    };

                }
            );


            setSuccessMessage(
                "Cart cleared successfully."
            );


        } catch (requestError: any) {

            console.error(
                "Clear cart error:",
                requestError
            );


            setError(
                requestError?.response?.data?.message ||
                "Unable to clear cart."
            );

        } finally {

            setActionId("");

        }

    }


    // =================================================
    // TOTAL ITEMS
    // =================================================

    const totalItems =
        cart?.items.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,
            0
        ) || 0;


    // =================================================
    // SUBTOTAL
    // =================================================

    const subtotal =
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
        ) || 0;


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
                        Loading your cart...
                    </p>

                </div>

            </main>

        );

    }


    // =================================================
    // ERROR
    // =================================================

    if (
        error &&
        !cart
    ) {

        return (

            <main className="page-container">

                <div className="empty-state">

                    <h2>
                        Unable to load cart
                    </h2>


                    <p>
                        {error}
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                        className="create-listing-button"
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

        <main className="page-container">


            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "25px",
                    flexWrap: "wrap"
                }}
            >

                <div>

                    <Link
                        to="/marketplace"
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

                        Continue Shopping

                    </Link>


                    <h1
                        style={{
                            marginBottom: "6px"
                        }}
                    >

                        <ShoppingCart
                            size={28}
                            style={{
                                verticalAlign: "middle",
                                marginRight: "8px"
                            }}
                        />

                        My Cart

                    </h1>


                    <p>

                        {totalItems === 0
                            ? "Your cart is empty."
                            : `${totalItems} ${
                                totalItems === 1
                                    ? "item"
                                    : "items"
                            } in your cart.`}

                    </p>

                </div>


                {cart &&
                    cart.items.length > 0 && (

                    <button
                        type="button"
                        onClick={
                            handleClearCart
                        }
                        disabled={
                            actionId ===
                            "clear-cart"
                        }
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px"
                        }}
                        className="seller-action-button delete"
                    >

                        {actionId ===
                            "clear-cart" ? (

                            <Loader2
                                size={17}
                                className="spinning"
                            />

                        ) : (

                            <Trash2
                                size={17}
                            />

                        )}

                        Clear Cart

                    </button>

                )}

            </div>


            {/* =================================================
                MESSAGES
            ================================================= */}

            {error && (

                <div
                    className="listing-form-message error"
                    role="alert"
                    style={{
                        marginBottom: "15px"
                    }}
                >

                    {error}

                </div>

            )}


            {successMessage && (

                <div
                    className="listing-form-message success"
                    role="status"
                    style={{
                        marginBottom: "15px"
                    }}
                >

                    {successMessage}

                </div>

            )}


            {/* =================================================
                EMPTY CART
            ================================================= */}

            {!cart ||
                cart.items.length === 0 ? (

                <div className="empty-state">

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <ShoppingCart
                            size={52}
                        />

                    </div>


                    <h3>
                        Your cart is empty
                    </h3>


                    <p>
                        Browse the marketplace and add
                        products or services you would like
                        to purchase.
                    </p>


                    <button
                        type="button"
                        className="create-listing-button"
                        onClick={() =>
                            navigate(
                                "/marketplace"
                            )
                        }
                        style={{
                            marginTop: "15px"
                        }}
                    >

                        <ShoppingBag
                            size={19}
                        />

                        Browse Marketplace

                    </button>

                </div>

            ) : (

                /* =================================================
                   CART CONTENT
                ================================================= */

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "minmax(0, 1fr) 330px",
                        gap: "25px",
                        alignItems: "start"
                    }}
                >


                    {/* =================================================
                        ITEMS
                    ================================================= */}

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px"
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
                                        : null;


                                return (

                                    <article
                                        key={item.id}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "120px minmax(0,1fr) auto",
                                            gap: "18px",
                                            alignItems: "center",
                                            padding: "18px",
                                            borderRadius: "12px",
                                            border:
                                                "1px solid #e5e7eb",
                                            background:
                                                "#ffffff"
                                        }}
                                    >


                                        {/* IMAGE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/product/${item.listing.id}`
                                                )
                                            }
                                            style={{
                                                border: "none",
                                                padding: 0,
                                                background:
                                                    "transparent",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >

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
                                                        width:
                                                            "120px",
                                                        height:
                                                            "100px",
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "10px"
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    style={{
                                                        width:
                                                            "120px",
                                                        height:
                                                            "100px",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        borderRadius:
                                                            "10px",
                                                        background:
                                                            "#f3f4f6"
                                                    }}
                                                >

                                                    <ShoppingBag
                                                        size={32}
                                                    />

                                                </div>

                                            )}

                                        </button>


                                        {/* DETAILS */}

                                        <div
                                            style={{
                                                minWidth: 0
                                            }}
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/product/${item.listing.id}`
                                                    )
                                                }
                                                style={{
                                                    border:
                                                        "none",
                                                    background:
                                                        "transparent",
                                                    padding: 0,
                                                    cursor:
                                                        "pointer",
                                                    fontSize:
                                                        "18px",
                                                    fontWeight:
                                                        700,
                                                    textAlign:
                                                        "left"
                                                }}
                                            >

                                                {
                                                    item.listing.title
                                                }

                                            </button>


                                            <p
                                                style={{
                                                    margin:
                                                        "7px 0",
                                                    color:
                                                        "#6b7280"
                                                }}
                                            >

                                                {
                                                    item.listing.location ||
                                                    "Location not specified"
                                                }

                                            </p>


                                            <strong>

                                                {
                                                    formatPrice(
    price,
    item.listing.currency ?? "NGN"
)
                                                }

                                            </strong>


                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap:
                                                        "8px",
                                                    marginTop:
                                                        "12px"
                                                }}
                                            >

                                                <button
                                                    type="button"
                                                    disabled={
                                                        item.quantity <=
                                                        1 ||
                                                        actionId ===
                                                        `quantity-${item.id}`
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            item.quantity -
                                                            1
                                                        )
                                                    }
                                                    style={{
                                                        width:
                                                            "34px",
                                                        height:
                                                            "34px",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        border:
                                                            "1px solid #d1d5db",
                                                        borderRadius:
                                                            "7px",
                                                        background:
                                                            "#ffffff",
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >

                                                    <Minus
                                                        size={16}
                                                    />

                                                </button>


                                                <span
                                                    style={{
                                                        minWidth:
                                                            "30px",
                                                        textAlign:
                                                            "center",
                                                        fontWeight:
                                                            600
                                                    }}
                                                >

                                                    {
                                                        item.quantity
                                                    }

                                                </span>


                                                <button
                                                    type="button"
                                                    disabled={
                                                        actionId ===
                                                        `quantity-${item.id}`
                                                    }
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            item.quantity +
                                                            1
                                                        )
                                                    }
                                                    style={{
                                                        width:
                                                            "34px",
                                                        height:
                                                            "34px",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        border:
                                                            "1px solid #d1d5db",
                                                        borderRadius:
                                                            "7px",
                                                        background:
                                                            "#ffffff",
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >

                                                    <Plus
                                                        size={16}
                                                    />

                                                </button>

                                            </div>

                                        </div>


                                        {/* RIGHT SIDE */}

                                        <div
                                            style={{
                                                textAlign:
                                                    "right",
                                                minWidth:
                                                    "110px"
                                            }}
                                        >

                                            <strong
                                                style={{
                                                    display:
                                                        "block",
                                                    fontSize:
                                                        "17px",
                                                    marginBottom:
                                                        "15px"
                                                }}
                                            >

                                                {
                                                   formatPrice(
    itemTotal,
    item.listing.currency ?? "NGN"
)
                                                }

                                            </strong>


                                            <button
                                                type="button"
                                                className="seller-action-button delete"
                                                disabled={
                                                    actionId ===
                                                    `remove-${item.id}`
                                                }
                                                onClick={() =>
                                                    handleRemoveItem(
                                                        item.id
                                                    )
                                                }
                                                style={{
                                                    display:
                                                        "inline-flex",
                                                    alignItems:
                                                        "center",
                                                    gap:
                                                        "6px"
                                                }}
                                            >

                                                {actionId ===
                                                    `remove-${item.id}` ? (

                                                    <Loader2
                                                        size={16}
                                                        className="spinning"
                                                    />

                                                ) : (

                                                    <Trash2
                                                        size={16}
                                                    />

                                                )}

                                                Remove

                                            </button>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>


                    {/* =================================================
                        SUMMARY
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


                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                gap: "15px",
                                margin:
                                    "20px 0 10px"
                            }}
                        >

                            <span>
                                Items
                            </span>


                            <strong>
                                {totalItems}
                            </strong>

                        </div>


                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                gap: "15px",
                                marginBottom:
                                    "15px"
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


                        <hr
                            style={{
                                border: 0,
                                borderTop:
                                    "1px solid #e5e7eb",
                                margin:
                                    "15px 0"
                            }}
                        />


                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                gap: "15px",
                                fontSize:
                                    "18px",
                                marginBottom:
                                    "20px"
                            }}
                        >

                            <strong>
                                Total
                            </strong>


                            <strong>
                                {
                                    formatPrice(
                                        subtotal
                                    )
                                }
                            </strong>

                        </div>


             <button
    type="button"
    className="create-listing-button"
    style={{
        width:
            "100%",
        justifyContent:
            "center"
    }}
    onClick={() =>
        navigate(
            "/checkout"
        )
    }
>

    Proceed to Checkout

</button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/marketplace"
                                )
                            }
                            style={{
                                width:
                                    "100%",
                                marginTop:
                                    "10px",
                                padding:
                                    "11px",
                                border:
                                    "1px solid #d1d5db",
                                borderRadius:
                                    "8px",
                                background:
                                    "#ffffff",
                                cursor:
                                    "pointer"
                            }}
                        >

                            Continue Shopping

                        </button>

                    </aside>

                </div>

            )}

        </main>

    );

}