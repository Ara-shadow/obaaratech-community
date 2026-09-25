import type {
    PaymentProvider,
    InitializePaymentInput,
    InitializePaymentResult,
    VerifyPaymentResult
} from "../payment.provider.js";

const FLUTTERWAVE_SECRET_KEY =
    process.env.FLUTTERWAVE_SECRET_KEY;

export const flutterwaveProvider: PaymentProvider = {

    name: "FLUTTERWAVE",

    async initialize(
        input: InitializePaymentInput
    ): Promise<InitializePaymentResult> {

        if (!FLUTTERWAVE_SECRET_KEY) {
            throw new Error(
                "FLUTTERWAVE_SECRET_KEY is not configured"
            );
        }

        const response = await fetch(
            "https://api.flutterwave.com/v3/payments",
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${FLUTTERWAVE_SECRET_KEY}`,

                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    tx_ref:
                        input.paymentId,

                    amount:
                        input.amount,

                    currency:
                        input.currency,

                    redirect_url:
                        input.callbackUrl,

                    customer: {
                        email:
                            input.email
                    },

                    meta: {

                        paymentId:
                            input.paymentId,

                        userId:
                            input.userId,

                        planId:
                            input.planId

                    }

                })

            }
        );

        const data =
            await response.json() as {

                status?: string;

                message?: string;

                data?: {

                    link?: string;

                };

            };


        if (
            !response.ok ||
            data.status !== "success" ||
            !data.data?.link
        ) {

            throw new Error(
                data.message ||
                "Flutterwave initialization failed"
            );

        }


        return {

            success: true,

            provider: "FLUTTERWAVE",

            reference:
                input.paymentId,

            checkoutUrl:
                data.data.link,

            authorizationUrl:
                data.data.link

        };

    },


    async verify(
        reference: string
    ): Promise<VerifyPaymentResult> {

        if (!FLUTTERWAVE_SECRET_KEY) {

            throw new Error(
                "FLUTTERWAVE_SECRET_KEY is not configured"
            );

        }


        const url =
            new URL(
                "https://api.flutterwave.com/v3/transactions/verify_by_reference"
            );


        url.searchParams.set(
            "tx_ref",
            reference
        );


        const response =
            await fetch(

                url.toString(),

                {

                    method: "GET",

                    headers: {

                        Authorization:
                            `Bearer ${FLUTTERWAVE_SECRET_KEY}`,

                        "Content-Type":
                            "application/json"

                    }

                }

            );


        const data =
            await response.json() as {

                status?: string;

                message?: string;

                data?: {

                    id?: number;

                    tx_ref?: string;

                    amount?: number;

                    currency?: string;

                    status?: string;

                };

            };


        if (
            !response.ok ||
            data.status !== "success" ||
            !data.data
        ) {

            throw new Error(
                data.message ||
                "Flutterwave verification failed"
            );

        }


        let status:
            | "PENDING"
            | "APPROVED"
            | "REJECTED" =
            "PENDING";


        const transactionStatus =
            data.data.status?.toLowerCase();


        if (
            transactionStatus === "successful"
        ) {

            status = "APPROVED";

        } else if (

            transactionStatus === "failed" ||

            transactionStatus === "cancelled"

        ) {

            status = "REJECTED";

        }


        return {

            success:
                status === "APPROVED",

            provider:
                "FLUTTERWAVE",

            reference:
                data.data.tx_ref ||
                reference,

            status,

            amount:
                data.data.amount,

            currency:
                data.data.currency

        };

    }

};
