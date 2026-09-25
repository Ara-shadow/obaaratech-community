import { createSubscriptionSchema } from "./seller.subscription.schema.js";
import { subscribeSeller, fetchMySubscription } from "./seller.subscription.service.js";
// =====================================
// SUBSCRIBE
// =====================================
export async function subscribeController(request, reply) {
    try {
        const user = request.user;
        const data = createSubscriptionSchema.parse(request.body);
        const subscription = await subscribeSeller(user.id, data.planId);
        return reply.code(201).send({
            success: true,
            message: "Subscription activated",
            subscription
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// MY SUBSCRIPTION
// =====================================
export async function mySubscriptionController(request, reply) {
    try {
        const user = request.user;
        const subscription = await fetchMySubscription(user.id);
        return reply.send({
            success: true,
            subscription
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
