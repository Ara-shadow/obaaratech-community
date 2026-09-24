import { sellerDashboardController } from "./seller.dashboard.controller.js";
export default async function sellerDashboardRoutes(app) {
    app.get("/dashboard", {
        preHandler: [
            app.authenticate
        ]
    }, sellerDashboardController);
}
