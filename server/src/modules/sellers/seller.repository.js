import { prisma } from "../../lib/prisma.js";
// ==============================
// GET SELLER PROFILE
// ==============================
export async function getSellerProfile(sellerId) {
    const seller = await prisma.user.findUnique({
        where: {
            id: sellerId
        },
        select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
            verifiedSeller: true,
            createdAt: true,
            listings: {
                where: {
                    available: true
                },
                include: {
                    images: true,
                    category: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            },
            reviews: {
                select: {
                    rating: true
                }
            }
        }
    });
    if (!seller) {
        throw new Error("Seller not found");
    }
    const totalReviews = seller.reviews.length;
    const averageRating = totalReviews
        ?
            seller.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        :
            0;
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
        listings: seller.listings
    };
}
