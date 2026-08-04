import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";


export default fp(async function jwtPlugin(app) {


    await app.register(
        fastifyJwt,
        {
            secret:
                process.env.JWT_SECRET || "supersecretkey",
        }
    );



    app.decorate(
        "authenticate",
        async function(
            request,
            reply
        ){

            console.log(
                "AUTH HEADER:",
                request.headers.authorization
            );


            try {


                await request.jwtVerify();


                console.log(
                    "JWT SUCCESS:",
                    request.user
                );


            } catch(error:any){


                console.log(
                    "JWT ERROR:",
                    error.message
                );


                return reply.code(401).send({

                    success:false,

                    message:"Unauthorized",

                });

            }

        }
    );


});