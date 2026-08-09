import type {
  FastifyReply,
  FastifyRequest
} from "fastify";


import {
  createNewCategory,
  fetchCategories,
  fetchCategoryById,
  fetchCategoryTree
} from "./category.service.js";




// CREATE CATEGORY

export async function createCategoryController(
  request: FastifyRequest,
  reply: FastifyReply
){

  const body =
    request.body as {
      name:string;
    };


  const category =
    await createNewCategory(
      body.name
    );


  return reply.code(201).send({

    success:true,

    category

  });

}




// GET ALL CATEGORIES

export async function getCategoriesController(
  request:FastifyRequest,
  reply:FastifyReply
){

  const categories =
    await fetchCategories();


  return reply.send({

    success:true,

    categories

  });

}




// GET CATEGORY TREE

export async function getCategoryTreeController(
  request:FastifyRequest,
  reply:FastifyReply
){

  const categories =
    await fetchCategoryTree();


  return reply.send({

    success:true,

    categories

  });

}




// GET SINGLE CATEGORY

export async function getCategoryController(
  request:FastifyRequest,
  reply:FastifyReply
){

  const {id} =
    request.params as {
      id:string;
    };


  const category =
    await fetchCategoryById(id);



  if(!category){

    return reply.code(404).send({

      success:false,

      message:"Category not found"

    });

  }



  return reply.send({

    success:true,

    category

  });

}