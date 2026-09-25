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

    app.addHook("preParsing", async (request, _reply, payload) => {
        if (
            request.method === "POST" &&
            request.url.endsWith("/paystack/webhook")
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

    app.post(
        "/initialize",
        { preHandler: [authenticate] },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                orderId: string;
                email: string;
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
                checkoutUrl: result.checkoutUrl,
                reference: result.reference,
                accessCode: result.accessCode
            };
        }
    );

    app.post(
        "/verify",
        { preHandler: [authenticate] },
        async (request, reply) => {
            const body = request.body as { reference: string };

            const verification = await verifyPaystackPayment(body.reference);

            if (verification.status === "success") {
                const transaction = await prisma.marketplaceTransaction.findFirst({
                    where: { transactionReference: body.reference }
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
            }

            return {
                success: true,
                status: verification.status
            };
        }
    );

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