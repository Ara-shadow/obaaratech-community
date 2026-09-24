import { fetchSellerProfile } from "./seller.service.js";
// =====================================
// GET SELLER PROFILE
// =====================================
export async function getSellerProfileController(request, reply) {
    try {
        const { sellerId } = request.params;
        const seller = await fetchSellerProfile(sellerId);
        return reply.send({
            success: true,
            seller
        });
    }
    catch (error) {
        return reply.code(404).send({
            success: false,
            message: error.message
        });
    }
}
