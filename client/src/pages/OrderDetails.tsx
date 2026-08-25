
import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    CreditCard,
    Loader2,
    MapPin,
    Package,
    Phone,
    Truck,
    XCircle
} from "lucide-react";

import {
    getBuyerOrder
} from "../api/orders";

import type {
    Order,
    OrderStatus
} from "../api/orders";


// =====================================================
// ORDER TRACKING STEPS
// =====================================================

const trackingSteps: {
    status: OrderStatus;
    title: string;
    description: string;
    icon: typeof Package;
}[] = [

    {
        status: "PENDING",
        title: "Order Placed",
        description:
            "Your order has been received and is waiting for confirmation.",
        icon: Package
    },

    {
        status: "CONFIRMED",
        title: "Order Confirmed",
        description:
            "The seller has confirmed your order.",
        icon: CheckCircle2
    },

    {
        status: "PROCESSING",
        title: "Processing",
        description:
            "The seller is preparing your items.",
        icon: Clock3
    },

    {
        status: "READY",
        title: "Ready for Delivery",
        description:
            "Your order is ready to be delivered.",
        icon: Package
    },

    {
        status: "SHIPPED",
        title: "Shipped",
        description:
            "Your order is on its way to you.",
        icon: Truck
    },

    {
        status: "DELIVERED",
        title: "Delivered",
        description:
            "Your order has been delivered successfully.",
        icon: CheckCircle2
    }

];


// =====================================================
// STATUS ORDER
// =====================================================

const statusIndex: Record<
    OrderStatus,
    number
> = {

    PENDING: 0,

    CONFIRMED: 1,

    PROCESSING: 2,

    READY: 3,

    SHIPPED: 4,

    DELIVERED: 5,

    CANCELLED: -1

};


// =====================================================
// COMPONENT
// =====================================================

