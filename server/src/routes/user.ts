import type { FastifyInstance } from "fastify";

import { authenticate } from "../middleware/auth.js";

import { prisma } from "../lib/prisma.js";


export default async function userRoutes(
    app:FastifyInstance
){


    app.get(
        "/profile",

        {
            preHandler:[
                authenticate
            ]
        },

        async(
            request,
            reply
        )=>{


            const user =
            request.user as {

                id:string;

                role:string;

            };




            const profile =
                await prisma.user.findUnique({

                    where:{
                        id:user.id
                    },


                    select:{


                        id:true,

                        name:true,

                        email:true,

                        role:true,

                        phone:true,

                        verifiedSeller:true


                    }

                });






            if(!profile){

                return reply.code(404).send({

                    success:false,

                    message:
                    "User not found"

                });

            }





            return {

                success:true,

                user:profile

            };


        }

    );


}
