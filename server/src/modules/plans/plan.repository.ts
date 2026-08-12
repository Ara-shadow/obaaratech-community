import { prisma } from "../../lib/prisma.js";

// =================================
// CREATE DEFAULT SELLER PLANS
// =================================

export async function createDefaultPlans(){


    const plans = [


        {
            name:"FREE",
            price:0,
            duration:30,
            maxListings:5,
            imageLimit:3,
            featuredListing:false,
            prioritySearch:false,
            verifiedBadge:false
        },


        {
            name:"PREMIUM",
            price:5000,
            duration:30,
            maxListings:50,
            imageLimit:10,
            featuredListing:true,
            prioritySearch:true,
            verifiedBadge:false
        },


        {
            name:"BUSINESS",
            price:15000,
            duration:30,
            maxListings:200,
            imageLimit:50,
            featuredListing:true,
            prioritySearch:true,
            verifiedBadge:true
        }


    ];



    for(const plan of plans){


        await prisma.sellerPlan.upsert({


            where:{
                name:plan.name
            },


            update:plan,


            create:plan


        });


    }



}




// =================================
// GET ALL PLANS
// =================================


export async function getPlans(){


    return prisma.sellerPlan.findMany({


        orderBy:{


            price:"asc"


        }


    });


}




// =================================
// GET USER ACTIVE PLAN
// =================================


export async function getUserPlan(
    userId:string
){


    return prisma.sellerSubscription.findFirst({


        where:{


            userId,


            active:true,


            expiryDate:{


                gt:new Date()


            }


        },


        include:{


            plan:true


        }


    });


}