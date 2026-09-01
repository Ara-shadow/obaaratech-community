import { prisma } from "../../lib/prisma.js";
// =====================================
// CREATE MARKETPLACE TRANSACTION
// =====================================
export async function createMarketplaceTransaction(data) {
    return prisma.marketplaceTransaction.create({
        data: {
            orderId: data.orderId,
            amount: data.amount,
            currency: data.currency,
            paymentMethod: data.paymentMethod,
            provider: data.provider,
            providerReference: data.providerReference,
            transactionReference: data.transactionReference,
            metadata: data.metadata
        },
        include: {
            order: {
                include: {
                    items: true,
                    payment: true
                }
            }
        }
    });
}
// =====================================
// GET TRANSACTION BY ID
// =====================================
export async function getMarketplaceTransactionById(transactionId) {
    return prisma.marketplaceTransaction.findUnique({
        where: {
            id: transactionId
        },
        include: {
            order: {
                include: {
                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true
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
                                    email: true,
                                    phone: true,
                                    whatsapp: true
                                }
                            }
                        }
                    },
                    payment: true
                }
            },
            earnings: {
                include: {
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    orderItem: true
                }
            }
        }
    });
}
// =====================================
// GET TRANSACTION BY ORDER
// =====================================
export async function getMarketplaceTransactionByOrderId(orderId) {
    return prisma.marketplaceTransaction.findUnique({
        where: {
            orderId
        },
        include: {
            order: {
                include: {
                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true
                        }
                    },
                    items: true,
                    payment: true
                }
            },
            earnings: true
        }
    });
}
// =====================================
// UPDATE MARKETPLACE TRANSACTION
// =====================================
export async function updateMarketplaceTransaction(transactionId, data) {
    return prisma.marketplaceTransaction.update({
        where: {
            id: transactionId
        },
        data: {
            ...(data.status !== undefined && {
                status: data.status
            }),
            ...(data.provider !== undefined && {
                provider: data.provider
            }),
            ...(data.providerReference !== undefined && {
                providerReference: data.providerReference
            }),
            ...(data.transactionReference !== undefined && {
                transactionReference: data.transactionReference
            }),
            ...(data.metadata !== undefined && {
                metadata: data.metadata
            }),
            ...(data.verifiedAt !== undefined && {
                verifiedAt: data.verifiedAt
            }),
            ...(data.paidAt !== undefined && {
                paidAt: data.paidAt
            })
        }
    });
}
// =====================================
// GET ORDER FOR PAYMENT PROCESSING
// =====================================
export async function getOrderForMarketplacePayment(orderId) {
    return prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            buyer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            },
            payment: true,
            items: {
                include: {
                    listing: true,
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true
                        }
                    }
                }
            },
            marketplaceTransaction: true
        }
    });
}
// =====================================
// CREATE SELLER EARNING
// =====================================
export async function createSellerEarning(data) {
    return prisma.sellerEarning.create({
        data: {
            transactionId: data.transactionId,
            orderItemId: data.orderItemId,
            sellerId: data.sellerId,
            grossAmount: data.grossAmount,
            commissionRate: data.commissionRate,
            commissionAmount: data.commissionAmount,
            paymentFee: data.paymentFee ?? 0,
            netAmount: data.netAmount,
            status: data.status ?? "PENDING",
            availableAt: data.availableAt ?? null
        }
    });
}
// =====================================
// GET SELLER EARNINGS
// =====================================
export async function getSellerEarnings(sellerId) {
    return prisma.sellerEarning.findMany({
        where: {
            sellerId
        },
        include: {
            transaction: {
                select: {
                    id: true,
                    orderId: true,
                    amount: true,
                    currency: true,
                    status: true,
                    paidAt: true,
                    createdAt: true
                }
            },
            orderItem: {
                select: {
                    id: true,
                    title: true,
                    quantity: true,
                    unitPrice: true,
                    subtotal: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}
// =====================================
// GET SELLER BALANCE
// =====================================
export async function getSellerBalance(sellerId) {
    return prisma.sellerBalance.findUnique({
        where: {
            userId: sellerId
        },
        include: {
            ledgerEntries: {
                orderBy: {
                    createdAt: "desc"
                },
                take: 100
            }
        }
    });
}
// =====================================
// CREATE OR GET SELLER BALANCE
// =====================================
export async function getOrCreateSellerBalance(sellerId, tx = prisma) {
    return tx.sellerBalance.upsert({
        where: {
            userId: sellerId
        },
        create: {
            userId: sellerId
        },
        update: {}
    });
}
// =====================================
// CREATE LEDGER ENTRY
// =====================================
export async function createSellerLedgerEntry(data, tx = prisma) {
    return tx.sellerLedgerEntry.create({
        data: {
            sellerId: data.sellerId,
            balanceId: data.balanceId,
            type: data.type,
            amount: data.amount,
            referenceType: data.referenceType,
            referenceId: data.referenceId,
            description: data.description
        }
    });
}
// =====================================
// UPDATE SELLER BALANCE
// =====================================
export async function updateSellerBalance(balanceId, data, tx = prisma) {
    return tx.sellerBalance.update({
        where: {
            id: balanceId
        },
        data: {
            ...(data.pendingBalance !== undefined && {
                pendingBalance: data.pendingBalance
            }),
            ...(data.availableBalance !== undefined && {
                availableBalance: data.availableBalance
            }),
            ...(data.totalSales !== undefined && {
                totalSales: data.totalSales
            }),
            ...(data.totalCommission !== undefined && {
                totalCommission: data.totalCommission
            }),
            ...(data.totalSettled !== undefined && {
                totalSettled: data.totalSettled
            })
        }
    });
}
// =====================================
// CREDIT SELLER PENDING BALANCE
// =====================================
export async function creditSellerPendingBalance(sellerId, grossAmount, commissionAmount, tx) {
    const balance = await getOrCreateSellerBalance(sellerId, tx);
    const netAmount = grossAmount -
        commissionAmount;
    if (netAmount < 0) {
        throw new Error("Seller net earning cannot be negative");
    }
    return tx.sellerBalance.update({
        where: {
            id: balance.id
        },
        data: {
            pendingBalance: {
                increment: netAmount
            },
            totalSales: {
                increment: grossAmount
            },
            totalCommission: {
                increment: commissionAmount
            }
        }
    });
}
// =====================================
// MARK ORDER PAYMENT SUCCESSFUL
// =====================================
export async function markOrderPaymentSuccessful(orderId, reference, provider, tx) {
    return tx.orderPayment.update({
        where: {
            orderId
        },
        data: {
            status: "PAID",
            reference,
            provider,
            paidAt: new Date()
        }
    });
}
// =====================================
// MARK ORDER PAYMENT COMPLETED
// =====================================
export async function markOrderPaymentCompleted(orderId, tx) {
    return tx.order.update({
        where: {
            id: orderId
        },
        data: {
            paymentStatus: "PAID"
        },
        include: {
            payment: true,
            items: true
        }
    });
}
// =====================================
// FIND EXISTING EARNING
// =====================================
export async function getSellerEarningByOrderItem(orderItemId) {
    return prisma.sellerEarning.findFirst({
        where: {
            orderItemId
        }
    });
}
// =====================================
// TRANSACTION HELPER
// =====================================
export async function runMarketplacePaymentTransaction(callback) {
    return prisma.$transaction(async (tx) => {
        return callback(tx);
    });
}
