import {
    prisma
} from "../../lib/prisma.js";


// =====================================
// TYPES
// =====================================

export interface CreateOrderItemInput {

    listingId: string;

    sellerId: string;

    title: string;

    unitPrice: number;

    quantity: number;

    subtotal: number;

}


export interface CreateOrderInput {

    orderNumber: string;

    buyerId: string;

    subtotal: number;

    deliveryFee: number;

    total: number;

    paymentMethod:
        "CASH_ON_DELIVERY"
        | "BANK_TRANSFER"
        | "PAYSTACK";

    deliveryAddress: string;

    phone: string;

    note?: string;

    items: CreateOrderItemInput[];

}


// =====================================
// CREATE ORDER
// =====================================

export async function createOrder(
    data: CreateOrderInput
) {

    return prisma.$transaction(
        async (tx) => {

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

                        paymentMethod:
                            data.paymentMethod,

                        deliveryAddress:
                            data.deliveryAddress,

                        phone:
                            data.phone,

                        note:
                            data.note,

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
                                            item.subtotal

                                    })
                                )

                        }

                    },

                    include: {

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

            await tx.cartItem.deleteMany({

                where: {

                    cart: {

                        userId:
                            data.buyerId

                    }

                }

            });


            return order;

        }
    );

}


// =====================================
// GET BUYER ORDERS
// =====================================

export async function getBuyerOrders(
    buyerId: string
) {

    return prisma.order.findMany({

        where: {

            buyerId

        },

        include: {

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
// GET SELLER ORDER ITEM
// =====================================

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
// UPDATE ORDER STATUS
// =====================================

export async function updateOrderStatus(
    orderId: string,
    status:
        | "PENDING"
        | "CONFIRMED"
        | "PROCESSING"
        | "READY"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED"
) {

    return prisma.order.update({

        where: {

            id: orderId

        },

        data: {

            status

        }

    });

}