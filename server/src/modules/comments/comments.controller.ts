import type {
    FastifyReply,
    FastifyRequest
} from "fastify";

import {
    createComment,
    getPostComments,
    deleteComment
} from "./comments.repository.js";



// Create comment
export async function create(
    request: FastifyRequest,
    reply: FastifyReply
){

    try {

        const { postId } = request.params as {
            postId:string
        };


        const { content } = request.body as {
            content:string
        };


        const comment = await createComment(
            request.user.id,
            postId,
            content
        );


        return reply.code(201).send({

            success:true,
            comment

        });


    } catch(error){

        return reply.code(400).send({

            success:false,
            message:"Could not create comment"

        });

    }

}




// Get comments
export async function allComments(
    request:FastifyRequest,
    reply:FastifyReply
){

    const { postId } = request.params as {
        postId:string
    };


    const comments = await getPostComments(postId);


    return reply.send({

        success:true,
        comments

    });

}




// Delete comment
export async function remove(
    request:FastifyRequest,
    reply:FastifyReply
){

    const { id } = request.params as {
        id:string
    };


    await deleteComment(id);


    return reply.send({

        success:true,
        message:"Comment deleted"

    });

}