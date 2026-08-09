import { prisma } from "../../lib/prisma.js";


export async function getListingDetails(
    id:string
){

    const listing =
        await prisma.listing.findUnique({

            where:{
                id
            },

            include:{

                images:true,

                category:true,

                owner:{
                    select:{
                        id:true,
                        name:true,
                        avatar:true,
                        verifiedSeller:true
                    }
                }

            }

        });



    if(!listing){

        return null;

    }



    const similarListings =
        await prisma.listing.findMany({

            where:{

                categoryId:listing.categoryId,

                id:{
                    not:id
                },

                status:"ACTIVE"

            },

            take:5,

            include:{
                images:true
            }

        });



    return {

        ...listing,

        similarListings

    };

}