import type {
    Currency,
    OrderPaymentMethod,
} from "@prisma/client";

// =====================================
// MARKETPLACE PAYMENT TYPES
// =====================================

export interface InitializeMarketplacePaymentInput {
    transactionId: string;

    orderId: string;

    userId: string;

    email: string;

    amount: number;

    currency: Currency;

    paymentMethod: OrderPaymentMethod;

    callbackUrl?: string;
}

// =====================================
// INITIALIZE RESULT
// =====================================

export interface InitializeMarketplacePaymentResult {
    success: boolean;

    provider: OrderPaymentMethod;

    reference: string;

    checkoutUrl?: string;

    authorizationUrl?: string;

    message?: string;

    metadata?: Record<string, unknown>;
}

// =====================================
// VERIFY RESULT
// =====================================

export interface VerifyMarketplacePaymentResult {
    success: boolean;

    provider: OrderPaymentMethod;

    reference: string;

    status:
        | "PENDING"
        | "SUCCESSFUL"
        | "FAILED";

    amount?: number;

    currency?: Currency;

    metadata?: Record<string, unknown>;
}

// =====================================
// MARKETPLACE PAYMENT PROVIDER
// =====================================

export interface MarketplacePaymentProvider {
    readonly name: OrderPaymentMethod;

    initialize(
        input: InitializeMarketplacePaymentInput
    ): Promise<InitializeMarketplacePaymentResult>;

    verify(
        reference: string
    ): Promise<VerifyMarketplacePaymentResult>;
}