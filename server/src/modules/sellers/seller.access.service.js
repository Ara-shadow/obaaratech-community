import { prisma } from "../../database/prisma.js";
// =================================
// GET SELLER PLAN
// =================================
export async function getSellerPlan(userId) {
    const subscription = await prisma.sellerSubscription.findFirst({
        where: {
            userId,
            active: true,
            expiryDate: {
                gt: new Date()
            }
        },
        include: {
            plan: true
        }
    });
    if (!subscription) {
        const freePlan = await prisma.sellerPlan.findFirst({
            where: {
                name: "FREE"
            }
        });
        return freePlan;
    }
    return subscription.plan;
}
// =================================
// CHECK LISTING LIMIT
// =================================
export async function checkListingLimit(userId) {
    const plan = await getSellerPlan(userId);
    if (!plan) {
        return true;
    }
    const count = await prisma.listing.count({
        where: {
            ownerId: userId,
            status: {
                in: [
                    "ACTIVE",
                    "DRAFT"
                ]
            }
        }
    });
    if (count >= plan.maxListings) {
        throw new Error(`Your ${plan.name} plan allows only ${plan.maxListings} listings`);
    }
    return true;
}
// =================================
// CHECK IMAGE LIMIT
// =================================
export async function checkImageLimit(userId, listingId) {
    const plan = await getSellerPlan(userId);
    if (!plan) {
        return true;
    }
    const imageCount = await prisma.listingImage.count({
        where: {
            listingId
        }
    });
    if (imageCount >= plan.imageLimit) {
        throw new Error(`Your ${plan.name} plan allows only ${plan.imageLimit} images`);
    }
    return true;
}
// =================================
// FEATURED LISTING ACCESS
// =================================
export async function canFeatureListing(userId) {
    const plan = await getSellerPlan(userId);
    return Boolean(plan?.featuredListing);
}
// =================================
// VERIFIED BADGE
// =================================
export async function hasVerifiedBadge(userId) {
    const plan = await getSellerPlan(userId);
    return Boolean(plan?.verifiedBadge);
}
// =================================
// SELLER BENEFITS
// =================================
export async function getSellerBenefits(userId) {
    const plan = await getSellerPlan(userId);
    return {
        planName: plan?.name ?? "FREE",
        maxListings: plan?.maxListings ?? 0,
        imageLimit: plan?.imageLimit ?? 0,
        featuredListing: Boolean(plan?.featuredListing),
        verifiedBadge: Boolean(plan?.verifiedBadge)
    };
}
