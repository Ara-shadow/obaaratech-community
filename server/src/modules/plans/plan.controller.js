import { fetchPlans, fetchUserPlan, fetchAllSellerPlans, fetchSellerPlanById, updatePlan, } from "./plan.service.js";
import { updateSellerPlanSchema, } from "./plan.schema.js";
// =================================
// GET ACTIVE PLANS
// =================================
export async function getPlansController(request, reply) {
    try {
        const plans = await fetchPlans();
        return reply.send({
            success: true,
            plans,
        });
    }
    catch (error) {
        request.log.error(error, "Failed to fetch seller plans");
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch seller plans";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
// =================================
// GET MY PLAN
// =================================
export async function getMyPlanController(request, reply) {
    try {
        const authenticatedRequest = request;
        const userId = authenticatedRequest.user?.id;
        if (!userId) {
            return reply.code(401).send({
                success: false,
                message: "Unauthorized",
            });
        }
        const plan = await fetchUserPlan(userId);
        return reply.send({
            success: true,
            plan,
        });
    }
    catch (error) {
        request.log.error(error, "Failed to fetch user's seller plan");
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch seller plan";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
// =================================
// ADMIN — GET ALL PLANS
// =================================
export async function adminGetSellerPlansController(request, reply) {
    try {
        const plans = await fetchAllSellerPlans();
        return reply.send({
            success: true,
            plans,
        });
    }
    catch (error) {
        request.log.error(error, "Failed to fetch all seller plans");
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch seller plans";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
// =================================
// ADMIN — GET SINGLE PLAN
// =================================
export async function adminGetSellerPlanController(request, reply) {
    try {
        const params = request.params;
        if (!params?.id?.trim()) {
            return reply.code(400).send({
                success: false,
                message: "Seller plan ID is required",
            });
        }
        const plan = await fetchSellerPlanById(params.id);
        if (!plan) {
            return reply.code(404).send({
                success: false,
                message: "Seller plan not found",
            });
        }
        return reply.send({
            success: true,
            plan,
        });
    }
    catch (error) {
        request.log.error(error, "Failed to fetch seller plan");
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch seller plan";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
// =================================
// ADMIN — UPDATE PLAN
// =================================
export async function adminUpdateSellerPlanController(request, reply) {
    try {
        const params = request.params;
        if (!params?.id?.trim()) {
            return reply.code(400).send({
                success: false,
                message: "Seller plan ID is required",
            });
        }
        const parsed = updateSellerPlanSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({
                success: false,
                message: "Invalid seller plan data",
                errors: parsed.error.flatten(),
            });
        }
        const plan = await updatePlan(params.id, parsed.data);
        return reply.send({
            success: true,
            message: "Seller plan updated successfully",
            plan,
        });
    }
    catch (error) {
        request.log.error(error, "Failed to update seller plan");
        const message = error instanceof Error
            ? error.message
            : "Failed to update seller plan";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
