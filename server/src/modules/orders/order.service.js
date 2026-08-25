import { prisma } from "../../lib/prisma.js";
import { createOrder, getBuyerOrders, getBuyerOrderById, getSellerOrders, getSellerOrder, updateSellerOrderItemStatus } from "./order.repository.js";
import { sendNotification } from "../notifications/notifications.service.js";
// =====================================
// DELIVERY FEE
// =====================================
function calculateDeliveryFee(deliveryAddress) {
    // Keep this simple for now.
    // We can introduce location-based delivery
    // pricing later.
    if (!deliveryAddress.trim()) {
        return 0;
    }
    return 0;
}
// =====================================
// ORDER NUMBER
// =====================================
function generateOrderNumber() {
    const timestamp = Date.now()
        .toString()
        .slice(-8);
    const random = Math.floor(1000 +
        Math.random() * 9000);
    return `OBA-${timestamp}-${random}`;
}
// =====================================
// CREATE ORDER / CHECKOUT
// =====================================
export async function checkout(buyerId, input) {
    // =================================
    // VALIDATE INPUT
    // =================================
    const deliveryAddress = input.deliveryAddress?.trim();
    const phone = input.phone?.trim();
    if (!deliveryAddress) {
        throw new Error("Delivery address is required");
    }
    if (!phone) {
        throw new Error("Phone number is required");
    }
    if (input.paymentMethod !== "FLUTTERWAVE") {
        throw new Error("Marketplace payments must be processed through Flutterwave");
    }
    // =================================
    // GET BUYER CART
    // =================================
    const cart = await prisma.cart.findUnique({
        where: {
            userId: buyerId
        },
        include: {
            items: {
                include: {
                    listing: {
                        include: {
                            owner: {
                                select: {
                                    id: true,
                                    name: true,
                                    phone: true,
                                    whatsapp: true
                                }
                            },
                            images: true
                        }
                    }
                }
            }
        }
    });
    if (!cart || cart.items.length === 0) {
        throw new Error("Your cart is empty");
    }
    // =================================
    // VALIDATE CART ITEMS
    // =================================
    const orderItems = cart.items.map((cartItem) => {
        const listing = cartItem.listing;
        // -----------------------------
        // LISTING STATUS
        // -----------------------------
        if (listing.status !== "ACTIVE") {
            throw new Error(`"${listing.title}" is no longer available for purchase`);
        }
        // -----------------------------
        // LISTING AVAILABILITY
        // -----------------------------
        if (!listing.available) {
            throw new Error(`"${listing.title}" is currently unavailable`);
        }
        // -----------------------------
        // LISTING PRICE
        // -----------------------------
        if (listing.price === null ||
            listing.price === undefined) {
            throw new Error(`"${listing.title}" does not have a valid price`);
        }
        // -----------------------------
        // SELLER
        // -----------------------------
        if (!listing.ownerId) {
            throw new Error(`"${listing.title}" has no valid seller`);
        }
        if (listing.ownerId === buyerId) {
            throw new Error("You cannot order your own listing");
        }
        // -----------------------------
        // QUANTITY
        // -----------------------------
        if (cartItem.quantity < 1) {
            throw new Error(`Invalid quantity for "${listing.title}"`);
        }
        const unitPrice = listing.price;
        const subtotal = unitPrice *
            cartItem.quantity;
        return {
            listingId: listing.id,
            sellerId: listing.ownerId,
            title: listing.title,
            unitPrice,
            quantity: cartItem.quantity,
            subtotal
        };
    });
    // =================================
    // CALCULATE TOTALS
    // =================================
    const subtotal = orderItems.reduce((total, item) => total +
        item.subtotal, 0);
    const deliveryFee = calculateDeliveryFee(deliveryAddress);
    const total = subtotal +
        deliveryFee;
    // =================================
    // CREATE ORDER
    // =================================
    const order = await createOrder({
        orderNumber: generateOrderNumber(),
        buyerId,
        subtotal,
        deliveryFee,
        total,
        currency: "NGN",
        paymentMethod: input.paymentMethod,
        deliveryAddress,
        phone,
        note: input.note?.trim(),
        items: orderItems
    });
    // =================================
    // NOTIFY SELLERS
    // =================================
    //
    // One order can contain products
    // belonging to multiple sellers.
    //
    // Each seller receives only ONE
    // notification for this order,
    // containing the items belonging
    // to that seller.
    // =================================
    const sellerItems = new Map();
    for (const item of order.items) {
        const sellerId = item.sellerId;
        const sellerName = item.seller?.name ||
            "A customer";
        const existing = sellerItems.get(sellerId);
        if (existing) {
            existing.titles.push(item.title);
        }
        else {
            sellerItems.set(sellerId, {
                sellerName,
                titles: [
                    item.title
                ]
            });
        }
    }
    // =================================
    // SEND SELLER NOTIFICATIONS
    // =================================
    const notificationJobs = Array.from(sellerItems.entries()).map(async ([sellerId, sellerData]) => {
        const itemText = sellerData.titles.length === 1
            ? sellerData.titles[0]
            : `${sellerData.titles.length} items`;
        try {
            await sendNotification({
                userId: sellerId,
                actorId: buyerId,
                type: "NEW_ORDER",
                message: `New order ${order.orderNumber} received for ${itemText}`
            });
        }
        catch (error) {
            console.error("Failed to send seller order notification:", error);
        }
    });
    await Promise.all(notificationJobs);
    // =================================
    // RETURN ORDER
    // =================================
    return order;
}
// =====================================
// BUYER ORDERS
// =====================================
export async function fetchBuyerOrders(buyerId) {
    return getBuyerOrders(buyerId);
}
// =====================================
// SINGLE BUYER ORDER
// =====================================
export async function fetchBuyerOrder(buyerId, orderId) {
    const order = await getBuyerOrderById(buyerId, orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
}
// =====================================
// SELLER ORDERS
// =====================================
export async function fetchSellerOrders(sellerId) {
    return getSellerOrders(sellerId);
}
// =====================================
// SINGLE SELLER ORDER
// =====================================
export async function fetchSellerOrder(sellerId, orderId) {
    const order = await getSellerOrder(sellerId, orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    return order;
}
// =====================================
// UPDATE SELLER ORDER STATUS
// =====================================
export async function changeSellerOrderStatus(sellerId, orderId, status) {
    const updatedOrder = await updateSellerOrderItemStatus(sellerId, orderId, status);
    if (!updatedOrder) {
        throw new Error("Order not found");
    }
    // =================================
    // NOTIFY BUYER
    // =================================
    try {
        await sendNotification({
            userId: updatedOrder.buyerId,
            actorId: sellerId,
            type: "ORDER_STATUS",
            message: `Your order ${updatedOrder.orderNumber} status has been updated to ${status}`
        });
    }
    catch (error) {
        console.error("Failed to send order status notification:", error);
    }
    return updatedOrder;
}
