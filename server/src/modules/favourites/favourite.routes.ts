import type { FastifyInstance } from "fastify";

import {
  addFavouriteController,
  removeFavouriteController,
  getFavouritesController,
} from "./favourite.controller.js";


export default async function favouriteRoutes(
  app: FastifyInstance
) {


  app.post(
    "/:listingId",
    {
      onRequest:[
        app.authenticate,
      ],
    },
    addFavouriteController
  );


  app.delete(
    "/:listingId",
    {
      onRequest:[
        app.authenticate,
      ],
    },
    removeFavouriteController
  );


  app.get(
    "/",
    {
      onRequest:[
        app.authenticate,
      ],
    },
    getFavouritesController
  );


}