import dotenv from "dotenv";

dotenv.config({
    path: "./server/.env",
    override: true
});

const { prisma } =
    await import("./src/lib/prisma.js");

const orderId =
    "9c70138c-035f-419a-812f-676b3066c186";

const order =
    await prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            payment: true,
            items: true
        }
    });

if (!order) {
    throw new Error("Test order not found");
}

console.log("");
console.log("=====================================");
console.log("CURRENT TEST ORDER STATE");
console.log("=====================================");

console.log("Order ID:", order.id);
console.log("Order Number:", order.orderNumber);
console.log("Order Status:", order.status);
console.log("Payment Method:", order.paymentMethod);
console.log("Payment Status:", order.paymentStatus);
console.log("Total:", order.total);
console.log("Currency:", order.currency);
console.log("Payment Expires:", order.paymentExpiresAt);

console.log("");
console.log("Order Payment:");

if (order.payment) {
    console.log("  ID:", order.payment.id);
    console.log("  Status:", order.payment.status);
    console.log("  Method:", order.payment.paymentMethod);
    console.log("  Provider:", order.payment.provider);
    console.log("  Reference:", order.payment.reference);
    console.log("  Paid At:", order.payment.paidAt);
} else {
    console.log("  NONE");
}

console.log("");
console.log("Order Items:");

for (const item of order.items) {
    console.log("  -----------------------------");
    console.log("  Item ID:", item.id);
    console.log("  Listing ID:", item.listingId);
    console.log("  Seller ID:", item.sellerId);
    console.log("  Title:", item.title);
    console.log("  Quantity:", item.quantity);
    console.log("  Unit Price:", item.unitPrice);
    console.log("  Subtotal:", item.subtotal);
    console.log("  Status:", item.status);
}

console.log("");
console.log("=====================================");
console.log("");

await prisma.$disconnect();
