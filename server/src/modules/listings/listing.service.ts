import type { FastifyInstance } from "fastify";

import { prisma } from "../../lib/prisma.js";


import {
  createListingWithFeatured,
  getListings,
  getListingById,
  getMyListings,
  updateListing as updateListingRepository,
  deleteListing,
  changeListingStatus,
  searchListings
} from "./listing.repository.js";


import {
  checkListingLimit
} from "../sellers/seller.access.service.js";




// ============================
// UPDATE LISTING STATUS
// ============================

export async function updateListingStatus(

  id:string,

  userId:string,

  status:string

){


  return changeListingStatus(

    id,

    status

  );


}







// ============================
// CREATE LISTING
// ============================

export async function createNewListing(

  app:FastifyInstance,

  data:any,

  userId:string

){



  await checkListingLimit(

    app,

    userId

  );





  const subscription =

    await prisma.sellerSubscription.findFirst({


      where:{


        userId,

        active:true


      },


      include:{


        plan:true


      }


    });







  const featured =

    subscription?.plan?.featuredListing ?? false;







  return createListingWithFeatured({


    ...data,


    ownerId:userId,


    featured


  });



}









// ============================
// GET ALL LISTINGS
// ============================

export async function fetchListings(){


  return getListings();


}









// ============================
// SEARCH LISTINGS
// ============================

export async function fetchSearchListings(

  filters:any

){


  return searchListings(

    filters

  );


}









// ============================
// GET SINGLE LISTING
// ============================

export async function fetchListingById(

  id:string

){


  return getListingById(

    id

  );


}









// ============================
// GET MY LISTINGS
// ============================

export async function fetchMyListings(

  userId:string

){


  return getMyListings(

    userId

  );


}









// ============================
// UPDATE LISTING
// ============================

export async function editListing(

  id:string,

  ownerId:string,

  data:{


    title?:string;


    description?:string;


    price?:number;


    negotiable?:boolean;


    location?:string;


    type?:string;


    categoryId?:string;


  }

){


  return updateListingRepository(

    id,

    ownerId,

    data

  );


}









// ============================
// DELETE LISTING
// ============================

export async function removeListing(

  id:string,

  ownerId:string

){


  return deleteListing(

    id,

    ownerId

  );


}