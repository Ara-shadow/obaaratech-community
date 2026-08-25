import { prisma } from "../../lib/prisma.js";

import type {
  CreateSellerPlanInput
} from "./seller.plan.schema.js";





// =====================================
// CREATE PLAN
// =====================================

export async function createSellerPlan(

  data:CreateSellerPlanInput

){

  return prisma.sellerPlan.create({

    data

  });

}





// =====================================
// GET ALL PLANS
// =====================================

export async function getSellerPlans(){

  return prisma.sellerPlan.findMany({

    orderBy:{

      price:"asc"

    }

  });

}





// =====================================
// GET SINGLE PLAN
// =====================================

export async function getSellerPlanById(

  id:string

){

  return prisma.sellerPlan.findUnique({

    where:{

      id

    }

  });

}





// =====================================
// DELETE PLAN
// =====================================

export async function deleteSellerPlan(

  id:string

){

  return prisma.sellerPlan.delete({

    where:{

      id

    }

  });

}
