import { prisma } from "../../database/prisma.js";

import {
    createListingWithFeatured,
    getListings,
    getListingById,
    getMyListings,
    updateListing as updateListingRepository,
    deleteListing,
    changeListingStatus,
    searchListings
} from "./listing.repository.js";


import {
    checkListingLimit
} from "../sellers/seller.access.service.js";




// =================================
// CREATE LISTING
// =================================

export async function createNewListing(

    data:any,

    userId:string

){

    await checkListingLimit(

        userId

    );



    const subscription =

        await prisma.sellerSubscription.findFirst({

            where:{

                userId,

                active:true

            },

            include:{

                plan:true

            }

        });



    const featured =

        subscription?.plan?.featuredListing ?? false;



 return createListingWithFeatured({

        title:data.title,

        description:data.description,

        price:Number(data.price),

        location:data.location,

        condition:data.condition,

        type:data.type,

        negotiable:data.negotiable,

        available:data.available,

        status:data.status,

        categoryId:data.categoryId,

        ownerId:userId,

        featured

});


}







// =================================
// GET ALL LISTINGS
// =================================

export async function fetchListings(){

    return getListings();

}







// =================================
// SEARCH LISTINGS
// =================================

export async function fetchSearchListings(

    filters:any

){

    return searchListings(

        filters

    );

}







// =================================
// GET SINGLE LISTING
// =================================

export async function fetchListingById(

    id:string

){

    return getListingById(

        id

    );

}







// =================================
// GET MY LISTINGS
// =================================

export async function fetchMyListings(

    userId:string

){

    return getMyListings(

        userId

    );

}







// =================================
// UPDATE LISTING
// =================================

export async function editListing(

    id:string,

    ownerId:string,

    data:any

){

    return updateListingRepository(

        id,

        ownerId,

        data

    );

}







// =================================
// DELETE LISTING
// =================================

export async function removeListing(

    id:string,

    ownerId:string

){

    return deleteListing(

        id,

        ownerId

    );

}







// =================================
// CHANGE STATUS
// =================================

export async function updateListingStatus(

    id:string,

    userId:string,

    status:string

){

    return changeListingStatus(

        id,

        status

    );

}