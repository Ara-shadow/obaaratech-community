import fs from "node:fs/promises";
import path from "node:path";
import { findImageById, deleteImage } from "./upload.repository.js";
export async function removeListingImage(imageId, userId) {
    const image = await findImageById(imageId);
    if (!image) {
        throw new Error("Image not found");
    }
    if (image.listing.ownerId !== userId) {
        throw new Error("You are not allowed to delete this image");
    }
    const filePath = path.join(process.cwd(), image.url);
    try {
        await fs.unlink(filePath);
    }
    catch (error) {
        console.log("File already removed");
    }
    return deleteImage(imageId);
}
