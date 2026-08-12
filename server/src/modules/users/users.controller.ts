import type {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import { prisma } from "../../lib/prisma.js";



export async function me(
    request: FastifyRequest,
    reply: FastifyReply
) {


    const authUser =
        request.user as {
            id:string;
            role:string;
        };



    const user =
        await prisma.user.findUnique({

            where:{
                id:authUser.id
            },

            select:{

                id:true,

                name:true,

                email:true,

                phone:true,

                role:true,

                verifiedSeller:true,

                avatar:true,

                createdAt:true

            }

        });



    if(!user){


        return reply.code(404).send({

            success:false,

            message:"User not found"

        });


    }



    return reply.send({

        success:true,

        user

    });


}