export default function OrderDetails() {

    const {
        id
    } = useParams<{
        id: string;
    }>();


    const navigate =
        useNavigate();


    // =================================================
    // STATE
    // =================================================

    const [
        order,
        setOrder
    ] = useState<Order | null>(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    // =================================================
    // LOAD ORDER
    // =================================================

    useEffect(() => {

        let mounted = true;


        async function loadOrder() {

            if (!id) {

                setError(
                    "Order ID is missing."
                );

                setLoading(false);

                return;

            }


            try {

                setLoading(true);

                setError("");


                const data =
                    await getBuyerOrder(id);


                if (!mounted) {

                    return;

                }


                setOrder(data);


            } catch (requestError: any) {

                console.error(
                    "Order loading error:",
                    requestError
                );


                if (mounted) {

                    setError(
                        requestError?.response?.data?.message ||
                        "Unable to load this order."
                    );

                }


            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        }


        loadOrder();


        return () => {

            mounted = false;

        };

    }, [id]);


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
    // FORMAT DATE
    // =================================================

    function formatDate(
        date: string
    ) {

        return new Intl.DateTimeFormat(
            "en-NG",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        ).format(
            new Date(date)
        );

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
    // CURRENT TRACKING INDEX
    // =================================================

    const currentStatusIndex =
        useMemo(
            () =>
                order
                    ? statusIndex[
                        order.status
                    ]
                    : -1,
            [order]
        );


    // =================================================
    // PAYMENT LABEL
    // =================================================

    function paymentMethodLabel(
        method: Order["paymentMethod"]
    ) {

        switch (method) {

            case "CASH_ON_DELIVERY":

                return "Cash on Delivery";

            case "BANK_TRANSFER":

                return "Bank Transfer";

          case "FLUTTERWAVE":

    return "Flutterwave";

            default:

                return method;

        }

    }


    // =================================================
    // PAYMENT STATUS LABEL
    // =================================================

    function paymentStatusLabel(
        status: Order["paymentStatus"]
    ) {

        switch (status) {

            case "PAID":

                return "Paid";

            case "FAILED":

                return "Failed";

            case "REFUNDED":

                return "Refunded";

            case "PENDING":

            default:

                return "Pending";

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
                        Loading your order...
                    </p>

                </div>

            </main>

        );

    }


    // =================================================
    // ERROR
    // =================================================

    if (error || !order) {

        return (

            <main className="page-container">

                <div className="empty-state">

                    <Package
                        size={52}
                    />

                    <h2>
                        Unable to load order
                    </h2>

                    <p>
                        {error ||
                            "This order could not be found."}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "15px"
                        }}
                    >

                        <button
                            type="button"
                            className="create-listing-button"
                            onClick={() =>
                                navigate("/marketplace")
                            }
                        >

                            Back to Marketplace

                        </button>

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

                </div>

            </main>

        );

    }


    // =================================================
    // CANCELLED ORDER
    // =================================================

    const isCancelled =
        order.status === "CANCELLED";


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

                    Back to Marketplace

                </Link>


                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "15px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h1>
                            Order Details
                        </h1>

                        <p
                            style={{
                                marginBottom: 0
                            }}
                        >

                            Order{" "}

                            <strong>
                                {order.orderNumber}
                            </strong>

                        </p>

                    </div>


                    <div
                        style={{
                            padding:
                                "8px 14px",
                            borderRadius:
                                "999px",
                            background:
                                isCancelled
                                    ? "#fee2e2"
                                    : "#dbeafe",
                            color:
                                isCancelled
                                    ? "#b91c1c"
                                    : "#1d4ed8",
                            fontWeight: 700,
                            fontSize:
                                "14px"
                        }}
                    >

                        {isCancelled
                            ? "Cancelled"
                            : order.status}

                    </div>

                </div>

            </div>


            {/* =================================================
                CANCELLED NOTICE
            ================================================= */}

            {isCancelled && (

                <section
                    className="listing-form-card"
                    style={{
                        marginBottom: "20px",
                        border:
                            "1px solid #fecaca",
                        background:
                            "#fef2f2"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            alignItems:
                                "flex-start"
                        }}
                    >

                        <XCircle
                            size={26}
                            color="#dc2626"
                        />

                        <div>

                            <h2
                                style={{
                                    marginTop: 0,
                                    color: "#991b1b"
                                }}
                            >

                                Order Cancelled

                            </h2>

                            <p
                                style={{
                                    marginBottom: 0,
                                    color: "#7f1d1d"
                                }}
                            >

                                This order has been cancelled
                                and will not continue through
                                the delivery process.

                            </p>

                        </div>

                    </div>

                </section>

            )}


            {/* =================================================
                TRACKING
            ================================================= */}

            {!isCancelled && (

                <section
                    className="listing-form-card"
                    style={{
                        marginBottom: "20px"
                    }}
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
                                    Track Your Order
                                </h2>

                                <p>
                                    Follow the progress of
                                    your order.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        style={{
                            marginTop: "25px"
                        }}
                    >

                        {trackingSteps.map(
                            (
                                step,
                                index
                            ) => {

                                const Icon =
                                    step.icon;

                                const completed =
                                    index <
                                    currentStatusIndex;

                                const active =
                                    index ===
                                    currentStatusIndex;


                                return (

                                    <div
                                        key={
                                            step.status
                                        }
                                        style={{
                                            display:
                                                "grid",
                                            gridTemplateColumns:
                                                "46px minmax(0,1fr)",
                                            gap: "15px",
                                            minHeight:
                                                index ===
                                                trackingSteps.length - 1
                                                    ? "70px"
                                                    : "95px"
                                        }}
                                    >

                                        {/* TIMELINE */}


                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                alignItems:
                                                    "center"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        "42px",
                                                    height:
                                                        "42px",
                                                    borderRadius:
                                                        "50%",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    background:
                                                        completed ||
                                                        active
                                                            ? "#2563eb"
                                                            : "#e5e7eb",
                                                    color:
                                                        completed ||
                                                        active
                                                            ? "#ffffff"
                                                            : "#6b7280",
                                                    flexShrink:
                                                        0
                                                }}
                                            >

                                                <Icon
                                                    size={20}
                                                />

                                            </div>


                                            {index <
                                                trackingSteps.length - 1 && (

                                                <div
                                                    style={{
                                                        width:
                                                            "2px",
                                                        flex:
                                                            1,
                                                        marginTop:
                                                            "5px",
                                                        background:
                                                            index <
                                                            currentStatusIndex
                                                                ? "#2563eb"
                                                                : "#e5e7eb"
                                                    }}
                                                />

                                            )}

                                        </div>


                                        {/* DETAILS */}

                                        <div
                                            style={{
                                                paddingTop:
                                                    "2px",
                                                paddingBottom:
                                                    "20px"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    margin:
                                                        "0 0 5px",
                                                    color:
                                                        active
                                                            ? "#1d4ed8"
                                                            : "#111827"
                                                }}
                                            >

                                                {step.title}

                                            </h3>


                                            <p
                                                style={{
                                                    margin:
                                                        0,
                                                    color:
                                                        "#6b7280"
                                                }}
                                            >

                                                {
                                                    step.description
                                                }

                                            </p>


                                            {active && (

                                                <span
                                                    style={{
                                                        display:
                                                            "inline-block",
                                                        marginTop:
                                                            "8px",
                                                        fontSize:
                                                            "13px",
                                                        fontWeight:
                                                            700,
                                                        color:
                                                            "#2563eb"
                                                    }}
                                                >

                                                    Current status

                                                </span>

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                ORDER INFORMATION
            ================================================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(0, 1fr) 360px",
                    gap: "20px",
                    alignItems: "start"
                }}
            >

                {/* =================================================
                    LEFT COLUMN
                ================================================= */}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                    }}
                >

                    {/* ORDER ITEMS */}

                    <section
                        className="listing-form-card"
                    >

                        <div
                            className="listing-form-section-heading"
                        >

                            <div>

                                <span>
                                    {isCancelled
                                        ? "01"
                                        : "02"}
                                </span>

                                <div>

                                    <h2>
                                        Ordered Items
                                    </h2>

                                    <p>
                                        Products included
                                        in this order.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: "16px",
                                marginTop:
                                    "20px"
                            }}
                        >

                            {order.items.map(
                                item => {

                                    const image =
                                        item.listing
                                            ?.images?.[0]
                                            ?.url;


                                    return (

                                        <div
                                            key={
                                                item.id
                                            }
                                            style={{
                                                display:
                                                    "grid",
                                                gridTemplateColumns:
                                                    "65px minmax(0,1fr) auto",
                                                gap: "12px",
                                                alignItems:
                                                    "center"
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
                                                        item.title
                                                    }
                                                    style={{
                                                        width:
                                                            "65px",
                                                        height:
                                                            "65px",
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "9px"
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    style={{
                                                        width:
                                                            "65px",
                                                        height:
                                                            "65px",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        background:
                                                            "#f3f4f6",
                                                        borderRadius:
                                                            "9px"
                                                    }}
                                                >

                                                    <Package
                                                        size={25}
                                                    />

                                                </div>

                                            )}


                                            <div
                                                style={{
                                                    minWidth:
                                                        0
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
                                                        item.title
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

                                                    {" • "}

                                                    {
                                                        formatPrice(
                                                            item.unitPrice
                                                        )
                                                    }

                                                    {" each"}

                                                </small>

                                            </div>


                                            <strong>

                                                {
                                                    formatPrice(
                                                        item.subtotal
                                                    )
                                                }

                                            </strong>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </section>


                    {/* DELIVERY */}

                    <section
                        className="listing-form-card"
                    >

                        <div
                            className="listing-form-section-heading"
                        >

                            <div>

                                <span>
                                    {isCancelled
                                        ? "02"
                                        : "03"}
                                </span>

                                <div>

                                    <h2>
                                        Delivery Information
                                    </h2>

                                    <p>
                                        Where your order
                                        will be delivered.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: "15px",
                                marginTop:
                                    "20px"
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap: "10px",
                                    alignItems:
                                        "flex-start"
                                }}
                            >

                                <MapPin
                                    size={20}
                                />

                                <div>

                                    <strong>
                                        Delivery Address
                                    </strong>

                                    <p
                                        style={{
                                            margin:
                                                "4px 0 0",
                                            color:
                                                "#6b7280"
                                        }}
                                    >

                                        {
                                            order.deliveryAddress
                                        }

                                    </p>

                                </div>

                            </div>


                            <div
                                style={{
                                    display:
                                        "flex",
                                    gap: "10px",
                                    alignItems:
                                        "center"
                                }}
                            >

                                <Phone
                                    size={20}
                                />

                                <div>

                                    <strong>
                                        Phone
                                    </strong>

                                    <p
                                        style={{
                                            margin:
                                                "4px 0 0",
                                            color:
                                                "#6b7280"
                                        }}
                                    >

                                        {order.phone}

                                    </p>

                                </div>

                            </div>


                            {order.note && (

                                <div>

                                    <strong>
                                        Order Note
                                    </strong>

                                    <p
                                        style={{
                                            margin:
                                                "4px 0 0",
                                            color:
                                                "#6b7280"
                                        }}
                                    >

                                        {order.note}

                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                </div>


                {/* =================================================
                    RIGHT COLUMN
                ================================================= */}

                <aside
                    style={{
                        display:
                            "flex",
                        flexDirection:
                            "column",
                        gap: "20px",
                        position:
                            "sticky",
                        top: "90px"
                    }}
                >

                    {/* PAYMENT */}

                    <section
                        style={{
                            padding:
                                "22px",
                            borderRadius:
                                "12px",
                            border:
                                "1px solid #e5e7eb",
                            background:
                                "#ffffff"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: 0
                            }}
                        >

                            Payment

                        </h2>


                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: "12px"
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    gap: "10px"
                                }}
                            >

                                <span>
                                    Method
                                </span>

                                <strong
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: "5px",
                                        textAlign:
                                            "right"
                                    }}
                                >

                                    <CreditCard
                                        size={16}
                                    />

                                    {
                                        paymentMethodLabel(
                                            order.paymentMethod
                                        )
                                    }

                                </strong>

                            </div>


                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    gap: "10px"
                                }}
                            >

                                <span>
                                    Payment Status
                                </span>

                                <strong>
                                    {
                                        paymentStatusLabel(
                                            order.paymentStatus
                                        )
                                    }
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* ORDER SUMMARY */}

                    <section
                        style={{
                            padding:
                                "22px",
                            borderRadius:
                                "12px",
                            border:
                                "1px solid #e5e7eb",
                            background:
                                "#ffffff"
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
                                flexDirection:
                                    "column",
                                gap: "12px"
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between"
                                }}
                            >

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    {
                                        formatPrice(
                                            order.subtotal
                                        )
                                    }
                                </strong>

                            </div>


                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between"
                                }}
                            >

                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    {order.deliveryFee === 0
                                        ? "Free"
                                        : formatPrice(
                                            order.deliveryFee
                                        )}
                                </strong>

                            </div>


                            <hr
                                style={{
                                    border: 0,
                                    borderTop:
                                        "1px solid #e5e7eb",
                                    width:
                                        "100%"
                                }}
                            />


                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    gap: "10px",
                                    fontSize:
                                        "20px"
                                }}
                            >

                                <strong>
                                    Total
                                </strong>

                                <strong>
                                    {
                                        formatPrice(
                                            order.total
                                        )
                                    }
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* ORDER DATE */}

                    <section
                        style={{
                            padding:
                                "18px 22px",
                            borderRadius:
                                "12px",
                            border:
                                "1px solid #e5e7eb",
                            background:
                                "#ffffff"
                        }}
                    >

                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                gap: "10px"
                            }}
                        >

                            <span>
                                Order Date
                            </span>

                            <strong
                                style={{
                                    textAlign:
                                        "right"
                                }}
                            >

                                {
                                    formatDate(
                                        order.createdAt
                                    )
                                }

                            </strong>

                        </div>

                    </section>

                </aside>

            </div>

        </main>

    );

}