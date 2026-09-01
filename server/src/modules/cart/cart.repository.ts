import { prisma } from "../../lib/prisma.js";

// =====================================================
// CART INCLUDE
// =====================================================

const cartInclude = {
    items: {
        orderBy: {
            createdAt: "desc"
        },
        include: {
            listing: {
                include: {
                    images: true,
                    owner: true,
                    category: true
                }
            }
        }
    }
} as const;


// =====================================================
// GET USER CART
// =====================================================

export async function getUserCart(
    userId: string
) {
    let cart = await prisma.cart.findUnique({
        where: {
            userId
        },
        include: cartInclude
    });

    // -------------------------------------------------
    // CREATE CART IF USER DOES NOT HAVE ONE
    // -------------------------------------------------

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId
            },
            include: cartInclude
        });
    }

    return cart;
}


// =====================================================
// ADD ITEM TO CART
// =====================================================

export async function addCartItem(
    userId: string,
    listingId: string
) {

    // -------------------------------------------------
    // CHECK LISTING
    // -------------------------------------------------

    const listing = await prisma.listing.findFirst({
        where: {
            id: listingId,
            status: "ACTIVE",
            available: true,
            price: {
                not: null
            }
        },
        select: {
            id: true,
            ownerId: true
        }
    });

    if (!listing) {
        throw new Error(
            "This listing is no longer available to add to your cart."
        );
    }


    // -------------------------------------------------
    // PREVENT BUYING OWN LISTING
    // -------------------------------------------------

    if (listing.ownerId === userId) {
        throw new Error(
            "You cannot add your own listing to your cart."
        );
    }


    // -------------------------------------------------
    // FIND OR CREATE USER CART
    // -------------------------------------------------

    let cart = await prisma.cart.findUnique({
        where: {
            userId
        }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId
            }
        });
    }


    // -------------------------------------------------
    // CHECK EXISTING ITEM
    // -------------------------------------------------

    const existingItem =
        await prisma.cartItem.findUnique({
            where: {
                cartId_listingId: {
                    cartId: cart.id,
                    listingId
                }
            }
        });


    // -------------------------------------------------
    // ALREADY IN CART
    // -------------------------------------------------

    if (existingItem) {
        return existingItem;
    }


    // -------------------------------------------------
    // CREATE CART ITEM
    // -------------------------------------------------

    return prisma.cartItem.create({
        data: {
            cartId: cart.id,
            listingId,
            quantity: 1
        }
    });
}


// =====================================================
// UPDATE CART ITEM QUANTITY
// =====================================================

export async function updateCartItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
) {

    // -------------------------------------------------
    // VERIFY CART ITEM BELONGS TO USER
    // -------------------------------------------------

    const item = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cart: {
                userId
            }
        },
        select: {
            id: true,
            listingId: true
        }
    });

    if (!item) {
        throw new Error(
            "Cart item not found."
        );
    }


    // -------------------------------------------------
    // VERIFY LISTING IS STILL AVAILABLE
    // -------------------------------------------------

    const listing =
        await prisma.listing.findFirst({
            where: {
                id: item.listingId,
                status: "ACTIVE",
                available: true,
                price: {
                    not: null
                }
            },
            select: {
                id: true
            }
        });

    if (!listing) {
        throw new Error(
            "This listing is no longer available."
        );
    }


    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------

    return prisma.cartItem.update({
        where: {
            id: item.id
        },
        data: {
            quantity
        }
    });
}


// =====================================================
// REMOVE CART ITEM
// =====================================================

export async function removeCartItem(
    userId: string,
    itemId: string
) {

    // -------------------------------------------------
    // VERIFY OWNERSHIP
    // -------------------------------------------------

    const item = await prisma.cartItem.findFirst({
        where: {
            id: itemId,
            cart: {
                userId
            }
        },
        select: {
            id: true
        }
    });

    if (!item) {
        throw new Error(
            "Cart item not found."
        );
    }


    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    return prisma.cartItem.delete({
        where: {
            id: item.id
        }
    });
}


// =====================================================
// CLEAR USER CART
// =====================================================

export async function clearUserCart(
    userId: string
) {

    const cart =
        await prisma.cart.findUnique({
            where: {
                userId
            },
            select: {
                id: true
            }
        });

    if (!cart) {
        return {
            count: 0
        };
    }


    return prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id
        }
    });
}