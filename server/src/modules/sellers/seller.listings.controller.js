import { getSellerListings, updateSellerListing, deleteSellerListing, markListingSold } from "./seller.listings.service.js";
// =================================
// GET SELLER LISTINGS
// =================================
export async function sellerListingsController(request, reply) {
    try {
        const user = request.user;
        const listings = await getSellerListings(user.id);
        return reply.send({
            success: true,
            listings
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
// =================================
// UPDATE LISTING
// =================================
export async function updateSellerListingController(request, reply) {
    try {
        const user = request.user;
        const params = request.params;
        const listing = await updateSellerListing(request.server, user.id, params.id, request.body);
        return reply.send({
            success: true,
            listing
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
// =================================
// DELETE LISTING
// =================================
export async function deleteSellerListingController(request, reply) {
    try {
        const user = request.user;
        const params = request.params;
        await deleteSellerListing(request.server, user.id, params.id);
        return reply.send({
            success: true,
            message: "Listing deleted"
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
// =================================
// MARK SOLD
// =================================
export async function markListingSoldController(request, reply) {
    try {
        const user = request.user;
        const params = request.params;
        const listing = await markListingSold(request.server, user.id, params.id);
        return reply.send({
            success: true,
            listing
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
