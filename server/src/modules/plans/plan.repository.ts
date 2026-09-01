import { prisma } from "../../lib/prisma.js";

// =================================
// TYPES
// =================================

export interface UpdateSellerPlanInput {
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
// CREATE DEFAULT SELLER PLANS
// =================================

export async function createDefaultPlans() {
    const plans = [
        {
            name: "FREE",
            price: 0,
            duration: 30,
            maxListings: 5,
            imageLimit: 3,
            featuredListing: false,
            prioritySearch: false,
            verifiedBadge: false,
            isActive: true,
        },
        {
            name: "PREMIUM",
            price: 5000,
            duration: 30,
            maxListings: 50,
            imageLimit: 10,
            featuredListing: true,
            prioritySearch: true,
            verifiedBadge: false,
            isActive: true,
        },
        {
            name: "BUSINESS",
            price: 15000,
            duration: 30,
            maxListings: 150,
            imageLimit: 30,
            featuredListing: true,
            prioritySearch: true,
            verifiedBadge: true,
            isActive: true,
        },
    ];

    for (const plan of plans) {
        await prisma.sellerPlan.upsert({
            where: {
                name: plan.name,
            },

            update: {
                price: plan.price,
                duration: plan.duration,
                maxListings: plan.maxListings,
                imageLimit: plan.imageLimit,
                featuredListing: plan.featuredListing,
                prioritySearch: plan.prioritySearch,
                verifiedBadge: plan.verifiedBadge,
                isActive: plan.isActive,
            },

            create: plan,
        });
    }

    return prisma.sellerPlan.findMany({
        orderBy: {
            price: "asc",
        },
    });
}

// =================================
// GET ALL ACTIVE PLANS
// =================================

export async function getPlans() {
    return prisma.sellerPlan.findMany({
        where: {
            isActive: true,
        },

        orderBy: [
            {
                price: "asc",
            },
            {
                name: "asc",
            },
        ],
    });
}

// =================================
// GET ALL PLANS FOR ADMIN
// =================================

export async function getAllSellerPlans() {
    return prisma.sellerPlan.findMany({
        orderBy: [
            {
                price: "asc",
            },
            {
                name: "asc",
            },
        ],
    });
}

// =================================
// GET SINGLE PLAN
// =================================

export async function getSellerPlanById(
    id: string
) {
    if (!id.trim()) {
        throw new Error(
            "Seller plan ID is required"
        );
    }

    return prisma.sellerPlan.findUnique({
        where: {
            id,
        },
    });
}

// =================================
// UPDATE SELLER PLAN
// =================================

export async function updateSellerPlan(
    id: string,
    data: UpdateSellerPlanInput
) {
    if (!id.trim()) {
        throw new Error(
            "Seller plan ID is required"
        );
    }

    if (
        data.name !== undefined &&
        !data.name.trim()
    ) {
        throw new Error(
            "Seller plan name cannot be empty"
        );
    }

    if (
        data.price !== undefined &&
        (!Number.isFinite(data.price) ||
            data.price < 0)
    ) {
        throw new Error(
            "Seller plan price must be a non-negative number"
        );
    }

    if (
        data.duration !== undefined &&
        (!Number.isInteger(data.duration) ||
            data.duration <= 0)
    ) {
        throw new Error(
            "Seller plan duration must be a positive integer"
        );
    }

    if (
        data.maxListings !== undefined &&
        (!Number.isInteger(data.maxListings) ||
            data.maxListings < 0)
    ) {
        throw new Error(
            "Maximum listings must be a non-negative integer"
        );
    }

    if (
        data.imageLimit !== undefined &&
        (!Number.isInteger(data.imageLimit) ||
            data.imageLimit < 1)
    ) {
        throw new Error(
            "Image limit must be a positive integer"
        );
    }

    const existingPlan =
        await prisma.sellerPlan.findUnique({
            where: {
                id,
            },
        });

    if (!existingPlan) {
        throw new Error(
            "Seller plan not found"
        );
    }

    const updateData: UpdateSellerPlanInput = {
        ...data,
    };

    if (updateData.name !== undefined) {
        updateData.name =
            updateData.name.trim().toUpperCase();
    }

    return prisma.sellerPlan.update({
        where: {
            id,
        },

        data: updateData,
    });
}

// =================================
// GET USER ACTIVE PLAN
// =================================

export async function getUserPlan(
    userId: string
) {
    if (!userId.trim()) {
        throw new Error(
            "User ID is required"
        );
    }

    return prisma.sellerSubscription.findFirst({
        where: {
            userId,
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
    });
}