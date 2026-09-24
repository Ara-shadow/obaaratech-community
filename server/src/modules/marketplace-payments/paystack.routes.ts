import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";
import {
    initializePaystackPayment,
    verifyPaystackPayment,
    verifyPaystackWebhook
} from "./providers/paystack-marketplace.provider.js";

export default async function paystackRoutes(app: FastifyInstance) {

    // Initialize Paystack Payment
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
                reference: result.reference
            };
        }
    );

    // Verify Payment
    app.post(
        "/verify",
        { preHandler: [authenticate] },
        async (request, reply) => {
            const body = request.body as { reference: string };
            
            const verification = await verifyPaystackPayment(body.reference);
            
            if (verification.status === "success") {
                // Find transaction by reference
                const transaction = await prisma.marketplaceTransaction.findFirst({
                    where: { transactionReference: body.reference }
                });

                if (transaction) {
                    await prisma.marketplaceTransaction.update({
                        where: { id: transaction.id },
                        data: {
                            status: "SUCCESSFUL",
                            paidAt: new Date(),
                            verifiedAt: new Date()
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

    // Paystack Webhook (Public)
    app.post(
        "/webhook",
        async (request, reply) => {
            const signature = request.headers["x-paystack-signature"] as string;
            const rawBody = (request as any).rawBody;

            if (!verifyPaystackWebhook(rawBody, signature)) {
                return reply.code(401).send({ status: "error" });
            }

            const body = request.body as any;

            // Handle charge.success event [citation:1]
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
                            verifiedAt: new Date(),
                            providerReference: String(body.data.id)
                        }
                    });

                    await prisma.order.update({
                        where: { id: transaction.orderId },
                        data: { paymentStatus: "PAID" }
                    });
                }
            }

            return { status: "success" };
        }
    );
}