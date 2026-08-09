import { prisma } from "../../lib/prisma.js";



export async function createDefaultPlans(){


    const plans = [

        {
            name:"FREE",
            price:0,
            imageLimit:3
        },

        {
            name:"PREMIUM",
            price:5000,
            imageLimit:6
        },

        {
            name:"PRO",
            price:10000,
            imageLimit:15
        }

    ];



    for(const plan of plans){


        await prisma.plan.upsert({

            where:{
                name:plan.name as any
            },


            update:{},

            create:{

                name:plan.name as any,

                price:plan.price,

                imageLimit:plan.imageLimit

            }

        });


    }



    return prisma.plan.findMany({

        orderBy:{
            price:"asc"
        }

    });


}





export async function getPlans(){


    return prisma.plan.findMany({

        orderBy:{
            price:"asc"
        }

    });


}





export async function getUserPlan(
    userId:string
){


    return prisma.userPlan.findUnique({

        where:{
            userId
        },


        include:{

            plan:true

        }

    });


}