import type { FastifyInstance } from "fastify";
import { authenticate, authorizeSeller } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function sellerSubscriptionRoutes(app: FastifyInstance) {

    // ============================
    // GET SELLER SUBSCRIPTION
    // ============================
    app.get(
        "/",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const subscription = await prisma.sellerSubscription.findUnique({
                where: { userId: user.id },
                include: {
                    plan: true
                }
            });

            return {
                success: true,
                subscription
            };
        }
    );

    // ============================
    // SUBSCRIBE TO PLAN
    // ============================
    app.post(
        "/",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as { planId: string };

            if (!body.planId) {
                return reply.code(400).send({
                    success: false,
                    message: "Plan ID is required"
                });
            }

            // Check if plan exists
            const plan = await prisma.sellerPlan.findUnique({
                where: { id: body.planId, isActive: true }
            });

            if (!plan) {
                return reply.code(404).send({
                    success: false,
                    message: "Plan not found"
                });
            }

            // Check if user already has a subscription
            const existing = await prisma.sellerSubscription.findUnique({
                where: { userId: user.id }
            });

            const now = new Date();
            const expiryDate = new Date(now);
            expiryDate.setDate(expiryDate.getDate() + plan.duration);

            let subscription;

            if (existing) {
                // Update existing subscription
                subscription = await prisma.sellerSubscription.update({
                    where: { userId: user.id },
                    data: {
                        planId: body.planId,
                        startDate: now,
                        expiryDate: expiryDate,
                        active: true
                    },
                    include: {
                        plan: true
                    }
                });
            } else {
                // Create new subscription
                subscription = await prisma.sellerSubscription.create({
                    data: {
                        userId: user.id,
                        planId: body.planId,
                        startDate: now,
                        expiryDate: expiryDate,
                        active: true
                    },
                    include: {
                        plan: true
                    }
                });
            }

            return {
                success: true,
                subscription
            };
        }
    );

    // ============================
    // CANCEL SUBSCRIPTION
    // ============================
    app.delete(
        "/",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const subscription = await prisma.sellerSubscription.findUnique({
                where: { userId: user.id }
            });

            if (!subscription) {
                return reply.code(404).send({
                    success: false,
                    message: "No active subscription found"
                });
            }

            const cancelled = await prisma.sellerSubscription.update({
                where: { userId: user.id },
                data: { active: false },
                include: {
                    plan: true
                }
            });

            return {
                success: true,
                subscription: cancelled,
                message: "Subscription cancelled"
            };
        }
    );

    // ============================
    // GET AVAILABLE PLANS
    // ============================
    app.get(
        "/plans",
        async (request, reply) => {
            const plans = await prisma.sellerPlan.findMany({
                where: { isActive: true },
                orderBy: { price: "asc" }
            });

            return {
                success: true,
                plans
            };
        }
    );
}