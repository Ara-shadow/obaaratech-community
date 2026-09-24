import prisma from "../../database/prisma";
// Create notification
export async function createNotification(data) {
    return prisma.notification.create({
        data: {
            userId: data.userId,
            actorId: data.actorId,
            type: data.type,
            message: data.message,
            postId: data.postId
        }
    });
}
// Get user notifications
export function getNotifications(userId) {
    return prisma.notification.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "desc"
        },
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
                    content: true
                }
            }
        }
    });
}
// Get unread notification count
export function getUnreadCount(userId) {
    return prisma.notification.count({
        where: {
            userId,
            read: false
        }
    });
}
// Mark one notification read
export function markAsRead(id, userId) {
    return prisma.notification.updateMany({
        where: {
            id,
            userId
        },
        data: {
            read: true
        }
    });
}
// Mark all notifications read
export function markAllAsRead(userId) {
    return prisma.notification.updateMany({
        where: {
            userId,
            read: false
        },
        data: {
            read: true
        }
    });
}
