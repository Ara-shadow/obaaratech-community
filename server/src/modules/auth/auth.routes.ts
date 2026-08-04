import type { FastifyInstance } from "fastify";


import {
    registerUser,
    loginUser
} from "./auth.service.js";



export default async function authRoutes(
    app:FastifyInstance
){



    app.post(
        "/register",
        async(
            request,
            reply
        )=>{


            try{


                const user =
                    await registerUser(
                        app,
                        request.body
                    );



                return reply.send(user);



            }catch(error:any){


                return reply.status(400).send({

                    message:error.message

                });


            }


        }
    );






    app.post(
        "/login",
        async(
            request,
            reply
        )=>{


            try{


                const body:any =
                    request.body;



                const result =
                    await loginUser(

                        app,

                        body.email,

                        body.password

                    );



                return reply.send(result);



            }catch(error:any){


                return reply.status(400).send({

                    message:error.message

                });


            }


        }
    );



}