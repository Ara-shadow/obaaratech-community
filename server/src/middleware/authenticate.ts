import { FastifyInstance } from "fastify";


export default async function authenticatePlugin(
  app: FastifyInstance
) {


  app.decorate(
    "authenticate",
    async function(request:any, reply:any){

      try{

        await request.jwtVerify();


      }catch(error){

        reply.code(401).send({

          message:"Unauthorized"

        });

      }

    }
  );


}