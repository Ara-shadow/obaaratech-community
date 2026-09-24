import path from "node:path";
import fs from "node:fs/promises";
import { prisma } from "../../database/prisma.js";
import { removeListingImage } from "./upload.service.js";
export async function deleteImageController(request, reply) {
    try {
        const user = request.user;
        const { imageId } = request.params;
        await removeListingImage(imageId, user.id);
        return reply.send({
            success: true,
            message: "Image deleted successfully"
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
export async function uploadImageController(request, reply) {
    const { listingId } = request.params;
    const file = await request.file();
    if (!file) {
        return reply.code(400).send({
            success: false,
            message: "No image uploaded",
        });
    }
    const uploadDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, {
        recursive: true,
    });
    const filename = `${Date.now()}-${file.filename}`;
    const filePath = path.join(uploadDir, filename);
    const buffer = await file.toBuffer();
    await fs.writeFile(filePath, buffer);
    const image = await prisma.image.create({
        data: {
            url: `/uploads/${filename}`,
            listingId,
        },
    });
    return reply.send({
        success: true,
        message: "Image uploaded successfully",
        image,
    });
}
