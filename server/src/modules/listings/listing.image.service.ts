import cloudinary from "../../config/cloudinary.js";
import { prisma } from "../../lib/prisma.js";

import {
    deleteFromCloudinary
} from "../../config/cloudinary.js";

import { fileTypeFromBuffer } from "file-type";

import sharp from "sharp";


// ===============================
// IMAGE CONSTANTS
// ===============================

const MAX_IMAGE_WIDTH = 2000;
const MAX_IMAGE_HEIGHT = 2000;

const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp"
]);


// ===============================
// VALIDATE + PROCESS IMAGE
// ===============================

export async function processListingImage(
    buffer: Buffer
): Promise<Buffer> {

    if (!buffer || buffer.length === 0) {

        throw new Error(
            "Empty image file"
        );

    }


    // ===============================
    // VERIFY ACTUAL FILE TYPE
    // ===============================

    const detectedType =
        await fileTypeFromBuffer(buffer);


    if (!detectedType) {

        throw new Error(
            "Unable to determine image file type"
        );

    }


    if (
        !ALLOWED_IMAGE_TYPES.has(
            detectedType.mime
        )
    ) {

        throw new Error(
            "Only JPEG, PNG and WebP images are allowed"
        );

    }


    // ===============================
    // PROCESS WITH SHARP
    // ===============================

    try {

        const metadata =
            await sharp(buffer)
                .metadata();


        if (
            !metadata.width ||
            !metadata.height
        ) {

            throw new Error(
                "Invalid image dimensions"
            );

        }


        if (
            metadata.width < 1 ||
            metadata.height < 1
        ) {

            throw new Error(
                "Invalid image dimensions"
            );

        }


        // ===============================
        // NORMALIZE IMAGE
        // ===============================

        const processed =
            await sharp(buffer)

                .rotate()

                .resize({

                    width:
                        MAX_IMAGE_WIDTH,

                    height:
                        MAX_IMAGE_HEIGHT,

                    fit:"inside",

                    withoutEnlargement:true

                })

                .webp({

                    quality:85,

                    effort:4

                })

                .toBuffer();


        if (
            !processed ||
            processed.length === 0
        ) {

            throw new Error(
                "Image processing failed"
            );

        }


        return processed;


    } catch {

        throw new Error(
            "Invalid or corrupted image"
        );

    }

}


// ===============================
// UPLOAD IMAGE
// ===============================

export async function uploadImage(
    buffer: Buffer
){

    const processedBuffer =
        await processListingImage(
            buffer
        );


    return new Promise<any>(

        (resolve,reject)=>{

            const stream =
                cloudinary.uploader.upload_stream(

                    {

                        folder:
                            "obaaratech-marketplace",

                        resource_type:
                            "image",

                        format:
                            "webp"

                    },

                    (error,result)=>{

                        if(error){

                            reject(error);

                            return;

                        }


                        if(!result){

                            reject(
                                new Error(
                                    "Cloudinary upload failed"
                                )
                            );

                            return;

                        }


                        resolve(result);

                    }

                );


            stream.end(
                processedBuffer
            );

        }

    );

}


// ===============================
// GET LISTING OWNER
// ===============================

export async function getListingOwner(
    listingId:string
){

    return prisma.listing.findUnique({

        where:{
            id:listingId
        },

        select:{

            id:true,

            ownerId:true

        }

    });

}


// ===============================
// ADD IMAGE
// ===============================

export async function addListingImage(

    listingId:string,

    url:string

){

    return prisma.listingImage.create({

        data:{

            listingId,

            url

        }

    });

}


// ===============================
// GET IMAGE
// ===============================

export async function getListingImage(

    imageId:string

){

    return prisma.listingImage.findUnique({

        where:{
            id:imageId
        }

    });

}


// ===============================
// EXTRACT CLOUDINARY PUBLIC ID
// ===============================

function getCloudinaryPublicId(
    url:string
): string {

    try {

        const parsed =
            new URL(url);


        const uploadIndex =
            parsed.pathname.indexOf(
                "/upload/"
            );


        if(uploadIndex === -1){

            throw new Error(
                "Invalid Cloudinary URL"
            );

        }


        let path =
            parsed.pathname.substring(
                uploadIndex +
                "/upload/".length
            );


        path =
            path.replace(
                /^v\d+\//,
                ""
            );


        const extensionIndex =
            path.lastIndexOf(".");


        if(
            extensionIndex !== -1
        ){

            path =
                path.substring(
                    0,
                    extensionIndex
                );

        }


        if(!path){

            throw new Error(
                "Invalid Cloudinary public ID"
            );

        }


        return path;


    } catch {

        throw new Error(
            "Unable to determine Cloudinary image ID"
        );

    }

}


// ===============================
// DELETE IMAGE SERVICE
// ===============================

export async function deleteListingImage(

    listingId:string,

    imageId:string,

    userId:string

){

    const listing =
        await prisma.listing.findFirst({

            where:{

                id:listingId,

                ownerId:userId

            }

        });


    if(!listing){

        throw new Error(
            "Listing not found"
        );

    }


    const image =
        await prisma.listingImage.findFirst({

            where:{

                id:imageId,

                listingId

            }

        });


    if(!image){

        throw new Error(
            "Image not found"
        );

    }


    // ===============================
    // GET CLOUDINARY PUBLIC ID
    // ===============================

    const publicId =
        getCloudinaryPublicId(
            image.url
        );


    // ===============================
    // DELETE FROM CLOUDINARY
    // ===============================

    await deleteFromCloudinary(
        publicId
    );


    // ===============================
    // DELETE DATABASE RECORD
    // ===============================

    await prisma.listingImage.delete({

        where:{
            id:imageId
        }

    });


    return {

        success:true,

        message:
            "Image deleted successfully"

    };

}