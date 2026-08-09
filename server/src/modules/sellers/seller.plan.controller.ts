import type {
    FastifyReply,
    FastifyRequest
} from "fastify";


import {
    getSellerListings,
    updateSellerListing,
    deleteSellerListing,
    markListingSold
} from "./seller.listings.service.js";



// =================================
// GET SELLER LISTINGS
// =================================

export async function sellerListingsController(

    request:FastifyRequest,

    reply:FastifyReply

){

try{


    const user =
        request.user as {
            id:string;
        };


    const listings =
        await getSellerListings(

            request.server,

            user.id

        );


    return reply.send({

        success:true,

        listings

    });


}
catch(error:any){


    return reply.code(400).send({

        success:false,

        message:error.message

    });


}


}





// =================================
// UPDATE LISTING
// =================================

export async function updateSellerListingController(

request:FastifyRequest,

reply:FastifyReply

){

try{


const user =
request.user as {
id:string;
};


const params =
request.params as {
id:string;
};



const listing =
await updateSellerListing(

request.server,

user.id,

params.id,

request.body

);



return reply.send({

success:true,

listing

});


}
catch(error:any){

return reply.code(400).send({

success:false,

message:error.message

});

}


}





// =================================
// DELETE LISTING
// =================================

export async function deleteSellerListingController(

request:FastifyRequest,

reply:FastifyReply

){

try{


const user =
request.user as {
id:string;
};


const params =
request.params as {
id:string;
};



await deleteSellerListing(

request.server,

user.id,

params.id

);



return reply.send({

success:true,

message:"Listing deleted"

});


}
catch(error:any){

return reply.code(400).send({

success:false,

message:error.message

});

}


}




// =================================
// MARK SOLD
// =================================

export async function markListingSoldController(

request:FastifyRequest,

reply:FastifyReply

){

try{


const user =
request.user as {
id:string;
};


const params =
request.params as {
id:string;
};



const listing =
await markListingSold(

request.server,

user.id,

params.id

);



return reply.send({

success:true,

listing

});


}
catch(error:any){

return reply.code(400).send({

success:false,

message:error.message

});

}


}