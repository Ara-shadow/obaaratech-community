import {

  getSellerProfile

} from "./seller.repository.js";





export async function fetchSellerProfile(

  sellerId:string

){

  return getSellerProfile(

    sellerId

  );

}
