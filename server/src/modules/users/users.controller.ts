import type {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import { findUserByEmail } from "../auth/auth.repository.js";


export async function me(
    request: FastifyRequest,
    reply: FastifyReply
) {

    const userEmail = (request.user as any).email;


    const user = await findUserByEmail(
        userEmail
    );


    if (!user) {

        return reply.code(404).send({

            success:false,

            message:"User not found"

        });

    }


    return reply.send({

        success:true,

        user:{

            id:user.id,

            name:user.name,

            email:user.email,

            phone:user.phone,

            role:user.role,

            verifiedSeller:user.verifiedSeller

        }

    });

}