import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification
} from "./notifications.repository.js";



export async function listNotifications(
    userId:string
){

    const notifications =
        await getNotifications(userId);


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

    return markAsRead(
        id,
        userId
    );

}



export function readAllNotifications(
    userId:string
){

    return markAllAsRead(
        userId
    );

}



export function sendNotification(
    data:any
){

    return createNotification(data);

}