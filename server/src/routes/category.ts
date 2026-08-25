import type { FastifyInstance } from "fastify";

import { authenticate } from "../middleware/auth.js";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryTreeController
} from "../modules/categories/category.controller.js";

import {
  getCategoryController
} from "../modules/categories/category.controller.js";


export default async function categoryRoutes(
  app: FastifyInstance
) {

  // ===================================================
  // GET ALL CATEGORIES
  // ===================================================

  app.get(
    "/",
    getCategoriesController
  );


  // ===================================================
  // GET CATEGORY TREE
  // ===================================================

  app.get(
    "/tree",
    getCategoryTreeController
  );


  // ===================================================
  // GET SINGLE CATEGORY
  // ===================================================

  app.get(
    "/:id",
    getCategoryController
  );


  // ===================================================
  // CREATE CATEGORY
  // ===================================================

  app.post(
    "/",
    {
      preHandler: authenticate
    },
    async (request, reply) => {

      const user = request.user as {
        id: string;
        role: string;
      };


      if (
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN"
      ) {

        return reply.code(403).send({

          success: false,

          message:
            "Admin access required"

        });

      }


      return createCategoryController(
        request,
        reply
      );

    }
  );

}