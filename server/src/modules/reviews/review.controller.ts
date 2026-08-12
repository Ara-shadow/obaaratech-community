import type {

  FastifyRequest,

  FastifyReply

} from "fastify";



import {

  createReviewSchema

} from "./review.schema.js";



import {

  addReview,

  fetchListingReviews

} from "./review.service.js";







// ==============================
// CREATE REVIEW
// ==============================

export async function createReviewController(

  request: FastifyRequest,

  reply: FastifyReply

){


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

      createReviewSchema.parse(

        request.body

      );





    const review =

      await addReview(

        request.server,

        {

          rating:data.rating,

          comment:data.comment,

          userId:user.id,

          listingId

        }

      );





    return reply.code(201).send({

      success:true,

      message:"Review created successfully",

      review

    });



  } catch(error:any){


    return reply.code(400).send({

      success:false,

      message:error.message

    });


  }


}









// ==============================
// GET LISTING REVIEWS
// ==============================

export async function getListingReviewsController(

  request:FastifyRequest,

  reply:FastifyReply

){


  try {


    const {

      listingId

    } = request.params as {

      listingId:string;

    };





    const result =

      await fetchListingReviews(

        request.server,

        listingId

      );





    return reply.send({

      success:true,

      ...result

    });



  } catch(error:any){


    return reply.code(400).send({

      success:false,

      message:error.message

    });


  }


}
