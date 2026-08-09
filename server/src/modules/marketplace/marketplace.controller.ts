import type {
 FastifyReply,
 FastifyRequest
} from "fastify";

import { prisma } from "../../lib/prisma.js";


import {
 getListingDetails
} from "./marketplace.service.js";


import {
 searchMarketplace
}
from "./marketplace.search.service.js";



// =================================
// GET ALL MARKETPLACE LISTINGS
// =================================

export async function marketplaceListingsController(
 request:FastifyRequest,
 reply:FastifyReply
){

    const query = request.query as {

        categoryId?: string;

        category?: string;

        location?: string;

        type?: string;

    };


  const listings =
        await prisma.listing.findMany({


            where:{


                status:"ACTIVE",


                ...(query.categoryId && {

                    categoryId: query.categoryId

                }),



                ...(query.location && {

                    location:{
                        contains: query.location,
                        mode:"insensitive"
                    }

                }),



                ...(query.type && {

                    type: query.type

                }),



                ...(query.category && {

                    category:{

                        name:{
                            contains:query.category,
                            mode:"insensitive"
                        }

                    }

                })


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


            },


            orderBy:{

                createdAt:"desc"

            }


        });



    return reply.send({


        success:true,


        total:listings.length,


        listings


    });


}






// =================================
// GET SINGLE LISTING
// =================================

export async function listingDetailsController(

 request:FastifyRequest,

 reply:FastifyReply

){



    const params =

        request.params as {

            id:string;

        };



  const listing =
 await getListingDetails(
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






// =================================
// SEARCH MARKETPLACE
// =================================

export async function marketplaceSearchController(

 request:FastifyRequest,

 reply:FastifyReply

){


    const query =

        request.query as {


            q?:string;

            category?:string;

            location?:string;

            type?:string;

            minPrice?:string;

            maxPrice?:string;

            sort?:string;


        };



    const listings =

        await searchMarketplace({



            q:query.q,


            category:query.category,


            location:query.location,


            type:query.type,


            minPrice:

            query.minPrice

            ?

            Number(query.minPrice)

            :

            undefined,



            maxPrice:

            query.maxPrice

            ?

            Number(query.maxPrice)

            :

            undefined,



            sort:query.sort


        });



    return reply.send({

        success:true,

        total:listings.length,

        listings


    });


}