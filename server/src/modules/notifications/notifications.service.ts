import {
    getUserNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    createNotification
} from "./notifications.repository";



export async function listNotifications(
    userId:string
){

    const notifications =
        await getUserNotifications(userId);


    const unread =
        await getUnreadCount(userId);


    return {

        notifications,

        unread

    };

}



export function readNotification(
    id:string,
    userId:string
){

    return markNotificationRead(
        id,
        userId
    );

}



export function readAllNotifications(
    userId:string
){

    return markAllNotificationsRead(
        userId
    );

}



export function sendNotification(
    data:any
){

    return createNotification(data);

}