import type {
    FastifyReply,
    FastifyRequest
} from "fastify";

import {
    createOrder,
    getBuyerOrders,
    getBuyerOrderById,
    getSellerOrders,
    getSellerOrder,
    updateSellerOrderItemStatus
} from "./order.service.js";

// =====================================================
// TYPES
// =====================================================

interface AuthenticatedUser {
    id: string;
}

interface CheckoutRequestBody {
    deliveryAddress: string;
    phone: string;
    note?: string;
    paymentMethod: "FLUTTERWAVE";
}

interface OrderIdParams {
    id: string;
}

interface UpdateOrderStatusBody {
    status:
        | "PENDING"
        | "CONFIRMED"
        | "PROCESSING"
        | "READY"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED";
}

// =====================================================
// CHECKOUT
// =====================================================

export async function checkoutController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user =
            request.user as AuthenticatedUser;

        const body =
            request.body as CheckoutRequestBody;

        if (
            !body.deliveryAddress?.trim()
        ) {
            return reply.code(400).send({
                success: false,
                message:
                    "Delivery address is required"
            });
        }

        if (!body.phone?.trim()) {
            return reply.code(400).send({
                success: false,
                message:
                    "Phone number is required"
            });
        }

        if (
            body.paymentMethod !==
            "FLUTTERWAVE"
        ) {
            return reply.code(400).send({
                success: false,
                message:
                    "Only Flutterwave payments are supported"
            });
        }

        // =============================================
        // LOAD CART
        // =============================================

        const cart =
            await import("../../lib/prisma.js")
                .then(({ prisma }) =>
                    prisma.cart.findUnique({
                        where: {
                            userId:
                                user.id
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
                    })
                );

        if (
            !cart ||
            cart.items.length === 0
        ) {
            return reply.code(400).send({
                success: false,
                message:
                    "Your cart is empty"
            });
        }

        // =============================================
        // VALIDATE CART
        // =============================================

        let subtotal = 0;

        const items = [];

        for (
            const cartItem of cart.items
        ) {
            const listing =
                cartItem.listing;

            if (
                listing.status !==
                    "ACTIVE" ||
                !listing.available
            ) {
                return reply.code(400).send({
                    success: false,
                    message:
                        `${listing.title} is no longer available`
                });
            }

            if (
                listing.ownerId ===
                user.id
            ) {
                return reply.code(400).send({
                    success: false,
                    message:
                        "You cannot purchase your own listing"
                });
            }

            if (
                listing.price ===
                    null ||
                listing.price <= 0
            ) {
                return reply.code(400).send({
                    success: false,
                    message:
                        `${listing.title} does not have a valid price`
                });
            }

            const itemSubtotal =
                listing.price *
                cartItem.quantity;

            subtotal +=
                itemSubtotal;

            items.push({
                listingId:
                    listing.id,

                sellerId:
                    listing.ownerId,

                title:
                    listing.title,

                unitPrice:
                    listing.price,

                quantity:
                    cartItem.quantity,

                subtotal:
                    itemSubtotal
            });
        }

        // =============================================
        // DELIVERY FEE
        // =============================================

        const deliveryFee = 0;

        const total =
            subtotal +
            deliveryFee;

        // =============================================
        // ORDER NUMBER
        // =============================================

        const orderNumber =
            `OBT-${Date.now()}-${Math.floor(
                Math.random() * 10000
            )
                .toString()
                .padStart(4, "0")}`;

        // =============================================
        // CREATE RESERVED ORDER
        // =============================================

        const order =
            await createOrder({
                orderNumber,
                buyerId: user.id,

                subtotal,
                deliveryFee,
                total,

                currency: "NGN",

                paymentMethod:
                    "FLUTTERWAVE",

                deliveryAddress:
                    body.deliveryAddress,

                phone:
                    body.phone,

                note:
                    body.note,

                items
            });

        return reply.code(201).send({
            success: true,
            message:
                "Order created. Continue to Flutterwave to complete payment.",
            order
        });
    } catch (error: any) {
        request.log.error(error);

        return reply.code(400).send({
            success: false,
            message:
                error?.message ||
                "Unable to create order"
        });
    }
}

// =====================================================
// BUYER ORDERS
// =====================================================

export async function getBuyerOrdersController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user =
            request.user as AuthenticatedUser;

        const orders =
            await getBuyerOrders(
                user.id
            );

        return reply.send({
            success: true,
            orders
        });
    } catch (error: any) {
        return reply.code(400).send({
            success: false,
            message:
                error?.message ||
                "Unable to fetch orders"
        });
    }
}

// =====================================================
// SINGLE BUYER ORDER
// =====================================================

export async function getBuyerOrderController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user =
            request.user as AuthenticatedUser;

        const {
            id
        } =
            request.params as OrderIdParams;

        const order =
            await getBuyerOrderById(
                user.id,
                id
            );

        if (!order) {
            return reply.code(404).send({
                success: false,
                message:
                    "Order not found"
            });
        }

        return reply.send({
            success: true,
            order
        });
    } catch (error: any) {
        return reply.code(404).send({
            success: false,
            message:
                error?.message ||
                "Order not found"
        });
    }
}

// =====================================================
// SELLER ORDERS
// =====================================================

export async function getSellerOrdersController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user =
            request.user as AuthenticatedUser;

        const orders =
            await getSellerOrders(
                user.id
            );

        return reply.send({
            success: true,
            orders
        });
    } catch (error: any) {
        return reply.code(400).send({
            success: false,
            message:
                error?.message ||
                "Unable to fetch seller orders"
        });
    }
}

// =====================================================
// SINGLE SELLER ORDER
// =====================================================

export async function getSellerOrderController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user =
            request.user as AuthenticatedUser;

        const {
            id
        } =
            request.params as OrderIdParams;

        const order =
            await getSellerOrder(
                user.id,
                id
            );

        if (!order) {
            return reply.code(404).send({
                success: false,
                message:
                    "Order not found"
            });
        }

        return reply.send({
            success: true,
            order
        });
    } catch (error: any) {
        return reply.code(404).send({
            success: false,
            message:
                error?.message ||
                "Order not found"
        });
    }
}

// =====================================================
// UPDATE SELLER ORDER STATUS
// =====================================================

export async function updateSellerOrderStatusController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const user =
            request.user as AuthenticatedUser;

        const {
            id
        } =
            request.params as OrderIdParams;

        const {
            status
        } =
            request.body as UpdateOrderStatusBody;

        const order =
            await updateSellerOrderItemStatus(
                user.id,
                id,
                status
            );

        return reply.send({
            success: true,
            message:
                "Order status updated",
            order
        });
    } catch (error: any) {
        return reply.code(400).send({
            success: false,
            message:
                error?.message ||
                "Unable to update order status"
        });
    }
}