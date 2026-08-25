import { checkout, fetchBuyerOrders, fetchBuyerOrder, fetchSellerOrders, fetchSellerOrder, changeSellerOrderStatus } from "./order.service.js";
// =====================================
// CHECKOUT
// =====================================
export async function checkoutController(request, reply) {
    try {
        const user = request.user;
        const body = request.body;
        const order = await checkout(user.id, body);
        return reply.code(201).send({
            success: true,
            message: "Order created successfully",
            order
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error?.message ||
                "Unable to create order"
        });
    }
}
// =====================================
// GET BUYER ORDERS
// =====================================
export async function getBuyerOrdersController(request, reply) {
    try {
        const user = request.user;
        const orders = await fetchBuyerOrders(user.id);
        return reply.send({
            success: true,
            orders
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error?.message ||
                "Unable to fetch orders"
        });
    }
}
// =====================================
// GET SINGLE BUYER ORDER
// =====================================
export async function getBuyerOrderController(request, reply) {
    try {
        const user = request.user;
        const { id } = request.params;
        const order = await fetchBuyerOrder(user.id, id);
        return reply.send({
            success: true,
            order
        });
    }
    catch (error) {
        return reply.code(404).send({
            success: false,
            message: error?.message ||
                "Order not found"
        });
    }
}
// =====================================
// GET SELLER ORDERS
// =====================================
export async function getSellerOrdersController(request, reply) {
    try {
        const user = request.user;
        const orders = await fetchSellerOrders(user.id);
        return reply.send({
            success: true,
            orders
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error?.message ||
                "Unable to fetch seller orders"
        });
    }
}
// =====================================
// GET SINGLE SELLER ORDER
// =====================================
export async function getSellerOrderController(request, reply) {
    try {
        const user = request.user;
        const { id } = request.params;
        const order = await fetchSellerOrder(user.id, id);
        return reply.send({
            success: true,
            order
        });
    }
    catch (error) {
        return reply.code(404).send({
            success: false,
            message: error?.message ||
                "Order not found"
        });
    }
}
// =====================================
// UPDATE SELLER ORDER STATUS
// =====================================
export async function updateSellerOrderStatusController(request, reply) {
    try {
        const user = request.user;
        const { id } = request.params;
        const { status } = request.body;
        const order = await changeSellerOrderStatus(user.id, id, status);
        return reply.send({
            success: true,
            message: "Order status updated",
            order
        });
    }
    catch (error) {
        return reply.code(400).send({
            success: false,
            message: error?.message ||
                "Unable to update order status"
        });
    }
}
