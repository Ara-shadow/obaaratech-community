import {

  createSellerSubscription,

  getMySubscription

} from "./seller.subscription.repository.js";


import {

  applySellerBenefits

} from "./seller.benefit.service.js";





// =====================================
// CREATE SUBSCRIPTION
// =====================================

export async function subscribeSeller(

  userId:string,

  planId:string

){


  const subscription =

    await createSellerSubscription(

      userId,

      planId

    );





  await applySellerBenefits(

    userId,

    subscription.plan

  );




  return subscription;


}






// =====================================
// GET MY SUBSCRIPTION
// =====================================

export async function fetchMySubscription(

  userId:string

){


  return getMySubscription(

    userId

  );


}
