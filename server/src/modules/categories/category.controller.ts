import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";


import {
  createNewCategory,
  fetchCategories,
  fetchCategoryById,
} from "./category.service.js";



// CREATE CATEGORY
export async function createCategoryController(
  request: FastifyRequest,
  reply: FastifyReply
){

  try {

    const body = request.body as {
      name:string;
    };


    const category =
      await createNewCategory(
        body.name
      );


    return reply.code(201).send({

      success:true,

      message:"Category created",

      category,

    });


  } catch(error:any){


    if(error.code === "P2002"){

      return reply.code(400).send({

        success:false,

        message:"Category already exists",

      });

    }


    return reply.code(500).send({

      success:false,

      message:error.message,

    });

  }

}




// GET ALL CATEGORIES
export async function getCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply
){

  const categories =
    await fetchCategories();


  return reply.send({

    success:true,

    categories,

  });

}




// GET CATEGORY BY ID
export async function getCategoryController(
  request: FastifyRequest,
  reply: FastifyReply
){

  const { id } =
    request.params as {
      id:string;
    };


  const category =
    await fetchCategoryById(id);



  if(!category){

    return reply.code(404).send({

      success:false,

      message:"Category not found",

    });

  }



  return reply.send({

    success:true,

    category,

  });

}