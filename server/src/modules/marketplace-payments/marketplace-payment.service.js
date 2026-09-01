import { prisma } from "../../lib/prisma.js";
import { getMarketplacePaymentProvider } from "./marketplace-payment.providers.js";
import { createMarketplaceTransaction, getMarketplaceTransactionById, getMarketplaceTransactionByOrderId, updateMarketplaceTransaction, getOrCreateSellerBalance, createSellerLedgerEntry, creditSellerPendingBalance, runMarketplacePaymentTransaction } from "./marketplace-payment.repository.js";
// =====================================
// GET FINANCIAL SETTINGS
// =====================================
async function getCommissionConfiguration(tx = prisma) {
    const settings = await tx.marketplaceFinancialSetting.findFirst({
        orderBy: {
            createdAt: "asc"
        }
    });
    if (!settings) {
        return {
            defaultCommissionRate: 8,
            freeCommissionRate: 8,
            premiumCommissionRate: 6,
            businessCommissionRate: 5
        };
    }
    return {
        defaultCommissionRate: Number(settings.defaultCommissionRate),
        freeCommissionRate: Number(settings.freeCommissionRate),
        premiumCommissionRate: Number(settings.premiumCommissionRate),
        businessCommissionRate: Number(settings.businessCommissionRate)
    };
}
// =====================================
// GET SELLER COMMISSION RATE
// =====================================
async function getSellerCommissionRate(sellerId, tx) {
    const configuration = await getCommissionConfiguration(tx);
    const seller = await tx.user.findUnique({
        where: {
            id: sellerId
        },
        select: {
            id: true,
            sellerSubscription: {
                select: {
                    active: true,
                    expiryDate: true,
                    plan: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });
    if (!seller) {
        throw new Error(`Seller ${sellerId} not found`);
    }
    const subscription = seller.sellerSubscription;
    if (!subscription ||
        !subscription.active ||
        subscription.expiryDate <= new Date()) {
        return configuration.defaultCommissionRate;
    }
    const planName = subscription.plan.name
        .trim()
        .toLowerCase();
    if (planName === "free") {
        return configuration.freeCommissionRate;
    }
    if (planName === "premium") {
        return configuration.premiumCommissionRate;
    }
    if (planName === "business") {
        return configuration.businessCommissionRate;
    }
    return configuration.defaultCommissionRate;
}
// =====================================
// VALIDATE COMMISSION
// =====================================
function validateCommissionRate(rate) {
    if (!Number.isFinite(rate) ||
        rate < 0 ||
        rate > 100) {
        throw new Error("Invalid marketplace commission configuration");
    }
    return rate;
}
// =====================================
// INITIALIZE MARKETPLACE PAYMENT
// =====================================
export async function initializeMarketplacePayment(input) {
    const order = await prisma.order.findUnique({
        where: {
            id: input.orderId
        },
        include: {
            payment: true,
            items: true,
            marketplaceTransaction: true
        }
    });
    if (!order) {
        throw new Error("Order not found");
    }
    if (order.buyerId !==
        input.userId) {
        throw new Error("You are not authorized to pay for this order");
    }
    if (input.paymentMethod !==
        "FLUTTERWAVE") {
        throw new Error("This marketplace currently supports Flutterwave online payments");
    }
    if (order.paymentStatus ===
        "PAID") {
        throw new Error("This order has already been paid");
    }
    if (order.paymentExpiresAt &&
        order.paymentExpiresAt < new Date()) {
        throw new Error("This order payment session has expired");
    }
    if (order.total <= 0) {
        throw new Error("Invalid order amount");
    }
    if (order.currency !==
        "NGN") {
        throw new Error("Marketplace payments currently support NGN only");
    }
    let transaction = order.marketplaceTransaction;
    // =================================
    // CREATE TRANSACTION
    // =================================
    if (!transaction) {
        transaction =
            await createMarketplaceTransaction({
                orderId: order.id,
                amount: order.total,
                currency: order.currency,
                paymentMethod: "FLUTTERWAVE",
                provider: "FLUTTERWAVE",
                transactionReference: undefined,
                metadata: {
                    marketplace: "OBAARATECH",
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    buyerId: order.buyerId
                }
            });
    }
    if (transaction.status ===
        "SUCCESSFUL") {
        throw new Error("This marketplace transaction has already been completed");
    }
    // =================================
    // ENSURE AMOUNT HAS NOT CHANGED
    // =================================
    if (transaction.amount !==
        order.total) {
        throw new Error("Marketplace transaction amount does not match the order total");
    }
    const provider = getMarketplacePaymentProvider(input.paymentMethod);
    console.log("PAYMENT PROVIDER INPUT:", {
        orderId: order.id,
        transactionId: transaction.id,
        amount: order.total,
        currency: order.currency,
        email: input.email,
        userId: order.buyerId
    });
    const result = await provider.initialize({
        transactionId: transaction.id,
        orderId: order.id,
        userId: order.buyerId,
        email: input.email,
        amount: order.total,
        currency: order.currency,
        paymentMethod: input.paymentMethod,
        callbackUrl: input.callbackUrl
    });
    await updateMarketplaceTransaction(transaction.id, {
        status: "PENDING",
        provider: "FLUTTERWAVE",
        providerReference: result.reference,
        transactionReference: transaction.id,
        metadata: {
            marketplace: "OBAARATECH",
            orderId: order.id,
            orderNumber: order.orderNumber,
            provider: "FLUTTERWAVE",
            providerReference: result.reference
        }
    });
    return {
        success: result.success,
        transactionId: transaction.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.total,
        currency: order.currency,
        provider: "FLUTTERWAVE",
        reference: result.reference,
        checkoutUrl: result.checkoutUrl,
        authorizationUrl: result.authorizationUrl,
        metadata: result.metadata
    };
}
// =====================================
// VERIFY MARKETPLACE PAYMENT
// =====================================
export async function verifyMarketplacePayment(input) {
    const transaction = await getMarketplaceTransactionById(input.transactionId);
    if (!transaction) {
        throw new Error("Marketplace transaction not found");
    }
    if (transaction.status ===
        "SUCCESSFUL") {
        return {
            success: true,
            transactionId: transaction.id,
            orderId: transaction.orderId,
            status: "SUCCESSFUL",
            reference: transaction.providerReference ||
                transaction.transactionReference ||
                transaction.id
        };
    }
    if (transaction.paymentMethod !==
        "FLUTTERWAVE") {
        throw new Error("Unsupported marketplace payment provider");
    }
    const provider = getMarketplacePaymentProvider(transaction.paymentMethod);
    const reference = input.reference ||
        transaction.providerReference ||
        transaction.transactionReference ||
        transaction.id;
    const verification = await provider.verify(reference);
    // =================================
    // VERIFY AMOUNT
    // =================================
    if (verification.amount !==
        undefined) {
        if (verification.amount !==
            transaction.amount) {
            throw new Error("Payment amount does not match the marketplace order amount");
        }
    }
    // =================================
    // VERIFY CURRENCY
    // =================================
    if (verification.currency &&
        verification.currency !==
            transaction.currency) {
        throw new Error("Payment currency does not match the order currency");
    }
    // =================================
    // FAILED
    // =================================
    if (verification.status ===
        "FAILED") {
        await updateMarketplaceTransaction(transaction.id, {
            status: "FAILED",
            providerReference: verification.reference,
            verifiedAt: new Date(),
            metadata: verification.metadata
        });
        return {
            success: false,
            transactionId: transaction.id,
            orderId: transaction.orderId,
            status: "FAILED",
            reference: verification.reference
        };
    }
    // =================================
    // PENDING
    // =================================
    if (verification.status !==
        "SUCCESSFUL") {
        return {
            success: false,
            transactionId: transaction.id,
            orderId: transaction.orderId,
            status: "PENDING",
            reference: verification.reference
        };
    }
    // =================================
    // COMPLETE ATOMICALLY
    // =================================
    const completed = await runMarketplacePaymentTransaction(async (tx) => {
        const currentTransaction = await tx.marketplaceTransaction.findUnique({
            where: {
                id: transaction.id
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
        if (!currentTransaction) {
            throw new Error("Marketplace transaction no longer exists");
        }
        // =============================
        // IDEMPOTENCY
        // =============================
        if (currentTransaction.status ===
            "SUCCESSFUL") {
            return currentTransaction;
        }
        // =============================
        // ORDER PAYMENT CHECK
        // =============================
        if (currentTransaction.order.paymentStatus ===
            "PAID") {
            throw new Error("Order is already marked as paid");
        }
        // =============================
        // AMOUNT CHECK
        // =============================
        if (currentTransaction.amount !==
            currentTransaction.order.total) {
            throw new Error("Marketplace transaction amount does not match the order total");
        }
        // =============================
        // UPDATE TRANSACTION
        // =============================
        const updatedTransaction = await tx.marketplaceTransaction.update({
            where: {
                id: currentTransaction.id
            },
            data: {
                status: "SUCCESSFUL",
                provider: "FLUTTERWAVE",
                providerReference: verification.reference,
                transactionReference: currentTransaction.transactionReference ||
                    currentTransaction.id,
                verifiedAt: new Date(),
                paidAt: new Date(),
                metadata: verification.metadata
                    ? verification.metadata
                    : undefined
            }
        });
        // =============================
        // ORDER PAYMENT
        // =============================
        if (currentTransaction.order.payment) {
            await tx.orderPayment.update({
                where: {
                    orderId: currentTransaction.orderId
                },
                data: {
                    status: "PAID",
                    amount: currentTransaction.amount,
                    currency: currentTransaction.currency,
                    paymentMethod: "FLUTTERWAVE",
                    reference: verification.reference,
                    provider: "FLUTTERWAVE",
                    metadata: verification.metadata
                        ? verification.metadata
                        : undefined,
                    paidAt: new Date()
                }
            });
        }
        else {
            await tx.orderPayment.create({
                data: {
                    orderId: currentTransaction.orderId,
                    amount: currentTransaction.amount,
                    currency: currentTransaction.currency,
                    paymentMethod: "FLUTTERWAVE",
                    status: "PAID",
                    reference: verification.reference,
                    provider: "FLUTTERWAVE",
                    metadata: verification.metadata
                        ? verification.metadata
                        : undefined,
                    paidAt: new Date()
                }
            });
        }
        // =============================
        // ORDER
        // =============================
        await tx.order.update({
            where: {
                id: currentTransaction.orderId
            },
            data: {
                paymentStatus: "PAID",
                status: "CONFIRMED"
            }
        });
        await tx.orderItem.updateMany({
            where: {
                orderId: currentTransaction.orderId
            },
            data: {
                status: "CONFIRMED"
            }
        });
        // =============================
        // MARK LISTINGS AS SOLD
        // =============================
        for (const item of currentTransaction.order.items) {
            await tx.listing.update({
                where: {
                    id: item.listingId
                },
                data: {
                    status: "SOLD",
                    available: false,
                    reservedAt: null
                }
            });
        }
        // =============================
        // SELLER EARNINGS
        // =============================
        for (const item of currentTransaction.order.items) {
            const existingEarning = await tx.sellerEarning.findFirst({
                where: {
                    orderItemId: item.id
                }
            });
            if (existingEarning) {
                continue;
            }
            const configuredRate = await getSellerCommissionRate(item.sellerId, tx);
            const commissionRate = validateCommissionRate(configuredRate);
            const commissionAmount = Math.round(item.subtotal *
                commissionRate /
                100);
            const netAmount = item.subtotal -
                commissionAmount;
            if (netAmount < 0) {
                throw new Error("Seller net earning cannot be negative");
            }
            await tx.sellerEarning.create({
                data: {
                    transactionId: currentTransaction.id,
                    orderItemId: item.id,
                    sellerId: item.sellerId,
                    grossAmount: item.subtotal,
                    commissionRate: commissionRate,
                    commissionAmount,
                    paymentFee: 0,
                    netAmount,
                    status: "PENDING",
                    availableAt: null
                }
            });
            const balance = await getOrCreateSellerBalance(item.sellerId, tx);
            await creditSellerPendingBalance(item.sellerId, item.subtotal, commissionAmount, tx);
            await createSellerLedgerEntry({
                sellerId: item.sellerId,
                balanceId: balance.id,
                type: "SALE_CREDIT",
                amount: netAmount,
                referenceType: "MARKETPLACE_TRANSACTION",
                referenceId: currentTransaction.id,
                description: `Sale earning for ${item.title}`
            }, tx);
            await createSellerLedgerEntry({
                sellerId: item.sellerId,
                balanceId: balance.id,
                type: "COMMISSION",
                amount: commissionAmount,
                referenceType: "MARKETPLACE_TRANSACTION",
                referenceId: currentTransaction.id,
                description: `Marketplace commission (${commissionRate}%) for ${item.title}`
            }, tx);
        }
        return updatedTransaction;
    });
    return {
        success: true,
        transactionId: completed.id,
        orderId: completed.orderId,
        status: "SUCCESSFUL",
        reference: verification.reference
    };
}
// =====================================
// GET TRANSACTION
// =====================================
export async function fetchMarketplaceTransaction(transactionId, userId) {
    const transaction = await getMarketplaceTransactionById(transactionId);
    if (!transaction) {
        throw new Error("Marketplace transaction not found");
    }
    if (transaction.order.buyer.id !==
        userId) {
        throw new Error("You are not authorized to view this transaction");
    }
    return transaction;
}
// =====================================
// GET TRANSACTION BY ORDER
// =====================================
export async function fetchMarketplaceTransactionByOrder(orderId, userId) {
    const transaction = await getMarketplaceTransactionByOrderId(orderId);
    if (!transaction) {
        throw new Error("Marketplace transaction not found");
    }
    if (transaction.order.buyer.id !==
        userId) {
        throw new Error("You are not authorized to view this transaction");
    }
    return transaction;
}
// =====================================
// SELLER EARNINGS
// =====================================
export async function fetchSellerEarnings(sellerId) {
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
// SELLER BALANCE
// =====================================
export async function fetchSellerBalance(sellerId) {
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
