import dotenv from "dotenv";

dotenv.config({
    path: "./server/.env",
    override: true
});

console.log(
    "Flutterwave secret configured:",
    Boolean(process.env.FLUTTERWAVE_SECRET_KEY)
);

console.log(
    "Flutterwave secret length:",
    process.env.FLUTTERWAVE_SECRET_KEY?.length ?? 0
);

if (!process.env.FLUTTERWAVE_SECRET_KEY) {
    throw new Error(
        "FLUTTERWAVE_SECRET_KEY is still missing after loading server/.env"
    );
}

const { prisma } =
    await import("./src/lib/prisma.js");

const {
    flutterwaveMarketplaceProvider
} = await import(
    "./src/modules/marketplace-payments/providers/flutterwave-marketplace.provider.js"
);

const orderId =
    "9c70138c-035f-419a-812f-676b3066c186";

const order =
    await prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            payment: true
        }
    });

if (!order) {
    throw new Error("Test order not found");
}

if (!order.payment) {
    throw new Error("Order payment not found");
}

const transactionId =
    `OBA-FW-${Date.now()}`;

console.log("");
console.log("=====================================");
console.log("INITIALIZING FLUTTERWAVE PAYMENT");
console.log("=====================================");
console.log("Order:", order.orderNumber);
console.log("Amount:", order.total);
console.log("Currency:", order.currency);
console.log("Transaction:", transactionId);
console.log("");

const result =
    await flutterwaveMarketplaceProvider.initialize({
        transactionId,
        orderId: order.id,
        userId: order.buyerId,
        email: "test@example.com",
        amount: order.total,
        currency: order.currency,
        paymentMethod: "FLUTTERWAVE",
        callbackUrl:
            "http://localhost:5173/payment/flutterwave/callback"
    });

console.log("");
console.log("=====================================");
console.log("FLUTTERWAVE INITIALIZATION RESULT");
console.log("=====================================");
console.log("Success:", result.success);
console.log("Provider:", result.provider);
console.log("Reference:", result.reference);
console.log("Checkout URL:", result.checkoutUrl);
console.log("Authorization URL:", result.authorizationUrl);
console.log("Metadata:", result.metadata);
console.log("=====================================");
console.log("");

await prisma.$disconnect();
