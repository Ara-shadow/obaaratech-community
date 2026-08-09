import type {

 FastifyRequest,

 FastifyReply

} from "fastify";


import {

 createSubscriptionSchema

} from "./seller.subscription.schema.js";


import {

 subscribeSeller,

 fetchMySubscription

} from "./seller.subscription.service.js";






// =====================================
// SUBSCRIBE
// =====================================

export async function subscribeController(

 request:FastifyRequest,

 reply:FastifyReply

){

 try {


  const user = request.user as {

    id:string;

  };



  const data =

    createSubscriptionSchema.parse(

      request.body

    );



  const subscription =

    await subscribeSeller(

      request.server,

      user.id,

      data.planId

    );



  return reply.code(201).send({

    success:true,

    message:"Subscription activated",

    subscription

  });



 }catch(error:any){


  return reply.code(400).send({

    success:false,

    message:error.message

  });


 }

}







// =====================================
// MY SUBSCRIPTION
// =====================================

export async function mySubscriptionController(

 request:FastifyRequest,

 reply:FastifyReply

){

 try {


  const user = request.user as {

    id:string;

  };



  const subscription =

    await fetchMySubscription(

      request.server,

      user.id

    );



  return reply.send({

    success:true,

    subscription

  });



 }catch(error:any){


  return reply.code(400).send({

    success:false,

    message:error.message

  });


 }

}