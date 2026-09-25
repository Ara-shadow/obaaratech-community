import { prisma } from "../../lib/prisma.js";
import { createListingWithFeatured, getListings, getListingById, getMyListings, updateListing as updateListingRepository, deleteListing, changeListingStatus, searchListings, getRelatedListings, } from "./listing.repository.js";
import { checkListingLimit } from "../sellers/seller.access.service.js";
// =================================
// CREATE LISTING
// =================================
export async function createNewListing(data, userId) {
    await checkListingLimit(userId);
    const subscription = await prisma.sellerSubscription.findFirst({
        where: {
            userId,
            active: true
        },
        include: {
            plan: true
        }
    });
    const featured = subscription?.plan?.featuredListing ?? false;
    return createListingWithFeatured({
        title: data.title,
        description: data.description,
        price: Number(data.price),
        currency: data.currency ?? "NGN",
        location: data.location,
        condition: data.condition,
        type: data.type,
        negotiable: data.negotiable,
        available: data.available,
        status: data.status,
        categoryId: data.categoryId,
        details: data.details,
        ownerId: userId,
        featured
    });
}
// =================================
// GET ALL LISTINGS
// =================================
export async function fetchListings() {
    return getListings();
}
// =================================
// SEARCH LISTINGS
// =================================
export async function fetchSearchListings(filters) {
    return searchListings(filters);
}
// =================================
// GET SINGLE LISTING
// =================================
export async function fetchListingById(id) {
    return getListingById(id);
}
// =================================
// GET MY LISTINGS
// =================================
export async function fetchMyListings(userId) {
    return getMyListings(userId);
}
// =================================
// UPDATE LISTING
// =================================
export async function editListing(id, ownerId, data) {
    return updateListingRepository(id, ownerId, data);
}
// =================================
// DELETE LISTING
// =================================
export async function removeListing(id, ownerId) {
    return deleteListing(id, ownerId);
}
// =================================
// CHANGE STATUS
// =================================
export async function updateListingStatus(id, userId, status) {
    return changeListingStatus(id, userId, status);
}
// =================================
// RELATED LISTINGS
// =================================
export async function fetchRelatedListings(listingId, categoryId, type, location) {
    return getRelatedListings(listingId, categoryId, type, location);
}
