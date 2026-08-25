import type {
    OrderPaymentMethod
} from "@prisma/client";

import type {
    MarketplacePaymentProvider,
    InitializeMarketplacePaymentInput,
    InitializeMarketplacePaymentResult,
    VerifyMarketplacePaymentResult
} from "../marketplace-payment.provider.js";

// =====================================
// FLUTTERWAVE CONFIGURATION
// =====================================

const FLUTTERWAVE_SECRET_KEY =
    process.env.FLUTTERWAVE_SECRET_KEY;

const FLUTTERWAVE_API_BASE_URL =
    "https://api.flutterwave.com/v3";

// =====================================
// FLUTTERWAVE API RESPONSE TYPES
// =====================================

interface FlutterwaveInitializeResponse {

    status?: string;

    message?: string;

    data?: {

        link?: string;

    };

}

interface FlutterwaveVerifyResponse {

    status?: string;

    message?: string;

    data?: {

        id?: number;

        tx_ref?: string;

        flw_ref?: string;

        amount?: number;

        charged_amount?: number;

        amount_settled?: number;

        currency?: string;

        status?: string;

        payment_type?: string;

        processor_response?: string;

        customer?: {

            id?: number;

            name?: string;

            email?: string;

            phone_number?: string;

        };

    };

}

interface FlutterwaveErrorResponse {

    status?: string;

    message?: string;

    data?: unknown;

}

// =====================================
// SECRET KEY
// =====================================

function getFlutterwaveSecretKey(): string {

    if (
        !FLUTTERWAVE_SECRET_KEY ||
        !FLUTTERWAVE_SECRET_KEY.trim()
    ) {

        throw new Error(
            "FLUTTERWAVE_SECRET_KEY is not configured"
        );

    }

    return FLUTTERWAVE_SECRET_KEY.trim();
}

// =====================================
// REQUEST HEADERS
// =====================================

function getFlutterwaveHeaders() {

    const key =
        getFlutterwaveSecretKey();

    console.log(
        "FLUTTERWAVE KEY USED:",
        key.substring(0,12),
        "...",
        key.length
    );


    return {

        "Content-Type":
            "application/json",

        Authorization:
            `Bearer ${key}`

    };

}

// =====================================
// SAFE JSON READER
// =====================================

async function readJsonResponse<T>(
    response: Response
): Promise<T | null> {

    try {

        return await response.json() as T;

    }

    catch {

        return null;

    }

}

// =====================================
// ERROR MESSAGE
// =====================================

function getFlutterwaveErrorMessage(
    data: FlutterwaveErrorResponse | null,
    fallback: string
): string {

    if (
        data &&
        typeof data.message === "string" &&
        data.message.trim()
    ) {

        return data.message.trim();

    }

    return fallback;
}

// =====================================
// NORMALIZE AMOUNT
// =====================================

function normalizeAmount(
    amount: unknown
): number | undefined {

    if (
        typeof amount === "number" &&
        Number.isFinite(amount)
    ) {

        return amount;

    }

    if (
        typeof amount === "string" &&
        amount.trim() !== ""
    ) {

        const parsed =
            Number(amount);

        if (
            Number.isFinite(parsed)
        ) {

            return parsed;

        }

    }

    return undefined;
}

// =====================================
// NORMALIZE STATUS
// =====================================

function normalizeTransactionStatus(
    status: unknown
):
    | "PENDING"
    | "SUCCESSFUL"
    | "FAILED"
{

    const normalized =
        typeof status === "string"
            ? status.trim().toLowerCase()
            : "";

    if (
        normalized === "successful" ||
        normalized === "succeeded"
    ) {

        return "SUCCESSFUL";

    }

    if (
        normalized === "failed" ||
        normalized === "cancelled" ||
        normalized === "canceled"
    ) {

        return "FAILED";

    }

    return "PENDING";
}

// =====================================
// FLUTTERWAVE PROVIDER
// =====================================

