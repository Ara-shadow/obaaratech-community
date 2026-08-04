import {
 addFavourite,
 removeFavourite,
 getUserFavourites,
} from "./favourite.repository.js";



export async function saveFavourite(
 userId:string,
 listingId:string
){

 return addFavourite(
  userId,
  listingId
 );

}



export async function deleteFavourite(
 userId:string,
 listingId:string
){

 return removeFavourite(
  userId,
  listingId
 );

}



export async function fetchUserFavourites(
 userId:string
){

 return getUserFavourites(
  userId
 );

}