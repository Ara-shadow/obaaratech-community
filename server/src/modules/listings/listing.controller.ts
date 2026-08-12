import { ListingStatus } from "@prisma/client";

import type {
    FastifyReply,
    FastifyRequest
} from "fastify";


import {
    createNewListing,
    fetchListings,
    fetchListingById,
    fetchMyListings,
    editListing,
    removeListing,
    fetchSearchListings,
    updateListingStatus,
    fetchRelatedListings

} from "./listing.service.js";




// ===============================
// CREATE LISTING
// ===============================

export async function createListingController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const user =
        request.user as {

            id:string;

        };


    try {


        const listing =
            await createNewListing(

                request.body,

                user.id

            );



        return reply.send({

            success:true,

            listing

        });



    }catch(error:any){


        return reply.code(403).send({

            success:false,

            message:error.message

        });


    }


}





// ===============================
// GET ALL LISTINGS
// ===============================

export async function getListingsController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const listings =
        await fetchListings();



    return reply.send({

        success:true,

        listings

    });


}





// ===============================
// SEARCH LISTINGS
// ===============================

export async function searchListingsController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const listings =
        await fetchSearchListings(

            request.query

        );



    return reply.send({

        success:true,

        listings

    });


}





// ===============================
// SINGLE LISTING
// ===============================

export async function getListingByIdController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const params =
        request.params as {

            id:string;

        };



    const listing =
        await fetchListingById(

            params.id

        );



    if(!listing){


        return reply.code(404).send({

            success:false,

            message:"Listing not found"

        });


    }



    return reply.send({

        success:true,

        listing

    });


}







// ===============================
// MY LISTINGS
// ===============================

export async function getMyListingsController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const user =
        request.user as {

            id:string;

        };



    const listings =
        await fetchMyListings(

            user.id

        );



    return reply.send({

        success:true,

        listings

    });


}





// ===============================
// UPDATE LISTING
// ===============================

export async function updateListingController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const user =
        request.user as {

            id:string;

        };


    const params =
        request.params as {

            id:string;

        };



    const listing =
        await editListing(

            params.id,

            user.id,

            request.body

        );



    return reply.send({

        success:true,

        listing

    });


}







// ===============================
// DELETE LISTING
// ===============================

export async function deleteListingController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const user =
        request.user as {

            id:string;

        };


    const params =
        request.params as {

            id:string;

        };



    await removeListing(

        params.id,

        user.id

    );



    return reply.send({

        success:true,

        message:"Listing deleted"

    });


}






// ===============================
// CHANGE STATUS
// ===============================

export async function changeStatusController(

    request:FastifyRequest,

    reply:FastifyReply

){


    const user =
        request.user as {

            id:string;

        };


    const params =
        request.params as {

            id:string;

        };


    const body =
    request.body as {

        status: ListingStatus;

    };



    const listing =
        await updateListingStatus(

            params.id,

            user.id,

            body.status

        );



    return reply.send({

        success:true,

        listing

    });


}




// ===============================
// RELATED LISTINGS
// ===============================

export async function getRelatedListingsController(

    request:FastifyRequest,

    reply:FastifyReply

){

    const params =
        request.params as {

            id:string;

        };


    const listing =
        await fetchListingById(
            params.id
        );


    if(!listing){

        return reply.code(404).send({

            success:false,

            message:"Listing not found"

        });

    }



 const listings =
    await fetchRelatedListings(

        params.id,

        listing.categoryId,

        listing.type,

        listing.location

    );



    return reply.send({

        success:true,

        listings

    });


}