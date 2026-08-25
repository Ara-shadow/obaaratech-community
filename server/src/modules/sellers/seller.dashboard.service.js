import { prisma } from "../../lib/prisma.js";
import { getSellerPlan, canFeatureListing, hasVerifiedBadge } from "./seller.access.service.js";
// =================================
// SELLER DASHBOARD
// BUSINESS PLAN ONLY
// =================================
export async function getSellerDashboard(userId) {
    const plan = await getSellerPlan(userId);
    // =================================
    // BUSINESS DASHBOARD ACCESS
    // =================================
    if (!plan ||
        plan.name !== "BUSINESS") {
        throw new Error("Business plan required to access the seller dashboard");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            name: true,
            email: true,
            phone: true,
            verifiedSeller: true
        }
    });
    if (!user) {
        throw new Error("Seller account not found");
    }
    const listings = await prisma.listing.count({
        where: {
            ownerId: userId
        }
    });
    const images = await prisma.listingImage.count({
        where: {
            listing: {
                ownerId: userId
            }
        }
    });
    return {
        seller: user,
        plan: {
            name: plan.name,
            maxListings: plan.maxListings,
            imageLimit: plan.imageLimit,
            featuredListing: plan.featuredListing,
            verifiedBadge: plan.verifiedBadge
        },
        usage: {
            listings,
            remainingListings: Math.max(0, plan.maxListings -
                listings),
            images,
            remainingImages: Math.max(0, plan.imageLimit -
                images)
        },
        features: {
            canFeature: await canFeatureListing(userId),
            hasVerifiedBadge: await hasVerifiedBadge(userId)
        }
    };
}
