import { flutterwaveMarketplaceProvider } from "./providers/flutterwave-marketplace.provider.js";
// =====================================
// MARKETPLACE PAYMENT PROVIDERS
// =====================================
const providers = {
    FLUTTERWAVE: flutterwaveMarketplaceProvider
};
// =====================================
// GET PAYMENT PROVIDER
// =====================================
export function getMarketplacePaymentProvider(method) {
    const provider = providers[method];
    if (!provider) {
        throw new Error(`Unsupported marketplace payment method: ${method}`);
    }
    return provider;
}
