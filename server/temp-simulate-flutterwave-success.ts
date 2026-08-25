import dotenv from "dotenv";

dotenv.config({
    path: "./server/.env",
    override: true
});

const { prisma } =
    await import("./src/lib/prisma.js");

const orderId =
    "9c70138c-035f-419a-812f-676b3066c186";

const localReference =
    `OBA-LOCAL-FW-${Date.now()}`;

console.log("");
console.log("=====================================");
console.log("LOCAL FLUTTERWAVE SUCCESS SIMULATION");
console.log("=====================================");
console.log("Order ID:", orderId);
console.log("Reference:", localReference);
console.log("");

const result = await prisma.$transaction(async (tx) => {

    const order =
        await tx.order.findUnique({
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

    if (!order.payment) {
        throw new Error("Order payment not found");
    }

    if (
        order.payment.status === "PAID" ||
        order.paymentStatus === "PAID"
    ) {
        throw new Error(
            "This order has already been marked as paid"
        );
    }

    const paidAt = new Date();

    const payment =
        await tx.orderPayment.update({
            where: {
                orderId: order.id
            },
            data: {
                status: "PAID",
                reference: localReference,
                provider: "FLUTTERWAVE",
                paidAt
            }
        });

    const updatedOrder =
        await tx.order.update({
            where: {
                id: order.id
            },
            data: {
                paymentStatus: "PAID",
                status: "CONFIRMED"
            }
        });

    const updatedItems =
        await Promise.all(
            order.items.map((item) =>
                tx.orderItem.update({
                    where: {
                        id: item.id
                    },
                    data: {
                        status: "CONFIRMED"
                    }
                })
            )
        );

    return {
        payment,
        order: updatedOrder,
        items: updatedItems
    };
});

console.log("PAYMENT UPDATED");
console.log("-----------------------------");
console.log("Payment Status:", result.payment.status);
console.log("Reference:", result.payment.reference);
console.log("Provider:", result.payment.provider);
console.log("Paid At:", result.payment.paidAt);

console.log("");
console.log("ORDER UPDATED");
console.log("-----------------------------");
console.log("Order Status:", result.order.status);
console.log("Payment Status:", result.order.paymentStatus);

console.log("");
console.log("ORDER ITEMS UPDATED");
console.log("-----------------------------");

for (const item of result.items) {
    console.log(
        item.id,
        "=>",
        item.status
    );
}

console.log("");
console.log("=====================================");
console.log("LOCAL PAYMENT SIMULATION SUCCESSFUL");
console.log("=====================================");
console.log("");

await prisma.$disconnect();
