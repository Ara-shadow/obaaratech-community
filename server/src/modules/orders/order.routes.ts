// src/modules/orders/order.routes.ts
import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function orderRoutes(app: FastifyInstance) {

    // ============================
    // CREATE ORDER
    // ============================
    app.post(
        "/orders",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                deliveryAddress: string;
                phone: string;
                note?: string;
                paymentMethod?: string;
            };

            // Get cart
            const cart = await prisma.cart.findUnique({
                where: { userId: user.id },
                include: {
                    items: {
                        include: {
                            listing: true
                        }
                    }
                }
            });

            if (!cart || cart.items.length === 0) {
                return reply.code(400).send({
                    success: false,
                    message: "Cart is empty"
                });
            }

            // Calculate totals
            let subtotal = 0;
            const orderItems = [];

            for (const item of cart.items) {
                const price = item.listing.price || 0;
                const itemTotal = price * item.quantity;
                subtotal += itemTotal;
                
                orderItems.push({
                    listingId: item.listingId,
                    sellerId: item.listing.ownerId,
                    title: item.listing.title,
                    unitPrice: price,
                    quantity: item.quantity,
                    subtotal: itemTotal
                });
            }

            const deliveryFee = 0;
            const total = subtotal + deliveryFee;

            // Create order
            const order = await prisma.order.create({
                data: {
                    orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    buyerId: user.id,
                    subtotal,
                    deliveryFee,
                    total,
                    paymentMethod: body.paymentMethod as any || "CASH_ON_DELIVERY",
                    deliveryAddress: body.deliveryAddress,
                    phone: body.phone,
                    note: body.note,
                    items: {
                        create: orderItems
                    }
                },
                include: {
                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    }
                }
            });

            // Clear cart
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            return {
                success: true,
                order
            };
        }
    );

    // ============================
    // GET BUYER ORDERS
    // ============================
    app.get(
        "/orders",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const orders = await prisma.order.findMany({
                where: { buyerId: user.id },
                include: {
                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            return {
                success: true,
                orders
            };
        }
    );

    // ============================
    // GET ORDER BY ID
    // ============================
    app.get(
        "/orders/:id",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            const order = await prisma.order.findFirst({
                where: {
                    id,
                    buyerId: user.id
                },
                include: {
                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    }
                }
            });

            if (!order) {
                return reply.code(404).send({
                    success: false,
                    message: "Order not found"
                });
            }

            return {
                success: true,
                order
            };
        }
    );
}