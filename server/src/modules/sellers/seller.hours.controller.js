import { fetchSellerBusinessHours, updateSellerBusinessHours } from "./seller.hours.service.js";
// =====================================================
// GET SELLER BUSINESS HOURS
// =====================================================
export async function getSellerBusinessHoursController(request, reply) {
    try {
        const user = request.user;
        const hours = await fetchSellerBusinessHours(user.id);
        return reply.send({
            success: true,
            hours
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error?.message ||
                "Unable to load business hours"
        });
    }
}
// =====================================================
// UPDATE SELLER BUSINESS HOURS
// =====================================================
export async function updateSellerBusinessHoursController(request, reply) {
    try {
        const user = request.user;
        const hours = await updateSellerBusinessHours(user.id, request.body);
        return reply.send({
            success: true,
            message: "Business hours updated successfully",
            hours
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error?.message ||
                "Unable to update business hours"
        });
    }
}
