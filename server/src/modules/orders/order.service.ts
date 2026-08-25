import { prisma } from "../../lib/prisma.js";
import type {
    Currency,
    OrderPaymentMethod,
    OrderItemStatus
} from "@prisma/client";

// =====================================================
// PAYMENT RESERVATION WINDOW
// =====================================================

const PAYMENT_RESERVATION_MINUTES = 30;

// =====================================================
// CREATE ORDER
// =====================================================

export async function createOrder(data: {
    orderNumber: string;
    buyerId: string;

    subtotal: number;
    deliveryFee: number;
    total: number;

    currency: Currency;

    paymentMethod: OrderPaymentMethod;

    deliveryAddress: string;
    phone: string;
    note?: string;

    items: {
        listingId: string;
        sellerId: string;
        title: string;
        unitPrice: number;
        quantity: number;
        subtotal: number;
    }[];
}) {
    return prisma.$transaction(async (tx) => {
        if (data.items.length === 0) {
            throw new Error("Your cart is empty");
        }

        const reservedAt = new Date();

        const paymentExpiresAt = new Date(
            reservedAt.getTime() +
                PAYMENT_RESERVATION_MINUTES * 60 * 1000
        );

        // =================================================
        // RESERVE LISTINGS
        // =================================================

        for (const item of data.items) {
            const reservation =
                await tx.listing.updateMany({
                    where: {
                        id: item.listingId,
                        status: "ACTIVE",
                        available: true
                    },

                    data: {
                        status: "RESERVED",
                        available: false,
                        reservedAt
                    }
                });

            if (reservation.count !== 1) {
                throw new Error(
                    "One or more listings are no longer available"
                );
            }
        }

        // =================================================
        // CREATE ORDER
        // =================================================

        const order =
            await tx.order.create({
                data: {
                    orderNumber:
                        data.orderNumber,

                    buyerId:
                        data.buyerId,

                    subtotal:
                        data.subtotal,

                    deliveryFee:
                        data.deliveryFee,

                    total:
                        data.total,

                    currency:
                        data.currency,

                    paymentMethod:
                        data.paymentMethod,

                    paymentStatus:
                        "PENDING",

                    status:
                        "PENDING",

                    paymentExpiresAt,

                    deliveryAddress:
                        data.deliveryAddress,

                    phone:
                        data.phone,

                    note:
                        data.note,

                    // =====================================
                    // ORDER PAYMENT
                    // =====================================

                    payment: {
                        create: {
                            amount:
                                data.total,

                            currency:
                                data.currency,

                            paymentMethod:
                                data.paymentMethod,

                            status:
                                "PENDING",

                            provider:
                                data.paymentMethod ===
                                "FLUTTERWAVE"
                                    ? "FLUTTERWAVE"
                                    : null
                        }
                    },

                    // =====================================
                    // ORDER ITEMS
                    // =====================================

                    items: {
                        create:
                            data.items.map(
                                (item) => ({
                                    listingId:
                                        item.listingId,

                                    sellerId:
                                        item.sellerId,

                                    title:
                                        item.title,

                                    unitPrice:
                                        item.unitPrice,

                                    quantity:
                                        item.quantity,

                                    subtotal:
                                        item.subtotal,

                                    status:
                                        "PENDING"
                                })
                            )
                    }
                },

                include: {
                    payment: true,

                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            whatsapp: true
                        }
                    },

                    items: {
                        include: {
                            listing: {
                                include: {
                                    images: true
                                }
                            },

                            seller: {
                                select: {
                                    id: true,
                                    name: true,
                                    phone: true,
                                    whatsapp: true
                                }
                            }
                        }
                    }
                }
            });

        // =================================================
        // CLEAR CART
        // =================================================

        await tx.cartItem.deleteMany({
            where: {
                cart: {
                    userId:
                        data.buyerId
                }
            }
        });

        return order;
    });
}

// =====================================================
// GET BUYER ORDERS
// =====================================================

export async function getBuyerOrders(
    buyerId: string
) {
    return prisma.order.findMany({
        where: {
            buyerId
        },

        include: {
            payment: true,

            items: {
                include: {
                    listing: {
                        include: {
                            images: true
                        }
                    },

                    seller: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            whatsapp: true
                        }
                    }
                }
            }
        },

        orderBy: {
            createdAt: "desc"
        }
    });
}

// =====================================================
// GET SINGLE BUYER ORDER
// =====================================================

export async function getBuyerOrderById(
    buyerId: string,
    orderId: string
) {
    return prisma.order.findFirst({
        where: {
            id: orderId,
            buyerId
        },

        include: {
            payment: true,

            items: {
                include: {
                    listing: {
                        include: {
                            images: true
                        }
                    },

                    seller: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            whatsapp: true
                        }
                    }
                }
            }
        }
    });
}

// =====================================================
// GET SELLER ORDERS
// =====================================================

export async function getSellerOrders(
    sellerId: string
) {
    return prisma.order.findMany({
        where: {
            items: {
                some: {
                    sellerId
                }
            }
        },

        include: {
            payment: true,

            buyer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    whatsapp: true
                }
            },

            items: {
                where: {
                    sellerId
                },

                include: {
                    listing: {
                        include: {
                            images: true
                        }
                    }
                }
            }
        },

        orderBy: {
            createdAt: "desc"
        }
    });
}

