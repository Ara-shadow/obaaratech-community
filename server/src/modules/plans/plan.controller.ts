import type {
 FastifyReply,
 FastifyRequest
}
from "fastify";


import {
 fetchPlans,
 fetchUserPlan
}
from "./plan.service.js";




export async function getPlansController(

 request:FastifyRequest,

 reply:FastifyReply

){


 const plans =
 await fetchPlans();



 return reply.send({

    success:true,

    plans

 });

}





export async function getMyPlanController(

 request:FastifyRequest,

 reply:FastifyReply

){


 const user =
 request.user as {
    id:string
 };



 if(!user?.id){

    return reply.code(401).send({

        success:false,

        message:"Unauthorized"

    });

 }



 const plan =
 await fetchUserPlan(
    user.id
 );



 return reply.send({

    success:true,

    plan

 });

}
