import { adminOnly } from "../../middleware/role.js";
import { authenticatedUserId, createBankAccount, listBankAccounts, listSellerSettlements, requestSettlement, setDefaultBankAccount, listAllSettlements, getMarketplaceFinancialSettings, updateMarketplaceFinancialSettings, listSellerBalancesOverview, reviewSettlement, verifyBankAccount, releasePendingEarnings, } from "./seller-finance.service.js";
function userId(request) {
    return authenticatedUserId(request.user);
}
function errorMessage(error) {
    return error instanceof Error ? error.message : "Unable to process finance request";
}
export async function getBankAccountsController(request, reply) {
    try {
        return reply.send({ success: true, data: await listBankAccounts(userId(request)) });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function createBankAccountController(request, reply) {
    try {
        return reply.code(201).send({
            success: true,
            data: await createBankAccount(userId(request), request.body),
        });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function setDefaultBankAccountController(request, reply) {
    try {
        const params = request.params;
        return reply.send({
            success: true,
            data: await setDefaultBankAccount(userId(request), params.id || ""),
        });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function getSellerSettlementsController(request, reply) {
    try {
        return reply.send({ success: true, data: await listSellerSettlements(userId(request)) });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function requestSettlementController(request, reply) {
    try {
        const body = request.body;
        return reply.code(201).send({
            success: true,
            data: await requestSettlement(userId(request), Number(body.amount)),
        });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function getAdminSettlementsController(request, reply) {
    try {
        return reply.send({ success: true, data: await listAllSettlements() });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function getAdminFinancialSettingsController(request, reply) {
    try {
        return reply.send({ success: true, data: await getMarketplaceFinancialSettings() });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function updateAdminFinancialSettingsController(request, reply) {
    try {
        const body = request.body;
        return reply.send({
            success: true,
            data: await updateMarketplaceFinancialSettings(body),
        });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function getSellerBalancesOverviewController(request, reply) {
    try {
        return reply.send({ success: true, data: await listSellerBalancesOverview() });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function reviewSettlementController(request, reply) {
    try {
        const params = request.params;
        const body = request.body;
        if (!body.status) {
            return reply.code(400).send({ success: false, message: "Settlement status is required" });
        }
        return reply.send({
            success: true,
            data: await reviewSettlement(params.id || "", body.status, body.failureReason),
        });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function verifyBankAccountController(request, reply) {
    try {
        const params = request.params;
        return reply.send({ success: true, data: await verifyBankAccount(params.id || "") });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export async function releasePendingEarningsController(request, reply) {
    try {
        return reply.send({
            success: true,
            data: await releasePendingEarnings(),
        });
    }
    catch (error) {
        return reply.code(400).send({ success: false, message: errorMessage(error) });
    }
}
export { adminOnly };
