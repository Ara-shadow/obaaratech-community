import type { FastifyInstance } from "fastify";
import { authenticate, authorizeAdmin } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function planRoutes(app: FastifyInstance) {

    // ============================
    // GET ALL PLANS (Public)
    // ============================
    app.get(
        "/",
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

    // ============================
    // GET PLAN BY ID
    // ============================
    app.get(
        "/:id",
        async (request, reply) => {
            const { id } = request.params as { id: string };

            const plan = await prisma.sellerPlan.findUnique({
                where: { id }
            });

            if (!plan) {
                return reply.code(404).send({
                    success: false,
                    message: "Plan not found"
                });
            }

            return {
                success: true,
                plan
            };
        }
    );

    // ============================
    // CREATE PLAN (Admin only)
    // ============================
    app.post(
        "/",
        {
            preHandler: [authenticate, authorizeAdmin]
        },
        async (request, reply) => {
            const body = request.body as {
                name: string;
                price: number;
                duration: number;
                maxListings: number;
                imageLimit: number;
                featuredListing?: boolean;
                prioritySearch?: boolean;
                verifiedBadge?: boolean;
            };

            const plan = await prisma.sellerPlan.create({
                data: {
                    name: body.name,
                    price: body.price || 0,
                    duration: body.duration || 30,
                    maxListings: body.maxListings || 5,
                    imageLimit: body.imageLimit || 3,
                    featuredListing: body.featuredListing || false,
                    prioritySearch: body.prioritySearch || false,
                    verifiedBadge: body.verifiedBadge || false,
                    isActive: true
                }
            });

            return {
                success: true,
                plan
            };
        }
    );

    // ============================
    // UPDATE PLAN (Admin only)
    // ============================
    app.put(
        "/:id",
        {
            preHandler: [authenticate, authorizeAdmin]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const body = request.body as {
                name?: string;
                price?: number;
                duration?: number;
                maxListings?: number;
                imageLimit?: number;
                featuredListing?: boolean;
                prioritySearch?: boolean;
                verifiedBadge?: boolean;
                isActive?: boolean;
            };

            const plan = await prisma.sellerPlan.update({
                where: { id },
                data: body
            });

            return {
                success: true,
                plan
            };
        }
    );

    // ============================
    // DELETE PLAN (Admin only)
    // ============================
    app.delete(
        "/:id",
        {
            preHandler: [authenticate, authorizeAdmin]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };

            await prisma.sellerPlan.delete({
                where: { id }
            });

            return {
                success: true,
                message: "Plan deleted successfully"
            };
        }
    );
}