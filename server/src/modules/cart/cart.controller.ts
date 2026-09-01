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


// =====================================================
// AUTH USER TYPE
// =====================================================

interface AuthenticatedRequest
    extends FastifyRequest {

    user?: {
        id?: string;
        sub?: string;
        userId?: string;
    };
}


// =====================================================
// GET USER ID
// =====================================================

function getUserId(
    request: AuthenticatedRequest
): string {

    const userId =
        request.user?.id ||
        request.user?.sub ||
        request.user?.userId;


    if (!userId) {
        throw new Error(
            "Authenticated user ID could not be determined."
        );
    }


    return userId;
}


// =====================================================
// ERROR MESSAGE
// =====================================================

function getErrorMessage(
    error: unknown
): string {

    if (
        error instanceof Error
    ) {
        return error.message;
    }

    return "An unexpected error occurred.";
}


// =====================================================
// GET CART
// =====================================================

export async function getCartController(
    request: FastifyRequest,
    reply: FastifyReply
) {

    try {

        const userId =
            getUserId(
                request as AuthenticatedRequest
            );


        const cart =
            await fetchUserCart(
                userId
            );


        return reply.send({
            success: true,
            cart
        });

    } catch (error) {

        request.log.error(
            error,
            "Get cart error"
        );


        return reply.status(401).send({
            success: false,
            message:
                getErrorMessage(error)
        });
    }
}


// =====================================================
// ADD TO CART
// =====================================================

interface AddCartRequest
    extends FastifyRequest {

    Params: {
        listingId: string;
    };
}


export async function addCartController(
    request: AddCartRequest,
    reply: FastifyReply
) {

    try {

        const userId =
            getUserId(
                request as AuthenticatedRequest
            );


        const {
            listingId
        } = request.params;


        if (!listingId) {

            return reply.status(400).send({
                success: false,
                message:
                    "Listing ID is required."
            });

        }


        const cart =
            await addItemToCart(
                userId,
                listingId
            );


        return reply.status(200).send({
            success: true,
            message:
                "Item added to cart successfully.",
            cart
        });

    } catch (error) {

        request.log.error(
            error,
            "Add cart item error"
        );


        const message =
            getErrorMessage(error);


        const statusCode =
            message.includes("own listing")
                ? 403
                : message.includes("no longer available")
                    ? 409
                    : 400;


        return reply.status(
            statusCode
        ).send({
            success: false,
            message
        });
    }
}


// =====================================================
// UPDATE QUANTITY
// =====================================================

interface UpdateCartRequest
    extends FastifyRequest {

    Params: {
        itemId: string;
    };

    Body: {
        quantity: number;
    };
}


export async function updateCartController(
    request: UpdateCartRequest,
    reply: FastifyReply
) {

    try {

        const userId =
            getUserId(
                request as AuthenticatedRequest
            );


        const {
            itemId
        } = request.params;


        const {
            quantity
        } = request.body || {};


        if (!Number.isInteger(quantity)) {

            return reply.status(400).send({
                success: false,
                message:
                    "Quantity must be a whole number."
            });

        }


        if (quantity < 1) {

            return reply.status(400).send({
                success: false,
                message:
                    "Quantity must be at least 1."
            });

        }


        const cart =
            await changeCartItemQuantity(
                userId,
                itemId,
                quantity
            );


        return reply.send({
            success: true,
            message:
                "Cart quantity updated successfully.",
            cart
        });

    } catch (error) {

        request.log.error(
            error,
            "Update cart quantity error"
        );


        const message =
            getErrorMessage(error);


        const statusCode =
            message === "Cart item not found."
                ? 404
                : message.includes("no longer available")
                    ? 409
                    : 400;


        return reply.status(
            statusCode
        ).send({
            success: false,
            message
        });
    }
}


// =====================================================
// REMOVE ITEM
// =====================================================

interface RemoveCartRequest
    extends FastifyRequest {

    Params: {
        itemId: string;
    };
}


export async function removeCartController(
    request: RemoveCartRequest,
    reply: FastifyReply
) {

    try {

        const userId =
            getUserId(
                request as AuthenticatedRequest
            );


        const {
            itemId
        } = request.params;


        const cart =
            await removeItemFromCart(
                userId,
                itemId
            );


        return reply.send({
            success: true,
            message:
                "Item removed from cart successfully.",
            cart
        });

    } catch (error) {

        request.log.error(
            error,
            "Remove cart item error"
        );


        const message =
            getErrorMessage(error);


        const statusCode =
            message === "Cart item not found."
                ? 404
                : 400;


        return reply.status(
            statusCode
        ).send({
            success: false,
            message
        });
    }
}


// =====================================================
// CLEAR CART
// =====================================================

export async function clearCartController(
    request: FastifyRequest,
    reply: FastifyReply
) {

    try {

        const userId =
            getUserId(
                request as AuthenticatedRequest
            );


        const cart =
            await emptyCart(
                userId
            );


        return reply.send({
            success: true,
            message:
                "Cart cleared successfully.",
            cart
        });

    } catch (error) {

        request.log.error(
            error,
            "Clear cart error"
        );


        return reply.status(400).send({
            success: false,
            message:
                getErrorMessage(error)
        });
    }
}