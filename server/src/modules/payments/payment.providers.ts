import type {
    PaymentMethod,
    PaymentProvider
} from "./payment.provider.js";

import {
    bankTransferProvider
} from "./providers/bank-transfer.provider.js";

import {
    paystackProvider
} from "./providers/paystack.provider.js";

import {
    flutterwaveProvider
} from "./providers/flutterwave.provider.js";


const providers: Record<
    PaymentMethod,
    PaymentProvider
> = {

    BANK_TRANSFER:
        bankTransferProvider,

    PAYSTACK:
        paystackProvider,

    FLUTTERWAVE:
        flutterwaveProvider

};


export function getPaymentProvider(
    method: PaymentMethod
): PaymentProvider {

    const provider =
        providers[method];


    if (!provider) {

        throw new Error(
            `Unsupported payment method: ${method}`
        );

    }


    return provider;

}
