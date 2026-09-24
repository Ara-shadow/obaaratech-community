import { prisma } from "../../lib/prisma.js";
import cloudinary from "../../config/cloudinary.js";
export async function uploadImage(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "obaaratech/listings"
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
        stream.end(buffer);
    });
}
export async function getListingOwner(listingId) {
    return prisma.listing.findUnique({
        where: {
            id: listingId
        },
        select: {
            id: true,
            ownerId: true
        }
    });
}
export async function addListingImage(listingId, url) {
    return prisma.listingImage.create({
        data: {
            listingId,
            url
        }
    });
}
export async function deleteListingImage(imageId) {
    return prisma.listingImage.delete({
        where: {
            id: imageId
        }
    });
}
export async function getListingImage(imageId) {
    return prisma.listingImage.findUnique({
        where: {
            id: imageId
        }
    });
}
