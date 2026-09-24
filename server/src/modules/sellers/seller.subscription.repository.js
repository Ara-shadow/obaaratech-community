import { prisma } from "../../lib/prisma.js";
// =====================================
// CREATE SUBSCRIPTION
// =====================================
export async function createSellerSubscription(userId, planId) {
    const plan = await prisma.sellerPlan.findUnique({
        where: {
            id: planId
        }
    });
    if (!plan) {
        throw new Error("Seller plan not found");
    }
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);
    const existing = await prisma.sellerSubscription.findUnique({
        where: {
            userId
        }
    });
    if (existing) {
        return prisma.sellerSubscription.update({
            where: {
                userId
            },
            data: {
                planId,
                startDate: new Date(),
                expiryDate,
                active: true
            },
            include: {
                plan: true
            }
        });
    }
    return prisma.sellerSubscription.create({
        data: {
            userId,
            planId,
            expiryDate
        },
        include: {
            plan: true
        }
    });
}
// =====================================
// GET MY SUBSCRIPTION
// =====================================
export async function getMySubscription(userId) {
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
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}
