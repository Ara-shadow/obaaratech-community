import type {
  FastifyRequest,
  FastifyReply
} from "fastify";


import {
  createConversationSchema
} from "./conversation.schema.js";


import {
  startConversation,
  fetchMyConversations,
  fetchMessages
} from "./conversation.service.js";




// =====================================
// START CONVERSATION
// =====================================

export async function startConversationController(

  request: FastifyRequest,

  reply: FastifyReply

) {


  try {


    const user = request.user as {

      id:string;

    };



    const {
      listingId

    } = request.params as {

      listingId:string;

    };



    const data =
      createConversationSchema.parse(

        request.body

      );





    const conversation =

      await startConversation(

        listingId,

        user.id,

        data.message

      );






    return reply.code(201).send({

      success:true,

      message:"Conversation started",

      conversation

    });



  } catch(error:any) {


    return reply.code(400).send({

      success:false,

      message:error.message

    });


  }


}









// =====================================
// GET MY CONVERSATIONS
// =====================================

export async function getMyConversationsController(

  request:FastifyRequest,

  reply:FastifyReply

) {


  try {


    const user = request.user as {

      id:string;

    };





    const conversations =

      await fetchMyConversations(

        user.id

      );






    return reply.send({

      success:true,

      conversations

    });





  } catch(error:any) {


    return reply.code(400).send({

      success:false,

      message:error.message

    });


  }


}









// =====================================
// GET CONVERSATION MESSAGES
// =====================================

export async function getMessagesController(

  request:FastifyRequest,

  reply:FastifyReply

) {


  try {


    const {

      id

    } = request.params as {

      id:string;

    };





    const messages =

      await fetchMessages(

        id

      );






    return reply.send({

      success:true,

      messages

    });





  } catch(error:any) {


    return reply.code(400).send({

      success:false,

      message:error.message

    });


  }


}
