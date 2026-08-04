import type {
 FastifyReply,
 FastifyRequest,
} from "fastify";


import {
 addReview,
 fetchListingReviews,
 removeReview,
} from "./review.service.js";



export async function createReviewController(
 request:FastifyRequest,
 reply:FastifyReply
){

 const user =
 request.user as {
  id:string;
 };


 const { listingId } =
 request.params as {
  listingId:string;
 };


 const body =
 request.body as {
  rating:number;
  comment?:string;
 };


 const review =
 await addReview({

   rating:body.rating,

   ...(body.comment
     ? { comment: body.comment }
     : {}),

   userId:user.id,

   listingId,

 });


 return reply.code(201).send({

  success:true,

  message:"Review added",

  review,

 });

}




export async function getReviewsController(
 request:FastifyRequest,
 reply:FastifyReply
){

 const { listingId } =
 request.params as {
  listingId:string;
 };


 const reviews =
 await fetchListingReviews(listingId);


 return reply.send({

  success:true,

  reviews,

 });

}





export async function deleteReviewController(
 request:FastifyRequest,
 reply:FastifyReply
){

 const { id } =
 request.params as {
  id:string;
 };


 await removeReview(id);


 return reply.send({

  success:true,

  message:"Review deleted",

 });

}