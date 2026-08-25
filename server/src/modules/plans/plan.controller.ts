import type {
    FastifyReply,
    FastifyRequest
} from "fastify";


import {
    fetchPlans,
    fetchUserPlan,
    fetchAllSellerPlans,
    fetchSellerPlanById,
    updatePlan
}
from "./plan.service.js";


import {
    updateSellerPlanSchema
}
from "./plan.schema.js";


// =================================
// GET ACTIVE PLANS
// =================================

export async function getPlansController(

    request:FastifyRequest,

    reply:FastifyReply

){

    try {

        const plans =
            await fetchPlans();


        return reply.send({

            success:true,

            plans

        });

    }

    catch(error:any){

        return reply.code(400).send({

            success:false,

            message:error.message

        });

    }

}


// =================================
// GET MY PLAN
// =================================

export async function getMyPlanController(

    request:FastifyRequest,

    reply:FastifyReply

){

    try {

        const user =
            request.user as {

                id:string;

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

    catch(error:any){

        return reply.code(400).send({

            success:false,

            message:error.message

        });

    }

}


// =================================
// ADMIN — GET ALL PLANS
// =================================

export async function adminGetSellerPlansController(

    request:FastifyRequest,

    reply:FastifyReply

){

    try {

        const plans =
            await fetchAllSellerPlans();


        return reply.send({

            success:true,

            plans

        });

    }

    catch(error:any){

        return reply.code(400).send({

            success:false,

            message:error.message

        });

    }

}


// =================================
// ADMIN — GET SINGLE PLAN
// =================================

export async function adminGetSellerPlanController(

    request:FastifyRequest,

    reply:FastifyReply

){

    try {

        const params =
            request.params as {

                id:string;

            };


        const plan =
            await fetchSellerPlanById(

                params.id

            );


        if(!plan){

            return reply.code(404).send({

                success:false,

                message:"Seller plan not found"

            });

        }


        return reply.send({

            success:true,

            plan

        });

    }

    catch(error:any){

        return reply.code(400).send({

            success:false,

            message:error.message

        });

    }

}


// =================================
// ADMIN — UPDATE PLAN
// =================================

export async function adminUpdateSellerPlanController(

    request:FastifyRequest,

    reply:FastifyReply

){

    try {

        const params =
            request.params as {

                id:string;

            };


        const parsed =
            updateSellerPlanSchema.safeParse(

                request.body

            );


        if(!parsed.success){

            return reply.code(400).send({

                success:false,

                message:"Invalid seller plan data",

                errors:parsed.error.flatten()

            });

        }


        const plan =
            await updatePlan(

                params.id,

                parsed.data

            );


        return reply.send({

            success:true,

            message:"Seller plan updated successfully",

            plan

        });

    }

    catch(error:any){

        return reply.code(400).send({

            success:false,

            message:error.message

        });

    }

}