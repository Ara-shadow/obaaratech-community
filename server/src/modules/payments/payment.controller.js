import { initializePaymentSchema, verifyPaymentSchema, submitPaymentSchema } from "./payment.schema.js";
import { initializePayment, verifyPayment, submitPayment, fetchMyPayments, fetchPayment, fetchAllPayments, approveSellerPayment, rejectSellerPayment } from "./payment.service.js";
// =====================================
// INITIALIZE PAYMENT
// =====================================
export async function initializePaymentController(request, reply) {
    try {
        const user = request.user;
        if (!user?.id) {
            return reply
                .code(401)
                .send({
                success: false,
                message: "Unauthorized"
            });
        }
        const data = initializePaymentSchema.parse(request.body);
        const result = await initializePayment(user.id, data.planId, data.paymentMethod, data.callbackUrl);
        return reply
            .code(201)
            .send({
            ...result
        });
    }
    catch (error) {
        return reply
            .code(400)
            .send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// VERIFY PAYMENT
// =====================================
export async function verifyPaymentController(request, reply) {
    try {
        const user = request.user;
        if (!user?.id) {
            return reply
                .code(401)
                .send({
                success: false,
                message: "Unauthorized"
            });
        }
        const data = verifyPaymentSchema.parse(request.body);
        const result = await verifyPayment(user.id, data.paymentId, data.reference);
        return reply.send({
            ...result
        });
    }
    catch (error) {
        return reply
            .code(400)
            .send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// SUBMIT MANUAL PAYMENT
// =====================================
export async function createPaymentController(request, reply) {
    try {
        const user = request.user;
        if (!user?.id) {
            return reply
                .code(401)
                .send({
                success: false,
                message: "Unauthorized"
            });
        }
        const body = submitPaymentSchema.parse(request.body);
        const payment = await submitPayment(user.id, body.planId, body.amount, "BANK_TRANSFER", body.reference, body.proofUrl);
        return reply
            .code(201)
            .send({
            success: true,
            message: "Payment submitted successfully",
            payment
        });
    }
    catch (error) {
        return reply
            .code(400)
            .send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// MY PAYMENTS
// =====================================
export async function myPaymentsController(request, reply) {
    try {
        const user = request.user;
        const payments = await fetchMyPayments(user.id);
        return reply.send({
            success: true,
            payments
        });
    }
    catch (error) {
        return reply
            .code(400)
            .send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// GET PAYMENT
// =====================================
export async function paymentByIdController(request, reply) {
    try {
        const params = request.params;
        const payment = await fetchPayment(params.id);
        if (!payment) {
            return reply
                .code(404)
                .send({
                success: false,
                message: "Payment not found"
            });
        }
        // Do not expose another user's
        // payment record.
        const user = request.user;
        if (payment.userId !==
            user.id) {
            return reply
                .code(403)
                .send({
                success: false,
                message: "Forbidden"
            });
        }
        return reply.send({
            success: true,
            payment
        });
    }
    catch (error) {
        return reply
            .code(400)
            .send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// ADMIN - ALL PAYMENTS
// =====================================
export async function allPaymentsController(request, reply) {
    try {
        const payments = await fetchAllPayments();
        return reply.send({
            success: true,
            payments
        });
    }
    catch (error) {
        return reply
            .code(400)
            .send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// ADMIN - APPROVE
// =====================================
export async function approvePaymentController(request, reply) {
    try {
        const params = request.params;
        const body = request.body;
        const result = await approveSellerPayment(params.id, body?.adminNote);
        return reply.send({
            success: true,
            message: "Payment approved and subscription activated",
            ...result
        });
    }
    catch (error) {
        return reply
            .code(400)
            .send({
            success: false,
            message: error.message
        });
    }
}
// =====================================
// ADMIN - REJECT
// =====================================
export async function rejectPaymentController(request, reply) {
    try {
        const params = request.params;
        const body = request.body;
        const payment = await rejectSellerPayment(params.id, body?.adminNote);
        return reply.send({
            success: true,
            message: "Payment rejected",
            payment
        });
    }
    catch (error) {
        return reply
            .code(400)
            .send({
            success: false,
            message: error.message
        });
    }
}