export const flutterwaveMarketplaceProvider:
    MarketplacePaymentProvider = {

    name:
        "FLUTTERWAVE" as OrderPaymentMethod,

    // =================================
    // INITIALIZE
    // =================================

    async initialize(
        input: InitializeMarketplacePaymentInput
    ): Promise<InitializeMarketplacePaymentResult> {

        getFlutterwaveSecretKey();

        if (
            !Number.isFinite(input.amount) ||
            input.amount <= 0
        ) {

            throw new Error(
                "Invalid Flutterwave payment amount"
            );

        }

        if (
            !input.currency ||
            !input.currency.trim()
        ) {

            throw new Error(
                "Payment currency is required"
            );

        }

        if (
            !input.email ||
            !input.email.trim()
        ) {

            throw new Error(
                "Customer email is required for Flutterwave payment"
            );

        }

        if (
            !input.transactionId ||
            !input.transactionId.trim()
        ) {

            throw new Error(
                "Marketplace transaction ID is required"
            );

        }

        if (
            !input.orderId ||
            !input.orderId.trim()
        ) {

            throw new Error(
                "Marketplace order ID is required"
            );

        }

        // =================================
        // FLUTTERWAVE STANDARD CHECKOUT
        // =================================

        const response =
            await fetch(

                `${FLUTTERWAVE_API_BASE_URL}/payments`,

                {

                    method:
                        "POST",

                    headers:
                        getFlutterwaveHeaders(),

                    body:
                        JSON.stringify({

                            tx_ref:
                                input.transactionId,

                            amount:
                                input.amount,

                            currency:
                                input.currency
                                    .trim()
                                    .toUpperCase(),

                            redirect_url:
                                input.callbackUrl,

                            customer: {

                                email:
                                    input.email.trim()

                            },

                            meta: {

                                marketplace:
                                    "OBAARATECH",

                                transactionId:
                                    input.transactionId,

                                orderId:
                                    input.orderId,

                                userId:
                                    input.userId

                            },

                            customizations: {

                                title:
                                    "Obaaratech Community Market",

                                description:
                                    `Payment for marketplace order ${input.orderId}`

                            },

                            configurations: {

                                session_duration:
                                    30,

                                max_retry_attempt:
                                    5

                            }

                        })

                }

            );

        const data =
            await readJsonResponse<
                FlutterwaveInitializeResponse &
                FlutterwaveErrorResponse
            >(
                response
            );

        if (
            !response.ok ||
            data?.status !== "success" ||
            !data?.data?.link
        ) {

            throw new Error(

                getFlutterwaveErrorMessage(

                    data,

                    "Flutterwave marketplace payment initialization failed"

                )

            );

        }

        return {

            success:
                true,

            provider:
                "FLUTTERWAVE",

            reference:
                input.transactionId,

            checkoutUrl:
                data.data.link,

            authorizationUrl:
                data.data.link,

            metadata: {

                marketplace:
                    "OBAARATECH",

                transactionId:
                    input.transactionId,

                orderId:
                    input.orderId,

                userId:
                    input.userId

            }

        };

    },

    // =================================
    // VERIFY
    // =================================

    async verify(
        reference: string
    ): Promise<VerifyMarketplacePaymentResult> {

        getFlutterwaveSecretKey();

        if (
            !reference ||
            !reference.trim()
        ) {

            throw new Error(
                "Flutterwave transaction reference is required"
            );

        }

        const transactionReference =
            reference.trim();

        // =================================
        // VERIFY BY MERCHANT REFERENCE
        // =================================

        const url =
            new URL(

                `${FLUTTERWAVE_API_BASE_URL}/transactions/verify_by_reference`

            );

        url.searchParams.set(
            "tx_ref",
            transactionReference
        );

        const response =
            await fetch(

                url.toString(),

                {

                    method:
                        "GET",

                    headers:
                        getFlutterwaveHeaders()

                }

            );

        const data =
            await readJsonResponse<
                FlutterwaveVerifyResponse &
                FlutterwaveErrorResponse
            >(
                response
            );

        if (
            !response.ok ||
            data?.status !== "success" ||
            !data?.data
        ) {

            throw new Error(

                getFlutterwaveErrorMessage(

                    data,

                    "Flutterwave marketplace payment verification failed"

                )

            );

        }

        const flutterwaveTransaction =
            data.data;

        // =================================
        // VERIFY TX REF
        // =================================

        const returnedReference =
            flutterwaveTransaction.tx_ref;

        if (
            !returnedReference
        ) {

            throw new Error(
                "Flutterwave verification response does not contain tx_ref"
            );

        }

        if (
            returnedReference !==
            transactionReference
        ) {

            throw new Error(
                "Flutterwave transaction reference does not match the marketplace transaction"
            );

        }

        // =================================
        // STATUS
        // =================================

        const status =
            normalizeTransactionStatus(
                flutterwaveTransaction.status
            );

        // =================================
        // AMOUNT
        // =================================

        const amount =
            normalizeAmount(
                flutterwaveTransaction.amount
            );

        // =================================
        // CURRENCY
        // =================================

        const currency =
            typeof flutterwaveTransaction.currency ===
            "string"

                ? flutterwaveTransaction.currency
                    .trim()
                    .toUpperCase()

                : undefined;

        // =================================
        // RETURN
        // =================================

        return {

            success:
                status === "SUCCESSFUL",

            provider:
                "FLUTTERWAVE",

            reference:
                returnedReference,

            status,

            amount,

            currency,

            metadata: {

                flutterwaveTransactionId:
                    flutterwaveTransaction.id,

                flutterwaveReference:
                    flutterwaveTransaction.flw_ref,

                paymentType:
                    flutterwaveTransaction.payment_type,

                processorResponse:
                    flutterwaveTransaction.processor_response,

                chargedAmount:
                    normalizeAmount(
                        flutterwaveTransaction.charged_amount
                    ),

                amountSettled:
                    normalizeAmount(
                        flutterwaveTransaction.amount_settled
                    )

            }

        };

    }

};