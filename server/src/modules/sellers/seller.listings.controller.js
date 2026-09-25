import { getSellerListings, updateSellerListing, deleteSellerListing, markListingSold, } from "./seller.listings.service.js";
// =====================================
// GET SELLER LISTINGS
// =====================================
export async function sellerListingsController(request, reply) {
    try {
        const user = request.user;
        if (!user?.id) {
            return reply.code(401).send({
                success: false,
                message: "Unauthorized",
            });
        }
        const listings = await getSellerListings(user.id);
        return reply.send({
            success: true,
            listings,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to retrieve seller listings";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
// =====================================
// UPDATE SELLER LISTING
// =====================================
export async function updateSellerListingController(request, reply) {
    try {
        const user = request.user;
        if (!user?.id) {
            return reply.code(401).send({
                success: false,
                message: "Unauthorized",
            });
        }
        const params = request.params;
        const listingId = params.id?.trim();
        if (!listingId) {
            return reply.code(400).send({
                success: false,
                message: "Listing ID is required",
            });
        }
        const listing = await updateSellerListing(user.id, listingId, request.body);
        return reply.send({
            success: true,
            listing,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to update listing";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
// =====================================
// DELETE SELLER LISTING
// =====================================
export async function deleteSellerListingController(request, reply) {
    try {
        const user = request.user;
        if (!user?.id) {
            return reply.code(401).send({
                success: false,
                message: "Unauthorized",
            });
        }
        const params = request.params;
        const listingId = params.id?.trim();
        if (!listingId) {
            return reply.code(400).send({
                success: false,
                message: "Listing ID is required",
            });
        }
        await deleteSellerListing(user.id, listingId);
        return reply.send({
            success: true,
            message: "Listing deleted successfully",
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to delete listing";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
// =====================================
// MARK LISTING SOLD
// =====================================
export async function markListingSoldController(request, reply) {
    try {
        const user = request.user;
        if (!user?.id) {
            return reply.code(401).send({
                success: false,
                message: "Unauthorized",
            });
        }
        const params = request.params;
        const listingId = params.id?.trim();
        if (!listingId) {
            return reply.code(400).send({
                success: false,
                message: "Listing ID is required",
            });
        }
        const listing = await markListingSold(user.id, listingId);
        return reply.send({
            success: true,
            listing,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Unable to mark listing as sold";
        return reply.code(400).send({
            success: false,
            message,
        });
    }
}
