import {
    getUserCart,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearUserCart
} from "./cart.repository.js";


// =====================================
// GET CART
// =====================================

export async function fetchUserCart(
    userId:string
){

    return getUserCart(
        userId
    );

}



// =====================================
// ADD TO CART
// =====================================

export async function addItemToCart(
    userId:string,
    listingId:string
){

    return addCartItem(
        userId,
        listingId
    );

}



// =====================================
// UPDATE QUANTITY
// =====================================

export async function changeCartItemQuantity(
    userId:string,
    itemId:string,
    quantity:number
){

    if(!Number.isInteger(quantity) || quantity < 1){

        throw new Error(
            "Quantity must be at least 1"
        );

    }


    return updateCartItemQuantity(
        userId,
        itemId,
        quantity
    );

}



// =====================================
// REMOVE ITEM
// =====================================

export async function removeItemFromCart(
    userId:string,
    itemId:string
){

    return removeCartItem(
        userId,
        itemId
    );

}



// =====================================
// CLEAR CART
// =====================================

export async function emptyCart(
    userId:string
){

    return clearUserCart(
        userId
    );

}
