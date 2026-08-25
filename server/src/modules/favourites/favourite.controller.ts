import type {
 FastifyReply,
 FastifyRequest,
} from "fastify";


import {
 saveFavourite,
 deleteFavourite,
 fetchUserFavourites,
} from "./favourite.service.js";



export async function addFavouriteController(
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


 const favourite =
 await saveFavourite(
  user.id,
  listingId
 );


 return reply.code(201).send({

  success:true,

  message:"Listing saved",

  favourite,

 });

}




export async function removeFavouriteController(
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


 await deleteFavourite(
  user.id,
  listingId
 );


 return reply.send({

  success:true,

  message:"Listing removed from favourites",

 });

}





export async function getFavouritesController(
 request:FastifyRequest,
 reply:FastifyReply
){

 const user =
 request.user as {
  id:string;
 };


 const favourites =
 await fetchUserFavourites(
  user.id
 );


 return reply.send({

  success:true,

  favourites,

 });

}
