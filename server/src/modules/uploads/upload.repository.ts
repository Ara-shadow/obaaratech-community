import { prisma } from "../../database/prisma.js";


export async function findImageById(
    imageId:string
){

    return prisma.image.findUnique({

        where:{
            id:imageId
        },

        include:{

            listing:true

        }

    });

}



export async function deleteImage(
    imageId:string
){

    return prisma.image.delete({

        where:{
            id:imageId
        }

    });

}