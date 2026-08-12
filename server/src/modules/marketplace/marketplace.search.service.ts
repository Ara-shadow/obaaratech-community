import { prisma } from "../../lib/prisma.js";

interface SearchOptions {
    q?: string;
    category?: string;
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
}


export async function searchMarketplace(
    options: SearchOptions
){

    const {
        q,
        category,
        location,
        type,
        minPrice,
        maxPrice,
        sort
    } = options;


    const listings =
        await prisma.listing.findMany({

            where:{

                status:"ACTIVE",

                available:true,


                ...(q && {

                    OR:[

                        {
                            title:{
                                contains:q,
                                mode:"insensitive"
                            }
                        },

                        {
                            description:{
                                contains:q,
                                mode:"insensitive"
                            }
                        }

                    ]

                }),



                ...(category && {

                    category:{
                        name:{
                            equals:category,
                            mode:"insensitive"
                        }
                    }

                }),



                ...(location && {

                    location:{
                        contains:location,
                        mode:"insensitive"
                    }

                }),



                ...(type && {

                    type:type as any

                }),



                ...(minPrice || maxPrice ? {

                    price:{

                        gte:minPrice,

                        lte:maxPrice

                    }

                }:{})


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


            orderBy:

            sort==="price_low"

            ?

            {
                price:"asc"
            }

            :

            sort==="price_high"

            ?

            {
                price:"desc"
            }

            :

            {
                createdAt:"desc"
            }


        });



    return listings;

}
