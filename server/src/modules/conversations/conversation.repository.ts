import { prisma } from "../../lib/prisma.js";



// =====================================
// CREATE CONVERSATION
// =====================================

export async function createConversation(

  listingId: string,

  buyerId: string,

  message: string

) {


  const listing = await prisma.listing.findUnique({

    where: {

      id: listingId

    }

  });



  if (!listing) {

    throw new Error(
      "Listing not found"
    );

  }




  // Prevent seller messaging own listing

  if (listing.ownerId === buyerId) {

    throw new Error(
      "You cannot message your own listing"
    );

  }





  let conversation =

    await prisma.conversation.findUnique({

      where: {

        listingId_buyerId_sellerId: {

          listingId,

          buyerId,

          sellerId: listing.ownerId

        }

      }

    });






  if (!conversation) {


    conversation =

      await prisma.conversation.create({

        data: {

          listingId,

          buyerId,

          sellerId: listing.ownerId

        }

      });


  }







  const newMessage =

    await prisma.message.create({

      data: {

        conversationId: conversation.id,

        senderId: buyerId,

        text: message

      }

    });







  return {

    conversation,

    message: newMessage

  };


}









// =====================================
// GET USER CONVERSATIONS
// =====================================

export async function getMyConversations(

  userId: string

) {


  return prisma.conversation.findMany({

    where: {

      OR: [

        {

          buyerId: userId

        },

        {

          sellerId: userId

        }

      ]

    },



    include: {


      listing: {

        include: {

          images:true,

          category:true

        }

      },



      buyer: {

        select: {

          id:true,

          name:true,

          email:true,

          phone:true

        }

      },



      seller: {

        select: {

          id:true,

          name:true,

          email:true,

          phone:true

        }

      },



      messages: {

        orderBy: {

          createdAt:"desc"

        },

        take:1

      }


    },



    orderBy: {

      updatedAt:"desc"

    }


  });


}









// =====================================
// GET CONVERSATION MESSAGES
// =====================================

export async function getConversationMessages(

  conversationId:string

) {


  return prisma.message.findMany({

    where: {

      conversationId

    },



    include: {

      sender: {

        select: {

          id:true,

          name:true

        }

      }

    },



    orderBy: {

      createdAt:"asc"

    }


  });


}
