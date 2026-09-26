import type { FastifyInstance, FastifyRequest } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";
import {
    initializePaystackPayment,
    verifyPaystackPayment,
    verifyPaystackWebhook
} from "./providers/paystack-marketplace.provider.js";

declare module "fastify" {
    interface FastifyRequest {
        rawBody?: string;
    }
}

export default async function paystackRoutes(app: FastifyInstance) {

    // ============================================
    // Raw body capture for webhook HMAC verification
    // ============================================
    app.addHook("preParsing", async (request, _reply, payload) => {
        if (
            request.method === "POST" &&
            request.url.includes("/paystack/webhook")
        ) {
            const chunks: Buffer[] = [];
            for await (const chunk of payload) {
                chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
            }
            const raw = Buffer.concat(chunks);
            request.rawBody = raw.toString("utf8");

            const { Readable } = await import("node:stream");
            return Readable.from(raw);
        }
        return payload;
    });

    // ============================================
    // Initialize Payment
    // ============================================
    app.post(
        "/initialize",
        { preHandler: [authenticate] },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                orderId: string;
                email: string;
                paymentMethod?: string;
                callbackUrl: string;
            };

            const order = await prisma.order.findFirst({
                where: { id: body.orderId, buyerId: user.id }
            });

            if (!order) {
                return reply.code(404).send({
                    success: false,
                    message: "Order not found"
                });
            }

            const result = await initializePaystackPayment({
                orderId: order.id,
                email: body.email,
                amount: order.total,
                callbackUrl: body.callbackUrl
            });

            return {
                success: true,
                transactionId: result.reference,
                orderId: order.id,
                orderNumber: order.orderNumber,
                amount: order.total,
                currency: order.currency ?? "NGN",
                provider: "PAYSTACK",
                reference: result.reference,
                checkoutUrl: result.checkoutUrl,
                authorizationUrl: result.checkoutUrl,
                accessCode: result.accessCode
            };
        }
    );

    // ============================================
    // Verify Payment
    // ============================================
    app.post(
        "/verify",
        { preHandler: [authenticate] },
        async (request, reply) => {
            const body = request.body as {
                transactionId?: string;
                reference?: string;
            };

            const reference = body.reference ?? body.transactionId;

            if (!reference) {
                return reply.code(400).send({
                    success: false,
                    message: "Transaction reference is required"
                });
            }

            const verification = await verifyPaystackPayment(reference);

            if (verification.status === "success") {
                const transaction = await prisma.marketplaceTransaction.findFirst({
                    where: { transactionReference: reference }
                });

                if (transaction && transaction.status !== "SUCCESSFUL") {
                    await prisma.marketplaceTransaction.update({
                        where: { id: transaction.id },
                        data: {
                            status: "SUCCESSFUL",
                            paidAt: new Date(),
                            providerReference: String(verification.reference ?? "")
                        }
                    });

                    await prisma.order.update({
                        where: { id: transaction.orderId },
                        data: { paymentStatus: "PAID" }
                    });
                }

                const updated = await prisma.marketplaceTransaction.findFirst({
                    where: { transactionReference: reference }
                });

                return {
                    success: true,
                    transactionId: updated?.id ?? reference,
                    orderId: updated?.orderId,
                    status: "SUCCESSFUL",
                    reference
                };
            }

            return {
                success: true,
                transactionId: reference,
                status: "PENDING",
                reference
            };
        }
    );

    // ============================================
    // Get Transaction by Order
    // ============================================
    app.get(
        "/orders/:orderId/transaction",
        { preHandler: [authenticate] },
        async (request, reply) => {
            const params = request.params as { orderId: string };

            const transaction = await prisma.marketplaceTransaction.findFirst({
                where: { orderId: params.orderId }
            });

            if (!transaction) {
                return reply.code(404).send({
                    success: false,
                    message: "Transaction not found for this order"
                });
            }

            return {
                success: true,
                data: {
                    id: transaction.id,
                    orderId: transaction.orderId,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    paymentMethod: "PAYSTACK",
                    provider: transaction.provider,
                    providerReference: transaction.providerReference,
                    transactionReference: transaction.transactionReference,
                    status: transaction.status,
                    metadata: transaction.metadata,
                    paidAt: transaction.paidAt,
                    createdAt: transaction.createdAt,
                    updatedAt: transaction.updatedAt
                }
            };
        }
    );

    // ============================================
    // Seller Balance (computed from OrderItems)
    // ============================================
    app.get(
        "/seller/balance",
        { preHandler: [authenticate] },
        async (request, reply) => {
            const user = (request as any).user;

            const items = await prisma.orderItem.findMany({
                where: { sellerId: user.id },
                select: {
                    subtotal: true,
                    status: true,
                    Order: {
                        select: { paymentStatus: true }
                    }
                }
            });

            let pendingBalance = 0;
            let availableBalance = 0;
            let totalSales = 0;

            for (const item of items) {
                const amount = item.subtotal ?? 0;
                totalSales += amount;

                if (item.Order?.paymentStatus === "PAID") {
                    if (item.status === "DELIVERED") {
                        availableBalance += amount;
                    } else {
                        pendingBalance += amount;
                    }
                }
            }

            return {
                success: true,
                data: {
                    userId: user.id,
                    pendingBalance,
                    availableBalance,
                    totalSales,
                    totalCommission: 0,
                    totalSettled: 0
                }
            };
        }
    );

    // ============================================
    // Seller Earnings (computed from OrderItems)
    // ============================================
    app.get(
        "/seller/earnings",
        { preHandler: [authenticate] },
        async (request, reply) => {
            const user = (request as any).user;

            const items = await prisma.orderItem.findMany({
                where: { sellerId: user.id },
                orderBy: { createdAt: "desc" },
                include: {
                    Order: {
                        select: { orderNumber: true, paymentStatus: true }
                    }
                }
            });

            const earnings = items.map((item) => ({
                id: item.id,
                sellerId: item.sellerId,
                orderId: item.orderId,
                orderItemId: item.id,
                grossAmount: item.subtotal,
                commissionAmount: 0,
                netAmount: item.subtotal,
                status: item.status,
                createdAt: item.createdAt,
                orderItem: {
                    title: item.title
                },
                order: item.Order
            }));

            return {
                success: true,
                data: earnings
            };
        }
    );

    // ============================================
    // Paystack Webhook (public)
    // ============================================
    app.post(
        "/webhook",
        async (request, reply) => {
            const signature = request.headers["x-paystack-signature"] as string;
            const rawBody = request.rawBody;

            if (!signature || !rawBody) {
                request.log.warn("Paystack webhook: missing signature or raw body");
                return reply.code(401).send({ status: "error" });
            }

            if (!verifyPaystackWebhook(rawBody, signature)) {
                request.log.warn("Paystack webhook: invalid signature");
                return reply.code(401).send({ status: "error" });
            }

            const body = request.body as any;

            request.log.info(
                { event: body?.event, reference: body?.data?.reference },
                "Paystack webhook received"
            );

            if (body.event === "charge.success") {
                const reference = body.data.reference;

                const transaction = await prisma.marketplaceTransaction.findFirst({
                    where: { transactionReference: reference }
                });

                if (transaction && transaction.status !== "SUCCESSFUL") {
                    await prisma.marketplaceTransaction.update({
                        where: { id: transaction.id },
                        data: {
                            status: "SUCCESSFUL",
                            paidAt: new Date(),
                            providerReference: String(body.data.id)
                        }
                    });

                    await prisma.order.update({
                        where: { id: transaction.orderId },
                        data: { paymentStatus: "PAID" }
                    });

                    request.log.info(
                        { orderId: transaction.orderId, reference },
                        "Order marked PAID via webhook"
                    );
                } else {
                    request.log.info(
                        { reference },
                        "Webhook: transaction already processed (idempotent skip)"
                    );
                }
            }

            return { status: "success" };
        }
    );
}