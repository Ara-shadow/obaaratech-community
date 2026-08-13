import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import type {
    ReactNode
} from "react";

import {
    useAuth
} from "./AuthContext";

import {
    getCart,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    clearCart
} from "../api/cart";

import type {
    Cart
} from "../api/cart";


// =====================================================
// CART CONTEXT TYPE
// =====================================================

interface CartContextType {

    cart: Cart | null;

    loading: boolean;

    itemCount: number;

    refreshCart: () => Promise<void>;

    addItem: (
        listingId: string
    ) => Promise<void>;

    updateQuantity: (
        itemId: string,
        quantity: number
    ) => Promise<void>;

    removeItem: (
        itemId: string
    ) => Promise<void>;

    clear: () => Promise<void>;

}


// =====================================================
// CONTEXT
// =====================================================

const CartContext =
    createContext<CartContextType | undefined>(
        undefined
    );


// =====================================================
// PROVIDER
// =====================================================

export function CartProvider({
    children
}: {
    children: ReactNode;
}) {

    const {
        isAuthenticated
    } = useAuth();


    const [
        cart,
        setCart
    ] = useState<Cart | null>(null);


    const [
        loading,
        setLoading
    ] = useState(false);


    // =================================================
    // LOAD CART
    // =================================================

    async function refreshCart() {

        if (!isAuthenticated) {

            setCart(null);

            return;

        }


        try {

            setLoading(true);


            const data =
                await getCart();


            setCart(data);


        } catch (error) {

            console.error(
                "Cart loading error:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    // =================================================
    // LOAD WHEN AUTHENTICATED
    // =================================================

    useEffect(() => {

        if (!isAuthenticated) {

            setCart(null);

            return;

        }


        refreshCart();

    }, [isAuthenticated]);


    // =================================================
    // ADD ITEM
    // =================================================

    async function addItem(
        listingId: string
    ) {

        const response =
            await addToCart(
                listingId
            );


        // Reload cart so the Navbar count
        // and cart contents remain synchronized.

        await refreshCart();


        return response;

    }


    // =================================================
    // UPDATE QUANTITY
    // =================================================

    async function updateQuantity(
        itemId: string,
        quantity: number
    ) {

        if (quantity < 1) {

            return;

        }


        const response =
            await updateCartQuantity(
                itemId,
                quantity
            );


        setCart(
            current => {

                if (!current) {

                    return current;

                }


                return {

                    ...current,

                    items:
                        current.items.map(
                            item =>
                                item.id === itemId
                                    ? {
                                        ...item,
                                        quantity:
                                            response.item.quantity
                                    }
                                    : item
                        )

                };

            }
        );

    }


    // =================================================
    // REMOVE ITEM
    // =================================================

    async function removeItem(
        itemId: string
    ) {

        await removeCartItem(
            itemId
        );


        setCart(
            current => {

                if (!current) {

                    return current;

                }


                return {

                    ...current,

                    items:
                        current.items.filter(
                            item =>
                                item.id !== itemId
                        )

                };

            }
        );

    }


    // =================================================
    // CLEAR CART
    // =================================================

    async function clear() {

        await clearCart();


        setCart(
            current => {

                if (!current) {

                    return current;

                }


                return {

                    ...current,

                    items: []

                };

            }
        );

    }


    // =================================================
    // TOTAL ITEM COUNT
    // =================================================

    const itemCount =
        cart?.items.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,
            0
        ) || 0;


    // =================================================
    // PROVIDER
    // =================================================

    return (

        <CartContext.Provider
            value={{

                cart,

                loading,

                itemCount,

                refreshCart,

                addItem,

                updateQuantity,

                removeItem,

                clear

            }}
        >

            {children}

        </CartContext.Provider>

    );

}


// =====================================================
// HOOK
// =====================================================

export function useCart() {

    const context =
        useContext(
            CartContext
        );


    if (!context) {

        throw new Error(
            "useCart must be used inside CartProvider"
        );

    }


    return context;

}