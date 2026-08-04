import type { FastifyInstance } from "fastify";

import {
    create,
    allPosts,
    singlePost,
    removePost
} from "./posts.controller.js";

import { authenticate } from "../../middleware/auth.js";


export default async function postsRoutes(
    app: FastifyInstance
){

    // Create post
    app.post(
        "/",
        {
            preHandler: authenticate
        },
        create
    );


    // Community feed
    app.get(
        "/",
        allPosts
    );


    // Single post
    app.get(
        "/:id",
        singlePost
    );


    // Delete own post
    app.delete(
        "/:id",
        {
            preHandler: authenticate
        },
        removePost
    );

}