import type {
    FastifyInstance
} from "fastify";

import {
    initializeMarketplacePaymentController,
    verifyMarketplacePaymentController,
    marketplaceTransactionController,
    marketplaceTransactionByOrderController,
    sellerEarningsController,
    sellerBalanceController
} from "./marketplace-payment.controller.js";

import {
    flutterwaveMarketplaceWebhookController
} from "./marketplace-payment.webhook.controller.js";

// =====================================
// MARKETPLACE PAYMENT ROUTES
// =====================================

export default async function marketplacePaymentRoutes(
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

        initializeMarketplacePaymentController

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

        verifyMarketplacePaymentController

    );

    // =================================
    // GET TRANSACTION
    // =================================

    app.get(

        "/transactions/:id",

        {

            preHandler: [
                app.authenticate
            ]

        },

        marketplaceTransactionController

    );

    // =================================
    // GET TRANSACTION BY ORDER
    // =================================

    app.get(

        "/orders/:orderId/transaction",

        {

            preHandler: [
                app.authenticate
            ]

        },

        marketplaceTransactionByOrderController

    );

    // =================================
    // FLUTTERWAVE WEBHOOK
    // =================================
    //
    // DO NOT USE app.authenticate.
    //
    // Flutterwave calls this endpoint
    // directly.
    //
    // Authentication is performed with
    // FLW_SECRET_HASH and the
    // flutterwave-signature header.
    //

    app.post(

        "/webhook/flutterwave",

        flutterwaveMarketplaceWebhookController

    );

    // =================================
    // SELLER EARNINGS
    // =================================

    app.get(

        "/seller/earnings",

        {

            preHandler: [
                app.authenticate
            ]

        },

        sellerEarningsController

    );

    // =================================
    // SELLER BALANCE
    // =================================

    app.get(

        "/seller/balance",

        {

            preHandler: [
                app.authenticate
            ]

        },

        sellerBalanceController

    );

}