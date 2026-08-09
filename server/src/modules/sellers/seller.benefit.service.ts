import { prisma } from "../../lib/prisma.js";


// =====================================
// APPLY SELLER PLAN BENEFITS
// =====================================

export async function applySellerBenefits(

  userId: string,

  plan:any

){


  if(plan.verifiedBadge){


    await prisma.user.update({

      where:{
        id:userId
      },

      data:{
        verifiedSeller:true
      }

    });

  }


  return true;

}