import fs from "node:fs/promises";
import path from "node:path";

import {
    findImageById,
    deleteImage
} from "./upload.repository.js";


// =====================================
// REMOVE LISTING IMAGE
// =====================================

export async function removeListingImage(
    imageId: string,
    userId: string
) {

    const image =
        await findImageById(
            imageId
        );


    // Image does not exist
    if (!image) {

        throw new Error(
            "Image not found"
        );

    }


    // Image is not attached to a listing
    if (!image.listing) {

        throw new Error(
            "Image is not attached to a listing"
        );

    }


    // Only the listing owner can delete the image
    if (
        image.listing.ownerId !== userId
    ) {

        throw new Error(
            "You are not allowed to delete this image"
        );

    }


    // Build the physical file path
    const filePath =
        path.join(
            process.cwd(),
            image.url
        );


    // Remove physical file
    try {

        await fs.unlink(
            filePath
        );

    } catch (error) {

        console.log(
            "File already removed"
        );

    }


    // Remove database record
    return deleteImage(
        imageId
    );

}