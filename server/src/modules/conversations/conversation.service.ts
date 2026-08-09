import {
  createConversation,
  getMyConversations,
  getConversationMessages
} from "./conversation.repository.js";




// ===============================
// START CONVERSATION
// ===============================

export async function startConversation(

  listingId: string,

  buyerId: string,

  message: string

) {


  return createConversation(

    listingId,

    buyerId,

    message

  );

}








// ===============================
// FETCH MY CONVERSATIONS
// ===============================

export async function fetchMyConversations(

  userId: string

) {


  return getMyConversations(

    userId

  );

}








// ===============================
// FETCH CONVERSATION MESSAGES
// ===============================

export async function fetchMessages(

  conversationId:string

) {


  return getConversationMessages(

    conversationId

  );

}