import { subscribeController, mySubscriptionController } from "./seller.subscription.controller.js";
export default async function sellerSubscriptionRoutes(app) {
    app.post("/", {
        preHandler: [
            app.authenticate
        ]
    }, subscribeController);
    app.get("/me", {
        preHandler: [
            app.authenticate
        ]
    }, mySubscriptionController);
}
