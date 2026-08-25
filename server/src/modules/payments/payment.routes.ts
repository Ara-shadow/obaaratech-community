import type {
    FastifyInstance
} from "fastify";

import {
    initializePaymentController,
    verifyPaymentController,
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


    // =================================
    // INITIALIZE PAYMENT
    // =================================

    app.post(

        "/initialize",

        {

            preHandler: [
                app.authenticate
            ]

        },

        initializePaymentController

    );


    // =================================
    // VERIFY PAYMENT
    // =================================

    app.post(

        "/verify",

        {

            preHandler: [
                app.authenticate
            ]

        },

        verifyPaymentController

    );


    // =================================
    // MANUAL PAYMENT SUBMISSION
    // =================================

    app.post(

        "/",

        {

            preHandler: [
                app.authenticate
            ]

        },

        createPaymentController

    );


    // =================================
    // MY PAYMENTS
    // =================================

    app.get(

        "/me",

        {

            preHandler: [
                app.authenticate
            ]

        },

        myPaymentsController

    );


    // =================================
    // GET PAYMENT
    // =================================

    app.get(

        "/:id",

        {

            preHandler: [
                app.authenticate
            ]

        },

        paymentByIdController

    );


    // =================================
    // ADMIN - ALL PAYMENTS
    // =================================

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


    // =================================
    // ADMIN - APPROVE
    // =================================

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


    // =================================
    // ADMIN - REJECT
    // =================================

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
