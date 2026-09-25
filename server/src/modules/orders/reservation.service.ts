import { prisma } from "../../lib/prisma.js";


// =====================================================
// RELEASE EXPIRED MARKETPLACE RESERVATIONS
// =====================================================
//
// Finds unpaid orders whose payment window has expired
// and releases their reserved listings.
//
// RESERVED → ACTIVE
//
// =====================================================


export async function releaseExpiredReservations() {

    const now =
        new Date();


    return prisma.$transaction(

        async (tx) => {


            // =========================================
            // FIND EXPIRED ORDERS
            // =========================================

            const expiredOrders =
                await tx.order.findMany({

                    where: {

                        paymentStatus:
                            "PENDING",

                        paymentExpiresAt: {

                            lt:
                                now

                        }

                    },

                    include: {

                        items:
                            true

                    }

                });



            let releasedCount = 0;



            // =========================================
            // RELEASE LISTINGS
            // =========================================

            for (
                const order of expiredOrders
            ) {


                for (
                    const item of order.items
                ) {


                    const released =
                        await tx.listing.updateMany({

                            where: {

                                id:
                                    item.listingId,

                                status:
                                    "RESERVED"

                            },

                            data: {

                                status:
                                    "ACTIVE",

                                available:
                                    true,

                                reservedAt:
                                    null

                            }

                        });



                    releasedCount +=
                        released.count;


                }



                // =====================================
                // CANCEL EXPIRED ORDER
                // =====================================

                await tx.orderItem.updateMany({
                    where: {
                        orderId: order.id
                    },
                    data: {
                        status: "CANCELLED"
                    }
                });

                await tx.order.update({

                    where: {

                        id:
                            order.id

                    },

                    data: {

                        status:
                            "CANCELLED",

                        paymentStatus:
                            "FAILED"

                    }

                });


            }



            return {

                expiredOrders:
                    expiredOrders.length,

                releasedListings:
                    releasedCount

            };


        }

    );

}