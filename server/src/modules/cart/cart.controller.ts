import type {
    FastifyReply,
    FastifyRequest
} from "fastify";


import {
    fetchUserCart,
    addItemToCart,
    changeCartItemQuantity,
    removeItemFromCart,
    emptyCart
} from "./cart.service.js";



// =====================================
// GET CART
// =====================================

export async function getCartController(
    request:FastifyRequest,
    reply:FastifyReply
){

    const user =
        request.user as {
            id:string;
        };


    const cart =
        await fetchUserCart(
            user.id
        );


    return reply.send({

        success:true,

        cart

    });

}




// =====================================
// ADD ITEM
// =====================================

export async function addCartController(
    request:FastifyRequest,
    reply:FastifyReply
){

    const user =
        request.user as {
            id:string;
        };


    const {
        listingId
    } =
    request.params as {
        listingId:string;
    };


    const item =
        await addItemToCart(
            user.id,
            listingId
        );


    return reply.code(201).send({

        success:true,

        message:"Added to cart",

        item

    });

}




// =====================================
// UPDATE QUANTITY
// =====================================

export async function updateCartController(
    request:FastifyRequest,
    reply:FastifyReply
){

    const {
        itemId
    } =
    request.params as {
        itemId:string;
    };


    const {
        quantity
    } =
    request.body as {
        quantity:number;
    };


    const item =
        await changeCartItemQuantity(
            itemId,
            quantity
        );


    return reply.send({

        success:true,

        item

    });

}




// =====================================
// REMOVE ITEM
// =====================================

export async function removeCartController(
    request:FastifyRequest,
    reply:FastifyReply
){

    const {
        itemId
    } =
    request.params as {
        itemId:string;
    };


    await removeItemFromCart(
        itemId
    );


    return reply.send({

        success:true,

        message:"Removed from cart"

    });

}




// =====================================
// CLEAR CART
// =====================================

export async function clearCartController(
    request:FastifyRequest,
    reply:FastifyReply
){

    const user =
        request.user as {
            id:string;
        };


    await emptyCart(
        user.id
    );


    return reply.send({

        success:true,

        message:"Cart cleared"

    });

}