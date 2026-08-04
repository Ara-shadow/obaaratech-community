import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";

import path from "node:path";


import { prisma } from "./lib/prisma.js";

import jwtPlugin from "./plugins/jwt.js";


// ROUTES

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";

import { favouriteRoutes } from "./modules/favourites/index.js";

import postsRoutes from "./modules/posts/posts.routes.js";
import commentsRoutes from "./modules/comments/comments.routes.js";
import likesRoutes from "./modules/likes/likes.routes.js";

import notificationsRoutes from "./modules/notifications/notifications.routes.js";

import listingRoutes from "./modules/listings/listing.routes.js";

import { uploadRoutes } from "./modules/uploads/index.js";




export async function buildApp(){


const app = Fastify({

logger:true

});




// CORS

await app.register(cors,{

origin:true

});




// FILE UPLOAD SUPPORT

await app.register(multipart);




// SERVE UPLOADED FILES

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




// JWT

await app.register(jwtPlugin);




// AUTH

await app.register(
authRoutes,
{
prefix:"/api/auth"
}
);




// USERS

await app.register(
usersRoutes,
{
prefix:"/api/users"
}
);




// PROFILE

await app.register(
profileRoutes,
{
prefix:"/api/profile"
}
);




// POSTS

await app.register(
postsRoutes,
{
prefix:"/api/posts"
}
);




// COMMENTS

await app.register(
commentsRoutes,
{
prefix:"/api"
}
);




// LIKES

await app.register(
likesRoutes,
{
prefix:"/api"
}
);




// NOTIFICATIONS

await app.register(
notificationsRoutes,
{
prefix:"/api"
}
);




// LISTINGS

await app.register(
listingRoutes,
{
prefix:"/api/listings"
}
);




// FAVOURITES

await app.register(
favouriteRoutes,
{
prefix:"/api/favourites"
}
);




// UPLOADS

await app.register(
uploadRoutes,
{
prefix:"/api/uploads"
}
);




// ROOT

app.get("/",async()=>{

return {

name:"Obaaratech Community API",

status:"running",

version:"1.0.0"

};

});




// HEALTH

app.get("/health",async()=>{

return {

success:true,

message:"API is healthy"

};

});




// DATABASE TEST

app.get("/database",async()=>{


const users =
await prisma.user.count();



return {

success:true,

database:"connected",

users

};


});



console.log(
app.printRoutes()
);



return app;


}