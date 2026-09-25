import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useParams,
    useSearchParams
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Loader2,
    RefreshCw,
    ShieldCheck,
    XCircle,
    Clock,
    CreditCard,
    AlertCircle
} from "lucide-react";

import {
    getMarketplaceTransactionByOrder,
    verifyMarketplacePayment
} from "../api/marketplace-payment";


// =====================================================
// PAYMENT CALLBACK STATUS
// =====================================================

type PaymentCallbackStatus =
    | "loading"
    | "success"
    | "pending"
    | "failed";


// =====================================================
// PAYMENT CALLBACK PAGE
// =====================================================

export default function PaymentCallback() {

    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();
    const [searchParams] = useSearchParams();

    // =================================================
    // STATE
    // =================================================

    const [status, setStatus] = useState<PaymentCallbackStatus>("loading");
    const [message, setMessage] = useState(
        "Please wait while we confirm your payment."
    );
    const [transactionReference, setTransactionReference] = useState("");
    const [isRetrying, setIsRetrying] = useState(false);

    // =================================================
    // PREVENT DUPLICATE VERIFICATION
    // =================================================

    const verificationStarted = useRef(false);

    // =================================================
    // READ FLUTTERWAVE CALLBACK REFERENCE
    // =================================================

    const callbackReference =
        searchParams.get("tx_ref") ||
        searchParams.get("transaction_id") ||
        searchParams.get("reference") ||
        "";

    // =================================================
    // VERIFY PAYMENT
    // =================================================

    const verifyPayment = useCallback(
        async (retry = false) => {

            if (!orderId) {
                setStatus("failed");
                setMessage(
                    "The order ID is missing from the payment callback. We cannot verify this payment."
                );
                return;
            }

            if (retry) {
                setIsRetrying(true);
            } else {
                setStatus("loading");
            }

            setMessage(
                "Please wait while we securely verify your payment."
            );

            try {

                // =================================
                // GET TRANSACTION
                // =================================

                const transaction = await getMarketplaceTransactionByOrder(orderId);

                if (!transaction) {
                    throw new Error(
                        "Payment transaction could not be found for this order."
                    );
                }

                // =================================
                // SAVE REFERENCE
                // =================================

                const reference =
                    transaction.transactionReference ||
                    transaction.providerReference ||
                    callbackReference ||
                    "";

                setTransactionReference(reference);

                // =================================
                // ALREADY SUCCESSFUL
                // =================================

                if (transaction.status === "SUCCESSFUL") {
                    setStatus("success");
                    setMessage(
                        "Your payment has already been confirmed successfully. Your order is now being processed."
                    );
                    return;
                }

                // =================================
                // ALREADY REFUNDED
                // =================================

                if (transaction.status === "REFUNDED") {
                    setStatus("failed");
                    setMessage(
                        "This payment has been refunded. Please contact Obaaratech Marketplace support if you believe this is incorrect."
                    );
                    return;
                }

                // =================================
                // VERIFY PAYMENT
                // =================================

                const verification = await verifyMarketplacePayment({
                    transactionId: transaction.id,
                    reference: reference || undefined
                });

                // =================================
                // SUCCESS
                // =================================

                if (verification.status === "SUCCESSFUL") {
                    setStatus("success");
                    setMessage(
                        "Your payment was successfully verified. Your order has been confirmed."
                    );
                    return;
                }

                // =================================
                // PENDING
                // =================================

                if (verification.status === "PENDING") {
                    setStatus("pending");
                    setMessage(
                        "Your payment has not been fully confirmed yet. This can happen when the payment provider is still processing the transaction."
                    );
                    return;
                }

                // =================================
                // FAILED
                // =================================

                setStatus("failed");
                setMessage(
                    "Flutterwave could not confirm this payment. Please check your payment status or return to the order and try again."
                );

            } catch (requestError: any) {
                console.error("Payment verification error:", requestError);
                console.error("Payment verification response:", requestError?.response?.data);

                const serverMessage = requestError?.response?.data?.message;

                setStatus("failed");
                setMessage(
                    serverMessage ||
                    requestError?.message ||
                    "We were unable to verify your payment at this time. Please try again."
                );

            } finally {
                setIsRetrying(false);
            }

        },
        [orderId, callbackReference]
    );

    // =================================================
    // INITIAL PAYMENT VERIFICATION
    // =================================================

    useEffect(() => {

        if (verificationStarted.current) return;

        verificationStarted.current = true;

        verifyPayment();

    }, [verifyPayment]);

    // =================================================
    // SUCCESS AUTO REDIRECT
    // =================================================

    useEffect(() => {

        if (status !== "success") return;

        const timer = window.setTimeout(() => {

            if (!orderId) return;

            navigate(`/orders/${orderId}`, {
                replace: true,
                state: { paymentVerified: true }
            });

        }, 3000);

        return () => {
            window.clearTimeout(timer);
        };

    }, [status, orderId, navigate]);

    // =================================================
    // HANDLERS
    // =================================================

    function handleRetry() {
        if (isRetrying) return;
        verifyPayment(true);
    }

    function handleViewOrder() {
        if (!orderId) {
            navigate("/orders");
            return;
        }
        navigate(`/orders/${orderId}`);
    }

    function handleBackToCheckout() {
        navigate("/checkout");
    }

    // =================================================
    // STATUS ICON
    // =================================================

    function renderStatusIcon() {

        if (status === "success") {
            return (
                <div className="payment-callback-icon success">
                    <CheckCircle2 size={48} />
                </div>
            );
        }

        if (status === "pending") {
            return (
                <div className="payment-callback-icon pending">
                    <Clock size={48} />
                </div>
            );
        }

        if (status === "failed") {
            return (
                <div className="payment-callback-icon failed">
                    <XCircle size={48} />
                </div>
            );
        }

        return (
            <div className="payment-callback-icon loading">
                <Loader2 size={48} className="spinning" />
            </div>
        );

    }

    // =================================================
    // STATUS COLOR
    // =================================================

    function getStatusColor() {
        switch (status) {
            case "success": return "#15803d";
            case "pending": return "#b45309";
            case "failed": return "#b91c1c";
            default: return "#1d4ed8";
        }
    }

    // =================================================
    // PAGE
    // =================================================

    return (

        <div className="payment-callback-page">

            <div className="payment-callback-container">

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="payment-callback-back"
                    onClick={handleBackToCheckout}
                    disabled={status === "loading"}
                >
                    <ArrowLeft size={18} />
                    Back to Checkout
                </button>

                {/* =================================================
                    MAIN CARD
                ================================================= */}

                <div className="payment-callback-card">

                    {/* Status Icon */}
                    {renderStatusIcon()}

                    {/* Title */}
                    <h1 className="payment-callback-title" style={{ color: getStatusColor() }}>
                        {status === "success" && "Payment Successful ✅"}
                        {status === "pending" && "Payment Processing ⏳"}
                        {status === "failed" && "Payment Verification Failed ❌"}
                        {status === "loading" && "Verifying Payment..."}
                    </h1>

                    {/* Message */}
                    <p className="payment-callback-message">
                        {message}
                    </p>

                    {/* Success Info */}
                    {status === "success" && (
                        <div className="payment-callback-info success">
                            <CheckCircle2 size={16} />
                            <span>Order payment confirmed. You will be redirected shortly.</span>
                        </div>
                    )}

                    {/* Pending Info */}
                    {status === "pending" && (
                        <div className="payment-callback-info pending">
                            <AlertCircle size={16} />
                            <span>Please do not make another payment yet. The payment provider may still be processing.</span>
                        </div>
                    )}

                    {/* Transaction Reference */}
                    {transactionReference && (
                        <div className="payment-callback-reference">
                            <span className="payment-callback-reference-label">
                                Payment Reference
                            </span>
                            <span className="payment-callback-reference-value">
                                {transactionReference}
                            </span>
                        </div>
                    )}

                    {/* Actions */}
                    {status !== "loading" && (
                        <div className="payment-callback-actions">

                            <button
                                type="button"
                                className="payment-callback-action primary"
                                onClick={handleViewOrder}
                            >
                                View Order
                            </button>

                            {(status === "pending" || status === "failed") && (
                                <button
                                    type="button"
                                    className="payment-callback-action secondary"
                                    onClick={handleRetry}
                                    disabled={isRetrying}
                                >
                                    {isRetrying ? (
                                        <>
                                            <Loader2 size={16} className="spinning" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw size={16} />
                                            Retry Verification
                                        </>
                                    )}
                                </button>
                            )}

                        </div>
                    )}

                    {/* Failed Extra Help */}
                    {status === "failed" && (
                        <div className="payment-callback-help">
                            <p>
                                If money was deducted from your account, please don't pay again.
                                Retry verification first or check your order status.
                            </p>
                            <button
                                type="button"
                                className="payment-callback-help-link"
                                onClick={handleViewOrder}
                            >
                                Check Order Status →
                            </button>
                        </div>
                    )}

                </div>

                {/* =================================================
                    SECURITY MESSAGE
                ================================================= */}

                <div className="payment-callback-security">
                    <ShieldCheck size={16} />
                    <span>
                        Payment verification is handled securely by the Obaaratech Marketplace
                        payment system. Your card details are not stored.
                    </span>
                </div>

                {/* =================================================
                    RETRY STATUS
                ================================================= */}

                {isRetrying && (
                    <div className="payment-callback-retrying">
                        <Loader2 size={14} className="spinning" />
                        Checking the payment provider...
                    </div>
                )}

            </div>

        </div>

    );

}