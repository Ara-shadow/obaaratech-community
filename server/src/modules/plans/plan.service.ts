import {
    getPlans,
    getUserPlan,
    createDefaultPlans
}
from "./plan.repository.js";


import { prisma } from "../../lib/prisma.js";



export async function fetchPlans(){

    await createDefaultPlans();

    return getPlans();

}





export async function fetchUserPlan(
    userId:string
){

    let userPlan =
        await getUserPlan(userId);



    if(!userPlan){


        await createDefaultPlans();


        const plans =
            await getPlans();



        const free =
            plans.find(
                p=>p.name==="FREE"
            );



        if(!free){

            throw new Error(
                "FREE plan not found"
            );

        }



        const expiry =
            new Date();


        expiry.setDate(
            expiry.getDate()+free.duration
        );



        userPlan =
        await prisma.sellerSubscription.create({

            data:{

                userId,

                planId:free.id,

                expiryDate:expiry

            },


            include:{

                plan:true

            }

        });


    }



    return userPlan;

}