import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function cartRoutes(app: FastifyInstance) {

    // ============================
    // GET CART
    // ============================
    app.get(
        "/",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;

            let cart = await prisma.cart.findUnique({
                where: { userId: user.id },
                include: {
                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true,
                                    category: true,
                                    owner: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // Create cart if doesn't exist
            if (!cart) {
                cart = await prisma.cart.create({
                    data: { userId: user.id },
                    include: {
                        items: {
                            include: {
                                listing: {
                                    include: {
                                        images: true,
                                        category: true
                                    }
                                }
                            }
                        }
                    }
                });
            }

            return {
                success: true,
                cart
            };
        }
    );

    // ============================
    // ADD TO CART
    // ============================
    app.post(
        "/",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as { listingId: string; quantity?: number };

            if (!body.listingId) {
                return reply.code(400).send({
                    success: false,
                    message: "Listing ID is required"
                });
            }

            const quantity = body.quantity || 1;

            // Check if listing exists and is available
            const listing = await prisma.listing.findUnique({
                where: { 
                    id: body.listingId,
                    available: true,
                    status: "ACTIVE"
                }
            });

            if (!listing) {
                return reply.code(404).send({
                    success: false,
                    message: "Listing not available"
                });
            }

            // Get or create cart
            let cart = await prisma.cart.findUnique({
                where: { userId: user.id }
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { userId: user.id }
                });
            }

            // Check if item already in cart
            const existingItem = await prisma.cartItem.findUnique({
                where: {
                    cartId_listingId: {
                        cartId: cart.id,
                        listingId: body.listingId
                    }
                }
            });

            let cartItem;

            if (existingItem) {
                // Update quantity
                cartItem = await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity }
                });
            } else {
                // Add new item
                cartItem = await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        listingId: body.listingId,
                        quantity: quantity
                    }
                });
            }

            // Get updated cart
            const updatedCart = await prisma.cart.findUnique({
                where: { id: cart.id },
                include: {
                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true,
                                    category: true
                                }
                            }
                        }
                    }
                }
            });

            return {
                success: true,
                cart: updatedCart,
                item: cartItem
            };
        }
    );

    // ============================
    // UPDATE CART ITEM QUANTITY
    // ============================
    app.put(
        "/items/:itemId",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { itemId } = request.params as { itemId: string };
            const user = (request as any).user;
            const body = request.body as { quantity: number };

            if (!body.quantity || body.quantity < 1) {
                return reply.code(400).send({
                    success: false,
                    message: "Quantity must be at least 1"
                });
            }

            // Check if item belongs to user's cart
            const cartItem = await prisma.cartItem.findFirst({
                where: {
                    id: itemId,
                    cart: {
                        userId: user.id
                    }
                },
                include: {
                    cart: true
                }
            });

            if (!cartItem) {
                return reply.code(404).send({
                    success: false,
                    message: "Cart item not found"
                });
            }

            const updated = await prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity: body.quantity }
            });

            // Get updated cart
            const cart = await prisma.cart.findUnique({
                where: { id: cartItem.cartId },
                include: {
                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true,
                                    category: true
                                }
                            }
                        }
                    }
                }
            });

            return {
                success: true,
                cart,
                item: updated
            };
        }
    );

    // ============================
    // REMOVE FROM CART
    // ============================
    app.delete(
        "/items/:itemId",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { itemId } = request.params as { itemId: string };
            const user = (request as any).user;

            // Check if item belongs to user's cart
            const cartItem = await prisma.cartItem.findFirst({
                where: {
                    id: itemId,
                    cart: {
                        userId: user.id
                    }
                },
                include: {
                    cart: true
                }
            });

            if (!cartItem) {
                return reply.code(404).send({
                    success: false,
                    message: "Cart item not found"
                });
            }

            await prisma.cartItem.delete({
                where: { id: itemId }
            });

            // Get updated cart
            const cart = await prisma.cart.findUnique({
                where: { id: cartItem.cartId },
                include: {
                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true,
                                    category: true
                                }
                            }
                        }
                    }
                }
            });

            return {
                success: true,
                cart
            };
        }
    );

    // ============================
    // CLEAR CART
    // ============================
    app.delete(
        "/",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const cart = await prisma.cart.findUnique({
                where: { userId: user.id }
            });

            if (!cart) {
                return reply.code(404).send({
                    success: false,
                    message: "Cart not found"
                });
            }

            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            const updatedCart = await prisma.cart.findUnique({
                where: { id: cart.id },
                include: {
                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true,
                                    category: true
                                }
                            }
                        }
                    }
                }
            });

            return {
                success: true,
                cart: updatedCart
            };
        }
    );
}