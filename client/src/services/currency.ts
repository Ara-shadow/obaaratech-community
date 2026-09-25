// =====================================================
// OBAARATECH COMMUNITY MARKETPLACE
// CURRENCY SERVICE
// =====================================================
//
// Central currency formatting for the entire application.
//
// NGN is the default currency.
// Supported currencies:
// NGN - Nigerian Naira
// USD - US Dollar
// GBP - British Pound
// EUR - Euro
//
// Keeping this logic in one place means we don't need
// separate currency formatting implementations throughout
// the application.
// =====================================================

export type Currency =
    | "NGN"
    | "USD"
    | "GBP"
    | "EUR";


// =====================================================
// DEFAULT CURRENCY
// =====================================================

export const DEFAULT_CURRENCY: Currency =
    "NGN";


// =====================================================
// SUPPORTED CURRENCIES
// =====================================================

export const SUPPORTED_CURRENCIES: Currency[] = [

    "NGN",

    "USD",

    "GBP",

    "EUR"

];


// =====================================================
// CURRENCY SYMBOLS
// =====================================================

export const CURRENCY_SYMBOLS: Record<
    Currency,
    string
> = {

    NGN: "₦",

    USD: "$",

    GBP: "£",

    EUR: "€"

};


// =====================================================
// CURRENCY NAMES
// =====================================================

export const CURRENCY_NAMES: Record<
    Currency,
    string
> = {

    NGN: "Nigerian Naira",

    USD: "US Dollar",

    GBP: "British Pound",

    EUR: "Euro"

};


// =====================================================
// LOCALE MAP
// =====================================================

const CURRENCY_LOCALES: Record<
    Currency,
    string
> = {

    NGN: "en-NG",

    USD: "en-US",

    GBP: "en-GB",

    EUR: "en-IE"

};


// =====================================================
// NORMALIZE CURRENCY
// =====================================================
//
// If an invalid, missing or undefined currency reaches
// the frontend, NGN is safely used as the default.
//
// This is important because older listings/orders may
// not have a currency value yet.
// =====================================================

export function normalizeCurrency(
    currency?: string | null
): Currency {

    if (
        currency === "NGN" ||
        currency === "USD" ||
        currency === "GBP" ||
        currency === "EUR"
    ) {

        return currency;

    }

    return DEFAULT_CURRENCY;

}


// =====================================================
// FORMAT CURRENCY
// =====================================================
//
// Example:
//
// formatCurrency(150000)
// → ₦150,000
//
// formatCurrency(150000, "USD")
// → $150,000
//
// Missing currency automatically becomes NGN.
// =====================================================

export function formatCurrency(
    amount: number | null | undefined,
    currency?: string | null
): string {

    const normalizedCurrency =
        normalizeCurrency(currency);


    if (
        amount === null ||
        amount === undefined ||
        Number.isNaN(amount)
    ) {

        amount = 0;

    }


    return new Intl.NumberFormat(

        CURRENCY_LOCALES[
            normalizedCurrency
        ],

        {

            style: "currency",

            currency:
                normalizedCurrency,

            maximumFractionDigits: 0

        }

    ).format(amount);

}


// =====================================================
// GET CURRENCY SYMBOL
// =====================================================

export function getCurrencySymbol(
    currency?: string | null
): string {

    const normalizedCurrency =
        normalizeCurrency(currency);


    return CURRENCY_SYMBOLS[
        normalizedCurrency
    ];

}


// =====================================================
// GET CURRENCY NAME
// =====================================================

export function getCurrencyName(
    currency?: string | null
): string {

    const normalizedCurrency =
        normalizeCurrency(currency);


    return CURRENCY_NAMES[
        normalizedCurrency
    ];

}


// =====================================================
// CURRENCY OPTIONS
// =====================================================
//
// Useful for dropdowns such as the Create Listing form.
// =====================================================

export const CURRENCY_OPTIONS =
    SUPPORTED_CURRENCIES.map(
        (currency) => ({

            value: currency,

            label:
                `${CURRENCY_NAMES[currency]} (${CURRENCY_SYMBOLS[currency]})`

        })
    );