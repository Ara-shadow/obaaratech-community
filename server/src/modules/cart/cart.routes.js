import { getCartController, addCartController, updateCartController, removeCartController, clearCartController } from "./cart.controller.js";
export default async function cartRoutes(app) {
    // ============================
    // GET USER CART
    // ============================
    app.get("/", {
        preHandler: [
            app.authenticate
        ]
    }, getCartController);
    // ============================
    // ADD TO CART
    // ============================
    app.post("/:listingId", {
        preHandler: [
            app.authenticate
        ]
    }, addCartController);
    // ============================
    // UPDATE QUANTITY
    // ============================
    app.patch("/item/:itemId", {
        preHandler: [
            app.authenticate
        ]
    }, updateCartController);
    // ============================
    // REMOVE ITEM
    // ============================
    app.delete("/item/:itemId", {
        preHandler: [
            app.authenticate
        ]
    }, removeCartController);
    // ============================
    // CLEAR CART
    // ============================
    app.delete("/", {
        preHandler: [
            app.authenticate
        ]
    }, clearCartController);
}
