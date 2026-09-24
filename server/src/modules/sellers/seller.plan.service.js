import { createSellerPlan, getSellerPlans, getSellerPlanById, deleteSellerPlan } from "./seller.plan.repository.js";
export async function createPlan(data) {
    return createSellerPlan(data);
}
export async function fetchPlans() {
    return getSellerPlans();
}
export async function fetchPlanById(id) {
    return getSellerPlanById(id);
}
export async function removePlan(id) {
    return deleteSellerPlan(id);
}
