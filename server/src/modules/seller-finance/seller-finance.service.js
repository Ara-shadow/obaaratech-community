import { prisma } from "../../lib/prisma.js";
const DEFAULT_MINIMUM_SETTLEMENT = 1000;
function getUserId(requestUser) {
    const userId = requestUser.id || requestUser.userId;
    if (!userId) {
        throw new Error("Authenticated user ID is missing");
    }
    return userId;
}
function normalizeAccountNumber(value) {
    const accountNumber = value.trim();
    if (!/^\d{10}$/.test(accountNumber)) {
        throw new Error("Account number must contain exactly 10 digits");
    }
    return accountNumber;
}
export async function listBankAccounts(userId) {
    return prisma.sellerBankAccount.findMany({
        where: { userId },
        orderBy: [
            { isDefault: "desc" },
            { createdAt: "desc" },
        ],
        select: {
            id: true,
            bankName: true,
            bankCode: true,
            accountNumber: true,
            accountName: true,
            isVerified: true,
            isDefault: true,
            provider: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
export async function createBankAccount(userId, input) {
    const bankName = input.bankName?.trim();
    const bankCode = input.bankCode?.trim();
    const accountName = input.accountName?.trim();
    const accountNumber = input.accountNumber
        ? normalizeAccountNumber(input.accountNumber)
        : "";
    if (!bankName || !bankCode || !accountName || !accountNumber) {
        throw new Error("Bank name, bank code, account name and account number are required");
    }
    const existing = await prisma.sellerBankAccount.findFirst({
        where: { userId, accountNumber },
    });
    if (existing) {
        throw new Error("This bank account is already registered");
    }
    const hasDefault = await prisma.sellerBankAccount.findFirst({
        where: { userId, isDefault: true },
        select: { id: true },
    });
    return prisma.sellerBankAccount.create({
        data: {
            userId,
            bankName,
            bankCode,
            accountNumber,
            accountName,
            isDefault: !hasDefault,
        },
    });
}
export async function setDefaultBankAccount(userId, accountId) {
    return prisma.$transaction(async (tx) => {
        const account = await tx.sellerBankAccount.findFirst({
            where: { id: accountId, userId },
        });
        if (!account) {
            throw new Error("Bank account not found");
        }
        await tx.sellerBankAccount.updateMany({
            where: { userId },
            data: { isDefault: false },
        });
        return tx.sellerBankAccount.update({
            where: { id: account.id },
            data: { isDefault: true },
        });
    });
}
export async function listSellerSettlements(userId) {
    return prisma.sellerSettlement.findMany({
        where: { sellerId: userId },
        orderBy: { createdAt: "desc" },
        include: {
            bankAccount: {
                select: {
                    bankName: true,
                    accountNumber: true,
                    accountName: true,
                },
            },
        },
    });
}
export async function requestSettlement(userId, amount) {
    if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error("Settlement amount must be a positive whole number");
    }
    return prisma.$transaction(async (tx) => {
        const setting = await tx.marketplaceFinancialSetting.findFirst({
            orderBy: { createdAt: "desc" },
        });
        const minimum = setting?.minimumSettlementAmount ?? DEFAULT_MINIMUM_SETTLEMENT;
        if (setting && (!setting.settlementEnabled || setting.settlementSchedule !== "MANUAL")) {
            throw new Error("Manual settlements are currently unavailable");
        }
        if (amount < minimum) {
            throw new Error(`Minimum settlement amount is ${minimum}`);
        }
        const bankAccount = await tx.sellerBankAccount.findFirst({
            where: { userId, isDefault: true, isVerified: true },
        });
        if (!bankAccount) {
            throw new Error("Add a verified default bank account before requesting settlement");
        }
        const balance = await tx.sellerBalance.findUnique({
            where: { userId },
        });
        if (!balance || balance.availableBalance < amount) {
            throw new Error("Settlement amount exceeds your available balance");
        }
        const settlement = await tx.sellerSettlement.create({
            data: {
                sellerId: userId,
                balanceId: balance.id,
                bankAccountId: bankAccount.id,
                amount,
                currency: "NGN",
                status: "PENDING",
            },
        });
        await tx.sellerBalance.update({
            where: { id: balance.id },
            data: {
                availableBalance: { decrement: amount },
            },
        });
        await tx.sellerLedgerEntry.create({
            data: {
                sellerId: userId,
                balanceId: balance.id,
                type: "SETTLEMENT",
                amount: -amount,
                referenceType: "SellerSettlement",
                referenceId: settlement.id,
                description: "Settlement requested and held for admin review",
            },
        });
        return settlement;
    });
}
export async function listAllSettlements() {
    return prisma.sellerSettlement.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            seller: { select: { id: true, name: true, email: true } },
            bankAccount: {
                select: {
                    bankName: true,
                    accountNumber: true,
                    accountName: true,
                },
            },
        },
    });
}
export async function getMarketplaceFinancialSettings() {
    const settings = await prisma.marketplaceFinancialSetting.findFirst({
        orderBy: { createdAt: "desc" },
    });
    if (!settings) {
        return prisma.marketplaceFinancialSetting.create({
            data: {
                defaultCommissionRate: 8,
                freeCommissionRate: 8,
                premiumCommissionRate: 6,
                businessCommissionRate: 5,
                paymentFeeMode: "ABSORB_BY_PLATFORM",
                settlementSchedule: "MANUAL",
                minimumSettlementAmount: 1000,
                settlementEnabled: true,
                marketplaceEnabled: true,
            },
        });
    }
    return settings;
}
export async function updateMarketplaceFinancialSettings(input) {
    const existing = await prisma.marketplaceFinancialSetting.findFirst({
        orderBy: { createdAt: "desc" },
    });
    const payload = {
        defaultCommissionRate: input.defaultCommissionRate ?? 8,
        freeCommissionRate: input.freeCommissionRate ?? 8,
        premiumCommissionRate: input.premiumCommissionRate ?? 6,
        businessCommissionRate: input.businessCommissionRate ?? 5,
        paymentFeeMode: input.paymentFeeMode ?? "ABSORB_BY_PLATFORM",
        settlementSchedule: input.settlementSchedule ?? "MANUAL",
        minimumSettlementAmount: input.minimumSettlementAmount ?? 1000,
        settlementEnabled: input.settlementEnabled ?? true,
        marketplaceEnabled: input.marketplaceEnabled ?? true,
    };
    if (!existing) {
        return prisma.marketplaceFinancialSetting.create({
            data: payload,
        });
    }
    return prisma.marketplaceFinancialSetting.update({
        where: { id: existing.id },
        data: payload,
    });
}
export async function listSellerBalancesOverview() {
    return prisma.sellerBalance.findMany({
        orderBy: { availableBalance: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
}
export async function verifyBankAccount(accountId) {
    return prisma.sellerBankAccount.update({
        where: { id: accountId },
        data: { isVerified: true },
    });
}
export async function reviewSettlement(settlementId, status, failureReason) {
    return prisma.$transaction(async (tx) => {
        const settlement = await tx.sellerSettlement.findUnique({
            where: { id: settlementId },
        });
        if (!settlement) {
            throw new Error("Settlement not found");
        }
        if (settlement.status !== "PENDING") {
            throw new Error("Only pending settlements can be reviewed");
        }
        const now = new Date();
        const updated = await tx.sellerSettlement.update({
            where: { id: settlement.id },
            data: {
                status,
                failureReason: status === "COMPLETED" ? null : failureReason?.trim() || "Settlement was not completed",
                processedAt: now,
            },
        });
        if (status === "COMPLETED") {
            await tx.sellerBalance.update({
                where: { id: settlement.balanceId },
                data: { totalSettled: { increment: settlement.amount } },
            });
        }
        else {
            await tx.sellerBalance.update({
                where: { id: settlement.balanceId },
                data: { availableBalance: { increment: settlement.amount } },
            });
            await tx.sellerLedgerEntry.create({
                data: {
                    sellerId: settlement.sellerId,
                    balanceId: settlement.balanceId,
                    type: "REVERSAL",
                    amount: settlement.amount,
                    referenceType: "SellerSettlement",
                    referenceId: settlement.id,
                    description: "Settlement returned after unsuccessful review",
                },
            });
        }
        return updated;
    });
}
export async function releasePendingEarnings() {
    return prisma.$transaction(async (tx) => {
        const pendingEarnings = await tx.sellerEarning.findMany({
            where: {
                status: "PENDING",
                transaction: {
                    status: "SUCCESSFUL",
                },
            },
            select: {
                id: true,
                sellerId: true,
                netAmount: true,
            },
        });
        const releasedAt = new Date();
        let releasedCount = 0;
        for (const earning of pendingEarnings) {
            const updated = await tx.sellerEarning.updateMany({
                where: {
                    id: earning.id,
                    status: "PENDING",
                },
                data: {
                    status: "AVAILABLE",
                    availableAt: releasedAt,
                },
            });
            if (updated.count === 0) {
                continue;
            }
            const balance = await tx.sellerBalance.findUnique({
                where: { userId: earning.sellerId },
            });
            if (!balance) {
                throw new Error("Seller balance not found for pending earning");
            }
            await tx.sellerBalance.update({
                where: { id: balance.id },
                data: {
                    pendingBalance: { decrement: earning.netAmount },
                    availableBalance: { increment: earning.netAmount },
                },
            });
            releasedCount += 1;
        }
        return {
            releasedCount,
            releasedAt,
        };
    });
}
export function authenticatedUserId(user) {
    return getUserId(user);
}
