import { prisma } from "./src/lib/prisma.js";

const orders = await prisma.order.findMany({
    where: {
        paymentStatus: "PENDING"
    },
    orderBy: {
        createdAt: "desc"
    },
    take: 5,
    select: {
        id: true,
        orderNumber: true,
        buyerId: true,
        total: true,
        currency: true,
        paymentMethod: true,
        paymentStatus: true,
        paymentExpiresAt: true,
        items: {
            select: {
                id: true,
                title: true,
                sellerId: true,
                subtotal: true,
                listingId: true
            }
        }
    }
});

console.dir(orders, { depth: null });

await prisma.$disconnect();
