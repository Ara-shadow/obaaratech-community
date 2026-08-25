import { createConversation, getMyConversations, getConversationMessages } from "./conversation.repository.js";
// ===============================
// START CONVERSATION
// ===============================
export async function startConversation(listingId, buyerId, message) {
    return createConversation(listingId, buyerId, message);
}
// ===============================
// FETCH MY CONVERSATIONS
// ===============================
export async function fetchMyConversations(userId) {
    return getMyConversations(userId);
}
// ===============================
// FETCH CONVERSATION MESSAGES
// ===============================
export async function fetchMessages(conversationId) {
    return getConversationMessages(conversationId);
}
