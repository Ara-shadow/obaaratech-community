import type { FastifyInstance } from "fastify";

import {
    hashPassword,
    comparePassword
} from "../../utils/password.js";

import { prisma } from "../../lib/prisma.js";


export default async function authRoutes(
    app: FastifyInstance
){


    // ============================
    // REGISTER
    // ============================

    app.post(
        "/register",
        async(
            request,
            reply
        )=>{


            const body = request.body as {

                name:string;

                email:string;

                password:string;

                phone?:string;

            };



            const existingUser =
                await prisma.user.findUnique({

                    where:{
                        email:body.email
                    }

                });



            if(existingUser){

                return reply.code(400).send({

                    success:false,

                    message:
                    "Email already registered"

                });

            }





            const hashedPassword =
                await hashPassword(
                    body.password
                );




            const user =
                await prisma.user.create({

                    data:{


                        name:
                        body.name,


                        email:
                        body.email,


                        password:
                        hashedPassword,


                        phone:
                        body.phone


                    }

                });






            const token =
                app.jwt.sign({

                    id:user.id,

                    role:user.role

                });






            return {

                success:true,

                token,


                user:{


                    id:user.id,

                    name:user.name,

                    email:user.email,

                    role:user.role


                }

            };


        }

    );









    // ============================
    // LOGIN
    // ============================


    app.post(
        "/login",
        async(
            request,
            reply
        )=>{


            const body =
            request.body as {

                email:string;

                password:string;

            };





            const user =
                await prisma.user.findUnique({

                    where:{
                        email:body.email
                    }

                });





            if(!user){

                return reply.code(401).send({

                    success:false,

                    message:
                    "Invalid email or password"

                });

            }






            const valid =
                await comparePassword(

                    body.password,

                    user.password

                );





            if(!valid){

                return reply.code(401).send({

                    success:false,

                    message:
                    "Invalid email or password"

                });

            }







            const token =
                app.jwt.sign({

                    id:user.id,

                    role:user.role

                });







            return {

                success:true,

                token,


                user:{


                    id:user.id,

                    name:user.name,

                    email:user.email,

                    role:user.role


                }

            };


        }

    );



}
