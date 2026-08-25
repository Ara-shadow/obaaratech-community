import { prisma } from "../../lib/prisma.js";

import type {
  PaymentMethod
} from "./payment.schema.js";



// =====================================
// CREATE PAYMENT
// =====================================

export async function createPayment(

  userId: string,

  planId: string,

  amount: number,

  paymentMethod: PaymentMethod,

  reference?: string,

  proofUrl?: string

) {

  return prisma.sellerPayment.create({

    data: {

      userId,

      planId,

      amount,

      paymentMethod,

      reference,

      proofUrl

    },

    include: {

      plan: true

    }

  });

}



// =====================================
// UPDATE PAYMENT REFERENCE
// =====================================

export async function updatePaymentReference(

  paymentId: string,

  reference: string

) {

  return prisma.sellerPayment.update({

    where: {

      id: paymentId

    },

    data: {

      reference

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

) {

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

) {

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

export async function getAllPayments() {

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

) {

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

) {

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



// =====================================
// APPROVE PAYMENT + ACTIVATE PLAN
// ATOMIC TRANSACTION
// =====================================

export async function approvePaymentAndActivateSubscription(

  paymentId: string,

  adminNote?: string

) {

  return prisma.$transaction(

    async (tx) => {

      // =================================
      // GET PAYMENT
      // =================================

      const payment =
        await tx.sellerPayment.findUnique({

          where: {

            id: paymentId

          },

          include: {

            plan: true

          }

        });


      if (!payment) {

        throw new Error(
          "Payment not found"
        );

      }


      // =================================
      // PAYMENT STATUS CHECK
      // =================================

      if (
        payment.status ===
        "APPROVED"
      ) {

        throw new Error(
          "Payment has already been approved"
        );

      }


      if (
        payment.status ===
        "REJECTED"
      ) {

        throw new Error(
          "Rejected payment cannot be approved"
        );

      }


      // =================================
      // PLAN CHECK
      // =================================

      if (!payment.plan) {

        throw new Error(
          "Seller plan not found"
        );

      }


      // =================================
      // AMOUNT VALIDATION
      // =================================

      if (
        payment.amount !==
        payment.plan.price
      ) {

        throw new Error(
          "Payment amount does not match the selected plan"
        );

      }


      // =================================
      // GET EXISTING SUBSCRIPTION
      // =================================

      const existing =
        await tx.sellerSubscription.findUnique({

          where: {

            userId:
              payment.userId

          }

        });


      const now =
        new Date();


      let startDate =
        now;


      let expiryDate =
        new Date();


      /*
       * ACTIVE SUBSCRIPTION
       *
       * Continue from the current expiry.
       */

      if (
        existing &&
        existing.active &&
        existing.expiryDate > now
      ) {

        startDate =
          existing.expiryDate;


        expiryDate =
          new Date(
            existing.expiryDate
          );


        expiryDate.setDate(

          expiryDate.getDate() +
          payment.plan.duration

        );

      }

      /*
       * NEW OR EXPIRED SUBSCRIPTION
       */

      else {

        expiryDate =
          new Date();


        expiryDate.setDate(

          expiryDate.getDate() +
          payment.plan.duration

        );

      }


      // =================================
      // CREATE / UPDATE SUBSCRIPTION
      // =================================

      let subscription;


      if (existing) {

        subscription =
          await tx.sellerSubscription.update({

            where: {

              userId:
                payment.userId

            },

            data: {

              planId:
                payment.planId,

              startDate,

              expiryDate,

              active: true

            },

            include: {

              plan: true

            }

          });

      }

      else {

        subscription =
          await tx.sellerSubscription.create({

            data: {

              userId:
                payment.userId,

              planId:
                payment.planId,

              startDate,

              expiryDate,

              active: true

            },

            include: {

              plan: true

            }

          });

      }


      // =================================
      // APPLY SELLER BENEFITS
      // =================================

      if (
        payment.plan.verifiedBadge
      ) {

        await tx.user.update({

          where: {

            id:
              payment.userId

          },

          data: {

            verifiedSeller: true

          }

        });

      }


      // =================================
      // APPROVE PAYMENT
      // =================================

      const approvedPayment =
        await tx.sellerPayment.update({

          where: {

            id:
              paymentId

          },

          data: {

            status:
              "APPROVED",

            adminNote,

            reviewedAt:
              new Date()

          },

          include: {

            plan: true

          }

        });


      // =================================
      // RETURN COMPLETE RESULT
      // =================================

      return {

        payment:
          approvedPayment,

        subscription

      };

    }

  );

}