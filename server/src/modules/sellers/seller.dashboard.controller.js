import { getSellerDashboard } from "./seller.dashboard.service.js";
// =================================
// SELLER DASHBOARD
// =================================
export async function sellerDashboardController(request, reply) {
    const user = request.user;
    const dashboard = await getSellerDashboard(request.server, user.id);
    return reply.send({
        success: true,
        dashboard
    });
}
