import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "./notifications.repository";
// Get notifications
export async function listNotifications(request, reply) {
    try {
        const notifications = await getNotifications(request.user.id);
        return reply.send({
            success: true,
            notifications
        });
    }
    catch (error) {
        return reply.code(500).send({
            success: false,
            message: "Could not load notifications"
        });
    }
}
// Unread count
export async function unreadCount(request, reply) {
    try {
        const count = await getUnreadCount(request.user.id);
        return reply.send({
            success: true,
            count
        });
    }
    catch (error) {
        return reply.code(500).send({
            success: false,
            message: "Could not get unread count"
        });
    }
}
// Mark one read
export async function readNotification(request, reply) {
    try {
        const { id } = request.params;
        await markAsRead(id, request.user.id);
        return reply.send({
            success: true,
            message: "Notification marked as read"
        });
    }
    catch (error) {
        return reply.code(500).send({
            success: false,
            message: "Could not update notification"
        });
    }
}
// Mark all read
export async function readAllNotifications(request, reply) {
    try {
        await markAllAsRead(request.user.id);
        return reply.send({
            success: true,
            message: "All notifications marked as read"
        });
    }
    catch (error) {
        return reply.code(500).send({
            success: false,
            message: "Could not update notifications"
        });
    }
}
