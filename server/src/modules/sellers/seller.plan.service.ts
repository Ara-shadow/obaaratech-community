import {

  createSellerPlan,

  getSellerPlans,

  getSellerPlanById,

  deleteSellerPlan

} from "./seller.plan.repository.js";


import type {

  CreateSellerPlanInput

} from "./seller.plan.schema.js";






export async function createPlan(

  data:CreateSellerPlanInput

){

  return createSellerPlan(

    data

  );

}







export async function fetchPlans(){

  return getSellerPlans();

}







export async function fetchPlanById(

  id:string

){

  return getSellerPlanById(

    id

  );

}







export async function removePlan(

  id:string

){

  return deleteSellerPlan(

    id

  );

}