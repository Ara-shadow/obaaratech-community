import cloudinary from "../../config/cloudinary.js";
import { prisma } from "../../database/prisma.js";



// ===============================
// UPLOAD IMAGE
// ===============================

export async function uploadImage(
    buffer:Buffer
){

    return new Promise<any>(

        (resolve,reject)=>{


            const stream =
            cloudinary.uploader.upload_stream(

                {
                    folder:
                    "obaaratech-marketplace",

                    resource_type:
                    "image"
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
// DELETE IMAGE
// ===============================

export async function deleteListingImage(

    imageId:string

){

    return prisma.listingImage.delete({

        where:{
            id:imageId
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