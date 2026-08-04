import { prisma } from "../../database/prisma.js";


export async function createReview(data:{
  rating:number;
  comment?:string;
  userId:string;
  listingId:string;
}){

  return prisma.review.create({

    data:{
      rating:data.rating,
      comment:data.comment ?? null,
      userId:data.userId,
      listingId:data.listingId,
    },

  });

}



export async function getListingReviews(
 listingId:string
){

 return prisma.review.findMany({

   where:{
     listingId,
   },

   include:{
     user:{
       select:{
         id:true,
         name:true,
       },
     },
   },

   orderBy:{
     createdAt:"desc",
   },

 });

}



export async function deleteReview(
 id:string
){

 return prisma.review.delete({

   where:{
     id,
   },

 });

}