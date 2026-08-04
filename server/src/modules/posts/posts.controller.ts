import type {
    FastifyReply,
    FastifyRequest
} from "fastify";

import {
    createPost,
    getPosts,
    getPostById,
    deletePost
} from "./posts.repository.js";



export async function create(
    request: FastifyRequest,
    reply: FastifyReply
){

    try {

        const post = await createPost(
            request.user.id,
            request.body
        );


        return reply.code(201).send({

            success:true,
            post

        });


    } catch(error){

        return reply.code(400).send({

            success:false,
            message:"Could not create post"

        });

    }

}




export async function allPosts(
    request: FastifyRequest,
    reply: FastifyReply
){

    const posts = await getPosts();


    return reply.send({

        success:true,
        posts

    });

}





export async function singlePost(
    request: FastifyRequest,
    reply: FastifyReply
){

    const { id } = request.params as {
        id:string
    };


    const post = await getPostById(id);


    if(!post){

        return reply.code(404).send({

            success:false,
            message:"Post not found"

        });

    }


    return reply.send({

        success:true,
        post

    });

}





export async function removePost(
    request: FastifyRequest,
    reply: FastifyReply
){

    const { id } = request.params as {
        id:string
    };


    await deletePost(id);


    return reply.send({

        success:true,
        message:"Post deleted"

    });

}