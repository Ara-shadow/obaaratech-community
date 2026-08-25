import type {
    FastifyReply,
    FastifyRequest
} from "fastify";

import {
    getProfile,
    updateProfile
} from "./profile.repository.js";



export async function profile(
    request:FastifyRequest,
    reply:FastifyReply
){

    const user = await getProfile(
        request.user.id
    );


    if(!user){

        return reply.code(404).send({

            success:false,

            message:"Profile not found"

        });

    }


    return reply.send({

        success:true,

        profile:user

    });

}





export async function editProfile(
    request:FastifyRequest,
    reply:FastifyReply
){

    const updatedUser = await updateProfile(

        request.user.id,

        request.body

    );


    return reply.send({

        success:true,

        profile:updatedUser

    });

}
