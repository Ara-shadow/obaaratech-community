import { createNewListing, fetchListings, fetchListingById, fetchMyListings, editListing, removeListing, fetchSearchListings, updateListingStatus } from "./listing.service.js";
// ===============================
// CREATE LISTING
// ===============================
export async function createListingController(request, reply) {
    const user = request.user;
    try {
        const listing = await createNewListing(request.body, user.id);
        return reply.send({
            success: true,
            listing
        });
    }
    catch (error) {
        return reply.code(403).send({
            success: false,
            message: error.message
        });
    }
}
// ===============================
// GET ALL LISTINGS
// ===============================
export async function getListingsController(request, reply) {
    const listings = await fetchListings();
    return reply.send({
        success: true,
        listings
    });
}
// ===============================
// SEARCH LISTINGS
// ===============================
export async function searchListingsController(request, reply) {
    const listings = await fetchSearchListings(request.query);
    return reply.send({
        success: true,
        listings
    });
}
// ===============================
// SINGLE LISTING
// ===============================
export async function getListingByIdController(request, reply) {
    const params = request.params;
    const listing = await fetchListingById(params.id);
    if (!listing) {
        return reply.code(404).send({
            success: false,
            message: "Listing not found"
        });
    }
    return reply.send({
        success: true,
        listing
    });
}
// ===============================
// MY LISTINGS
// ===============================
export async function getMyListingsController(request, reply) {
    const user = request.user;
    const listings = await fetchMyListings(user.id);
    return reply.send({
        success: true,
        listings
    });
}
// ===============================
// UPDATE LISTING
// ===============================
export async function updateListingController(request, reply) {
    const user = request.user;
    const params = request.params;
    const listing = await editListing(params.id, user.id, request.body);
    return reply.send({
        success: true,
        listing
    });
}
// ===============================
// DELETE LISTING
// ===============================
export async function deleteListingController(request, reply) {
    const user = request.user;
    const params = request.params;
    await removeListing(params.id, user.id);
    return reply.send({
        success: true,
        message: "Listing deleted"
    });
}
// ===============================
// CHANGE STATUS
// ===============================
export async function changeStatusController(request, reply) {
    const user = request.user;
    const params = request.params;
    const body = request.body;
    const listing = await updateListingStatus(params.id, user.id, body.status);
    return reply.send({
        success: true,
        listing
    });
}
