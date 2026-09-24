import prisma from "../../database/prisma";
import { createNotification } from "../notifications/notifications.repository";
// Like a post
export async function likePost(userId, postId) {
    const like = await prisma.like.create({
        data: {
            userId,
            postId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },
            post: {
                select: {
                    id: true,
                    authorId: true
                }
            }
        }
    });
    // Create notification
    if (like.post.authorId !== userId) {
        await createNotification({
            userId: like.post.authorId,
            actorId: userId,
            postId: postId,
            type: "LIKE",
            message: `${like.user.name} liked your post`
        });
    }
    return like;
}
// Remove like
export function unlikePost(userId, postId) {
    return prisma.like.delete({
        where: {
            postId_userId: {
                postId,
                userId
            }
        }
    });
}
// Get likes
export function getPostLikes(postId) {
    return prisma.like.findMany({
        where: {
            postId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            }
        }
    });
}
