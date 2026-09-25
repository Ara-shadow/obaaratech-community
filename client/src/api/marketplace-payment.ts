import api from "./axios";

// =====================================================
// PAYMENT PROVIDER
// =====================================================

export type MarketplacePaymentProvider =
    | "FLUTTERWAVE";

// =====================================================
// PAYMENT METHOD
// =====================================================

export type MarketplacePaymentMethod =
    | "FLUTTERWAVE";

// =====================================================
// TRANSACTION STATUS
// =====================================================

export type MarketplaceTransactionStatus =
    | "PENDING"
    | "SUCCESSFUL"
    | "FAILED"
    | "REFUNDED";

// =====================================================
// INITIALIZE PAYMENT INPUT
// =====================================================

export interface InitializeMarketplacePaymentInput {
    orderId: string;

    email: string;

    paymentMethod: MarketplacePaymentMethod;

    callbackUrl?: string;
}

// =====================================================
// INITIALIZE PAYMENT RESPONSE
// =====================================================

export interface InitializeMarketplacePaymentResponse {
    success: boolean;

    transactionId: string;

    orderId: string;

    orderNumber: string;

    amount: number;

    currency: string;

    provider: MarketplacePaymentProvider;

    reference: string;

    checkoutUrl?: string | null;

    authorizationUrl?: string | null;

    metadata?: Record<
        string,
        unknown
    > | null;
}

// =====================================================
// VERIFY PAYMENT INPUT
// =====================================================

export interface VerifyMarketplacePaymentInput {
    transactionId: string;

    reference?: string;
}

// =====================================================
// VERIFY PAYMENT RESPONSE
// =====================================================

export interface VerifyMarketplacePaymentResponse {
    success: boolean;

    transactionId: string;

    orderId: string;

    status: MarketplaceTransactionStatus;

    reference?: string | null;
}

// =====================================================
// MARKETPLACE TRANSACTION
// =====================================================

export interface MarketplaceTransaction {
    id: string;

    orderId: string;

    amount: number;

    currency: string;

    paymentMethod:
        | "CASH_ON_DELIVERY"
        | "BANK_TRANSFER"
        | "FLUTTERWAVE";

    provider?: string | null;

    providerReference?: string | null;

    transactionReference?: string | null;

    status: MarketplaceTransactionStatus;

    metadata?: Record<
        string,
        unknown
    > | null;

    verifiedAt?: string | null;

    paidAt?: string | null;

    createdAt: string;

    updatedAt: string;
}

// =====================================================
// INITIALIZE MARKETPLACE PAYMENT
// =====================================================

export async function initializeMarketplacePayment(
    input: InitializeMarketplacePaymentInput
): Promise<InitializeMarketplacePaymentResponse> {

    if (!input.orderId?.trim()) {
        throw new Error(
            "Order ID is required."
        );
    }

    if (!input.email?.trim()) {
        throw new Error(
            "Customer email is required."
        );
    }

    if (
        input.paymentMethod !==
        "FLUTTERWAVE"
    ) {
        throw new Error(
            "Unsupported payment method."
        );
    }

    const response =
        await api.post<
            InitializeMarketplacePaymentResponse
        >(
            "/marketplace/payments/initialize",
            input
        );

    if (
        !response.data ||
        !response.data.transactionId
    ) {
        throw new Error(
            "The server did not return a valid payment transaction."
        );
    }

    return response.data;
}

// =====================================================
// VERIFY MARKETPLACE PAYMENT
// =====================================================

export async function verifyMarketplacePayment(
    input: VerifyMarketplacePaymentInput
): Promise<VerifyMarketplacePaymentResponse> {

    if (!input.transactionId?.trim()) {
        throw new Error(
            "Transaction ID is required."
        );
    }

    const response =
        await api.post<
            VerifyMarketplacePaymentResponse
        >(
            "/marketplace/payments/verify",
            input
        );

    if (
        !response.data ||
        !response.data.transactionId
    ) {
        throw new Error(
            "The server did not return a valid payment verification response."
        );
    }

    return response.data;
}

// =====================================================
// GET TRANSACTION
// =====================================================

export async function getMarketplaceTransaction(
    transactionId: string
): Promise<MarketplaceTransaction> {

    if (!transactionId?.trim()) {
        throw new Error(
            "Transaction ID is required."
        );
    }

    const response =
        await api.get<{
            success: boolean;
            transaction: MarketplaceTransaction;
        }>(
            `/marketplace/payments/transactions/${encodeURIComponent(
                transactionId
            )}`
        );

    if (
        !response.data?.transaction
    ) {
        throw new Error(
            "The server did not return the payment transaction."
        );
    }

    return response.data.transaction;
}

// =====================================================
// GET TRANSACTION BY ORDER
// =====================================================

export async function getMarketplaceTransactionByOrder(
    orderId: string
): Promise<MarketplaceTransaction> {

    if (!orderId?.trim()) {
        throw new Error(
            "Order ID is required."
        );
    }

    const response =
        await api.get<{
            success: boolean;
            data: MarketplaceTransaction;
        }>(
            `/marketplace/payments/orders/${encodeURIComponent(
                orderId
            )}/transaction`
        );

    if (
        !response.data?.data
    ) {
        throw new Error(
            "The server did not return the order payment transaction."
        );
    }

    return response.data.data;
}