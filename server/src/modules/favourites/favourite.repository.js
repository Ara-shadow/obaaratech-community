import { prisma } from "../../lib/prisma.js";
// ============================
// ADD FAVOURITE
// ============================
export async function addFavourite(userId, listingId) {
    return prisma.favourite.create({
        data: {
            userId,
            listingId
        }
    });
}
// ============================
// REMOVE FAVOURITE
// ============================
export async function removeFavourite(userId, listingId) {
    return prisma.favourite.delete({
        where: {
            userId_listingId: {
                userId,
                listingId
            }
        }
    });
}
// ============================
// GET USER FAVOURITES
// ============================
export async function getMyFavourites(userId) {
    return prisma.favourite.findMany({
        where: {
            userId
        },
        include: {
            listing: {
                include: {
                    images: true,
                    category: true
                }
            }
        }
    });
}
