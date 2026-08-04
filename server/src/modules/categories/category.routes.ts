import type {
  FastifyInstance,
} from "fastify";


import {
  createCategoryController,
  getCategoriesController,
  getCategoryController,
} from "./category.controller.js";



export default async function categoryRoutes(
  app:FastifyInstance
){


  app.post(
    "/",
    createCategoryController
  );


  app.get(
    "/",
    getCategoriesController
  );


  app.get(
    "/:id",
    getCategoryController
  );


}