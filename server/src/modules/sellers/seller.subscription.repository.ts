import { prisma } from "../../lib/prisma.js";



// =====================================
// CREATE / RENEW SUBSCRIPTION
// =====================================

export async function createSellerSubscription(

  userId: string,

  planId: string

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


  const now =
    new Date();


  const existing =
    await prisma.sellerSubscription.findUnique({

      where: {
        userId
      }

    });


  /*
   * If the current subscription is still active,
   * continue from its existing expiry date.
   *
   * Example:
   *
   * Existing expiry: August 20
   * Renewal date:    August 14
   * Duration:        30 days
   *
   * New expiry:      September 19
   */

  if (
    existing &&
    existing.active &&
    existing.expiryDate > now
  ) {

    const expiryDate =
      new Date(
        existing.expiryDate
      );


    expiryDate.setDate(

      expiryDate.getDate() +
      plan.duration

    );


    return prisma.sellerSubscription.update({

      where: {
        userId
      },

      data: {

        planId,

        startDate:
          existing.expiryDate,

        expiryDate,

        active: true

      },

      include: {

        plan: true

      }

    });

  }


  /*
   * New subscription or expired subscription.
   */

  const expiryDate =
    new Date();


  expiryDate.setDate(

    expiryDate.getDate() +
    plan.duration

  );


  if (existing) {

    return prisma.sellerSubscription.update({

      where: {
        userId
      },

      data: {

        planId,

        startDate: now,

        expiryDate,

        active: true

      },

      include: {

        plan: true

      }

    });

  }


  return prisma.sellerSubscription.create({

    data: {

      userId,

      planId,

      startDate: now,

      expiryDate,

      active: true

    },

    include: {

      plan: true

    }

  });

}



// =====================================
// GET MY SUBSCRIPTION
// =====================================

export async function getMySubscription(

  userId: string

) {

  return prisma.sellerSubscription.findFirst({

    where: {

      userId,

      active: true,

      expiryDate: {

        gt: new Date()

      }

    },

    include: {

      plan: true

    },

    orderBy: {

      createdAt: "desc"

    }

  });

}