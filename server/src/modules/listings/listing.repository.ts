import { prisma } from "../../database/prisma.js";


export async function createListing(data: {
  title: string;
  description: string;
  price?: number | undefined;
  negotiable?: boolean | undefined;
  type?: any | undefined;
  location: string;
  ownerId: string;
  categoryId?: string | undefined;
})
{

  return prisma.listing.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price ?? null,
      negotiable: data.negotiable ?? true,
      type: data.type ?? "PRODUCT",
      location: data.location,
      ownerId: data.ownerId,
      categoryId: data.categoryId ?? null,
    },

    include:{
      images:true,
      category:true,
    }

  });

}



export async function getListings() {

  return prisma.listing.findMany({

    include: {

      owner: {
        select:{
          id:true,
          name:true,
          phone:true,
        },
      },

      category:true,

      images:true,

    },

    orderBy:{
      createdAt:"desc",
    },

  });

}



export async function getListingById(
  id:string
){

  return prisma.listing.findUnique({

    where:{
      id,
    },

    include:{

      owner:{
        select:{
          id:true,
          name:true,
          phone:true,
          whatsapp:true,
        },
      },

      category:true,

      images:true,

      reviews:true,

    },

  });

}

export async function getMyListings(
  ownerId:string
) {

  return prisma.listing.findMany({

    where:{
      ownerId,
    },

    include:{

      category:true,

      images:true,

    },

    orderBy:{
      createdAt:"desc",
    },

  });

}