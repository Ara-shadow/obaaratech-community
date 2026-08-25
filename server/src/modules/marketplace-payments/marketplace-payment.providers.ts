import type {
    OrderPaymentMethod,
} from "@prisma/client";

import type {
    MarketplacePaymentProvider,
} from "./marketplace-payment.provider.js";

import {
    flutterwaveMarketplaceProvider,
} from "./providers/flutterwave-marketplace.provider.js";

// =====================================
// MARKETPLACE PAYMENT PROVIDERS
// =====================================

const providers: Partial<
    Record<
        OrderPaymentMethod,
        MarketplacePaymentProvider
    >
> = {
    FLUTTERWAVE:
        flutterwaveMarketplaceProvider,
};

// =====================================
// GET PAYMENT PROVIDER
// =====================================

export function getMarketplacePaymentProvider(
    method: OrderPaymentMethod
): MarketplacePaymentProvider {
    const provider =
        providers[method];

    if (!provider) {
        throw new Error(
            `Unsupported marketplace payment method: ${method}`
        );
    }

    return provider;
}

// =====================================
// CHECK PROVIDER AVAILABILITY
// =====================================

export function hasMarketplacePaymentProvider(
    method: OrderPaymentMethod
): boolean {
    return Boolean(
        providers[method]
    );
}

// =====================================
// GET AVAILABLE PROVIDERS
// =====================================

export function getAvailableMarketplacePaymentProviders(): OrderPaymentMethod[] {
    return Object.entries(providers)
        .filter(
            (
                [, provider]
            ) => Boolean(provider)
        )
        .map(
            ([method]) =>
                method as OrderPaymentMethod
        );
}