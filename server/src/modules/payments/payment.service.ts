import {
    createPayment,
    updatePaymentReference,
    getUserPayments,
    getPaymentById,
    getAllPayments,
    rejectPayment,
    approvePaymentAndActivateSubscription
} from "./payment.repository.js";

import {
    getPaymentProvider
} from "./payment.providers.js";

import type {
    PaymentMethod
} from "./payment.schema.js";

import { prisma } from "../../lib/prisma.js";


// =====================================
// CREATE MANUAL PAYMENT
// =====================================

export async function submitPayment(
    userId: string,
    planId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    reference?: string,
    proofUrl?: string
) {

    const plan =
        await prisma.sellerPlan.findUnique({

            where: {
                id: planId
            }

        });


    if (!plan) {

        throw new Error(
            "Seller plan not found"
        );

    }


    if (plan.price <= 0) {

        throw new Error(
            "This plan does not require payment"
        );

    }


    if (amount !== plan.price) {

        throw new Error(
            `Payment amount must be ₦${plan.price}`
        );

    }


    return createPayment(

        userId,

        planId,

        amount,

        paymentMethod,

        reference,

        proofUrl

    );

}


// =====================================
// INITIALIZE PAYMENT
// =====================================

export async function initializePayment(

    userId: string,

    planId: string,

    paymentMethod: PaymentMethod,

    callbackUrl?: string

) {

    const plan =
        await prisma.sellerPlan.findUnique({

            where: {
                id: planId
            }

        });


    if (!plan) {

        throw new Error(
            "Seller plan not found"
        );

    }


    if (plan.price <= 0) {

        throw new Error(
            "This plan does not require payment"
        );

    }


    const user =
        await prisma.user.findUnique({

            where: {
                id: userId
            },

            select: {

                id: true,

                email: true,

                name: true

            }

        });


    if (!user) {

        throw new Error(
            "User not found"
        );

    }


    if (!user.email) {

        throw new Error(
            "User email is required for payment"
        );

    }


    // ===================================
    // CREATE PAYMENT RECORD FIRST
    // ===================================

    const payment =
        await createPayment(

            userId,

            planId,

            plan.price,

            paymentMethod

        );


    // ===================================
    // BANK TRANSFER
    // ===================================

    if (
        paymentMethod ===
        "BANK_TRANSFER"
    ) {

        return {

            payment,

            success: true,

            provider:
                "BANK_TRANSFER",

            reference:
                payment.id,

            message:
                "Bank transfer payment created. Awaiting manual confirmation.",

            bankTransfer: {

                paymentId:
                    payment.id,

                amount:
                    plan.price,

                currency:
                    "NGN"

            }

        };

    }


    // ===================================
    // ONLINE PROVIDER
    // ===================================

    const provider =
        getPaymentProvider(
            paymentMethod
        );


    const result =
        await provider.initialize({

            paymentId:
                payment.id,

            userId,

            email:
                user.email,

            amount:
                plan.price,

            currency:
                "NGN",

            planId,

            planName:
                plan.name,

            callbackUrl

        });


    // ===================================
    // SAVE PROVIDER REFERENCE
    // ===================================

    if (
        result.reference &&
        result.reference !== payment.id
    ) {

        await updatePaymentReference(

            payment.id,

            result.reference

        );

    }


    return {

        payment: {

            ...payment,

            reference:
                result.reference

        },

        success:
            result.success,

        provider:
            result.provider,

        reference:
            result.reference,

        checkoutUrl:
            result.checkoutUrl,

        authorizationUrl:
            result.authorizationUrl,

        message:
            result.message,

        metadata:
            result.metadata

    };

}


// =====================================
// VERIFY PAYMENT
// =====================================

export async function verifyPayment(

    userId: string,

    paymentId: string,

    reference?: string

) {

    const payment =
        await getPaymentById(
            paymentId
        );


    if (!payment) {

        throw new Error(
            "Payment not found"
        );

    }


    // ===================================
    // SECURITY CHECK
    // ===================================

    if (
        payment.userId !==
        userId
    ) {

        throw new Error(
            "You are not authorized to verify this payment"
        );

    }


    // ===================================
    // ALREADY APPROVED
    // ===================================

    if (
        payment.status ===
        "APPROVED"
    ) {

        return {

            success: true,

            alreadyProcessed: true,

            payment,

            message:
                "Payment has already been approved"

        };

    }


    // ===================================
    // BANK TRANSFER
    // ===================================

    if (
        payment.paymentMethod ===
        "BANK_TRANSFER"
    ) {

        return {

            success: false,

            payment,

            message:
                "Bank transfer payments require manual admin approval."

        };

    }


    // ===================================
    // PAYMENT PROVIDER
    // ===================================

    const provider =
        getPaymentProvider(

            payment.paymentMethod

        );


    const providerReference =
        reference ||
        payment.reference ||
        payment.id;


    const result =
        await provider.verify(

            providerReference

        );


    // ===================================
    // PAYMENT FAILED
    // ===================================

    if (
        result.status ===
        "REJECTED"
    ) {

        const rejectedPayment =
            await rejectPayment(

                payment.id,

                "Payment provider reported a failed transaction."

            );


        return {

            success: false,

            payment:
                rejectedPayment,

            providerResult:
                result

        };

    }


    // ===================================
    // PAYMENT STILL PENDING
    // ===================================

    if (
        result.status !==
        "APPROVED"
    ) {

        return {

            success: false,

            payment,

            providerResult:
                result,

            message:
                "Payment is still pending."

        };

    }


    // ===================================
    // AMOUNT VALIDATION
    // ===================================

    if (
        result.amount !== undefined &&
        result.amount !== payment.amount
    ) {

        throw new Error(
            "Payment amount does not match the selected plan"
        );

    }


    // ===================================
    // ACTIVATE SUBSCRIPTION
    // ATOMIC TRANSACTION
    // =====================================

    const activated =
        await approvePaymentAndActivateSubscription(

            payment.id,

            "Payment verified automatically by payment provider."

        );


    return {

        success: true,

        payment:
            activated.payment,

        subscription:
            activated.subscription,

        providerResult:
            result

    };

}


// =====================================
// GET MY PAYMENTS
// =====================================

export async function fetchMyPayments(
    userId: string
) {

    return getUserPayments(
        userId
    );

}


// =====================================
// GET PAYMENT
// =====================================

export async function fetchPayment(
    paymentId: string
) {

    return getPaymentById(
        paymentId
    );

}


// =====================================
// ADMIN - GET ALL PAYMENTS
// =====================================

export async function fetchAllPayments() {

    return getAllPayments();

}


// =====================================
// ADMIN - APPROVE PAYMENT
// =====================================

export async function approveSellerPayment(

    paymentId: string,

    adminNote?: string

) {

    const result =
        await approvePaymentAndActivateSubscription(

            paymentId,

            adminNote

        );


    return result;

}


// =====================================
// ADMIN - REJECT PAYMENT
// =====================================

export async function rejectSellerPayment(

    paymentId: string,

    adminNote?: string

) {

    const payment =
        await getPaymentById(

            paymentId

        );


    if (!payment) {

        throw new Error(
            "Payment not found"
        );

    }


    if (
        payment.status ===
        "APPROVED"
    ) {

        throw new Error(
            "Approved payment cannot be rejected"
        );

    }


    if (
        payment.status ===
        "REJECTED"
    ) {

        throw new Error(
            "Payment has already been rejected"
        );

    }


    return rejectPayment(

        paymentId,

        adminNote

    );

}