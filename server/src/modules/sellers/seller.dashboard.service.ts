import type { FastifyInstance } from "fastify";

import { prisma } from "../../lib/prisma.js";

import {
    getSellerPlan,
    canFeatureListing,
    hasVerifiedBadge
} from "./seller.access.service.js";

// =================================
// SELLER DASHBOARD
// =================================

export async function getSellerDashboard(

    app:FastifyInstance,

    userId:string

){


    const plan =
        await getSellerPlan(
            userId
        );



  const user =
    await prisma.user.findUnique({

            where:{
                id:userId
            },

            select:{

                name:true,

                email:true,

                phone:true,

                verifiedSeller:true

            }

        });



    const listings =
    await prisma.listing.count({

            where:{
                ownerId:userId
            }

        });



    const images =
    await prisma.listingImage.count({

            where:{

                listing:{

                    ownerId:userId

                }

            }

        });



    return {


        seller:user,


        plan:{


            name:
                plan?.name ?? "FREE",


            maxListings:
                plan?.maxListings ?? 0,


            imageLimit:
                plan?.imageLimit ?? 0,


            featuredListing:
                plan?.featuredListing ?? false,


            verifiedBadge:
                plan?.verifiedBadge ?? false


        },



        usage:{


            listings,


            remainingListings:
                Math.max(

                    0,

                    (plan?.maxListings ?? 0)
                    -
                    listings

                ),



            images,


            remainingImages:
                Math.max(

                    0,

                    (plan?.imageLimit ?? 0)
                    -
                    images

                )


        },



        features:{


            canFeature:

                await canFeatureListing(
                    userId
                ),



            hasVerifiedBadge:

                await hasVerifiedBadge(
                    userId
                )


        }


    };


}