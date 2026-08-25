import { prisma } from "../../lib/prisma.js";
// =====================================
// CREATE PLAN
// =====================================
export async function createSellerPlan(data) {
    return prisma.sellerPlan.create({
        data
    });
}
// =====================================
// GET ALL PLANS
// =====================================
export async function getSellerPlans() {
    return prisma.sellerPlan.findMany({
        orderBy: {
            price: "asc"
        }
    });
}
// =====================================
// GET SINGLE PLAN
// =====================================
export async function getSellerPlanById(id) {
    return prisma.sellerPlan.findUnique({
        where: {
            id
        }
    });
}
// =====================================
// DELETE PLAN
// =====================================
export async function deleteSellerPlan(id) {
    return prisma.sellerPlan.delete({
        where: {
            id
        }
    });
}
