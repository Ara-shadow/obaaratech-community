import { prisma } from "../../database/prisma.js";


export async function addFavourite(
  userId:string,
  listingId:string
){

  return prisma.favourite.create({

    data:{
      userId,
      listingId,
    },

  });

}



export async function removeFavourite(
  userId:string,
  listingId:string
){

  return prisma.favourite.delete({

    where:{
      userId_listingId:{
        userId,
        listingId,
      },
    },

  });

}



export async function getUserFavourites(
  userId:string
){

  return prisma.favourite.findMany({

    where:{
      userId,
    },


    include:{

      listing:{

        include:{
          images:true,
          category:true,
        },

      },

    },

    orderBy:{
      createdAt:"desc",
    },

  });

}