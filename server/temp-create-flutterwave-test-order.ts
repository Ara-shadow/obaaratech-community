import { prisma } from "./src/lib/prisma.js";

const buyer = await prisma.user.findFirst({
    orderBy: {
        createdAt: "asc"
    }
});

if (!buyer) {
    throw new Error("No user found");
}

const listing = await prisma.listing.findFirst({
    where: {
        status: "ACTIVE",
        available: true,
        ownerId: {
            not: buyer.id
        }
    },
    orderBy: {
        createdAt: "asc"
    }
});

if (!listing) {
    throw new Error("No available listing found for test");
}

const reservedAt = new Date();

const paymentExpiresAt = new Date(
    reservedAt.getTime() + 30 * 60 * 1000
);

const orderNumber =
    `TEST-FW-${Date.now()}`;

const order = await prisma.$transaction(async (tx) => {

    const reservation =
        await tx.listing.updateMany({

            where: {
                id: listing.id,
                status: "ACTIVE",
                available: true
            },

            data: {
                status: "RESERVED",
                available: false,
                reservedAt
            }

        });

    if (reservation.count !== 1) {
        throw new Error(
            "Listing could not be reserved"
        );
    }

    return tx.order.create({

        data: {

            orderNumber,

            buyerId: buyer.id,

            subtotal: listing.price,

            deliveryFee: 0,

            total: listing.price,

            currency: "NGN",

            paymentMethod: "FLUTTERWAVE",

            paymentStatus: "PENDING",

            paymentExpiresAt,

            deliveryAddress:
                "Flutterwave Test Address",

            phone:
                buyer.phone || "08000000000",

            note:
                "Controlled Flutterwave marketplace test",

            payment: {

                create: {

                    amount: listing.price,

                    currency: "NGN",

                    paymentMethod:
                        "FLUTTERWAVE",

                    status:
                        "PENDING",

                    provider:
                        "FLUTTERWAVE"

                }

            },

            items: {

                create: {

                    listingId:
                        listing.id,

                    sellerId:
                        listing.ownerId,

                    title:
                        listing.title,

                    unitPrice:
                        listing.price,

                    quantity:
                        1,

                    subtotal:
                        listing.price,

                    status:
                        "PENDING"

                }

            }

        },

        include: {

            payment: true,

            items: true

        }

    });

});

console.log("");
console.log("=====================================");
console.log("FLUTTERWAVE TEST ORDER CREATED");
console.log("=====================================");
console.log("Order ID:", order.id);
console.log("Order Number:", order.orderNumber);
console.log("Buyer ID:", buyer.id);
console.log("Listing ID:", listing.id);
console.log("Seller ID:", listing.ownerId);
console.log("Amount:", order.total);
console.log("Currency:", order.currency);
console.log("Payment Method:", order.paymentMethod);
console.log("Payment Status:", order.paymentStatus);
console.log("Payment Expires:", order.paymentExpiresAt);
console.log("Transaction:", "Not created yet");
console.log("=====================================");

await prisma.$disconnect();
