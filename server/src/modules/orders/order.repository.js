import { prisma } from "../../lib/prisma.js";
// =====================================
// PAYMENT RESERVATION WINDOW
// =====================================
//
// Listings remain RESERVED while the
// customer completes payment.
//
// The payment initialization/verification
// layer will use this expiry time to
// determine whether the reservation is
// still valid.
//
// =====================================
const PAYMENT_RESERVATION_MINUTES = 30;
// =====================================
// CREATE ORDER
// =====================================
export async function createOrder(data) {
    return prisma.$transaction(async (tx) => {
        // =================================
        // RESERVATION EXPIRY
        // =================================
        const reservedAt = new Date();
        const paymentExpiresAt = new Date(reservedAt.getTime() +
            PAYMENT_RESERVATION_MINUTES *
                60 *
                1000);
        // =================================
        // RESERVE LISTINGS
        // =================================
        //
        // A listing is currently treated as
        // a single marketplace item.
        //
        // We reserve every listing inside
        // the same transaction that creates
        // the order.
        //
        // This prevents two customers from
        // purchasing the same listing at
        // the same time.
        //
        // ACTIVE → RESERVED
        //
        // It will only become SOLD after
        // successful payment verification.
        // =================================
        for (const item of data.items) {
            const reservation = await tx.listing.updateMany({
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
                throw new Error("One or more listings are no longer available");
            }
        }
        // =================================
        // CREATE ORDER
        // =================================
        const order = await tx.order.create({
            data: {
                orderNumber: data.orderNumber,
                buyerId: data.buyerId,
                subtotal: data.subtotal,
                deliveryFee: data.deliveryFee,
                total: data.total,
                currency: data.currency,
                paymentMethod: data.paymentMethod,
                paymentStatus: "PENDING",
                paymentExpiresAt,
                deliveryAddress: data.deliveryAddress,
                phone: data.phone,
                note: data.note,
                // =================================
                // CREATE ORDER PAYMENT
                // =================================
                payment: {
                    create: {
                        amount: data.total,
                        currency: data.currency,
                        paymentMethod: data.paymentMethod,
                        status: "PENDING",
                        provider: data.paymentMethod ===
                            "FLUTTERWAVE"
                            ? "FLUTTERWAVE"
                            : null
                    }
                },
                // =================================
                // CREATE ORDER ITEMS
                // =================================
                items: {
                    create: data.items.map((item) => ({
                        listingId: item.listingId,
                        sellerId: item.sellerId,
                        title: item.title,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        subtotal: item.subtotal,
                        status: "PENDING"
                    }))
                }
            },
            // =================================
            // RETURN COMPLETE ORDER
            // =================================
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
        // =================================
        // CLEAR CART
        // =================================
        //
        // The listings have now been
        // successfully transferred into
        // the order/reservation.
        //
        // Clearing the cart here prevents
        // the buyer from attempting to
        // checkout the same items again.
        // =================================
        await tx.cartItem.deleteMany({
            where: {
                cart: {
                    userId: data.buyerId
                }
            }
        });
        return order;
    });
}
// =====================================
// GET BUYER ORDERS
// =====================================
export async function getBuyerOrders(buyerId) {
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
// =====================================
// GET SINGLE BUYER ORDER
// =====================================
export async function getBuyerOrderById(buyerId, orderId) {
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
// =====================================
// GET SELLER ORDERS
// =====================================
export async function getSellerOrders(sellerId) {
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
// =====================================
// GET SINGLE SELLER ORDER
// =====================================
export async function getSellerOrder(sellerId, orderId) {
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
// =====================================
// UPDATE SELLER ITEM STATUS
// =====================================
export async function updateSellerOrderItemStatus(sellerId, orderId, status) {
    return prisma.$transaction(async (tx) => {
        // =================================
        // VERIFY SELLER OWNS ITEMS
        // =================================
        const sellerItems = await tx.orderItem.findMany({
            where: {
                orderId,
                sellerId
            },
            select: {
                id: true
            }
        });
        if (sellerItems.length === 0) {
            throw new Error("Order not found or you are not authorized to update it");
        }
        // =================================
        // UPDATE ONLY THIS SELLER'S ITEMS
        // =================================
        await tx.orderItem.updateMany({
            where: {
                orderId,
                sellerId
            },
            data: {
                status
            }
        });
        // =================================
        // GET ALL ORDER ITEMS
        // =================================
        const allItems = await tx.orderItem.findMany({
            where: {
                orderId
            },
            select: {
                status: true
            }
        });
        // =================================
        // CALCULATE OVERALL ORDER STATUS
        // =================================
        let overallStatus;
        const statuses = allItems.map(item => item.status);
        // =================================
        // CANCELLED
        // =================================
        if (statuses.every(itemStatus => itemStatus ===
            "CANCELLED")) {
            overallStatus =
                "CANCELLED";
        }
        // =================================
        // DELIVERED
        // =================================
        else if (statuses.every(itemStatus => itemStatus ===
            "DELIVERED")) {
            overallStatus =
                "DELIVERED";
        }
        // =================================
        // SHIPPED
        // =================================
        else if (statuses.some(itemStatus => itemStatus ===
            "SHIPPED")) {
            overallStatus =
                "SHIPPED";
        }
        // =================================
        // READY
        // =================================
        else if (statuses.some(itemStatus => itemStatus ===
            "READY")) {
            overallStatus =
                "READY";
        }
        // =================================
        // PROCESSING
        // =================================
        else if (statuses.some(itemStatus => itemStatus ===
            "PROCESSING")) {
            overallStatus =
                "PROCESSING";
        }
        // =================================
        // CONFIRMED
        // =================================
        else if (statuses.some(itemStatus => itemStatus ===
            "CONFIRMED")) {
            overallStatus =
                "CONFIRMED";
        }
        // =================================
        // DEFAULT
        // =================================
        else {
            overallStatus =
                "PENDING";
        }
        // =================================
        // UPDATE OVERALL ORDER
        // =================================
        await tx.order.update({
            where: {
                id: orderId
            },
            data: {
                status: overallStatus
            }
        });
        // =================================
        // RETURN UPDATED SELLER VIEW
        // =================================
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
    });
}
