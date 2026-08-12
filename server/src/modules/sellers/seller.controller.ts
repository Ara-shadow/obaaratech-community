import type {

  FastifyRequest,

  FastifyReply

} from "fastify";


import {

  fetchSellerProfile

} from "./seller.service.js";






// =====================================
// GET SELLER PROFILE
// =====================================

export async function getSellerProfileController(

  request: FastifyRequest,

  reply: FastifyReply

){


  try {


    const {

      sellerId

    } = request.params as {

      sellerId:string;

    };





    const seller =

     await fetchSellerProfile(
    sellerId
);





    return reply.send({

      success:true,

      seller

    });



  } catch(error:any){


    return reply.code(404).send({

      success:false,

      message:error.message

    });


  }


}
