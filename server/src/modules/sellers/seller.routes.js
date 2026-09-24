import { getSellerProfileController } from "./seller.controller.js";
import { sellerDashboardController } from "./seller.dashboard.controller.js";
export default async function sellerRoutes(app) {
    // ==============================
    // SELLER DASHBOARD
    // ==============================
    app.get("/dashboard", {
        preHandler: [
            app.authenticate
        ]
    }, sellerDashboardController);
    // ==============================
    // PUBLIC SELLER PROFILE
    // ==============================
    app.get("/:sellerId", getSellerProfileController);
}
