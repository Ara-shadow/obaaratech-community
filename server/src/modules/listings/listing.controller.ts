import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";


import {
  createListingSchema,
} from "./listing.schema.js";


import {
  createNewListing,
  fetchListings,
  fetchListingById,
  fetchMyListings,
} from "./listing.service.js";

import {
  updateListing
} from "./listing.service.js";

export async function updateListingController(
    request: FastifyRequest,
    reply: FastifyReply
){

    try{


        const user =
            request.user as {
                id:string;
            };



        const {
            id
        } =
        request.params as {
            id:string;
        };



        const updated =
            await updateListing(

                id,

                user.id,

                request.body as any

            );



        return reply.send({

            success:true,

            message:
            "Listing updated successfully",

            listing:updated

        });



    }catch(error:any){


        return reply.code(400).send({

            success:false,

            message:error.message

        });


    }

}

export async function createListingController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  try {


    const user =
      request.user as {
        id:string;
        email?:string;
        role?:string;
      };


    console.log(
      "CREATE LISTING USER:",
      user
    );


    if(!user?.id){

      return reply.code(401).send({

        success:false,

        message:"Unauthorized"

      });

    }



    const data =
      createListingSchema.parse(
        request.body
      );



    const listing =
      await createNewListing(
        data,
        user.id
      );



    return reply.code(201).send({

      success:true,

      message:
        "Listing created successfully",

      listing,

    });



  }catch(error:any){


    return reply.code(400).send({

      success:false,

      message:error.message,

    });


  }

}






export async function getListingsController(
 request:FastifyRequest,
 reply:FastifyReply
){

 const listings =
   await fetchListings();


 return reply.send({

   success:true,

   listings,

 });

}






export async function getListingByIdController(
 request:FastifyRequest,
 reply:FastifyReply
){

 const {
   id
 } =
 request.params as {
   id:string;
 };



 const listing =
   await fetchListingById(id);



 if(!listing){

   return reply.code(404).send({

     success:false,

     message:"Listing not found",

   });

 }



 return reply.send({

   success:true,

   listing,

 });

}







export async function getMyListingsController(
 request:FastifyRequest,
 reply:FastifyReply
){

 try {


   const user =
     request.user as {
       id:string;
     };


   if(!user?.id){

     return reply.code(401).send({

       success:false,

       message:"Unauthorized"

     });

   }



   const listings =
     await fetchMyListings(
       user.id
     );



   return reply.send({

     success:true,

     listings,

   });



 }catch(error:any){


   return reply.code(400).send({

     success:false,

     message:error.message,

   });


 }

}