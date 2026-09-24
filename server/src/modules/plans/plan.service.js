import { getPlans, getUserPlan, createDefaultPlans } from "./plan.repository.js";
import { prisma } from "../../lib/prisma.js";
export async function fetchPlans() {
    await createDefaultPlans();
    return getPlans();
}
export async function fetchUserPlan(userId) {
    let userPlan = await getUserPlan(userId);
    if (!userPlan) {
        await createDefaultPlans();
        const plans = await getPlans();
        const free = plans.find(p => p.name === "FREE");
        if (!free) {
            throw new Error("Free plan not found");
        }
        userPlan =
            await prisma.userPlan.create({
                data: {
                    userId,
                    planId: free.id
                },
                include: {
                    plan: true
                }
            });
    }
    return userPlan;
}
