import type {
  FastifyInstance
} from "fastify";

import {
  createPaymentController,
  myPaymentsController,
  paymentByIdController,
  allPaymentsController,
  approvePaymentController,
  rejectPaymentController
} from "./payment.controller.js";

import {
  adminOnly
} from "../../middleware/role.js";


// =====================================
// PAYMENT ROUTES
// =====================================

export default async function paymentRoutes(
  app: FastifyInstance
) {


  // ===================================
  // SELLER / USER
  // ===================================

  app.post(

    "/",

    {

      preHandler: [
        app.authenticate
      ]

    },

    createPaymentController

  );


  app.get(

    "/me",

    {

      preHandler: [
        app.authenticate
      ]

    },

    myPaymentsController

  );


  app.get(

    "/:id",

    {

      preHandler: [
        app.authenticate
      ]

    },

    paymentByIdController

  );


  // ===================================
  // ADMIN
  // ===================================

  app.get(

    "/",

    {

      preHandler: [
        app.authenticate,
        adminOnly
      ]

    },

    allPaymentsController

  );


  app.post(

    "/:id/approve",

    {

      preHandler: [
        app.authenticate,
        adminOnly
      ]

    },

    approvePaymentController

  );


  app.post(

    "/:id/reject",

    {

      preHandler: [
        app.authenticate,
        adminOnly
      ]

    },

    rejectPaymentController

  );

}