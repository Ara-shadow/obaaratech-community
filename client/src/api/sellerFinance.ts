import api from "./axios";

export interface SellerEarning {
    id: string;
    orderItemId: string;
    grossAmount: number;
    commissionRate: number | string;
    commissionAmount: number;
    paymentFee: number;
    netAmount: number;
    status: string;
    availableAt?: string | null;
    createdAt: string;
    orderItem?: {
        title: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
    };
    transaction?: {
        orderId: string;
        currency: string;
        status: string;
        paidAt?: string | null;
        createdAt: string;
    };
}

export interface SellerLedgerEntry {
    id: string;
    type: string;
    amount: number;
    referenceType?: string | null;
    referenceId?: string | null;
    description?: string | null;
    createdAt: string;
}

export interface SellerBalance {
    id: string;
    pendingBalance: number;
    availableBalance: number;
    totalSales: number;
    totalCommission: number;
    totalSettled: number;
    ledgerEntries: SellerLedgerEntry[];
}

export interface SellerBankAccount {
    id: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    isVerified: boolean;
    isDefault: boolean;
    createdAt: string;
}

export interface SellerSettlement {
    id: string;
    sellerId?: string;
    bankAccountId: string;
    amount: number;
    currency: string;
    status: string;
    failureReason?: string | null;
    requestedAt: string;
    processedAt?: string | null;
    bankAccount: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    seller?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface MarketplaceFinancialSettings {
    id: string;
    defaultCommissionRate: number;
    freeCommissionRate: number;
    premiumCommissionRate: number;
    businessCommissionRate: number;
    paymentFeeMode: "ABSORB_BY_PLATFORM" | "DEDUCT_FROM_SELLER" | "PASS_TO_CUSTOMER";
    settlementSchedule: "MANUAL" | "DAILY" | "WEEKLY" | "MONTHLY";
    minimumSettlementAmount: number;
    settlementEnabled: boolean;
    marketplaceEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SellerBalanceOverview {
    id: string;
    userId: string;
    pendingBalance: number;
    availableBalance: number;
    totalSales: number;
    totalCommission: number;
    totalSettled: number;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export async function getSellerEarnings(): Promise<SellerEarning[]> {
    const response = await api.get<{
        success: boolean;
        data: SellerEarning[];
    }>("/marketplace/payments/seller/earnings");

    return response.data.data;
}

export async function getSellerBalance(): Promise<SellerBalance | null> {
    const response = await api.get<{
        success: boolean;
        data: SellerBalance | null;
    }>("/marketplace/payments/seller/balance");

    return response.data.data;
}

export async function getSellerBankAccounts(): Promise<SellerBankAccount[]> {
    const response = await api.get<{
        success: boolean;
        data: SellerBankAccount[];
    }>("/seller-finance/bank-accounts");

    return response.data.data;
}

export async function addSellerBankAccount(input: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
}) {
    const response = await api.post<{
        success: boolean;
        data: SellerBankAccount;
    }>("/seller-finance/bank-accounts", input);

    return response.data.data;
}

export async function setDefaultSellerBankAccount(accountId: string) {
    const response = await api.patch<{
        success: boolean;
        data: SellerBankAccount;
    }>(`/seller-finance/bank-accounts/${accountId}/default`);

    return response.data.data;
}

export async function getSellerSettlements(): Promise<SellerSettlement[]> {
    const response = await api.get<{
        success: boolean;
        data: SellerSettlement[];
    }>("/seller-finance/settlements");

    return response.data.data;
}

export async function requestSellerSettlement(amount: number) {
    const response = await api.post<{
        success: boolean;
        data: SellerSettlement;
    }>("/seller-finance/settlements", { amount });

    return response.data.data;
}

export async function getAdminSettlements(): Promise<SellerSettlement[]> {
    const response = await api.get<{
        success: boolean;
        data: SellerSettlement[];
    }>("/seller-finance/admin/settlements");

    return response.data.data;
}

export async function getAdminFinancialSettings(): Promise<MarketplaceFinancialSettings> {
    const response = await api.get<{
        success: boolean;
        data: MarketplaceFinancialSettings;
    }>("/seller-finance/admin/finance/settings");

    return response.data.data;
}

export async function updateAdminFinancialSettings(input: Partial<MarketplaceFinancialSettings>) {
    const response = await api.patch<{
        success: boolean;
        data: MarketplaceFinancialSettings;
    }>("/seller-finance/admin/finance/settings", input);

    return response.data.data;
}

export async function getSellerBalancesOverview(): Promise<SellerBalanceOverview[]> {
    const response = await api.get<{
        success: boolean;
        data: SellerBalanceOverview[];
    }>("/seller-finance/admin/finance/seller-balances");

    return response.data.data;
}

export async function reviewSellerSettlement(
    settlementId: string,
    status: "COMPLETED" | "FAILED" | "CANCELLED",
    failureReason?: string
) {
    const response = await api.patch<{
        success: boolean;
        data: SellerSettlement;
    }>(`/seller-finance/admin/settlements/${settlementId}`, {
        status,
        failureReason,
    });

    return response.data.data;
}

export async function verifySellerBankAccount(accountId: string) {
    const response = await api.patch<{
        success: boolean;
        data: SellerBankAccount;
    }>(`/seller-finance/admin/bank-accounts/${accountId}/verify`);

    return response.data.data;
}

export async function releasePendingSellerEarnings() {
    const response = await api.post<{
        success: boolean;
        data: {
            releasedCount: number;
            releasedAt: string;
        };
    }>("/seller-finance/admin/earnings/release");

    return response.data.data;
}
