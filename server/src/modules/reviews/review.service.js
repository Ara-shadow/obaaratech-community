import { createReview, getListingReviews } from "./review.repository.js";
// ==============================
// CREATE REVIEW
// ==============================
export async function addReview(app, data) {
    return createReview(app, data);
}
// ==============================
// FETCH LISTING REVIEWS
// ==============================
export async function fetchListingReviews(app, listingId) {
    return getListingReviews(app, listingId);
}
