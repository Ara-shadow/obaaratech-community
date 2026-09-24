import { prisma } from "../../lib/prisma.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import { checkImageLimit } from "../sellers/seller.access.service.js";
import { createNewListing } from "./listing.service.js";
// ===============================
// CREATE LISTING
// ===============================
export async function createListingController(request, reply) {
    const user = request.user;
    const listing = await createNewListing(request.server, request.body, user.id);
    return reply.send({
        success: true,
        listing
    });
}
// ===============================
// ADD LISTING IMAGE
// ===============================
export async function addListingImageController(request, reply) {
    const user = request.user;
    const params = request.params;
    const listing = await prisma.listing.findUnique({
        where: {
            id: params.id
        }
    });
    if (!listing) {
        return reply.code(404).send({
            message: "Listing not found"
        });
    }
    if (listing.ownerId !== user.id) {
        return reply.code(403).send({
            message: "Not allowed"
        });
    }
    // CHECK SELLER IMAGE LIMIT
    await checkImageLimit(request.server, user.id, params.id);
    const file = await request.file();
    if (!file) {
        return reply.code(400).send({
            message: "No image uploaded"
        });
    }
    const buffer = await file.toBuffer();
    const uploaded = await uploadToCloudinary(buffer);
    const image = await prisma.listingImage.create({
        data: {
            url: uploaded.secure_url,
            listingId: params.id
        }
    });
    return reply.send({
        success: true,
        image
    });
}
// ===============================
// DELETE IMAGE
// ===============================
export async function deleteListingImageController(request, reply) {
    const user = request.user;
    const params = request.params;
    const listing = await prisma.listing.findUnique({
        where: {
            id: params.id
        }
    });
    if (!listing) {
        return reply.code(404).send({
            message: "Listing not found"
        });
    }
    if (listing.ownerId !== user.id) {
        return reply.code(403).send({
            message: "Not allowed"
        });
    }
    const image = await prisma.listingImage.findUnique({
        where: {
            id: params.imageId
        }
    });
    if (!image) {
        return reply.code(404).send({
            message: "Image not found"
        });
    }
    if (image.listingId !== params.id) {
        return reply.code(403).send({
            message: "Image does not belong to this listing"
        });
    }
    await prisma.listingImage.delete({
        where: {
            id: params.imageId
        }
    });
    return reply.send({
        success: true,
        message: "Image deleted"
    });
}
