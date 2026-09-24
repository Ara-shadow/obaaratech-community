import { createConversationSchema } from "./conversation.schema.js";
import { startConversation, fetchMyConversations, fetchMessages } from "./conversation.service.js";
// =====================================
// START CONVERSATION
// =====================================
export async function startConversationController(request, reply) {
    try {
        const user = request.user;
        const { listingId } = request.params;
        const data = createConversationSchema.parse(request.body);
        const conversation = await startConversation(listingId, user.id, data.message);
        return reply.code(201).send({
            success: true,
            message: "Conversation started",
            conversation
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// GET MY CONVERSATIONS
// =====================================
export async function getMyConversationsController(request, reply) {
    try {
        const user = request.user;
        const conversations = await fetchMyConversations(user.id);
        return reply.send({
            success: true,
            conversations
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// GET CONVERSATION MESSAGES
// =====================================
export async function getMessagesController(request, reply) {
    try {
        const { id } = request.params;
        const messages = await fetchMessages(id);
        return reply.send({
            success: true,
            messages
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error.message
        });
    }
}
