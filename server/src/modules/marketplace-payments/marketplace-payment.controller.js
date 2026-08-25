import { initializeMarketplacePayment, verifyMarketplacePayment, fetchMarketplaceTransaction, fetchMarketplaceTransactionByOrder, fetchSellerEarnings, fetchSellerBalance } from "./marketplace-payment.service.js";
import { prisma } from "../../lib/prisma.js";
// =====================================
// AUTH USER
// =====================================
function getAuthenticatedUserId(request) {
    const user = request.user;
    const userId = user.id ||
        user.userId;
    if (!userId) {
        throw new Error("Authenticated user ID is missing");
    }
    return userId;
}
// =====================================
// INITIALIZE MARKETPLACE PAYMENT
// =====================================
export async function initializeMarketplacePaymentController(request, reply) {
    const userId = getAuthenticatedUserId(request);
    const body = request.body;
    if (!body.orderId) {
        return reply
            .code(400)
            .send({
            success: false,
            message: "orderId is required"
        });
    }
    if (body.paymentMethod &&
        body.paymentMethod !==
            "FLUTTERWAVE") {
        return reply
            .code(400)
            .send({
            success: false,
            message: "Only FLUTTERWAVE is currently supported"
        });
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true
        }
    });
    if (!user) {
        return reply
            .code(404)
            .send({
            success: false,
            message: "User not found"
        });
    }
    if (!user.email) {
        return reply
            .code(400)
            .send({
            success: false,
            message: "User email is required for payment"
        });
    }
    const order = await prisma.order.findUnique({
        where: {
            id: body.orderId
        },
        select: {
            id: true,
            total: true,
            currency: true,
            buyerId: true
        }
    });
    if (!order) {
        return reply
            .code(404)
            .send({
            success: false,
            message: "Order not found"
        });
    }
    if (order.buyerId !== userId) {
        return reply
            .code(403)
            .send({
            success: false,
            message: "You are not authorized to pay for this order"
        });
    }
    const result = await initializeMarketplacePayment({
        orderId: order.id,
        userId,
        email: user.email,
        amount: Number(order.total),
        currency: order.currency,
        transactionId: `OBA-${Date.now()}`,
        paymentMethod: "FLUTTERWAVE",
        callbackUrl: body.callbackUrl
    });
    return reply.send({
        success: true,
        message: "Marketplace payment initialized successfully",
        data: result
    });
}
// =====================================
// VERIFY MARKETPLACE PAYMENT
// =====================================
export async function verifyMarketplacePaymentController(request, reply) {
    const userId = getAuthenticatedUserId(request);
    const body = request.body;
    if (!body.transactionId) {
        return reply
            .code(400)
            .send({
            success: false,
            message: "transactionId is required"
        });
    }
    const transaction = await fetchMarketplaceTransaction(body.transactionId, userId);
    if (!transaction) {
        return reply
            .code(404)
            .send({
            success: false,
            message: "Marketplace transaction not found"
        });
    }
    const result = await verifyMarketplacePayment({
        transactionId: body.transactionId,
        reference: body.reference
    });
    return reply.send({
        success: result.success,
        message: result.success
            ? "Marketplace payment verified successfully"
            : "Marketplace payment is not yet successful",
        data: result
    });
}
// =====================================
// GET TRANSACTION
// =====================================
export async function marketplaceTransactionController(request, reply) {
    const userId = getAuthenticatedUserId(request);
    const params = request.params;
    if (!params.id) {
        return reply
            .code(400)
            .send({
            success: false,
            message: "Transaction ID is required"
        });
    }
    const transaction = await fetchMarketplaceTransaction(params.id, userId);
    return reply.send({
        success: true,
        data: transaction
    });
}
// =====================================
// GET TRANSACTION BY ORDER
// =====================================
export async function marketplaceTransactionByOrderController(request, reply) {
    const userId = getAuthenticatedUserId(request);
    const params = request.params;
    if (!params.orderId) {
        return reply
            .code(400)
            .send({
            success: false,
            message: "Order ID is required"
        });
    }
    const transaction = await fetchMarketplaceTransactionByOrder(params.orderId, userId);
    return reply.send({
        success: true,
        data: transaction
    });
}
// =====================================
// SELLER EARNINGS
// =====================================
export async function sellerEarningsController(request, reply) {
    const sellerId = getAuthenticatedUserId(request);
    const earnings = await fetchSellerEarnings(sellerId);
    return reply.send({
        success: true,
        data: earnings
    });
}
// =====================================
// SELLER BALANCE
// =====================================
export async function sellerBalanceController(request, reply) {
    const sellerId = getAuthenticatedUserId(request);
    const balance = await fetchSellerBalance(sellerId);
    return reply.send({
        success: true,
        data: balance
    });
}
