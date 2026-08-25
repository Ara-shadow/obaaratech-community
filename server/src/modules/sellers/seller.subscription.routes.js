import { mySubscriptionController } from "./seller.subscription.controller.js";
// =====================================
// SELLER SUBSCRIPTION ROUTES
// =====================================
export default async function sellerSubscriptionRoutes(app) {
    // ===================================
    // MY SUBSCRIPTION
    // ===================================
    //
    // Users can view their current
    // subscription, but cannot activate
    // a plan directly from this endpoint.
    //
    // Subscription activation happens only
    // through the payment flow.
    // ===================================
    app.get("/me", {
        preHandler: [
            app.authenticate
        ]
    }, mySubscriptionController);
}
