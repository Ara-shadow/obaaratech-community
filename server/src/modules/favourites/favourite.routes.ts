import type { FastifyInstance } from "fastify";


import {
  addFavouriteController,
  removeFavouriteController,
  getFavouritesController
} from "./favourite.controller.js";



export default async function favouriteRoutes(
  app: FastifyInstance
){

  // ============================
  // ADD FAVOURITE
  // ============================

  app.post(
    "/:listingId",
    {
      preHandler:[
        app.authenticate
      ]
    },
    addFavouriteController
  );




  // ============================
  // REMOVE FAVOURITE
  // ============================

  app.delete(
    "/:listingId",
    {
      preHandler:[
        app.authenticate
      ]
    },
    removeFavouriteController
  );





  // ============================
  // GET MY FAVOURITES
  // ============================

  app.get(
    "/",
    {
      preHandler:[
        app.authenticate
      ]
    },
    getFavouritesController
  );


}