import { likePost, unlikePost, getPostLikes } from "./likes.repository.js";
// Like a post
export async function like(request, reply) {
    try {
        const { postId } = request.params;
        const result = await likePost(request.user.id, postId);
        return reply.code(201).send({
            success: true,
            like: result
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: "Post already liked"
        });
    }
}
// Unlike a post
export async function unlike(request, reply) {
    const { postId } = request.params;
    await unlikePost(request.user.id, postId);
    return reply.send({
        success: true,
        message: "Like removed"
    });
}
// Get likes
export async function allLikes(request, reply) {
    const { postId } = request.params;
    const likes = await getPostLikes(postId);
    return reply.send({
        success: true,
        likes
    });
}
