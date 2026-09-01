import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";
import { uploadImage, deleteImage, getFileSizeInMB } from "../../utils/imageUpload.js";

export async function listingImageRoutes(app: FastifyInstance) {

    // ============================
    // UPLOAD LISTING IMAGE
    // ============================
    app.post(
        "/:listingId/images",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { listingId } = request.params as { listingId: string };
            const user = (request as any).user;

            // Check if listing exists
            const listing = await prisma.listing.findUnique({
                where: { id: listingId }
            });

            if (!listing) {
                return reply.code(404).send({
                    success: false,
                    message: "Listing not found"
                });
            }

            // Check ownership
            if (listing.ownerId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }

            // Check image limit (max 10 images per listing)
            const imageCount = await prisma.listingImage.count({
                where: { listingId }
            });

            if (imageCount >= 10) {
                return reply.code(400).send({
                    success: false,
                    message: "Maximum 10 images per listing"
                });
            }

            // Get file from multipart
            const data = await request.file();
            if (!data) {
                return reply.code(400).send({
                    success: false,
                    message: "No image file provided"
                });
            }

            try {
                // Upload image (validation happens inside)
                const result = await uploadImage(data);
                
                const image = await prisma.listingImage.create({
                    data: {
                        url: result.url,
                        listingId: listingId
                    }
                });

                return {
                    success: true,
                    image: {
                        id: image.id,
                        url: image.url,
                        size: result.size,
                        mimeType: result.mimeType
                    },
                    message: "Image uploaded successfully"
                };
            } catch (error: any) {
                console.error("Image upload error:", error);
                return reply.code(400).send({
                    success: false,
                    message: error.message || "Failed to upload image"
                });
            }
        }
    );

    // ============================
    // DELETE LISTING IMAGE
    // ============================
    app.delete(
        "/images/:imageId",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { imageId } = request.params as { imageId: string };
            const user = (request as any).user;

            // Check if image exists
            const image = await prisma.listingImage.findUnique({
                where: { id: imageId },
                include: {
                    listing: {
                        select: { ownerId: true }
                    }
                }
            });

            if (!image) {
                return reply.code(404).send({
                    success: false,
                    message: "Image not found"
                });
            }

            // Check ownership
            if (image.listing.ownerId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }

            // Delete from filesystem
            try {
                await deleteImage(image.url);
            } catch (error) {
                console.error("Failed to delete image file:", error);
                // Continue to delete from database even if file deletion fails
            }

            // Delete from database
            await prisma.listingImage.delete({
                where: { id: imageId }
            });

            return {
                success: true,
                message: "Image deleted successfully"
            };
        }
    );

    // ============================
    // GET LISTING IMAGES
    // ============================
    app.get(
        "/:listingId/images",
        async (request, reply) => {
            const { listingId } = request.params as { listingId: string };

            const images = await prisma.listingImage.findMany({
                where: { listingId },
                orderBy: { id: "asc" }
            });

            return {
                success: true,
                images
            };
        }
    );
}