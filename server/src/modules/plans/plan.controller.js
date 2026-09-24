import { fetchPlans, fetchUserPlan } from "./plan.service.js";
export async function getPlansController(request, reply) {
    const plans = await fetchPlans();
    return reply.send({
        success: true,
        plans
    });
}
export async function getMyPlanController(request, reply) {
    const user = request.user;
    if (!user?.id) {
        return reply.code(401).send({
            success: false,
            message: "Unauthorized"
        });
    }
    const plan = await fetchUserPlan(user.id);
    return reply.send({
        success: true,
        plan
    });
}
