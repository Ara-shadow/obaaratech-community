// src/modules/profile/profile.routes.ts
import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function profileRoutes(app: FastifyInstance) {

    // ============================
    // GET PROFILE
    // ============================
    app.get(
        "/",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const profile = await prisma.user.findUnique({
                where: { id: user.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    role: true,
                    verifiedSeller: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return {
                success: true,
                profile
            };
        }
    );

    // ============================
    // UPDATE PROFILE
    // ============================
    app.put(
        "/",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                name?: string;
                phone?: string;
                avatar?: string;
            };

            const updated = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: body.name,
                    phone: body.phone,
                    avatar: body.avatar
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    role: true,
                    verifiedSeller: true
                }
            });

            return {
                success: true,
                profile: updated
            };
        }
    );
}