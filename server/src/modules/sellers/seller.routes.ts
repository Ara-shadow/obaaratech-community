import type { FastifyInstance } from "fastify";


import {

  getSellerProfileController

} from "./seller.controller.js";


import {

  sellerDashboardController

} from "./seller.dashboard.controller.js";





export default async function sellerRoutes(

  app: FastifyInstance

){



  // ==============================
  // SELLER DASHBOARD
  // ==============================

  app.get(

    "/dashboard",

    {

      preHandler:[

        app.authenticate

      ]

    },

    sellerDashboardController

  );






  // ==============================
  // PUBLIC SELLER PROFILE
  // ==============================

  app.get(

    "/:sellerId",

    getSellerProfileController

  );



}
