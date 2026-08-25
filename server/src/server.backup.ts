import "dotenv/config";
// or if you are using dotenvx:
// import "dotenvx/config";


import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import multipart from "@fastify/multipart";


// Plugins
import prismaPlugin from "./plugins/prisma.js";
import authenticatePlugin from "./plugins/authenticate.js";


// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.js";
import categoryRoutes from "./routes/category.js";

import listingRoutes from "./modules/listings/listing.routes.js";
import favouriteRoutes from "./modules/favourites/favourite.routes.js";
import conversationRoutes from "./modules/conversations/conversation.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";

import sellerRoutes from "./modules/sellers/seller.routes.js";
import sellerPlanRoutes from "./modules/sellers/seller.plan.routes.js";
import sellerSubscriptionRoutes from "./modules/sellers/seller.subscription.routes.js";

import { marketplaceRoutes } from "./modules/marketplace/marketplace.routes.js";


dotenv.config();



const app = Fastify({

    logger:true

});




// ==============================
// MULTIPART
// ==============================

await app.register(multipart);





// ==============================
// CORS
// ==============================

await app.register(cors,{

    origin:true

});






// ==============================
// JWT
// ==============================

await app.register(jwt,{

    secret:process.env.JWT_SECRET!

});






// ==============================
// DATABASE
// MUST COME BEFORE ROUTES
// ==============================

await app.register(prismaPlugin);






// ==============================
// AUTHENTICATION
// ==============================

await app.register(authenticatePlugin);







// ==============================
// API ROUTES
// ==============================


await app.register(authRoutes,{

    prefix:"/api/auth"

});





await app.register(userRoutes,{

    prefix:"/api/user"

});





await app.register(categoryRoutes,{

    prefix:"/api/categories"

});





await app.register(listingRoutes,{

    prefix:"/api/listings"

});





// TEMPORARILY DISABLED FOR TESTING
// await app.register(
//     marketplaceRoutes,
//     {
//         prefix:"/api/marketplace"
//     }
// );




await app.register(sellerRoutes,{

    prefix:"/api/sellers"

});





await app.register(

 sellerSubscriptionRoutes,

 {

    prefix:"/api/seller-subscriptions"

 }

);





await app.register(

 sellerPlanRoutes,

 {

    prefix:"/api/seller-plans"

 }

);





await app.register(favouriteRoutes,{

    prefix:"/api/favourites"

});





await app.register(conversationRoutes,{

    prefix:"/api/conversations"

});





await app.register(reviewRoutes,{

    prefix:"/api/reviews"

});








// ==============================
// HEALTH
// ==============================

app.get("/", async()=>{

    return {

        message:"Obaaratech Community API running 🚀"

    };

});





app.get("/health",async()=>{

    return {

        success:true,

        message:"API is healthy"

    };

});








// ==============================
// START SERVER
// ==============================


const start = async()=>{


    try{


        await app.listen({

            port:Number(process.env.PORT)||5000,

            host:"0.0.0.0"

        });



        console.log(
            "🚀 Server running on port 5000"
        );


    }catch(error){


        app.log.error(error);


        process.exit(1);


    }


};



start();
