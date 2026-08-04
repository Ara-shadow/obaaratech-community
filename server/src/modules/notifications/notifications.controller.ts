import type { FastifyReply, FastifyRequest } from "fastify";

import {

    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead

} from "./notifications.repository";




// Get notifications

export async function listNotifications(
    request:FastifyRequest,
    reply:FastifyReply
){

    try{

        const notifications = await getNotifications(
            request.user.id
        );


        return reply.send({

            success:true,

            notifications

        });


    }catch(error){

        return reply.code(500).send({

            success:false,

            message:"Could not load notifications"

        });

    }

}





// Unread count

export async function unreadCount(
    request:FastifyRequest,
    reply:FastifyReply
){

    try{

        const count = await getUnreadCount(
            request.user.id
        );


        return reply.send({

            success:true,

            count

        });


    }catch(error){

        return reply.code(500).send({

            success:false,

            message:"Could not get unread count"

        });

    }

}





// Mark one read

export async function readNotification(
    request:FastifyRequest,
    reply:FastifyReply
){

    try{

        const {id}=request.params as {
            id:string
        };


        await markAsRead(
            id,
            request.user.id
        );


        return reply.send({

            success:true,

            message:"Notification marked as read"

        });


    }catch(error){

        return reply.code(500).send({

            success:false,

            message:"Could not update notification"

        });

    }

}





// Mark all read

export async function readAllNotifications(
    request:FastifyRequest,
    reply:FastifyReply
){

    try{

        await markAllAsRead(
            request.user.id
        );


        return reply.send({

            success:true,

            message:"All notifications marked as read"

        });


    }catch(error){

        return reply.code(500).send({

            success:false,

            message:"Could not update notifications"

        });

    }

}