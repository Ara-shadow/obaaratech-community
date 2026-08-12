import {
  createPayment,
  getUserPayments,
  getPaymentById,
  getAllPayments,
  approvePayment,
  rejectPayment
} from "./payment.repository.js";

import {
  createSellerSubscription
} from "../sellers/seller.subscription.repository.js";

import {
  applySellerBenefits
} from "../sellers/seller.benefit.service.js";

import { prisma } from "../../lib/prisma.js";


// =====================================
// CREATE PAYMENT
// =====================================

export async function submitPayment(
  userId: string,
  planId: string,
  amount: number,
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


  // FREE PLAN DOES NOT NEED PAYMENT

  if (plan.price <= 0) {

    throw new Error(
      "This plan does not require payment"
    );

  }


  // Make sure submitted amount matches plan

  if (amount !== plan.price) {

    throw new Error(
      `Payment amount must be ₦${plan.price}`
    );

  }


  return createPayment(
    userId,
    planId,
    amount,
    reference,
    proofUrl
  );

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

  const payment =
    await getPaymentById(
      paymentId
    );


  if (!payment) {

    throw new Error(
      "Payment not found"
    );

  }


  // Prevent approving an already
  // approved payment

  if (payment.status === "APPROVED") {

    throw new Error(
      "Payment has already been approved"
    );

  }


  // Prevent approving rejected payment

  if (payment.status === "REJECTED") {

    throw new Error(
      "Rejected payment cannot be approved"
    );

  }


  const plan =
    await prisma.sellerPlan.findUnique({

      where: {
        id: payment.planId
      }

    });


  if (!plan) {

    throw new Error(
      "Seller plan not found"
    );

  }


  // ===================================
  // ACTIVATE SUBSCRIPTION
  // ===================================

  const subscription =
    await createSellerSubscription(
      payment.userId,
      payment.planId
    );


  // ===================================
  // APPLY PLAN BENEFITS
  // ===================================

  await applySellerBenefits(
    payment.userId,
    subscription.plan
  );


  // ===================================
  // MARK PAYMENT APPROVED
  // ===================================

  const approvedPayment =
    await approvePayment(
      paymentId,
      adminNote
    );


  return {

    payment: approvedPayment,

    subscription

  };

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


  if (payment.status === "APPROVED") {

    throw new Error(
      "Approved payment cannot be rejected"
    );

  }


  if (payment.status === "REJECTED") {

    throw new Error(
      "Payment has already been rejected"
    );

  }


  return rejectPayment(
    paymentId,
    adminNote
  );

}