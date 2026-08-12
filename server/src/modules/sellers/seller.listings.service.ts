import { prisma } from "../../lib/prisma.js";


// =================================
// GET SELLER LISTINGS
// =================================

export async function getSellerListings(
    userId:string
){


    return prisma.listing.findMany({

        where:{

            ownerId:userId

        },


        include:{

            images:true,

            category:true

        },


        orderBy:{

            createdAt:"desc"

        }

    });

}






// =================================
// UPDATE SELLER LISTING
// =================================

export async function updateSellerListing(

    userId:string,

    listingId:string,

    data:any

){


    const listing =

        await prisma.listing.findUnique({

            where:{
                id:listingId
            }

        });



    if(!listing){

        throw new Error(
            "Listing not found"
        );

    }



    if(listing.ownerId !== userId){

        throw new Error(
            "You are not allowed to edit this listing"
        );

    }



    return prisma.listing.update({

        where:{

            id:listingId

        },


        data

    });


}







// =================================
// DELETE SELLER LISTING
// =================================

export async function deleteSellerListing(

    userId:string,

    listingId:string

){


    const listing =

        await prisma.listing.findUnique({

            where:{
                id:listingId
            }

        });



    if(!listing){

        throw new Error(
            "Listing not found"
        );

    }



    if(listing.ownerId !== userId){

        throw new Error(
            "You cannot delete this listing"
        );

    }



    await prisma.listing.delete({

        where:{

            id:listingId

        }

    });



    return true;


}








// =================================
// MARK LISTING SOLD
// =================================

export async function markListingSold(

    userId:string,

    listingId:string

){


    const listing =

        await prisma.listing.findUnique({

            where:{
                id:listingId
            }

        });



    if(!listing){

        throw new Error(
            "Listing not found"
        );

    }



    if(listing.ownerId !== userId){

        throw new Error(
            "You cannot modify this listing"
        );

    }



    return prisma.listing.update({

        where:{

            id:listingId

        },


        data:{


            status:"SOLD",

            available:false


        }

    });


}
