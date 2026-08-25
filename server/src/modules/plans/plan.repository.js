import { prisma } from "../../lib/prisma.js";
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
            isActive: true
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
            isActive: true
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
            isActive: true
        }
    ];
    for (const plan of plans) {
        const existing = await prisma.sellerPlan.findUnique({
            where: {
                name: plan.name
            }
        });
        if (!existing) {
            await prisma.sellerPlan.create({
                data: plan
            });
        }
    }
}
// =================================
// GET ALL ACTIVE PLANS
// =================================
export async function getPlans() {
    return prisma.sellerPlan.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            price: "asc"
        }
    });
}
// =================================
// GET ALL PLANS FOR ADMIN
// =================================
export async function getAllSellerPlans() {
    return prisma.sellerPlan.findMany({
        orderBy: [
            {
                price: "asc"
            },
            {
                name: "asc"
            }
        ]
    });
}
// =================================
// GET SINGLE PLAN
// =================================
export async function getSellerPlanById(id) {
    return prisma.sellerPlan.findUnique({
        where: {
            id
        }
    });
}
// =================================
// UPDATE SELLER PLAN
// =================================
export async function updateSellerPlan(id, data) {
    return prisma.sellerPlan.update({
        where: {
            id
        },
        data
    });
}
// =================================
// GET USER ACTIVE PLAN
// =================================
export async function getUserPlan(userId) {
    return prisma.sellerSubscription.findFirst({
        where: {
            userId,
            active: true,
            expiryDate: {
                gt: new Date()
            }
        },
        include: {
            plan: true
        }
    });
}
