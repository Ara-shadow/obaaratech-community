import type { FastifyInstance } from "fastify";

import { prisma } from "../../lib/prisma.js";



// ==============================
// CREATE REVIEW
// ==============================

export async function createReview(

    app: FastifyInstance,

    data:{
        rating:number;
        comment?:string;
        userId:string;
        listingId:string;
    }

){


    const existingReview =

        await prisma.review.findFirst({

            where:{

                userId:data.userId,

                listingId:data.listingId

            }

        });




    if(existingReview){

        throw new Error(

            "You already reviewed this listing"

        );

    }





    return prisma.review.create({

        data:{

            rating:data.rating,

            comment:data.comment,

            userId:data.userId,

            listingId:data.listingId

        },


        include:{


            user:{

                select:{

                    id:true,

                    name:true,

                    avatar:true,

                    verifiedSeller:true

                }

            },


            listing:{

                select:{

                    id:true,

                    title:true,

                    price:true,

                    location:true

                }

            }


        }


    });


}







// ==============================
// GET LISTING REVIEWS
// ==============================

export async function getListingReviews(

    app:FastifyInstance,

    listingId:string

){


    const reviews =

        await prisma.review.findMany({


            where:{

                listingId

            },


            include:{


                user:{

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





    const averageRating =

        reviews.length

        ?

        reviews.reduce(

            (sum,r)=>

                sum+r.rating,

            0

        ) / reviews.length

        :

        0;





    return {

        averageRating,

        reviews

    };


}
