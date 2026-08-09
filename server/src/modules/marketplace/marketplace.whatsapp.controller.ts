import type {
    FastifyReply,
    FastifyRequest
} from "fastify";


import {
    generateWhatsAppLink
} from "./marketplace.whatsapp.service.js";



export async function whatsappController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const params =

        request.params as {

            id:string;

        };



    try{


        const result =

            await generateWhatsAppLink(

                request.server,

                params.id

            );



        return reply.send({

            success:true,

            whatsapp:result

        });



    }catch(error:any){


        return reply.code(400).send({

            success:false,

            message:error.message

        });


    }


}