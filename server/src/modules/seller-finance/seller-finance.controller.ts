import type {
    FastifyReply,
    FastifyRequest,
} from "fastify";

import { adminOnly } from "../../middleware/role.js";
import {
    authenticatedUserId,
    createBankAccount,
    listBankAccounts,
    listSellerSettlements,
    requestSettlement,
    setDefaultBankAccount,
    listAllSettlements,
    getMarketplaceFinancialSettings,
    updateMarketplaceFinancialSettings,
    listSellerBalancesOverview,
    reviewSettlement,
    verifyBankAccount,
    releasePendingEarnings,
} from "./seller-finance.service.js";

function userId(request: FastifyRequest) {
    return authenticatedUserId(request.user as { id?: string; userId?: string });
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unable to process finance request";
}

export async function getBankAccountsController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        return reply.send({ success: true, data: await listBankAccounts(userId(request)) });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function createBankAccountController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        return reply.code(201).send({
            success: true,
            data: await createBankAccount(userId(request), request.body as {
                bankName?: string;
                bankCode?: string;
                accountNumber?: string;
                accountName?: string;
            }),
        });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function setDefaultBankAccountController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const params = request.params as { id?: string };
        return reply.send({
            success: true,
            data: await setDefaultBankAccount(userId(request), params.id || ""),
        });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function getSellerSettlementsController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        return reply.send({ success: true, data: await listSellerSettlements(userId(request)) });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function requestSettlementController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const body = request.body as { amount?: number };
        return reply.code(201).send({
            success: true,
            data: await requestSettlement(userId(request), Number(body.amount)),
        });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function getAdminSettlementsController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        return reply.send({ success: true, data: await listAllSettlements() });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function getAdminFinancialSettingsController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        return reply.send({ success: true, data: await getMarketplaceFinancialSettings() });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function updateAdminFinancialSettingsController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const body = request.body as Partial<{
            defaultCommissionRate: number;
            freeCommissionRate: number;
            premiumCommissionRate: number;
            businessCommissionRate: number;
            paymentFeeMode: "ABSORB_BY_PLATFORM" | "DEDUCT_FROM_SELLER" | "PASS_TO_CUSTOMER";
            settlementSchedule: "MANUAL" | "DAILY" | "WEEKLY" | "MONTHLY";
            minimumSettlementAmount: number;
            settlementEnabled: boolean;
            marketplaceEnabled: boolean;
        }>;

        return reply.send({
            success: true,
            data: await updateMarketplaceFinancialSettings(body),
        });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function getSellerBalancesOverviewController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        return reply.send({ success: true, data: await listSellerBalancesOverview() });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function reviewSettlementController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const params = request.params as { id?: string };
        const body = request.body as {
            status?: "COMPLETED" | "FAILED" | "CANCELLED";
            failureReason?: string;
        };
        if (!body.status) {
            return reply.code(400).send({ success: false, message: "Settlement status is required" });
        }
        return reply.send({
            success: true,
            data: await reviewSettlement(params.id || "", body.status, body.failureReason),
        });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function verifyBankAccountController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const params = request.params as { id?: string };
        return reply.send({ success: true, data: await verifyBankAccount(params.id || "") });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export async function releasePendingEarningsController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        return reply.send({
            success: true,
            data: await releasePendingEarnings(),
        });
    } catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}

export { adminOnly };
