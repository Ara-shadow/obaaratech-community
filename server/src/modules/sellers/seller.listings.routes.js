import { sellerListingsController, updateSellerListingController, deleteSellerListingController, markListingSoldController, } from "./seller.listings.controller.js";
// =====================================
// SELLER LISTING ROUTES
// =====================================
export default async function sellerListingRoutes(app) {
    // =====================================
    // GET SELLER LISTINGS
    // =====================================
    app.get("/listings", {
        preHandler: [
            app.authenticate,
        ],
    }, sellerListingsController);
    // =====================================
    // UPDATE SELLER LISTING
    // =====================================
    app.patch("/listings/:id", {
        preHandler: [
            app.authenticate,
        ],
    }, updateSellerListingController);
    // =====================================
    // DELETE SELLER LISTING
    // =====================================
    app.delete("/listings/:id", {
        preHandler: [
            app.authenticate,
        ],
    }, deleteSellerListingController);
    // =====================================
    // MARK LISTING AS SOLD
    // =====================================
    app.patch("/listings/:id/sold", {
        preHandler: [
            app.authenticate,
        ],
    }, markListingSoldController);
}
