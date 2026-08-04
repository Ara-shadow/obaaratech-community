import type { FastifyInstance } from "fastify";

import {
  uploadImageController,
} from "./upload.controller.js";


export default async function uploadRoutes(
  app: FastifyInstance
){

  app.post(
    "/listing/:listingId",
    {
      onRequest:[
        app.authenticate,
      ],
    },
    uploadImageController
  );

}