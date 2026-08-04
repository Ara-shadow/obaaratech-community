import {
  createListing,
  getListings,
  getListingById,
  getMyListings,
} from "./listing.repository.js";


import type {
  CreateListingInput,
} from "./listing.schema.js";


import { prisma } from "../../lib/prisma.js";



export async function fetchMyListings(
  userId: string
){

  return getMyListings(
    userId
  );

}




export async function createNewListing(
  data: CreateListingInput,
  userId: string
){

  return createListing({

    title:data.title,

    description:data.description,

    location:data.location,

    ownerId:userId,

    price:data.price,

    negotiable:data.negotiable,

    type:data.type,

    categoryId:data.categoryId,

  });

}




export async function fetchListings(){

  return getListings();

}




export async function fetchListingById(
  id:string
){

  return getListingById(id);

}





export async function updateListing(
    id:string,
    ownerId:string,
    data:{
        title?:string;
        description?:string;
        price?:number;
        negotiable?:boolean;
        location?:string;
        type?:any;
        categoryId?:string;
    }
){


    const listing =
        await prisma.listing.findUnique({

            where:{
                id
            }

        });



    if(!listing){

        throw new Error(
            "Listing not found"
        );

    }



    if(listing.ownerId !== ownerId){

        throw new Error(
            "You are not allowed to edit this listing"
        );

    }



    return prisma.listing.update({

        where:{
            id
        },


        data:{


            ...(data.title && {
                title:data.title
            }),


            ...(data.description && {
                description:data.description
            }),


            ...(data.price !== undefined && {
                price:data.price
            }),


            ...(data.negotiable !== undefined && {
                negotiable:data.negotiable
            }),


            ...(data.location && {
                location:data.location
            }),


            ...(data.type && {
                type:data.type
            }),


            ...(data.categoryId && {
                categoryId:data.categoryId
            }),

        },


        include:{

            images:true,

            category:true,

        }

    });

}