import {
    getPlans,
    getAllSellerPlans,
    getUserPlan,
    getSellerPlanById,
    updateSellerPlan,
    createDefaultPlans,
} from "./plan.repository.js";

import { prisma } from "../../lib/prisma.js";

// =================================
// TYPES
// =================================

export interface UpdatePlanInput {
    name?: string;
    price?: number;
    duration?: number;
    maxListings?: number;
    imageLimit?: number;
    featuredListing?: boolean;
    prioritySearch?: boolean;
    verifiedBadge?: boolean;
    isActive?: boolean;
}

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

export async function fetchSellerPlanById(
    id: string
) {
    const planId = id?.trim();

    if (!planId) {
        throw new Error(
            "Seller plan ID is required"
        );
    }

    return getSellerPlanById(planId);
}

// =================================
// UPDATE SELLER PLAN — ADMIN
// =================================

export async function updatePlan(
    id: string,
    data: UpdatePlanInput
) {
    const planId = id?.trim();

    if (!planId) {
        throw new Error(
            "Seller plan ID is required"
        );
    }

    const existing =
        await getSellerPlanById(planId);

    if (!existing) {
        throw new Error(
            "Seller plan not found"
        );
    }

    if (
        data.name !== undefined &&
        data.name.trim().length < 2
    ) {
        throw new Error(
            "Plan name must contain at least 2 characters"
        );
    }

    if (
        data.price !== undefined &&
        (!Number.isFinite(data.price) ||
            data.price < 0)
    ) {
        throw new Error(
            "Plan price cannot be negative"
        );
    }

    if (
        data.duration !== undefined &&
        (!Number.isInteger(data.duration) ||
            data.duration <= 0)
    ) {
        throw new Error(
            "Plan duration must be greater than zero"
        );
    }

    if (
        data.maxListings !== undefined &&
        (!Number.isInteger(data.maxListings) ||
            data.maxListings <= 0)
    ) {
        throw new Error(
            "Maximum listings must be greater than zero"
        );
    }

    if (
        data.imageLimit !== undefined &&
        (!Number.isInteger(data.imageLimit) ||
            data.imageLimit <= 0)
    ) {
        throw new Error(
            "Image limit must be greater than zero"
        );
    }

    const updateData: UpdatePlanInput = {
        ...data,
    };

    if (updateData.name !== undefined) {
        updateData.name =
            updateData.name
                .trim()
                .toUpperCase();
    }

    return updateSellerPlan(
        planId,
        updateData
    );
}

// =================================
// GET USER ACTIVE PLAN
// =================================

export async function fetchUserPlan(
    userId: string
) {
    const normalizedUserId =
        userId?.trim();

    if (!normalizedUserId) {
        throw new Error(
            "User ID is required"
        );
    }

    // ---------------------------------
    // CHECK EXISTING ACTIVE PLAN
    // ---------------------------------

    const existingPlan =
        await getUserPlan(
            normalizedUserId
        );

    if (existingPlan) {
        return existingPlan;
    }

    // ---------------------------------
    // ENSURE DEFAULT PLANS EXIST
    // ---------------------------------

    await createDefaultPlans();

    const plans =
        await getPlans();

    const freePlan =
        plans.find(
            (plan) =>
                plan.name
                    .trim()
                    .toUpperCase() ===
                "FREE"
        );

    if (!freePlan) {
        throw new Error(
            "FREE seller plan not found"
        );
    }

    // ---------------------------------
    // CHECK AGAIN BEFORE CREATING
    //
    // This helps prevent duplicate
    // subscriptions when two requests
    // arrive at nearly the same time.
    // ---------------------------------

    const existingSubscription =
        await prisma.sellerSubscription.findFirst(
            {
                where: {
                    userId:
                        normalizedUserId,

                    active: true,

                    expiryDate: {
                        gt: new Date(),
                    },
                },

                include: {
                    plan: true,
                },

                orderBy: {
                    expiryDate: "desc",
                },
            }
        );

    if (existingSubscription) {
        return existingSubscription;
    }

    // ---------------------------------
    // CREATE FREE SUBSCRIPTION
    // ---------------------------------

    const expiryDate =
        new Date();

    expiryDate.setDate(
        expiryDate.getDate() +
            freePlan.duration
    );

    const subscription =
        await prisma.sellerSubscription.create(
            {
                data: {
                    userId:
                        normalizedUserId,

                    planId:
                        freePlan.id,

                    active: true,

                    expiryDate,
                },

                include: {
                    plan: true,
                },
            }
        );

    return subscription;
}