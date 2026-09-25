import Paystack from "@sconyema/paystack-js";
import { prisma } from "../../../lib/prisma.js";
import crypto from "crypto";

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export interface PaystackInitializeParams {
    orderId: string;
    email: string;
    amount: number; // in KOBO (as stored in Order.total)
    callbackUrl: string;
}

export async function initializePaystackPayment({
    orderId,
    email,
    amount,
    callbackUrl
}: PaystackInitializeParams) {
    const reference = `PS-${orderId}-${Date.now()}`;
    const amountInKobo = Math.round(amount);

    const response = await paystack.transactions.initialize({
        email,
        amount: amountInKobo,
        currency: "NGN",
        reference,
        callback_url: callbackUrl,
        metadata: {
            orderId,
            custom_fields: [
                {
                    display_name: "Order ID",
                    variable_name: "order_id",
                    value: orderId
                }
            ]
        }
    });

    await prisma.marketplaceTransaction.upsert({
        where: { orderId },
        update: {
            provider: "PAYSTACK",
            transactionReference: reference,
            status: "PENDING"
        },
        create: {
            orderId,
            provider: "PAYSTACK",
            transactionReference: reference,
            status: "PENDING"
        }
    });

    return {
        checkoutUrl: response.authorization_url,
        reference,
        accessCode: response.access_code
    };
}

export async function verifyPaystackPayment(reference: string) {
    const transaction = await paystack.transactions.verify(reference);

    return {
        status: transaction.status,
        amount: transaction.amount / 100,
        reference: transaction.reference,
        paidAt: transaction.paid_at,
        channel: transaction.channel,
        currency: transaction.currency
    };
}

export function verifyPaystackWebhook(
    rawBody: string,
    signature: string
): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY!;

    const expected = crypto
        .createHmac("sha512", secret)
        .update(rawBody)
        .digest("hex");

    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expected)
        );
    } catch {
        return false;
    }
}
