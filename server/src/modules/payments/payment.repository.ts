import { prisma } from "../../lib/prisma.js";


// =====================================
// CREATE PAYMENT
// =====================================

export async function createPayment(
    userId: string,
    planId: string,
    amount: number,
    reference?: string,
    proofUrl?: string
){

    return prisma.sellerPayment.create({

        data: {

            userId,

            planId,

            amount,

            paymentMethod:
                "BANK_TRANSFER",

            reference,

            proofUrl

        },

        include: {

            plan: true

        }

    });

}



// =====================================
// GET USER PAYMENTS
// =====================================

export async function getUserPayments(
    userId: string
){

    return prisma.sellerPayment.findMany({

        where: {

            userId

        },

        include: {

            plan: true

        },

        orderBy: {

            createdAt: "desc"

        }

    });

}



// =====================================
// GET PAYMENT BY ID
// =====================================

export async function getPaymentById(
    paymentId: string
){

    return prisma.sellerPayment.findUnique({

        where: {

            id: paymentId

        },

        include: {

            plan: true,

            user: {

                select: {

                    id: true,

                    name: true,

                    email: true,

                    phone: true

                }

            }

        }

    });

}



// =====================================
// GET ALL PAYMENTS
// ADMIN
// =====================================

export async function getAllPayments(){

    return prisma.sellerPayment.findMany({

        include: {

            plan: true,

            user: {

                select: {

                    id: true,

                    name: true,

                    email: true,

                    phone: true

                }

            }

        },

        orderBy: {

            createdAt: "desc"

        }

    });

}



// =====================================
// APPROVE PAYMENT
// =====================================

export async function approvePayment(
    paymentId: string,
    adminNote?: string
){

    return prisma.sellerPayment.update({

        where: {

            id: paymentId

        },

        data: {

            status: "APPROVED",

            adminNote,

            reviewedAt: new Date()

        },

        include: {

            plan: true

        }

    });

}



// =====================================
// REJECT PAYMENT
// =====================================

export async function rejectPayment(
    paymentId: string,
    adminNote?: string
){

    return prisma.sellerPayment.update({

        where: {

            id: paymentId

        },

        data: {

            status: "REJECTED",

            adminNote,

            reviewedAt: new Date()

        },

        include: {

            plan: true

        }

    });

}