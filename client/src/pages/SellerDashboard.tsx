import {
    useEffect,
    useMemo,
    useState
} from "react";

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
    User,
    XCircle
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getSellerOrder,
    updateSellerOrderStatus
} from "../api/orders";

import type {
    Order,
    OrderStatus
} from "../api/orders";


// =====================================================
// STATUS CONFIGURATION
// =====================================================

const statusLabels: Record<
    OrderStatus,
    string
> = {

    PENDING: "Pending",

    CONFIRMED: "Confirmed",

    PROCESSING: "Processing",

    READY: "Ready for Delivery",

    SHIPPED: "Shipped",

    DELIVERED: "Delivered",

    CANCELLED: "Cancelled"

};


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


const statusIcons: Record<
    OrderStatus,
    typeof Clock3
> = {

    PENDING: Clock3,

    CONFIRMED: CheckCircle2,

    PROCESSING: Package,

    READY: Package,

    SHIPPED: Truck,

    DELIVERED: CheckCircle2,

    CANCELLED: XCircle

};


const statusSteps: OrderStatus[] = [

    "PENDING",

    "CONFIRMED",

    "PROCESSING",

    "READY",

    "SHIPPED",

    "DELIVERED"

];


// =====================================================
// COMPONENT
// =====================================================

export default function SellerOrderDetails() {

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
        updating,
        setUpdating
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage
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
                    await getSellerOrder(id);


                if (!mounted) {

                    return;

                }


                setOrder(data);


            } catch (requestError: any) {

                console.error(
                    "Seller order loading error:",
                    requestError
                );


                if (mounted) {

                    setError(
                        requestError?.response?.data?.message ||
                        "Unable to load this seller order."
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
    // PAYMENT STATUS
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
    // CURRENT STATUS INDEX
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
    // STATUS UPDATE
    // =================================================

    async function handleStatusChange(
        status: OrderStatus
    ) {

        if (!order || !id) {

            return;

        }


        if (
            status === order.status
        ) {

            return;

        }


        try {

            setUpdating(true);

            setError("");

            setSuccessMessage("");


            const updatedOrder =
                await updateSellerOrderStatus(
                    id,
                    status
                );


            setOrder(
                updatedOrder
            );


            setSuccessMessage(
                `Order status updated to ${statusLabels[status]}.`
            );


        } catch (requestError: any) {

            console.error(
                "Seller order status update error:",
                requestError
            );


            setError(
                requestError?.response?.data?.message ||
                "Unable to update the order status."
            );


        } finally {

            setUpdating(false);

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
                        Loading seller order...
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
        !order
    ) {

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
                        {error}
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
                                navigate(
                                    "/seller-dashboard"
                                )
                            }
                        >

                            Back to Seller Dashboard

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


    if (!order) {

        return null;

    }


    // =================================================
    // DERIVED VALUES
    // =================================================

    const isCancelled =
        order.status === "CANCELLED";


    const canCancel =
        order.status === "PENDING" ||
        order.status === "CONFIRMED";


    


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
                    to="/seller-dashboard"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        marginBottom: "12px",
                        textDecoration: "none"
                    }}
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back to Seller Dashboard

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
                            Seller Order Details
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

                        <p
                            style={{
                                marginTop: "5px",
                                color: "#6b7280"
                            }}
                        >

                            Placed{" "}
                            {formatDate(
                                order.createdAt
                            )}

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

                        {statusLabels[
                            order.status
                        ]}

                    </div>

                </div>

            </div>


            {/* =================================================
                ERROR / SUCCESS
            ================================================= */}

            {error && (

                <div
                    style={{
                        padding: "12px 15px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        background: "#fee2e2",
                        color: "#b91c1c"
                    }}
                >

                    {error}

                </div>

            )}


            {successMessage && (

                <div
                    style={{
                        padding: "12px 15px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                        background: "#dcfce7",
                        color: "#166534"
                    }}
                >

                    {successMessage}

                </div>

            )}


            {/* =================================================
                STATUS MANAGEMENT
            ================================================= */}

            <section
                className="listing-form-card"
                style={{
                    marginBottom: "20px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "18px"
                    }}
                >

                    <Truck
                        size={21}
                    />

                    <h2
                        style={{
                            margin: 0
                        }}
                    >
                        Order Status
                    </h2>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        overflowX: "auto",
                        paddingBottom: "8px"
                    }}
                >

                    {statusSteps.map(
                        (status, index) => {

                            const Icon =
                                statusIcons[
                                    status
                                ];


                            const completed =
                                currentStatusIndex >=
                                index;


                            const active =
                                order.status ===
                                status;


                            return (

                                <button
                                    key={status}
                                    type="button"
                                    disabled={
                                        updating ||
                                        status ===
                                        order.status
                                    }
                                    onClick={() =>
                                        handleStatusChange(
                                            status
                                        )
                                    }
                                    style={{
                                        minWidth:
                                            "125px",
                                        padding:
                                            "11px 12px",
                                        borderRadius:
                                            "10px",
                                        border:
                                            active
                                                ? "2px solid #2563eb"
                                                : "1px solid #d1d5db",
                                        background:
                                            active
                                                ? "#eff6ff"
                                                : completed
                                                    ? "#f0fdf4"
                                                    : "#fff",
                                        color:
                                            active
                                                ? "#1d4ed8"
                                                : "#374151",
                                        cursor:
                                            updating ||
                                            status ===
                                            order.status
                                                ? "default"
                                                : "pointer",
                                        fontWeight:
                                            active
                                                ? 700
                                                : 500
                                    }}
                                >

                                    <Icon
                                        size={18}
                                        style={{
                                            display:
                                                "block",
                                            margin:
                                                "0 auto 5px"
                                        }}
                                    />

                                    {
                                        statusLabels[
                                            status
                                        ]
                                    }

                                </button>

                            );

                        }
                    )}

                </div>


                {updating && (

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "12px",
                            color: "#6b7280"
                        }}
                    >

                        <Loader2
                            size={18}
                            className="spinning"
                        />

                        Updating order status...

                    </div>

                )}


                {canCancel && (

                    <button
                        type="button"
                        disabled={updating}
                        onClick={() =>
                            handleStatusChange(
                                "CANCELLED"
                            )
                        }
                        style={{
                            marginTop: "15px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            padding: "9px 14px",
                            borderRadius: "8px",
                            border: "1px solid #fecaca",
                            background: "#fff1f2",
                            color: "#b91c1c",
                            cursor: updating
                                ? "default"
                                : "pointer",
                            fontWeight: 600
                        }}
                    >

                        <XCircle
                            size={17}
                        />

                        Cancel Order

                    </button>

                )}

            </section>


            {/* =================================================
                MAIN GRID
            ================================================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(0, 2fr) minmax(280px, 1fr)",
                    gap: "20px",
                    alignItems: "start"
                }}
            >

                {/* =================================================
                    ORDER ITEMS
                ================================================= */}

                <section
                    className="listing-form-card"
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "18px"
                        }}
                    >

                        <Package
                            size={21}
                        />

                        <h2
                            style={{
                                margin: 0
                            }}
                        >
                            Order Items
                        </h2>

                    </div>


                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "14px"
                        }}
                    >

                        {order.items.map(
                            item => {

                                const image =
                                    item.listing?.images?.[0]?.url ||
                                    "";


                                return (

                                    <div
                                        key={item.id}
                                        style={{
                                            display:
                                                "flex",
                                            gap:
                                                "14px",
                                            padding:
                                                "14px",
                                            border:
                                                "1px solid #e5e7eb",
                                            borderRadius:
                                                "10px",
                                            flexWrap:
                                                "wrap"
                                        }}
                                    >

                                        {image ? (

                                            <img
                                                src={getImageUrl(
                                                    image
                                                )}
                                                alt={
                                                    item.title
                                                }
                                                style={{
                                                    width:
                                                        "90px",
                                                    height:
                                                        "90px",
                                                    objectFit:
                                                        "cover",
                                                    borderRadius:
                                                        "8px"
                                                }}
                                            />

                                        ) : (

                                            <div
                                                style={{
                                                    width:
                                                        "90px",
                                                    height:
                                                        "90px",
                                                    display:
                                                        "flex",
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

                                                <Package
                                                    size={30}
                                                />

                                            </div>

                                        )}


                                        <div
                                            style={{
                                                flex: 1,
                                                minWidth:
                                                    "180px"
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    margin:
                                                        "0 0 6px"
                                                }}
                                            >
                                                {item.title}
                                            </h3>

                                            <p
                                                style={{
                                                    margin:
                                                        "0 0 5px",
                                                    color:
                                                        "#6b7280"
                                                }}
                                            >

                                                Quantity:{" "}

                                                <strong>
                                                    {item.quantity}
                                                </strong>

                                            </p>

                                            <p
                                                style={{
                                                    margin:
                                                        "0 0 5px",
                                                    color:
                                                        "#6b7280"
                                                }}
                                            >

                                                Unit price:{" "}

                                                <strong>
                                                    {formatPrice(
                                                        item.unitPrice
                                                    )}
                                                </strong>

                                            </p>

                                            <div
                                                style={{
                                                    display:
                                                        "inline-flex",
                                                    padding:
                                                        "4px 9px",
                                                    borderRadius:
                                                        "999px",
                                                    background:
                                                        "#eff6ff",
                                                    color:
                                                        "#1d4ed8",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        700
                                                }}
                                            >

                                                {
                                                    statusLabels[
                                                        item.status
                                                    ]
                                                }

                                            </div>

                                        </div>


                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                fontWeight:
                                                    700,
                                                fontSize:
                                                    "16px"
                                            }}
                                        >

                                            {formatPrice(
                                                item.subtotal
                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </section>


                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px"
                    }}
                >

                    <section
                        className="listing-form-card"
                    >

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "16px"
                            }}
                        >

                            <CreditCard
                                size={21}
                            />

                            <h2
                                style={{
                                    margin: 0
                                }}
                            >
                                Payment
                            </h2>

                        </div>


                        <p>
                            <strong>
                                Method:
                            </strong>{" "}
                            {paymentMethodLabel(
                                order.paymentMethod
                            )}
                        </p>

                        <p
                            style={{
                                marginBottom: 0
                            }}
                        >
                            <strong>
                                Status:
                            </strong>{" "}

                            {paymentStatusLabel(
                                order.paymentStatus
                            )}

                        </p>

                    </section>


                    {/* =================================================
                        BUYER / DELIVERY
                    ================================================= */}

                    <section
                        className="listing-form-card"
                    >

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "16px"
                            }}
                        >

                            <User
                                size={21}
                            />

                            <h2
                                style={{
                                    margin: 0
                                }}
                            >
                                Customer Details
                            </h2>

                        </div>


                        <p>

                            <strong>
                                Buyer ID:
                            </strong>{" "}

                            {order.buyerId}

                        </p>


                        <p
                            style={{
                                display: "flex",
                                gap: "7px",
                                alignItems: "flex-start"
                            }}
                        >

                            <Phone
                                size={17}
                                style={{
                                    marginTop: "2px",
                                    flexShrink: 0
                                }}
                            />

                            <span>
                                {order.phone}
                            </span>

                        </p>


                        <p
                            style={{
                                display: "flex",
                                gap: "7px",
                                alignItems: "flex-start"
                            }}
                        >

                            <MapPin
                                size={17}
                                style={{
                                    marginTop: "2px",
                                    flexShrink: 0
                                }}
                            />

                            <span>
                                {order.deliveryAddress}
                            </span>

                        </p>


                        {order.note && (

                            <p>

                                <strong>
                                    Customer Note:
                                </strong>{" "}

                                {order.note}

                            </p>

                        )}

                    </section>


                    {/* =================================================
                        ORDER TOTAL
                    ================================================= */}

                    <section
                        className="listing-form-card"
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
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                marginBottom:
                                    "10px"
                            }}
                        >

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                {formatPrice(
                                    order.subtotal
                                )}
                            </strong>

                        </div>


                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                marginBottom:
                                    "10px"
                            }}
                        >

                            <span>
                                Delivery
                            </span>

                            <strong>
                                {formatPrice(
                                    order.deliveryFee
                                )}
                            </strong>

                        </div>


                        <hr
                            style={{
                                border: 0,
                                borderTop:
                                    "1px solid #e5e7eb",
                                margin:
                                    "14px 0"
                            }}
                        />


                        <div
                            style={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                fontSize:
                                    "18px"
                            }}
                        >

                            <strong>
                                Total
                            </strong>

                            <strong>
                                {formatPrice(
                                    order.total
                                )}
                            </strong>

                        </div>

                    </section>

                </div>

            </div>

        </main>

    );

}