import { fetchUserCart, addItemToCart, changeCartItemQuantity, removeItemFromCart, emptyCart } from "./cart.service.js";
// =====================================
// GET CART
// =====================================
export async function getCartController(request, reply) {
    const user = request.user;
    const cart = await fetchUserCart(user.id);
    return reply.send({
        success: true,
        cart
    });
}
// =====================================
// ADD ITEM
// =====================================
export async function addCartController(request, reply) {
    const user = request.user;
    const { listingId } = request.params;
    const item = await addItemToCart(user.id, listingId);
    return reply.code(201).send({
        success: true,
        message: "Added to cart",
        item
    });
}
// =====================================
// UPDATE QUANTITY
// =====================================
export async function updateCartController(request, reply) {
    const user = request.user;
    const { itemId } = request.params;
    const { quantity } = request.body;
    const item = await changeCartItemQuantity(user.id, itemId, quantity);
    return reply.send({
        success: true,
        item
    });
}
// =====================================
// REMOVE ITEM
// =====================================
export async function removeCartController(request, reply) {
    const { itemId } = request.params;
    const user = request.user;
    await removeItemFromCart(user.id, itemId);
    return reply.send({
        success: true,
        message: "Removed from cart"
    });
}
// =====================================
// CLEAR CART
// =====================================
export async function clearCartController(request, reply) {
    const user = request.user;
    await emptyCart(user.id);
    return reply.send({
        success: true,
        message: "Cart cleared"
    });
}
