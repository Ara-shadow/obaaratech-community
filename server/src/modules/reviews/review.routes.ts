import type { FastifyInstance } from "fastify";

import {
  createReviewController,
  getReviewsController,
  deleteReviewController,
} from "./review.controller.js";


export default async function reviewRoutes(
  app: FastifyInstance
){


  // Add review to listing
  app.post(
    "/:listingId",
    {
      onRequest:[
        app.authenticate,
      ],
    },
    createReviewController
  );



  // Get listing reviews
  app.get(
    "/:listingId",
    getReviewsController
  );



  // Delete review
  app.delete(
    "/:id",
    {
      onRequest:[
        app.authenticate,
      ],
    },
    deleteReviewController
  );


}