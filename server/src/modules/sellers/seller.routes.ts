import type { FastifyInstance } from "fastify";


import {

  getSellerProfileController

} from "./seller.controller.js";


import {

  sellerDashboardController

} from "./seller.dashboard.controller.js";


import {
    getSellerBusinessHoursController,
    updateSellerBusinessHoursController
} from "./seller.hours.controller.js";


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
// SELLER BUSINESS HOURS
// ==============================

app.get(
    "/business-hours",
    {
        preHandler: [
            app.authenticate
        ]
    },
    getSellerBusinessHoursController
);


app.put(
    "/business-hours",
    {
        preHandler: [
            app.authenticate
        ]
    },
    updateSellerBusinessHoursController
);


  // ==============================
  // PUBLIC SELLER PROFILE
  // ==============================

  app.get(

    "/:sellerId",

    getSellerProfileController

  );



}
