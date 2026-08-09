import type { FastifyInstance } from "fastify";


import {

  createListingController,

  getListingsController,

  getListingByIdController,

  getMyListingsController,

  updateListingController,

  deleteListingController,

  changeStatusController,

  searchListingsController

} from "./listing.controller.js";


import {

  addListingImageController,

  deleteListingImageController

} from "./listing.image.controller.js";





export default async function listingRoutes(

  app: FastifyInstance

) {





  console.log(
    "AUTH:",
    app.authenticate
  );


// ==========================
// CREATE LISTING
// ==========================

app.post(
    "/",
    {
        preHandler:[
            app.authenticate
        ]
    },
    createListingController
);



  // ==========================
  // SEARCH LISTINGS
  // ==========================

  app.get(

    "/search",

    searchListingsController

  );







  // ==========================
  // MY LISTINGS
  // ==========================

  app.get(

    "/my",

    {

      preHandler:[

        app.authenticate

      ]

    },

    getMyListingsController

  );







  // ==========================
  // ADD IMAGE TO LISTING
  // ==========================

  app.post(

    "/:id/images",

    {

      preHandler:[

        app.authenticate

      ]

    },

    addListingImageController

  );







  // ==========================
  // DELETE LISTING IMAGE
  // ==========================

  app.delete(

    "/:id/images/:imageId",

    {

      preHandler:[

        app.authenticate

      ]

    },

    deleteListingImageController

  );







  // ==========================
  // CHANGE LISTING STATUS
  // ==========================

  app.patch(

    "/:id/status",

    {

      preHandler:[

        app.authenticate

      ]

    },

    changeStatusController

  );







  // ==========================
  // UPDATE LISTING
  // ==========================

  app.put(

    "/:id",

    {

      preHandler:[

        app.authenticate

      ]

    },

    updateListingController

  );







  // ==========================
  // DELETE LISTING
  // ==========================

  app.delete(

    "/:id",

    {

      preHandler:[

        app.authenticate

      ]

    },

    deleteListingController

  );







  // ==========================
  // PUBLIC LISTINGS
  // ==========================

  app.get(

    "/",

    getListingsController

  );







  // ==========================
  // SINGLE LISTING
  // ==========================

  app.get(

    "/:id",

    getListingByIdController

  );



}