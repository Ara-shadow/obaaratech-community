import type { FastifyInstance } from "fastify";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryController,
  getCategoryTreeController,
  getCategoryBySlugController,
  getCategoryChildrenController,
  searchCategoriesController,
  updateCategoryController,
  deleteCategoryController
} from "./category.controller.js";

import { authenticate } from "../../middleware/auth.js";


export default async function categoryRoutes(
  app: FastifyInstance
){

  app.post(
    "/",
    {
      preHandler: authenticate
    },
    async (request, reply) => {
      const user = request.user as { role?: string } | undefined;

      if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
        return reply.code(403).send({
          success: false,
          message: "Admin access required"
        });
      }

      return createCategoryController(request, reply);
    }
  );


  app.patch(
    "/:id",
    {
      preHandler: authenticate
    },
    async (request, reply) => {
      const user = request.user as { role?: string } | undefined;

      if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
        return reply.code(403).send({
          success: false,
          message: "Admin access required"
        });
      }

      return updateCategoryController(request, reply);
    }
  );


  app.delete(
    "/:id",
    {
      preHandler: authenticate
    },
    async (request, reply) => {
      const user = request.user as { role?: string } | undefined;

      if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
        return reply.code(403).send({
          success: false,
          message: "Admin access required"
        });
      }

      return deleteCategoryController(request, reply);
    }
  );


  app.get(
    "/",
    getCategoriesController
  );


  app.get(
    "/tree",
    getCategoryTreeController
  );


  app.get(
    "/search",
    searchCategoriesController
  );


  app.get(
    "/slug/:slug",
    getCategoryBySlugController
  );


  app.get(
    "/:id/children",
    getCategoryChildrenController
  );


  app.get(
    "/:id",
    getCategoryController
  );

}
