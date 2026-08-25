import type {
    FastifyInstance
} from "fastify";

import {
    checkoutController,
    getBuyerOrdersController,
    getBuyerOrderController,
    getSellerOrdersController,
    getSellerOrderController,
    updateSellerOrderStatusController
} from "./order.controller.js";

export default async function orderRoutes(
    app: FastifyInstance
) {
    // =============================================
    // CHECKOUT
    // POST /api/checkout
    // =============================================

    app.post(
        "/checkout",
        {
            preHandler:
                app.authenticate
        },
        checkoutController
    );

    // =============================================
    // BUYER ORDERS
    // GET /api/orders
    // =============================================

    app.get(
        "/orders",
        {
            preHandler:
                app.authenticate
        },
        getBuyerOrdersController
    );

    // =============================================
    // BUYER ORDER
    // GET /api/orders/:id
    // =============================================

    app.get(
        "/orders/:id",
        {
            preHandler:
                app.authenticate
        },
        getBuyerOrderController
    );

    // =============================================
    // SELLER ORDERS
    // GET /api/seller/orders
    // =============================================

    app.get(
        "/seller/orders",
        {
            preHandler:
                app.authenticate
        },
        getSellerOrdersController
    );

    // =============================================
    // SELLER ORDER
    // GET /api/seller/orders/:id
    // =============================================

    app.get(
        "/seller/orders/:id",
        {
            preHandler:
                app.authenticate
        },
        getSellerOrderController
    );

    // =============================================
    // SELLER ORDER STATUS
    // PATCH /api/seller/orders/:id/status
    // =============================================

    app.patch(
        "/seller/orders/:id/status",
        {
            preHandler:
                app.authenticate
        },
        updateSellerOrderStatusController
    );
}