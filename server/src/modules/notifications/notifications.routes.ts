import type { FastifyInstance } from "fastify";

import {

    listNotifications,
    unreadCount,
    readNotification,
    readAllNotifications

} from "./notifications.controller";



export default async function notificationRoutes(
    app:FastifyInstance
){

    app.get(
        "/notifications",
        {
            preHandler:[
                app.authenticate
            ]
        },
        listNotifications
    );



    app.get(
        "/notifications/unread-count",
        {
            preHandler:[
                app.authenticate
            ]
        },
        unreadCount
    );



    app.put(
        "/notifications/:id/read",
        {
            preHandler:[
                app.authenticate
            ]
        },
        readNotification
    );



    app.put(
        "/notifications/read-all",
        {
            preHandler:[
                app.authenticate
            ]
        },
        readAllNotifications
    );

}