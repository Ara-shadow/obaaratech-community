import { z } from "zod";

export const paymentMethodSchema = z.enum([
    "BANK_TRANSFER",
    "PAYSTACK",
    "FLUTTERWAVE"
]);

export const initializePaymentSchema = z.object({
    planId: z.string().min(1),
    paymentMethod: paymentMethodSchema,
    callbackUrl: z.string().url().optional()
});

export const submitPaymentSchema = z.object({
    planId: z.string().min(1),
    amount: z.number().positive(),
    reference: z.string().optional(),
    proofUrl: z.string().url().optional()
});

export const verifyPaymentSchema = z.object({
    paymentId: z.string().min(1),
    reference: z.string().min(1).optional()
});

export type PaymentMethod =
    z.infer<typeof paymentMethodSchema>;

export type InitializePaymentInput =
    z.infer<typeof initializePaymentSchema>;

export type SubmitPaymentInput =
    z.infer<typeof submitPaymentSchema>;

export type VerifyPaymentInput =
    z.infer<typeof verifyPaymentSchema>;
