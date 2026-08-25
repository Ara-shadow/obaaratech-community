import type {
    FastifyReply,
    FastifyRequest
} from "fastify";

import {
    likePost,
    unlikePost,
    getPostLikes
} from "./likes.repository.js";



// Like a post
export async function like(
    request: FastifyRequest,
    reply: FastifyReply
){

    try {

        const { postId } = request.params as {
            postId:string
        };


        const result = await likePost(
            request.user.id,
            postId
        );


        return reply.code(201).send({

            success:true,
            like:result

        });


    } catch(error){

        return reply.code(400).send({

            success:false,
            message:"Post already liked"

        });

    }

}




// Unlike a post
export async function unlike(
    request: FastifyRequest,
    reply:FastifyReply
){

    const { postId } = request.params as {
        postId:string
    };


    await unlikePost(
        request.user.id,
        postId
    );


    return reply.send({

        success:true,
        message:"Like removed"

    });

}




// Get likes
export async function allLikes(
    request: FastifyRequest,
    reply: FastifyReply
){

    const { postId } = request.params as {
        postId:string
    };


    const likes = await getPostLikes(postId);


    return reply.send({

        success:true,
        likes

    });

}
