import api from "./axios";


// =====================================================
// TYPES
// =====================================================

export interface CartImage {
    id: string;
    url: string;
    [key: string]: unknown;
}


export interface CartOwner {
    id: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
}


export interface CartCategory {
    id: string;
    name?: string;
    [key: string]: unknown;
}


export interface CartListing {
    id: string;
    title: string;
    price: number | null;
    currency?: "NGN" | "USD" | "GBP" | "EUR" | string | null;
    location?: string | null;
    available?: boolean;
    status?: string;
    images?: CartImage[];
    owner?: CartOwner;
    category?: CartCategory;
    [key: string]: unknown;
}


export interface CartItem {
    id: string;
    cartId: string;
    listingId: string;
    quantity: number;
    createdAt?: string;
    updatedAt?: string;
    listing: CartListing;
}


export interface Cart {
    id: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    items: CartItem[];
}


export interface CartResponse {
    success: boolean;
    message?: string;
    cart: Cart;
}


// =====================================================
// ERROR TYPE
// =====================================================

export interface ApiErrorResponse {
    success?: boolean;
    message?: string;
}


// =====================================================
// GET CART
// =====================================================

export async function getCart(): Promise<Cart> {

    const response =
        await api.get<CartResponse>(
            "/cart"
        );


    return response.data.cart;
}


// =====================================================
// ADD TO CART
// =====================================================

export async function addToCart(
    listingId: string
): Promise<CartResponse> {

    const response =
        await api.post<CartResponse>(
            `/cart/${listingId}`
        );


    return response.data;
}


// =====================================================
// UPDATE CART QUANTITY
// =====================================================

export async function updateCartQuantity(
    itemId: string,
    quantity: number
): Promise<CartResponse> {

    const response =
        await api.patch<CartResponse>(
            `/cart/item/${itemId}`,
            {
                quantity
            }
        );


    return response.data;
}


// =====================================================
// REMOVE CART ITEM
// =====================================================

export async function removeCartItem(
    itemId: string
): Promise<CartResponse> {

    const response =
        await api.delete<CartResponse>(
            `/cart/item/${itemId}`
        );


    return response.data;
}


// =====================================================
// CLEAR CART
// =====================================================

export async function clearCart(): Promise<CartResponse> {

    const response =
        await api.delete<CartResponse>(
            "/cart"
        );


    return response.data;
}