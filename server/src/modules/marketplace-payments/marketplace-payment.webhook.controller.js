import crypto from "node:crypto";
import { verifyMarketplacePayment } from "./marketplace-payment.service.js";
import { prisma } from "../../lib/prisma.js";
// =====================================
// VERIFY SIGNATURE
// =====================================
function verifyFlutterwaveWebhookSignature(rawBody, signature, secretHash) {
    const expectedSignature = crypto
        .createHmac("sha256", secretHash)
        .update(rawBody, "utf8")
        .digest("base64");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(signature, "utf8");
    if (expectedBuffer.length !==
        receivedBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
// =====================================
// GET SIGNATURE
// =====================================
function getWebhookSignature(request) {
    const value = request.headers["flutterwave-signature"];
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}
// =====================================
// FLUTTERWAVE WEBHOOK
// =====================================
export async function flutterwaveMarketplaceWebhookController(request, reply) {
    const webhookRequest = request;
    // =================================
    // SECRET HASH
    // =================================
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH ||
        process.env.FLW_SECRET_HASH;
    if (!secretHash ||
        !secretHash.trim()) {
        request.log.error("FLW_SECRET_HASH is not configured");
        return reply
            .code(500)
            .send({
            success: false,
            message: "Flutterwave webhook secret is not configured"
        });
    }
    // =================================
    // SIGNATURE
    // =================================
    const signature = getWebhookSignature(request);
    if (!signature) {
        request.log.warn("Flutterwave webhook signature missing");
        return reply
            .code(401)
            .send({
            success: false,
            message: "Invalid webhook signature"
        });
    }
    // =================================
    // RAW BODY
    // =================================
    const rawBody = webhookRequest.rawBody;
    if (!rawBody) {
        request.log.error("Flutterwave webhook raw body is missing");
        return reply
            .code(400)
            .send({
            success: false,
            message: "Webhook raw body is missing"
        });
    }
    // =================================
    // VERIFY SIGNATURE
    // =================================
    const validSignature = verifyFlutterwaveWebhookSignature(rawBody, signature, secretHash.trim());
    if (!validSignature) {
        request.log.warn("Invalid Flutterwave webhook signature");
        return reply
            .code(401)
            .send({
            success: false,
            message: "Invalid webhook signature"
        });
    }
    // =================================
    // PARSE PAYLOAD
    // =================================
    let payload;
    try {
        payload =
            JSON.parse(rawBody);
    }
    catch {
        request.log.error("Invalid Flutterwave webhook JSON");
        return reply
            .code(400)
            .send({
            success: false,
            message: "Invalid webhook payload"
        });
    }
    // =================================
    // EVENT TYPE
    // =================================
    const eventType = payload.type ||
        payload.event ||
        "";
    request.log.info({
        webhookId: payload.webhook_id ||
            payload.id,
        event: eventType,
        flutterwaveTransactionId: payload.data?.id,
        reference: payload.data?.tx_ref,
        status: payload.data?.status,
        amount: payload.data?.amount,
        currency: payload.data?.currency
    }, "Flutterwave marketplace webhook received");
    // =================================
    // ONLY PROCESS CHARGE EVENTS
    // =================================
    if (eventType &&
        !eventType.startsWith("charge.")) {
        return reply
            .code(200)
            .send({
            success: true,
            message: "Webhook event acknowledged"
        });
    }
    // =================================
    // TRANSACTION REFERENCE
    // =================================
    const reference = payload.data?.tx_ref;
    if (!reference) {
        request.log.warn("Flutterwave webhook transaction reference missing");
        return reply
            .code(200)
            .send({
            success: true,
            message: "Webhook acknowledged"
        });
    }
    // =================================
    // FIND MARKETPLACE TRANSACTION
    // =================================
    const transaction = await prisma.marketplaceTransaction.findFirst({
        where: {
            OR: [
                {
                    providerReference: reference
                },
                {
                    transactionReference: reference
                },
                {
                    id: reference
                }
            ]
        },
        select: {
            id: true,
            orderId: true,
            status: true,
            providerReference: true,
            transactionReference: true
        }
    });
    if (!transaction) {
        request.log.warn({
            reference
        }, "Marketplace transaction not found for webhook");
        // This may belong to another
        // payment flow on the account.
        return reply
            .code(200)
            .send({
            success: true,
            message: "Webhook acknowledged"
        });
    }
    // =================================
    // ALREADY PROCESSED
    // =================================
    if (transaction.status ===
        "SUCCESSFUL") {
        return reply
            .code(200)
            .send({
            success: true,
            message: "Marketplace transaction already processed"
        });
    }
    // =================================
    // VERIFY PAYMENT AGAINST FLUTTERWAVE
    // =================================
    //
    // NEVER trust the webhook amount,
    // currency or status alone.
    //
    // Flutterwave recommends re-querying
    // the transaction before giving value.
    //
    // =================================
    try {
        const verification = await verifyMarketplacePayment({
            transactionId: transaction.id,
            reference
        });
        if (verification.success) {
            request.log.info({
                transactionId: transaction.id,
                orderId: transaction.orderId,
                reference
            }, "Flutterwave marketplace payment processed");
        }
        return reply
            .code(200)
            .send({
            success: true,
            message: verification.success
                ? "Marketplace payment processed"
                : "Marketplace payment notification received",
            status: verification.status
        });
    }
    catch (error) {
        request.log.error({
            error,
            transactionId: transaction.id,
            orderId: transaction.orderId,
            reference
        }, "Flutterwave marketplace webhook processing failed");
        // Returning non-200 allows Flutterwave
        // to retry according to its webhook
        // retry configuration.
        return reply
            .code(500)
            .send({
            success: false,
            message: "Webhook processing failed"
        });
    }
}
