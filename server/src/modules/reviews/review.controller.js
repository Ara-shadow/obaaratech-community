import { createReviewSchema } from "./review.schema.js";
import { addReview, fetchListingReviews } from "./review.service.js";
// ==============================
// CREATE REVIEW
// ==============================
export async function createReviewController(request, reply) {
    try {
        const user = request.user;
        const { listingId } = request.params;
        const data = createReviewSchema.parse(request.body);
        const review = await addReview(request.server, {
            rating: data.rating,
            comment: data.comment,
            userId: user.id,
            listingId
        });
        return reply.code(201).send({
            success: true,
            message: "Review created successfully",
            review
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
// ==============================
// GET LISTING REVIEWS
// ==============================
export async function getListingReviewsController(request, reply) {
    try {
        const { listingId } = request.params;
        const result = await fetchListingReviews(request.server, listingId);
        return reply.send({
            success: true,
            ...result
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
