import { prisma } from "../../lib/prisma.js";


export async function createConversation(data:{
  buyerId:string;
  sellerId:string;
  listingId?:string;
}){

  return prisma.conversation.create({
    data:{
      buyerId:data.buyerId,
      sellerId:data.sellerId,
      listingId:data.listingId,
    },
  });

}



export async function findConversation(
  id:string
){

  return prisma.conversation.findUnique({
    where:{
      id,
    },
    include:{
      messages:true,
    },
  });

}




export async function getUserConversations(
  userId:string
){

  return prisma.conversation.findMany({

    where:{
      OR:[
        {
          buyerId:userId,
        },
        {
          sellerId:userId,
        },
      ],
    },


    include:{
      listing:true,
      buyer:{
        select:{
          id:true,
          name:true,
        },
      },

      seller:{
        select:{
          id:true,
          name:true,
        },
      },

      messages:{
        orderBy:{
          createdAt:"desc",
        },
        take:1,
      },

    },


    orderBy:{
      updatedAt:"desc",
    },

  });

}





export async function createMessage(data:{
  conversationId:string;
  senderId:string;
  content:string;
}){


 return prisma.message.create({

   data:{
     conversationId:data.conversationId,
     senderId:data.senderId,
     content:data.content,
   },

 });


}
