import type { FastifyInstance } from "fastify";


import {

  createReviewController,

  getListingReviewsController

} from "./review.controller.js";





export default async function reviewRoutes(

  app: FastifyInstance

){



  // ==============================
  // CREATE REVIEW
  // ==============================

  app.post(

    "/:listingId",

    {

      onRequest:[

        app.authenticate

      ]

    },

    createReviewController

  );






  // ==============================
  // GET LISTING REVIEWS
  // ==============================

  app.get(

    "/listing/:listingId",

    getListingReviewsController

  );



}