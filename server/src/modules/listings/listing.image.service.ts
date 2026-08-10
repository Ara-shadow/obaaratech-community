import cloudinary from "../../config/cloudinary.js";
import { prisma } from "../../lib/prisma.js";

import {
    deleteFromCloudinary
} from "../../config/cloudinary.js";


// ===============================
// UPLOAD IMAGE
// ===============================

export async function uploadImage(
    buffer: Buffer
){

    return new Promise<any>(

        (resolve,reject)=>{


            const stream =
            cloudinary.uploader.upload_stream(

                {
                    folder:"obaaratech-marketplace",

                    resource_type:"image"
                },


                (error,result)=>{

                    if(error){

                        reject(error);
                        return;

                    }


                    resolve(result);

                }

            );


            stream.end(buffer);


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





    // Extract Cloudinary public id

    const uploadPath =
    image.url.split("/upload/")[1];


    const parts =
    uploadPath.split("/");


    // remove version number

    parts.shift();



    const filename =
    parts.pop()
    ?.split(".")[0];



    const publicId =
    [
        ...parts,
        filename
    ]
    .join("/");




    await deleteFromCloudinary(
        publicId
    );




    await prisma.listingImage.delete({

        where:{
            id:imageId
        }

    });



    return {

        success:true,

        message:"Image deleted successfully"

    };


}