import axios from "axios";


// =====================================================
// API CLIENT
// =====================================================

const api = axios.create({

    baseURL:
        "http://localhost:5000/api",

    headers: {

        "Content-Type":
            "application/json"

    }

});


// =====================================================
// TYPES
// =====================================================

export type OrderPaymentMethod =
    "FLUTTERWAVE";


export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "READY"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";


export type OrderPaymentStatus =
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";


export interface CheckoutInput {

    deliveryAddress: string;

    phone: string;

    note?: string;

    paymentMethod:
        "FLUTTERWAVE";

}


export interface OrderImage {

    id: string;

    url: string;

}


export interface OrderListing {

    id: string;

    title: string;

    price:
        number | null;

    location?:
        string | null;

    images?:
        OrderImage[];

}


export interface OrderSeller {

    id: string;

    name: string;

    phone?:
        string | null;

    whatsapp?:
        string | null;

}


export interface OrderBuyer {

    id: string;

    name: string;

    phone?:
        string | null;

    whatsapp?:
        string | null;

}


export interface OrderItem {

    id: string;

    listingId: string;

    sellerId: string;

    title: string;

    unitPrice: number;

    quantity: number;

    subtotal: number;

    status:
        OrderStatus;

    listing?:
        OrderListing;

    seller?:
        OrderSeller;

}


export interface Order {

    id: string;

    orderNumber: string;

    buyerId: string;

    subtotal: number;

    deliveryFee: number;

    total: number;

    currency:
        string;

    paymentMethod:
        OrderPaymentMethod;

    paymentStatus:
        OrderPaymentStatus;

    status:
        OrderStatus;

    deliveryAddress:
        string;

    phone:
        string;

    note?:
        string | null;

    paymentExpiresAt?:
        string | null;

    createdAt:
        string;

    updatedAt:
        string;

    items:
        OrderItem[];

    buyer?:
        OrderBuyer;

}


// =====================================================
// CHECKOUT
// =====================================================

export async function checkout(
    data: CheckoutInput
): Promise<Order> {

    const response =
        await api.post(
            "/checkout",
            data
        );


    return response.data.order;

}


// =====================================================
// BUYER ORDERS
// =====================================================

export async function getBuyerOrders()
    : Promise<Order[]> {

    const response =
        await api.get(
            "/orders"
        );


    return response.data.orders;

}


// =====================================================
// SINGLE BUYER ORDER
// =====================================================

export async function getBuyerOrder(
    orderId: string
): Promise<Order> {

    const response =
        await api.get(
            `/orders/${orderId}`
        );


    return response.data.order;

}


// =====================================================
// SELLER ORDERS
// =====================================================

export async function getSellerOrders()
    : Promise<Order[]> {

    const response =
        await api.get(
            "/seller/orders"
        );


    return response.data.orders;

}


// =====================================================
// SINGLE SELLER ORDER
// =====================================================

export async function getSellerOrder(
    orderId: string
): Promise<Order> {

    const response =
        await api.get(
            `/seller/orders/${orderId}`
        );


    return response.data.order;

}


// =====================================================
// UPDATE SELLER ORDER STATUS
// =====================================================

export async function updateSellerOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<Order> {

    const response =
        await api.patch(

            `/seller/orders/${orderId}/status`,

            {
                status
            }

        );


    return response.data.order;

}


// =====================================================
// ATTACH JWT
// =====================================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "token"
            );


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) =>
        Promise.reject(error)

);


// =====================================================
// EXPORT
// =====================================================

export default api;