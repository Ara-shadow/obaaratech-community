import { prisma } from "../../lib/prisma.js";

export async function getSellerProfile(
    sellerId: string
) {
    const seller = await prisma.user.findUnique({
        where: { id: sellerId },
        select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            verifiedSeller: true,
            createdAt: true,
            listings: {
                where: { available: true },
                include: {
                    images: true,
                    category: true,
                },
                orderBy: { createdAt: "desc" },
            },
            reviews: {
                select: { rating: true },
            },
            businessHours: {
                orderBy: { dayOfWeek: "asc" },
            },
        },
    });

    if (!seller) {
        throw new Error("Seller not found");
    }

    const totalReviews = seller.reviews.length;
    const averageRating = totalReviews
        ? seller.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        ) / totalReviews
        : 0;

    return {
        id: seller.id,
        name: seller.name,
        phone: seller.phone,
        avatar: seller.avatar,
        verifiedSeller: seller.verifiedSeller,
        joinedAt: seller.createdAt,
        totalListings: seller.listings.length,
        totalReviews,
        averageRating,
        businessHours: seller.businessHours,
        listings: seller.listings,
    };
}

