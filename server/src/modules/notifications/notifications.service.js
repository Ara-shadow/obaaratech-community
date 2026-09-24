import { getUserNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead, createNotification } from "./notifications.repository";
export async function listNotifications(userId) {
    const notifications = await getUserNotifications(userId);
    const unread = await getUnreadCount(userId);
    return {
        notifications,
        unread
    };
}
export function readNotification(id, userId) {
    return markNotificationRead(id, userId);
}
export function readAllNotifications(userId) {
    return markAllNotificationsRead(userId);
}
export function sendNotification(data) {
    return createNotification(data);
}
