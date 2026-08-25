import { getPlans, getAllSellerPlans, getUserPlan, getSellerPlanById, updateSellerPlan, createDefaultPlans } from "./plan.repository.js";
import { prisma } from "../../lib/prisma.js";
// =================================
// GET ACTIVE SELLER PLANS
// =================================
export async function fetchPlans() {
    await createDefaultPlans();
    return getPlans();
}
// =================================
// GET ALL SELLER PLANS — ADMIN
// =================================
export async function fetchAllSellerPlans() {
    await createDefaultPlans();
    return getAllSellerPlans();
}
// =================================
// GET SINGLE SELLER PLAN
// =================================
export async function fetchSellerPlanById(id) {
    return getSellerPlanById(id);
}
// =================================
// UPDATE SELLER PLAN — ADMIN
// =================================
export async function updatePlan(id, data) {
    const existing = await getSellerPlanById(id);
    if (!existing) {
        throw new Error("Seller plan not found");
    }
    if (data.name !== undefined &&
        data.name.trim().length < 2) {
        throw new Error("Plan name must contain at least 2 characters");
    }
    if (data.price !== undefined &&
        data.price < 0) {
        throw new Error("Plan price cannot be negative");
    }
    if (data.duration !== undefined &&
        data.duration <= 0) {
        throw new Error("Plan duration must be greater than zero");
    }
    if (data.maxListings !== undefined &&
        data.maxListings <= 0) {
        throw new Error("Maximum listings must be greater than zero");
    }
    if (data.imageLimit !== undefined &&
        data.imageLimit <= 0) {
        throw new Error("Image limit must be greater than zero");
    }
    return updateSellerPlan(id, data);
}
// =================================
// GET USER ACTIVE PLAN
// =================================
export async function fetchUserPlan(userId) {
    let userPlan = await getUserPlan(userId);
    if (!userPlan) {
        await createDefaultPlans();
        const plans = await getPlans();
        const free = plans.find(p => p.name === "FREE");
        if (!free) {
            throw new Error("FREE plan not found");
        }
        const expiry = new Date();
        expiry.setDate(expiry.getDate() +
            free.duration);
        userPlan =
            await prisma.sellerSubscription.create({
                data: {
                    userId,
                    planId: free.id,
                    expiryDate: expiry
                },
                include: {
                    plan: true
                }
            });
    }
    return userPlan;
}
