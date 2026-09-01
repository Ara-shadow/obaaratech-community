// src/modules/sellers/seller.routes.ts
import type { FastifyInstance } from "fastify";
import { authenticate, authorizeSeller } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function sellerRoutes(app: FastifyInstance) {

    // ============================
    // GET SELLER PROFILE
    // ============================
    app.get(
        "/profile",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const seller = await prisma.user.findUnique({
                where: { id: user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    verifiedSeller: true,
                    role: true,
                    createdAt: true,
                    businessHours: true
                }
            });

            return {
                success: true,
                seller
            };
        }
    );

    // ============================
    // GET PUBLIC SELLER PROFILE
    // ============================
    app.get(
        "/:id/public",
        async (request, reply) => {
            const { id } = request.params as { id: string };

            const seller = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    verifiedSeller: true,
                    createdAt: true,
                    businessHours: true
                }
            });

            if (!seller) {
                return reply.code(404).send({
                    success: false,
                    message: "Seller not found"
                });
            }

            return {
                success: true,
                seller
            };
        }
    );

    // ============================
    // UPDATE SELLER PROFILE
    // ============================
    app.put(
        "/profile",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                name?: string;
                phone?: string;
                avatar?: string;
                verifiedSeller?: boolean;
            };

            const updated = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: body.name,
                    phone: body.phone,
                    avatar: body.avatar,
                    verifiedSeller: body.verifiedSeller
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    verifiedSeller: true,
                    role: true
                }
            });

            return {
                success: true,
                seller: updated
            };
        }
    );
}