import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification } from "./notifications.repository.js";
export async function listNotifications(userId) {
    const notifications = await getNotifications(userId);
    const unread = await getUnreadCount(userId);
    return {
        notifications,
        unread
    };
}
export function readNotification(id, userId) {
    return markAsRead(id, userId);
}
export function readAllNotifications(userId) {
    return markAllAsRead(userId);
}
export function sendNotification(data) {
    return createNotification(data);
}
