import type { FastifyInstance } from "fastify";
import { authenticate, authorizeSeller } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function paymentRoutes(app: FastifyInstance) {

    // ============================
    // GET SELLER PAYMENTS
    // ============================
    app.get(
        "/seller",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const payments = await prisma.sellerPayment.findMany({
                where: { userId: user.id },
                include: {
                    plan: true
                },
                orderBy: { createdAt: "desc" }
            });

            return {
                success: true,
                payments
            };
        }
    );

    // ============================
    // CREATE PAYMENT
    // ============================
    app.post(
        "/seller",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                planId: string;
                amount: number;
                paymentMethod?: string;
                reference?: string;
                proofUrl?: string;
            };

            // Check if plan exists
            const plan = await prisma.sellerPlan.findUnique({
                where: { id: body.planId }
            });

            if (!plan) {
                return reply.code(404).send({
                    success: false,
                    message: "Plan not found"
                });
            }

            const payment = await prisma.sellerPayment.create({
                data: {
                    userId: user.id,
                    planId: body.planId,
                    amount: body.amount || plan.price,
                    paymentMethod: body.paymentMethod as any || "BANK_TRANSFER",
                    status: "PENDING",
                    reference: body.reference,
                    proofUrl: body.proofUrl
                },
                include: {
                    plan: true
                }
            });

            return {
                success: true,
                payment
            };
        }
    );

    // ============================
    // GET PAYMENT BY ID
    // ============================
    app.get(
        "/seller/:id",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            const payment = await prisma.sellerPayment.findFirst({
                where: {
                    id,
                    userId: user.id
                },
                include: {
                    plan: true
                }
            });

            if (!payment) {
                return reply.code(404).send({
                    success: false,
                    message: "Payment not found"
                });
            }

            return {
                success: true,
                payment
            };
        }
    );

    // ============================
    // UPDATE PAYMENT STATUS (Admin only)
    // ============================
    app.put(
        "/admin/:id",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;
            const body = request.body as {
                status: "PENDING" | "APPROVED" | "REJECTED";
                adminNote?: string;
            };

            // Check if user is admin
            if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }

            const payment = await prisma.sellerPayment.findUnique({
                where: { id },
                include: {
                    plan: true
                }
            });

            if (!payment) {
                return reply.code(404).send({
                    success: false,
                    message: "Payment not found"
                });
            }

            const updated = await prisma.sellerPayment.update({
                where: { id },
                data: {
                    status: body.status,
                    adminNote: body.adminNote,
                    reviewedAt: new Date()
                },
                include: {
                    plan: true
                }
            });

            // If payment is approved, activate subscription
            if (body.status === "APPROVED") {
                const now = new Date();
                const expiryDate = new Date(now);
                expiryDate.setDate(expiryDate.getDate() + payment.plan.duration);

                await prisma.sellerSubscription.upsert({
                    where: { userId: payment.userId },
                    update: {
                        planId: payment.planId,
                        startDate: now,
                        expiryDate: expiryDate,
                        active: true
                    },
                    create: {
                        userId: payment.userId,
                        planId: payment.planId,
                        startDate: now,
                        expiryDate: expiryDate,
                        active: true
                    }
                });
            }

            return {
                success: true,
                payment: updated
            };
        }
    );

    // ============================
    // GET ALL PAYMENTS (Admin only)
    // ============================
    app.get(
        "/admin",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;

            if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }

            const payments = await prisma.sellerPayment.findMany({
                include: {
                    plan: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            return {
                success: true,
                payments
            };
        }
    );
}