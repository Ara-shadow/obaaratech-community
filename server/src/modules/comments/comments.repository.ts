import { prisma } from "../../lib/prisma.js";
import { createNotification } from "../notifications/notifications.repository";



// Create comment
export async function createComment(
    userId:string,
    postId:string,
    content:string
){

    const comment = await prisma.comment.create({

        data:{
            content,
            userId,
            postId
        },

        include:{
            user:{
                select:{
                    id:true,
                    name:true,
                    avatar:true
                }
            }
        }

    });



    const post = await prisma.post.findUnique({

        where:{
            id:postId
        },

        select:{
            authorId:true
        }

    });



    if(post && post.authorId !== userId){

        await createNotification({

            userId:post.authorId,

            actorId:userId,

            postId,

            type:"COMMENT",

            message:`${comment.user.name} commented on your post`

        });

    }



    return comment;

}





// Get comments for a post
export function getPostComments(
    postId:string
){

    return prisma.comment.findMany({

        where:{
            postId
        },

        orderBy:{
            createdAt:"desc"
        },

        include:{

            user:{
                select:{
                    id:true,
                    name:true,
                    avatar:true
                }
            }

        }

    });

}





// Delete comment
export function deleteComment(
    id:string
){

    return prisma.comment.delete({

        where:{
            id
        }

    });

}
