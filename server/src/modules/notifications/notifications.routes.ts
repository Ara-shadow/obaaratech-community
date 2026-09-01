import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function notificationsRoutes(app: FastifyInstance) {

    // ============================
    // GET USER NOTIFICATIONS
    // ============================
    app.get(
        "/notifications",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const notifications = await prisma.notification.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: "desc" },
                include: {
                    actor: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    post: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            });

            const unreadCount = notifications.filter(n => !n.read).length;

            return {
                success: true,
                notifications,
                unreadCount
            };
        }
    );

    // ============================
    // MARK NOTIFICATION AS READ
    // ============================
    app.put(
        "/notifications/:id/read",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            const notification = await prisma.notification.findFirst({
                where: {
                    id,
                    userId: user.id
                }
            });

            if (!notification) {
                return reply.code(404).send({
                    success: false,
                    message: "Notification not found"
                });
            }

            const updated = await prisma.notification.update({
                where: { id },
                data: { read: true }
            });

            return {
                success: true,
                notification: updated
            };
        }
    );

    // ============================
    // MARK ALL NOTIFICATIONS AS READ
    // ============================
    app.put(
        "/notifications/read-all",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;

            await prisma.notification.updateMany({
                where: {
                    userId: user.id,
                    read: false
                },
                data: { read: true }
            });

            return {
                success: true,
                message: "All notifications marked as read"
            };
        }
    );

    // ============================
    // DELETE NOTIFICATION
    // ============================
    app.delete(
        "/notifications/:id",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            const notification = await prisma.notification.findFirst({
                where: {
                    id,
                    userId: user.id
                }
            });

            if (!notification) {
                return reply.code(404).send({
                    success: false,
                    message: "Notification not found"
                });
            }

            await prisma.notification.delete({
                where: { id }
            });

            return {
                success: true,
                message: "Notification deleted"
            };
        }
    );
}