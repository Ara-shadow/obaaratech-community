import { getSellerDashboard } from "./seller.dashboard.service.js";
// =================================
// SELLER DASHBOARD
// =================================
export async function sellerDashboardController(request, reply) {
    try {
        const user = request.user;
        const dashboard = await getSellerDashboard(user.id);
        return reply.send({
            success: true,
            dashboard
        });
    }
    catch (error) {
        const message = error?.message ??
            "Unable to load seller dashboard";
        if (message ===
            "Business plan required to access the seller dashboard") {
            return reply.code(403).send({
                success: false,
                message
            });
        }
        return reply.code(400).send({
            success: false,
            message
        });
    }
}
