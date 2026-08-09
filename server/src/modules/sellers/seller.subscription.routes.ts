import type { FastifyInstance } from "fastify";


import {

 subscribeController,

 mySubscriptionController

} from "./seller.subscription.controller.js";





export default async function sellerSubscriptionRoutes(

 app:FastifyInstance

){



 app.post(

  "/",

  {

    preHandler:[

      app.authenticate

    ]

  },

  subscribeController

 );





 app.get(

  "/me",

  {

    preHandler:[

      app.authenticate

    ]

  },

  mySubscriptionController

 );


}