// =====================================
// FLUTTERWAVE CONFIGURATION
// =====================================
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLUTTERWAVE_API_BASE_URL = "https://api.flutterwave.com/v3";
// =====================================
// SECRET KEY
// =====================================
function getFlutterwaveSecretKey() {
    if (!FLUTTERWAVE_SECRET_KEY ||
        !FLUTTERWAVE_SECRET_KEY.trim()) {
        throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
    }
    return FLUTTERWAVE_SECRET_KEY.trim();
}
// =====================================
// REQUEST HEADERS
// =====================================
function getFlutterwaveHeaders() {
    const key = getFlutterwaveSecretKey();
    console.log("FLUTTERWAVE KEY USED:", key.substring(0, 12), "...", key.length);
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`
    };
}
// =====================================
// SAFE JSON READER
// =====================================
async function readJsonResponse(response) {
    try {
        return await response.json();
    }
    catch {
        return null;
    }
}
// =====================================
// ERROR MESSAGE
// =====================================
function getFlutterwaveErrorMessage(data, fallback) {
    if (data &&
        typeof data.message === "string" &&
        data.message.trim()) {
        return data.message.trim();
    }
    return fallback;
}
// =====================================
// NORMALIZE AMOUNT
// =====================================
function normalizeAmount(amount) {
    if (typeof amount === "number" &&
        Number.isFinite(amount)) {
        return amount;
    }
    if (typeof amount === "string" &&
        amount.trim() !== "") {
        const parsed = Number(amount);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return undefined;
}
// =====================================
// NORMALIZE STATUS
// =====================================
function normalizeTransactionStatus(status) {
    const normalized = typeof status === "string"
        ? status.trim().toLowerCase()
        : "";
    if (normalized === "successful" ||
        normalized === "succeeded") {
        return "SUCCESSFUL";
    }
    if (normalized === "failed" ||
        normalized === "cancelled" ||
        normalized === "canceled") {
        return "FAILED";
    }
    return "PENDING";
}
// =====================================
// FLUTTERWAVE PROVIDER
// =====================================
export const flutterwaveMarketplaceProvider = {
    name: "FLUTTERWAVE",
    // =================================
    // INITIALIZE
    // =================================
    async initialize(input) {
        getFlutterwaveSecretKey();
        if (!Number.isFinite(input.amount) ||
            input.amount <= 0) {
            throw new Error("Invalid Flutterwave payment amount");
        }
        if (!input.currency ||
            !input.currency.trim()) {
            throw new Error("Payment currency is required");
        }
        if (!input.email ||
            !input.email.trim()) {
            throw new Error("Customer email is required for Flutterwave payment");
        }
        if (!input.transactionId ||
            !input.transactionId.trim()) {
            throw new Error("Marketplace transaction ID is required");
        }
        if (!input.orderId ||
            !input.orderId.trim()) {
            throw new Error("Marketplace order ID is required");
        }
        // =================================
        // FLUTTERWAVE STANDARD CHECKOUT
        // =================================
        const response = await fetch(`${FLUTTERWAVE_API_BASE_URL}/payments`, {
            method: "POST",
            headers: getFlutterwaveHeaders(),
            body: JSON.stringify({
                tx_ref: input.transactionId,
                amount: input.amount,
                currency: input.currency
                    .trim()
                    .toUpperCase(),
                redirect_url: input.callbackUrl,
                customer: {
                    email: input.email.trim()
                },
                meta: {
                    marketplace: "OBAARATECH",
                    transactionId: input.transactionId,
                    orderId: input.orderId,
                    userId: input.userId
                },
                customizations: {
                    title: "Obaaratech Community Market",
                    description: `Payment for marketplace order ${input.orderId}`
                },
                configurations: {
                    session_duration: 30,
                    max_retry_attempt: 5
                }
            })
        });
        const data = await readJsonResponse(response);
        if (!response.ok ||
            data?.status !== "success" ||
            !data?.data?.link) {
            throw new Error(getFlutterwaveErrorMessage(data, "Flutterwave marketplace payment initialization failed"));
        }
        return {
            success: true,
            provider: "FLUTTERWAVE",
            reference: input.transactionId,
            checkoutUrl: data.data.link,
            authorizationUrl: data.data.link,
            metadata: {
                marketplace: "OBAARATECH",
                transactionId: input.transactionId,
                orderId: input.orderId,
                userId: input.userId
            }
        };
    },
    // =================================
    // VERIFY
    // =================================
    async verify(reference) {
        getFlutterwaveSecretKey();
        if (!reference ||
            !reference.trim()) {
            throw new Error("Flutterwave transaction reference is required");
        }
        const transactionReference = reference.trim();
        // =================================
        // VERIFY BY MERCHANT REFERENCE
        // =================================
        const url = new URL(`${FLUTTERWAVE_API_BASE_URL}/transactions/verify_by_reference`);
        url.searchParams.set("tx_ref", transactionReference);
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: getFlutterwaveHeaders()
        });
        const data = await readJsonResponse(response);
        if (!response.ok ||
            data?.status !== "success" ||
            !data?.data) {
            throw new Error(getFlutterwaveErrorMessage(data, "Flutterwave marketplace payment verification failed"));
        }
        const flutterwaveTransaction = data.data;
        // =================================
        // VERIFY TX REF
        // =================================
        const returnedReference = flutterwaveTransaction.tx_ref;
        if (!returnedReference) {
            throw new Error("Flutterwave verification response does not contain tx_ref");
        }
        if (returnedReference !==
            transactionReference) {
            throw new Error("Flutterwave transaction reference does not match the marketplace transaction");
        }
        // =================================
        // STATUS
        // =================================
        const status = normalizeTransactionStatus(flutterwaveTransaction.status);
        // =================================
        // AMOUNT
        // =================================
        const amount = normalizeAmount(flutterwaveTransaction.amount);
        // =================================
        // CURRENCY
        // =================================
        const currency = typeof flutterwaveTransaction.currency ===
            "string"
            ? flutterwaveTransaction.currency
                .trim()
                .toUpperCase()
            : undefined;
        const supportedCurrency = currency === "NGN" ||
            currency === "USD" ||
            currency === "GBP" ||
            currency === "EUR"
            ? currency
            : undefined;
        // =================================
        // RETURN
        // =================================
        return {
            success: status === "SUCCESSFUL",
            provider: "FLUTTERWAVE",
            reference: returnedReference,
            status,
            amount,
            currency: supportedCurrency,
            metadata: {
                flutterwaveTransactionId: flutterwaveTransaction.id,
                flutterwaveReference: flutterwaveTransaction.flw_ref,
                paymentType: flutterwaveTransaction.payment_type,
                processorResponse: flutterwaveTransaction.processor_response,
                chargedAmount: normalizeAmount(flutterwaveTransaction.charged_amount),
                amountSettled: normalizeAmount(flutterwaveTransaction.amount_settled)
            }
        };
    }
};
