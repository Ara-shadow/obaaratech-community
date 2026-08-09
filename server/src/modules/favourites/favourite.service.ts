import {
  addFavourite,
  removeFavourite,
  getMyFavourites
} from "./favourite.repository.js";

import type { FastifyInstance } from "fastify";




// ============================
// SAVE FAVOURITE
// ============================

export async function saveFavourite(
  app: FastifyInstance,
  userId:string,
  listingId:string
){

  return addFavourite(
    app,
    userId,
    listingId
  );

}




// ============================
// REMOVE FAVOURITE
// ============================

export async function deleteFavourite(
  app: FastifyInstance,
  userId:string,
  listingId:string
){

  return removeFavourite(
    app,
    userId,
    listingId
  );

}




// ============================
// GET USER FAVOURITES
// ============================

export async function fetchUserFavourites(
  app: FastifyInstance,
  userId:string
){

  return getMyFavourites(
    app,
    userId
  );

}