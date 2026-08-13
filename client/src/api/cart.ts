import api from "./axios";

import type {
    Listing
} from "../types/listing";



export interface CartItem {

    id:string;

    quantity:number;

    listing:Listing;

}



export interface Cart {

    id:string;

    items:CartItem[];

}



// =====================================
// GET CART
// =====================================

export async function getCart():Promise<Cart>{

    const response =
        await api.get(
            "/cart"
        );


    return response.data.cart;

}



// =====================================
// ADD TO CART
// =====================================

export async function addToCart(
    listingId:string
){

    const response =
        await api.post(
            `/cart/${listingId}`
        );


    return response.data;

}



// =====================================
// UPDATE QUANTITY
// =====================================

export async function updateCartQuantity(
    itemId:string,
    quantity:number
){

    const response =
        await api.patch(
            `/cart/item/${itemId}`,
            {
                quantity
            }
        );


    return response.data;

}



// =====================================
// REMOVE ITEM
// =====================================

export async function removeCartItem(
    itemId:string
){

    const response =
        await api.delete(
            `/cart/item/${itemId}`
        );


    return response.data;

}



// =====================================
// CLEAR CART
// =====================================

export async function clearCart(){

    const response =
        await api.delete(
            "/cart"
        );


    return response.data;

}