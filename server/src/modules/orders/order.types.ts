import type {
    Currency,
    OrderPaymentMethod,
    OrderStatus,
    OrderItemStatus
} from "@prisma/client";

export interface CheckoutItemInput {
    listingId: string;
    quantity: number;
}

export interface CheckoutInput {
    deliveryAddress: string;
    phone: string;
    note?: string;
    paymentMethod: OrderPaymentMethod;
}

export interface CreateOrderInput {
    orderNumber: string;
    buyerId: string;

    subtotal: number;
    deliveryFee: number;
    total: number;

    currency: Currency;

    paymentMethod: OrderPaymentMethod;

    deliveryAddress: string;
    phone: string;
    note?: string;

    items: {
        listingId: string;
        sellerId: string;
        title: string;
        unitPrice: number;
        quantity: number;
        subtotal: number;
    }[];
}

export type SellerOrderItemStatus = OrderItemStatus;