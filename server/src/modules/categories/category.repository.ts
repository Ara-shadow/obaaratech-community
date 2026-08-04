import { prisma } from "../../database/prisma.js";


export async function createCategory(
  name:string
) {

  return prisma.category.create({
    data:{
      name,
    },
  });

}



export async function getCategories(){

  return prisma.category.findMany({
    orderBy:{
      createdAt:"desc",
    },
  });

}



export async function getCategoryById(
  id:string
){

  return prisma.category.findUnique({
    where:{
      id,
    },
    include:{
      listings:true,
    },
  });

}