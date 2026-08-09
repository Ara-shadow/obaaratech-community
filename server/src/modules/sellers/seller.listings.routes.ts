import type { FastifyInstance } from "fastify";

import {
 sellerListingsController,
 updateSellerListingController,
 deleteSellerListingController,
 markListingSoldController
} from "./seller.listings.controller.js";


export default async function sellerListingRoutes(
 app:FastifyInstance
){


app.get(
"/listings",
{
preHandler:[
app.authenticate
]
},
async(request,reply)=>{

console.log("SELLER LISTINGS ROUTE HIT");

return sellerListingsController(request,reply);

}
);


app.patch(
"/listings/:id",
{
preHandler:[
app.authenticate
]
},
updateSellerListingController
);



app.delete(
"/listings/:id",
{
preHandler:[
app.authenticate
]
},
deleteSellerListingController
);



app.patch(
"/listings/:id/sold",
{
preHandler:[
app.authenticate
]
},
markListingSoldController
);


}