import type { FastifyInstance } from "fastify";

import {

  startConversationController,

  getMyConversationsController,

  getMessagesController

} from "./conversation.controller.js";



export default async function conversationRoutes(
  app: FastifyInstance
) {

  app.post(

    "/:listingId",

    {

      preHandler: [

        app.authenticate

      ]

    },

    startConversationController

  );



  app.get(

    "/",

    {

      preHandler: [

        app.authenticate

      ]

    },

    getMyConversationsController

  );



  app.get(

    "/:id/messages",

    {

      preHandler: [

        app.authenticate

      ]

    },

    getMessagesController

  );

}
