import type {
    PaymentProvider,
    InitializePaymentInput,
    InitializePaymentResult,
    VerifyPaymentResult
} from "../payment.provider.js";

export const bankTransferProvider: PaymentProvider = {

    name: "BANK_TRANSFER",

    async initialize(
        input: InitializePaymentInput
    ): Promise<InitializePaymentResult> {

        return {
            success: true,
            provider: "BANK_TRANSFER",
            reference: input.paymentId,
            message: "Bank transfer payment created. Awaiting payment confirmation.",
            metadata: {
                planId: input.planId,
                amount: input.amount,
                currency: input.currency
            }
        };
    },

    async verify(
        reference: string
    ): Promise<VerifyPaymentResult> {

        return {
            success: false,
            provider: "BANK_TRANSFER",
            reference,
            status: "PENDING",
            metadata: {
                message: "Bank transfer requires manual confirmation."
            }
        };
    }
};
