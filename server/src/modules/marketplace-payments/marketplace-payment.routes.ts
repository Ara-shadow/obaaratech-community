import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";
import crypto from "node:crypto";

export default async function marketplacePaymentRoutes(app: FastifyInstance) {

    // ============================
    // INITIALIZE PAYMENT
    // ============================
    app.post(
        "/initialize",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                orderId: string;
                email: string;
                paymentMethod: string;
                callbackUrl: string;
            };

            // Get order
            const order = await prisma.order.findFirst({
                where: {
                    id: body.orderId,
                    buyerId: user.id
                },
                include: {
                    items: true
                }
            });

            if (!order) {
                return reply.code(404).send({
                    success: false,
                    message: "Order not found"
                });
            }

            // Check if payment already exists
            const existingPayment = await prisma.marketplaceTransaction.findUnique({
                where: { orderId: order.id }
            });

            if (existingPayment && existingPayment.status === "SUCCESSFUL") {
                return reply.code(400).send({
                    success: false,
                    message: "Order already paid"
                });
            }

            // Generate transaction reference
            const reference = `OBA-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

            // Create or update transaction
            const transaction = await prisma.marketplaceTransaction.upsert({
                where: { orderId: order.id },
                update: {
                    amount: order.total,
                    currency: order.currency || "NGN",
                    paymentMethod: order.paymentMethod,
                    provider: "FLUTTERWAVE",
                    transactionReference: reference,
                    status: "PENDING",
                    metadata: {
                        email: body.email,
                        callbackUrl: body.callbackUrl
                    }
                },
                create: {
                    orderId: order.id,
                    amount: order.total,
                    currency: order.currency || "NGN",
                    paymentMethod: order.paymentMethod,
                    provider: "FLUTTERWAVE",
                    transactionReference: reference,
                    status: "PENDING",
                    metadata: {
                        email: body.email,
                        callbackUrl: body.callbackUrl
                    }
                }
            });

            // TODO: Call Flutterwave API to initialize payment
            // For now, return a mock checkout URL
            const checkoutUrl = `https://checkout.flutterwave.com/v3/hosted/pay/${reference}`;

            return {
                success: true,
                transaction,
                checkoutUrl,
                reference
            };
        }
    );

    // ============================
    // VERIFY PAYMENT
    // ============================
    app.post(
        "/verify",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                transactionId: string;
                reference: string;
            };

            // Find transaction
            const transaction = await prisma.marketplaceTransaction.findUnique({
                where: { id: body.transactionId },
                include: {
                    order: true
                }
            });

            if (!transaction) {
                return reply.code(404).send({
                    success: false,
                    message: "Transaction not found"
                });
            }

            // Check if user owns the order
            if (transaction.order.buyerId !== user.id) {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }

            // TODO: Verify with Flutterwave API
            // For now, simulate verification
            const verificationStatus = "SUCCESSFUL";

            if (verificationStatus === "SUCCESSFUL") {
                await prisma.marketplaceTransaction.update({
                    where: { id: transaction.id },
                    data: {
                        status: "SUCCESSFUL",
                        verifiedAt: new Date(),
                        paidAt: new Date(),
                        providerReference: body.reference
                    }
                });

                // Update order payment status
                await prisma.order.update({
                    where: { id: transaction.orderId },
                    data: {
                        paymentStatus: "PAID"
                    }
                });
            }

            return {
                success: true,
                status: verificationStatus
            };
        }
    );

    // ============================
    // GET TRANSACTION BY ORDER
    // ============================
    app.get(
        "/order/:orderId",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { orderId } = request.params as { orderId: string };
            const user = (request as any).user;

            const transaction = await prisma.marketplaceTransaction.findUnique({
                where: { orderId },
                include: {
                    order: {
                        select: {
                            buyerId: true
                        }
                    }
                }
            });

            if (!transaction) {
                return reply.code(404).send({
                    success: false,
                    message: "Transaction not found"
                });
            }

            if (transaction.order.buyerId !== user.id) {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }

            return {
                success: true,
                transaction
            };
        }
    );

    // ============================
    // FLUTTERWAVE WEBHOOK (Public)
    // ============================
    app.post(
        "/webhook/flutterwave",
        async (request, reply) => {
            try {
                const body = request.body as any;
                const rawBody = (request as any).rawBody;

                // TODO: Verify webhook signature
                // const signature = request.headers['verif-hash'];
                // Verify using FLUTTERWAVE_WEBHOOK_SECRET

                const { status, tx_ref, transaction_id } = body;

                if (status === "successful") {
                    // Find transaction by reference
                    const transaction = await prisma.marketplaceTransaction.findFirst({
                        where: {
                            transactionReference: tx_ref
                        }
                    });

                    if (transaction && transaction.status !== "SUCCESSFUL") {
                        await prisma.marketplaceTransaction.update({
                            where: { id: transaction.id },
                            data: {
                                status: "SUCCESSFUL",
                                paidAt: new Date(),
                                verifiedAt: new Date(),
                                providerReference: String(transaction_id)
                            }
                        });

                        // Update order
                        await prisma.order.update({
                            where: { id: transaction.orderId },
                            data: {
                                paymentStatus: "PAID"
                            }
                        });
                    }
                }

                return { status: "success" };
            } catch (error) {
                console.error("Webhook error:", error);
                return { status: "error" };
            }
        }
    );
}