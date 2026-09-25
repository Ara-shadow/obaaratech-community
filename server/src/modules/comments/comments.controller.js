import { createComment, getPostComments, deleteComment } from "./comments.repository.js";
// Create comment
export async function create(request, reply) {
    try {
        const { postId } = request.params;
        const { content } = request.body;
        const comment = await createComment(request.user.id, postId, content);
        return reply.code(201).send({
            success: true,
            comment
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: "Could not create comment"
        });
    }
}
// Get comments
export async function allComments(request, reply) {
    const { postId } = request.params;
    const comments = await getPostComments(postId);
    return reply.send({
        success: true,
        comments
    });
}
// Delete comment
export async function remove(request, reply) {
    const { id } = request.params;
    await deleteComment(id);
    return reply.send({
        success: true,
        message: "Comment deleted"
    });
}
