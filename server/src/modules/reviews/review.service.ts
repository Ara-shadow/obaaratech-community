import type { FastifyInstance } from "fastify";


import {

  createReview,

  getListingReviews

} from "./review.repository.js";





// ==============================
// CREATE REVIEW
// ==============================

export async function addReview(

  app: FastifyInstance,

  data: {

    rating:number;

    comment?:string;

    userId:string;

    listingId:string;

  }

){


  return createReview(

    app,

    data

  );


}







// ==============================
// FETCH LISTING REVIEWS
// ==============================

export async function fetchListingReviews(

  app: FastifyInstance,

  listingId:string

){


  return getListingReviews(

    app,

    listingId

  );


}