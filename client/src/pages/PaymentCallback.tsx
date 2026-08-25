import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    CheckCircle,
    Loader2,
    XCircle
} from "lucide-react";

import {
    getMarketplaceTransactionByOrder,
    verifyMarketplacePayment
} from "../api/marketplace-payment";


export default function PaymentCallback() {

    const {
        orderId
    } = useParams();


    const navigate =
        useNavigate();


    const [
        status,
        setStatus
    ] = useState<
        "loading" | "success" | "failed"
    >("loading");


    const [
        message,
        setMessage
    ] = useState("");


    useEffect(() => {

        async function verifyPayment() {

            try {

                if (!orderId) {

                    throw new Error(
                        "Order ID missing"
                    );

                }


                // =====================================
                // GET TRANSACTION FOR THIS ORDER
                // =====================================

                const transaction =
                    await getMarketplaceTransactionByOrder(
                        orderId
                    );


                if (!transaction) {

                    throw new Error(
                        "Payment transaction not found"
                    );

                }


                // =====================================
                // VERIFY PAYMENT
                // =====================================

                const result =
                    await verifyMarketplacePayment({

                        transactionId:
                            transaction.id

                    });


                if (
                    result.status ===
                    "SUCCESSFUL"
                ) {

                    setStatus(
                        "success"
                    );

                    setMessage(
                        "Your payment was successful. Your order has been confirmed."
                    );


                    setTimeout(() => {

                        navigate(
                            `/orders/${orderId}`
                        );

                    }, 3000);


                } else {

                    setStatus(
                        "failed"
                    );

                    setMessage(
                        "Payment is not completed yet. Please try again."
                    );

                }


            } catch (error: any) {

                console.error(
                    "Payment verification error:",
                    error
                );


                setStatus(
                    "failed"
                );


                setMessage(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to verify payment."
                );

            }

        }


        verifyPayment();


    }, [
        orderId,
        navigate
    ]);



    return (

        <main
            className="page-container"
        >

            <div
                className="empty-state"
            >

                {
                    status === "loading" && (

                        <>

                            <Loader2
                                size={55}
                                className="spinning"
                            />

                            <h2>
                                Verifying Payment...
                            </h2>

                            <p>
                                Please wait while we confirm your Flutterwave payment.
                            </p>

                        </>

                    )
                }


                {
                    status === "success" && (

                        <>

                            <CheckCircle
                                size={60}
                            />

                            <h2>
                                Payment Successful
                            </h2>

                            <p>
                                {message}
                            </p>

                        </>

                    )
                }


                {
                    status === "failed" && (

                        <>

                            <XCircle
                                size={60}
                            />

                            <h2>
                                Payment Verification Failed
                            </h2>

                            <p>
                                {message}
                            </p>


                            <button
                                className="create-listing-button"
                                onClick={() =>
                                    navigate(
                                        `/orders/${orderId}`
                                    )
                                }
                            >

                                View Order

                            </button>

                        </>

                    )
                }

            </div>

        </main>

    );

}