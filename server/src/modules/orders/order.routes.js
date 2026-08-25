import { checkoutController, getBuyerOrdersController, getBuyerOrderController, getSellerOrdersController, getSellerOrderController, updateSellerOrderStatusController } from "./order.controller.js";
export default async function orderRoutes(app) {
    // =====================================
    // BUYER CHECKOUT
    // =====================================
    app.post("/checkout", {
        preHandler: [
            app.authenticate
        ]
    }, checkoutController);
    // =====================================
    // BUYER ORDERS
    // =====================================
    app.get("/orders", {
        preHandler: [
            app.authenticate
        ]
    }, getBuyerOrdersController);
    // =====================================
    // SINGLE BUYER ORDER
    // =====================================
    app.get("/orders/:id", {
        preHandler: [
            app.authenticate
        ]
    }, getBuyerOrderController);
    // =====================================
    // SELLER ORDERS
    // =====================================
    app.get("/seller/orders", {
        preHandler: [
            app.authenticate
        ]
    }, getSellerOrdersController);
    // =====================================
    // SINGLE SELLER ORDER
    // =====================================
    app.get("/seller/orders/:id", {
        preHandler: [
            app.authenticate
        ]
    }, getSellerOrderController);
    // =====================================
    // UPDATE SELLER ORDER STATUS
    // =====================================
    app.patch("/seller/orders/:id/status", {
        preHandler: [
            app.authenticate
        ]
    }, updateSellerOrderStatusController);
}
