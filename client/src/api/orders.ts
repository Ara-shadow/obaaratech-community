import api from "./axios";

// =====================================================
// PAYMENT METHOD
// =====================================================

export type OrderPaymentMethod =
    | "FLUTTERWAVE";

// =====================================================
// ORDER STATUS
// =====================================================

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "READY"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

// =====================================================
// PAYMENT STATUS
// =====================================================

export type OrderPaymentStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

// =====================================================
// CHECKOUT INPUT
// =====================================================

export interface CheckoutInput {
    deliveryAddress: string;

    phone: string;

    note?: string;

    paymentMethod: OrderPaymentMethod;
}

// =====================================================
// ORDER IMAGE
// =====================================================

export interface OrderImage {
    id: string;

    url: string;
}

// =====================================================
// ORDER LISTING
// =====================================================

export interface OrderListing {
    id: string;

    title: string;

    price: number | null;

    location?: string | null;

    images?: OrderImage[];
}

// =====================================================
// ORDER SELLER
// =====================================================

export interface OrderSeller {
    id: string;

    name: string;

    phone?: string | null;

    whatsapp?: string | null;
}

// =====================================================
// ORDER BUYER
// =====================================================

export interface OrderBuyer {
    id: string;

    name: string;

    phone?: string | null;

    whatsapp?: string | null;
}

// =====================================================
// ORDER ITEM
// =====================================================

export interface OrderItem {
    id: string;

    listingId: string;

    sellerId: string;

    title: string;

    unitPrice: number;

    quantity: number;

    subtotal: number;

    status: OrderStatus;

    listing?: OrderListing;

    seller?: OrderSeller;
}

// =====================================================
// ORDER
// =====================================================

export interface Order {
    id: string;

    orderNumber: string;

    buyerId: string;

    subtotal: number;

    deliveryFee: number;

    total: number;

    currency: string;

    paymentMethod: OrderPaymentMethod;

    paymentStatus: OrderPaymentStatus;

    status: OrderStatus;

    deliveryAddress: string;

    phone: string;

    note?: string | null;

    paymentExpiresAt?: string | null;

    createdAt: string;

    updatedAt: string;

    items: OrderItem[];

    buyer?: OrderBuyer;
}

// =====================================================
// CHECKOUT RESPONSE
// =====================================================

export interface CheckoutResponse {
    success?: boolean;

    order: Order;
}

// =====================================================
// GET ORDERS RESPONSE
// =====================================================

export interface OrdersResponse {
    success?: boolean;

    orders: Order[];
}

// =====================================================
// GET SINGLE ORDER RESPONSE
// =====================================================

export interface SingleOrderResponse {
    success?: boolean;

    order: Order;
}

// =====================================================
// CHECKOUT
// =====================================================

export async function checkout(
    data: CheckoutInput
): Promise<Order> {

    const response =
        await api.post<CheckoutResponse>(
            "/checkout",
            data
        );

    if (!response.data?.order) {
        throw new Error(
            "The server did not return the created order."
        );
    }

    return response.data.order;
}

// =====================================================
// GET BUYER ORDERS
// =====================================================

export async function getBuyerOrders():
    Promise<Order[]> {

    const response =
        await api.get<OrdersResponse>(
            "/orders"
        );

    return response.data?.orders || [];
}

// =====================================================
// GET SINGLE BUYER ORDER
// =====================================================

export async function getBuyerOrder(
    orderId: string
): Promise<Order> {

    if (!orderId?.trim()) {
        throw new Error(
            "Order ID is required."
        );
    }

    const response =
        await api.get<SingleOrderResponse>(
            `/orders/${encodeURIComponent(orderId)}`
        );

    if (!response.data?.order) {
        throw new Error(
            "The server did not return the order."
        );
    }

    return response.data.order;
}

// =====================================================
// GET SELLER ORDERS
// =====================================================

export async function getSellerOrders():
    Promise<Order[]> {

    const response =
        await api.get<OrdersResponse>(
            "/seller/orders"
        );

    return response.data?.orders || [];
}

// =====================================================
// GET SINGLE SELLER ORDER
// =====================================================

export async function getSellerOrder(
    orderId: string
): Promise<Order> {

    if (!orderId?.trim()) {
        throw new Error(
            "Order ID is required."
        );
    }

    const response =
        await api.get<SingleOrderResponse>(
            `/seller/orders/${encodeURIComponent(orderId)}`
        );

    if (!response.data?.order) {
        throw new Error(
            "The server did not return the seller order."
        );
    }

    return response.data.order;
}

// =====================================================
// UPDATE SELLER ORDER STATUS
// =====================================================

export async function updateSellerOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<Order> {

    if (!orderId?.trim()) {
        throw new Error(
            "Order ID is required."
        );
    }

    const response =
        await api.patch<SingleOrderResponse>(
            `/seller/orders/${encodeURIComponent(orderId)}/status`,
            {
                status
            }
        );

    if (!response.data?.order) {
        throw new Error(
            "The server did not return the updated order."
        );
    }

    return response.data.order;
}