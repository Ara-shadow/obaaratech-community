import {
    getUserCart,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearUserCart
} from "./cart.repository.js";


// =====================================================
// GET CART
// =====================================================

export async function fetchUserCart(
    userId: string
) {
    return getUserCart(userId);
}


// =====================================================
// ADD ITEM TO CART
// =====================================================

export async function addItemToCart(
    userId: string,
    listingId: string
) {

    if (!userId) {
        throw new Error(
            "User authentication is required."
        );
    }

    if (!listingId) {
        throw new Error(
            "Listing ID is required."
        );
    }


    await addCartItem(
        userId,
        listingId
    );


    // -------------------------------------------------
    // ALWAYS RETURN COMPLETE CART
    // -------------------------------------------------

    return getUserCart(userId);
}


// =====================================================
// CHANGE QUANTITY
// =====================================================

export async function changeCartItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
) {

    if (!Number.isInteger(quantity)) {
        throw new Error(
            "Quantity must be a whole number."
        );
    }

    if (quantity < 1) {
        throw new Error(
            "Quantity must be at least 1."
        );
    }

    if (!userId) {
        throw new Error(
            "User authentication is required."
        );
    }

    if (!itemId) {
        throw new Error(
            "Cart item ID is required."
        );
    }


    await updateCartItemQuantity(
        userId,
        itemId,
        quantity
    );


    return getUserCart(userId);
}


// =====================================================
// REMOVE ITEM
// =====================================================

export async function removeItemFromCart(
    userId: string,
    itemId: string
) {

    if (!userId) {
        throw new Error(
            "User authentication is required."
        );
    }

    if (!itemId) {
        throw new Error(
            "Cart item ID is required."
        );
    }


    await removeCartItem(
        userId,
        itemId
    );


    return getUserCart(userId);
}


// =====================================================
// CLEAR CART
// =====================================================

export async function emptyCart(
    userId: string
) {

    if (!userId) {
        throw new Error(
            "User authentication is required."
        );
    }


    await clearUserCart(
        userId
    );


    return getUserCart(userId);
}