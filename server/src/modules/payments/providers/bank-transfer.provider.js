export const bankTransferProvider = {
    name: "BANK_TRANSFER",
    async initialize(input) {
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
    async verify(reference) {
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
