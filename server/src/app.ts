import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";

import path from "node:path";

import { prisma } from "./lib/prisma.js";

import jwtPlugin from "./plugins/jwt.js";
import authenticatePlugin from "./plugins/authenticate.js";


// ===============================
// ROUTES
// ===============================

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";

import planRoutes from "./modules/plans/plan.routes.js";

import { favouriteRoutes } from "./modules/favourites/index.js";

import postsRoutes from "./modules/posts/posts.routes.js";
import commentsRoutes from "./modules/comments/comments.routes.js";
import likesRoutes from "./modules/likes/likes.routes.js";

import notificationsRoutes from "./modules/notifications/notifications.routes.js";



import listingRoutes from "./modules/listings/listing.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import {
    marketplaceRoutes
} from "./modules/marketplace/marketplace.routes.js";


import { uploadRoutes } from "./modules/uploads/index.js";


// SELLERS

import sellerRoutes from "./modules/sellers/seller.routes.js";

import sellerListingRoutes from "./modules/sellers/seller.listings.routes.js";


// PAYSTACK

import paystackRoutes from "./modules/marketplace-payments/paystack.routes.js";
import sellerFinanceRoutes from "./modules/seller-finance/seller-finance.routes.js";




// ===============================
// BUILD APP
// ===============================

export async function buildApp(){


const app = Fastify({

    logger:true,

    trustProxy:true

});





// ===============================
// GLOBAL ERROR HANDLER
// ===============================


app.setErrorHandler(
(error,request,reply)=>{


    request.log.error(error);


    reply
    .code(
        error.statusCode || 500
    )
    .send({

        success:false,

        message:
        error.message ||
        "Internal server error"

    });


});






// ===============================
// CORS
// ===============================


await app.register(
cors,
{

    origin:true

}

);






// ===============================
// MULTIPART
// ===============================


await app.register(
multipart
);







// ===============================
// STATIC FILES
// ===============================


await app.register(
fastifyStatic,
{

    root:path.join(
        process.cwd(),
        "uploads"
    ),

    prefix:"/uploads/"

}

);






// ===============================
// JWT
// ===============================

await app.register(
    jwtPlugin
);


// ===============================
// AUTHENTICATION
// ===============================

await app.register(
    authenticatePlugin
);



// ===============================
// AUTH
// ===============================


await app.register(
authRoutes,
{
    prefix:"/api/auth"
}

);






// ===============================
// USERS
// ===============================


await app.register(
usersRoutes,
{
    prefix:"/api/users"
}

);






// ===============================
// PROFILE
// ===============================


await app.register(
profileRoutes,
{
    prefix:"/api/profile"
}

);





// ===============================
// CATEGORIES
// ===============================

await app.register(
categoryRoutes,
{
    prefix:"/api/categories"
}

);



// ===============================
// MARKETPLACE
// ===============================


await app.register(
marketplaceRoutes,
{
    prefix:"/api/marketplace"
}

);







// ===============================
// LISTINGS
// ===============================


await app.register(
listingRoutes,
{
    prefix:"/api/listings"
}

);







// ===============================
// POSTS
// ===============================


await app.register(
postsRoutes,
{
    prefix:"/api/posts"
}

);







// ===============================
// COMMENTS
// ===============================


await app.register(
commentsRoutes,
{
    prefix:"/api"
}

);







// ===============================
// LIKES
// ===============================


await app.register(
likesRoutes,
{
    prefix:"/api"
}

);







// ===============================
// NOTIFICATIONS
// ===============================


await app.register(
notificationsRoutes,
{
    prefix:"/api"
}

);







// ===============================
// WHATSAPP
// ===============================









// ===============================
// FAVOURITES
// ===============================


await app.register(
favouriteRoutes,
{
    prefix:"/api/favourites"
}

);







// ===============================
// UPLOADS
// ===============================

await app.register(
uploadRoutes,
{
    prefix:"/api/uploads"
}

);







// ===============================
// SELLER PROFILE
// ===============================


await app.register(
sellerRoutes,
{
    prefix:"/api/sellers"
}

);







// ===============================
// SELLER LISTING MANAGEMENT
// ===============================


await app.register(
sellerListingRoutes,
{
    prefix:"/api/sellers"
}

);







// ===============================
// SELLER PLANS
// ===============================


await app.register(
planRoutes,
{
    prefix:"/api/plans"
}

);








// ===============================
// SELLER FINANCE
// ===============================


await app.register(
sellerFinanceRoutes,
{
   prefix:"/api/seller-finance"
}

);



// ===============================
// PAYSTACK PAYMENTS
// ===============================


await app.register(
paystackRoutes,
{
    prefix:"/api/marketplace/payments/paystack"
}

);








// ===============================
// ROOT
// ===============================


app.get(
"/",
async()=>{


return {

    name:
    "Obaaratech Community API",

    status:
    "running",

    version:
    "1.0.0"

};


}

);








// ===============================
// HEALTH
// ===============================


app.get(
"/health",
async()=>{


return {

    success:true,

    message:
    "API is healthy"

};


}

);








// ===============================
// DATABASE CHECK
// ===============================


app.get(
"/database",
async()=>{


const users =
await prisma.user.count();



return {

    success:true,

    database:
    "connected",

    users

};


}

);








console.log(
app.printRoutes()
);





return app;


}
