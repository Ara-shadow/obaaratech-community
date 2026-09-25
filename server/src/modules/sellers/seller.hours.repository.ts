import {
    prisma
} from "../../lib/prisma.js";


// =====================================================
// GET BUSINESS HOURS
// =====================================================

export async function getSellerBusinessHours(
    userId: string
) {

    return prisma.sellerBusinessHour.findMany({

        where: {

            userId

        },

        orderBy: {

            dayOfWeek: "asc"

        }

    });

}


// =====================================================
// SAVE BUSINESS HOURS
// =====================================================

export async function saveSellerBusinessHours(

    userId: string,

    hours: {

        dayOfWeek: number;

        isOpen: boolean;

        openingTime?: string | null;

        closingTime?: string | null;

    }[]

) {

    return prisma.$transaction(

        async (tx) => {

            await tx.sellerBusinessHour.deleteMany({

                where: {

                    userId

                }

            });


            await tx.sellerBusinessHour.createMany({

                data:

                    hours.map(
                        hour => ({

                            userId,

                            dayOfWeek:
                                hour.dayOfWeek,

                            isOpen:
                                hour.isOpen,

                            openingTime:
                                hour.isOpen
                                    ? hour.openingTime
                                    : null,

                            closingTime:
                                hour.isOpen
                                    ? hour.closingTime
                                    : null

                        })
                    )

            });


            return tx.sellerBusinessHour.findMany({

                where: {

                    userId

                },

                orderBy: {

                    dayOfWeek: "asc"

                }

            });

        }

    );

}