import type {
    PaymentMethod
} from "./payment.schema.js";

export type {
    PaymentMethod
};


export interface InitializePaymentInput {

    paymentId: string;

    userId: string;

    email: string;

    amount: number;

    currency: string;

    planId: string;

    planName: string;

    callbackUrl?: string;

}


export interface InitializePaymentResult {

    success: boolean;

    provider: PaymentMethod;

    reference: string;

    checkoutUrl?: string;

    authorizationUrl?: string;

    message?: string;

    metadata?: Record<string, unknown>;

}


export interface VerifyPaymentResult {

    success: boolean;

    provider: PaymentMethod;

    reference: string;

    status:
        | "PENDING"
        | "APPROVED"
        | "REJECTED";

    amount?: number;

    currency?: string;

    metadata?: Record<string, unknown>;

}


export interface PaymentProvider {

    readonly name: PaymentMethod;

    initialize(
        input: InitializePaymentInput
    ): Promise<InitializePaymentResult>;

    verify(
        reference: string
    ): Promise<VerifyPaymentResult>;

}
