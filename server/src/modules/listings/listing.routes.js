import { createListingController, getListingsController, getListingByIdController, getMyListingsController, updateListingController, deleteListingController, changeStatusController, searchListingsController, getRelatedListingsController } from "./listing.controller.js";
export default async function listingRoutes(app) {
    console.log("AUTH:", app.authenticate);
    // ==========================
    // CREATE LISTING
    // ==========================
    app.post("/", {
        preHandler: [
            app.authenticate
        ]
    }, createListingController);
    // ==========================
    // SEARCH LISTINGS
    // ==========================
    app.get("/search", searchListingsController);
    // ==========================
    // MY LISTINGS
    // ==========================
    app.get("/my", {
        preHandler: [
            app.authenticate
        ]
    }, getMyListingsController);
    // ==========================
    // CHANGE LISTING STATUS
    // ==========================
    app.patch("/:id/status", {
        preHandler: [
            app.authenticate
        ]
    }, changeStatusController);
    // ==========================
    // UPDATE LISTING
    // ==========================
    app.put("/:id", {
        preHandler: [
            app.authenticate
        ]
    }, updateListingController);
    // ==========================
    // DELETE LISTING
    // ==========================
    app.delete("/:id", {
        preHandler: [
            app.authenticate
        ]
    }, deleteListingController);
    // ==========================
    // PUBLIC LISTINGS
    // ==========================
    app.get("/", getListingsController);
    // ==========================
    // RELATED LISTINGS
    // ==========================
    app.get("/:id/related", getRelatedListingsController);
    // ==========================
    // SINGLE LISTING
    // ==========================
    app.get("/:id", getListingByIdController);
}
