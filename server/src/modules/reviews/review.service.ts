import {
 createReview,
 getListingReviews,
 deleteReview,
} from "./review.repository.js";



export async function addReview(
 data:{
  rating:number;
  comment?:string;
  userId:string;
  listingId:string;
 }
){

 return createReview(data);

}



export async function fetchListingReviews(
 listingId:string
){

 return getListingReviews(listingId);

}



export async function removeReview(
 id:string
){

 return deleteReview(id);

}