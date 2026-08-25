import { prisma } from "../../lib/prisma.js";
import { uploadImage } from "./listing.image.service.js";
import { checkImageLimit } from "../sellers/seller.access.service.js";
// ===============================
// ADD LISTING IMAGE
// ===============================
export async function addListingImageController(request, reply) {
    try {
        const user = request.user;
        const params = request.params;
        const listing = await prisma.listing.findUnique({
            where: {
                id: params.id
            }
        });
        if (!listing) {
            return reply.code(404).send({
                success: false,
                message: "Listing not found"
            });
        }
        if (listing.ownerId !== user.id) {
            return reply.code(403).send({
                success: false,
                message: "Not allowed"
            });
        }
        await checkImageLimit(user.id, params.id);
        const file = await request.file();
        if (!file) {
            return reply.code(400).send({
                success: false,
                message: "No image uploaded"
            });
        }
        if (!file.mimetype.startsWith("image/")) {
            return reply.code(400).send({
                success: false,
                message: "Only image files allowed"
            });
        }
        const buffer = await file.toBuffer();
        const uploaded = await uploadImage(buffer);
        const image = await prisma.listingImage.create({
            data: {
                listingId: params.id,
                url: uploaded.secure_url
            }
        });
        return reply.send({
            success: true,
            image
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
// ===============================
// DELETE IMAGE
// ===============================
export async function deleteListingImageController(request, reply) {
    try {
        const user = request.user;
        const params = request.params;
        const listing = await prisma.listing.findUnique({
            where: {
                id: params.id
            }
        });
        if (!listing) {
            return reply.code(404).send({
                success: false,
                message: "Listing not found"
            });
        }
        if (listing.ownerId !== user.id) {
            return reply.code(403).send({
                success: false,
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
                success: false,
                message: "Image not found"
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
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
