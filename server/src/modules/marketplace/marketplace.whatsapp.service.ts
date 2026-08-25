import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";


export async function generateWhatsAppLink(

    app:FastifyInstance,

    listingId:string

){


    const listing =

        await prisma.listing.findUnique({

            where:{
                id:listingId
            },

            include:{
                owner:true
            }

        });



    if(!listing){

        throw new Error(
            "Listing not found"
        );

    }



    if(!listing.owner.phone){

        throw new Error(
            "Seller has no WhatsApp number"
        );

    }



    let phone =

        listing.owner.phone.replace(
            /\D/g,
            ""
        );



    if(phone.startsWith("0")){

        phone =
            "234" + phone.substring(1);

    }



    const message = encodeURIComponent(

`Hello ${listing.owner.name},

I saw your ${listing.title} on Obaaratech Marketplace.

Is it still available?`

    );



    return {

        phone,

        url:
        `https://wa.me/${phone}?text=${message}`

    };


}