// =====================================================
// GET SINGLE SELLER ORDER
// =====================================================

export async function getSellerOrder(
    sellerId: string,
    orderId: string
) {
    return prisma.order.findFirst({
        where: {
            id: orderId,

            items: {
                some: {
                    sellerId
                }
            }
        },

        include: {
            payment: true,

            buyer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    whatsapp: true
                }
            },

            items: {
                where: {
                    sellerId
                },

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
}

// =====================================================
// UPDATE SELLER ORDER ITEM STATUS
// =====================================================

export async function updateSellerOrderItemStatus(
    sellerId: string,
    orderId: string,
    status: OrderItemStatus
) {
    return prisma.$transaction(
        async (tx) => {
            const sellerItems =
                await tx.orderItem.findMany({
                    where: {
                        orderId,
                        sellerId
                    },

                    select: {
                        id: true
                    }
                });

            if (
                sellerItems.length === 0
            ) {
                throw new Error(
                    "Order not found or you are not authorized to update it"
                );
            }

            // =============================================
            // SELLER MUST NOT PROCESS UNPAID ORDERS
            // =============================================

            const order =
                await tx.order.findUnique({
                    where: {
                        id: orderId
                    },

                    select: {
                        paymentStatus: true
                    }
                });

            if (!order) {
                throw new Error(
                    "Order not found"
                );
            }

            if (
                order.paymentStatus !==
                "PAID"
            ) {
                throw new Error(
                    "The order cannot be processed until payment is confirmed"
                );
            }

            // =============================================
            // UPDATE SELLER ITEMS
            // =============================================

            await tx.orderItem.updateMany({
                where: {
                    orderId,
                    sellerId
                },

                data: {
                    status
                }
            });

            // =============================================
            // GET ALL ITEMS
            // =============================================

            const allItems =
                await tx.orderItem.findMany({
                    where: {
                        orderId
                    },

                    select: {
                        status: true
                    }
                });

            const statuses =
                allItems.map(
                    (item) =>
                        item.status
                );

            // =============================================
            // CALCULATE ORDER STATUS
            // =============================================

            let overallStatus:
                | "PENDING"
                | "CONFIRMED"
                | "PROCESSING"
                | "READY"
                | "SHIPPED"
                | "DELIVERED"
                | "CANCELLED";

            if (
                statuses.every(
                    (status) =>
                        status ===
                        "CANCELLED"
                )
            ) {
                overallStatus =
                    "CANCELLED";
            } else if (
                statuses.every(
                    (status) =>
                        status ===
                        "DELIVERED"
                )
            ) {
                overallStatus =
                    "DELIVERED";
            } else if (
                statuses.some(
                    (status) =>
                        status ===
                        "SHIPPED"
                )
            ) {
                overallStatus =
                    "SHIPPED";
            } else if (
                statuses.some(
                    (status) =>
                        status ===
                        "READY"
                )
            ) {
                overallStatus =
                    "READY";
            } else if (
                statuses.some(
                    (status) =>
                        status ===
                        "PROCESSING"
                )
            ) {
                overallStatus =
                    "PROCESSING";
            } else if (
                statuses.some(
                    (status) =>
                        status ===
                        "CONFIRMED"
                )
            ) {
                overallStatus =
                    "CONFIRMED";
            } else {
                overallStatus =
                    "PENDING";
            }

            await tx.order.update({
                where: {
                    id: orderId
                },

                data: {
                    status:
                        overallStatus
                }
            });

            return tx.order.findUnique({
                where: {
                    id: orderId
                },

                include: {
                    payment: true,

                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            whatsapp: true
                        }
                    },

                    items: {
                        where: {
                            sellerId
                        },

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
        }
    );
}

// =====================================================
// RELEASE EXPIRED ORDER
// =====================================================

export async function releaseExpiredOrder(
    orderId: string
) {
    return prisma.$transaction(
        async (tx) => {
            const order =
                await tx.order.findUnique({
                    where: {
                        id: orderId
                    },

                    include: {
                        items: true
                    }
                });

            if (!order) {
                return null;
            }

            if (
                order.paymentStatus ===
                "PAID"
            ) {
                return order;
            }

            if (
                order.paymentExpiresAt &&
                order.paymentExpiresAt >
                    new Date()
            ) {
                return order;
            }

            // =========================================
            // RELEASE LISTINGS
            // =========================================

            for (const item of order.items) {
                await tx.listing.updateMany({
                    where: {
                        id: item.listingId,
                        status: "RESERVED"
                    },

                    data: {
                        status:
                            "ACTIVE",

                        available:
                            true,

                        reservedAt:
                            null
                    }
                });
            }

            await tx.orderPayment.updateMany({
                where: {
                    orderId
                },

                data: {
                    status:
                        "FAILED"
                }
            });

            await tx.order.update({
                where: {
                    id: orderId
                },

                data: {
                    paymentStatus:
                        "FAILED",

                    status:
                        "CANCELLED"
                }
            });

            await tx.orderItem.updateMany({
                where: {
                    orderId
                },

                data: {
                    status:
                        "CANCELLED"
                }
            });

            return tx.order.findUnique({
                where: {
                    id: orderId
                }
            });
        }
    );
}