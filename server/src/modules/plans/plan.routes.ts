import type {
 FastifyInstance
}
from "fastify";


import {
 getPlansController,
 getMyPlanController
}
from "./plan.controller.js";




export default async function planRoutes(

 app:FastifyInstance

){



app.get(

 "/",

 getPlansController

);



app.get(

 "/me",

 {

  preHandler:[
    app.authenticate
  ]

 },

 getMyPlanController

);



}
