import { adminOnly } from "../../middleware/role.js";
import { createBankAccountController, getAdminFinancialSettingsController, getAdminSettlementsController, getBankAccountsController, getSellerBalancesOverviewController, getSellerSettlementsController, requestSettlementController, reviewSettlementController, setDefaultBankAccountController, updateAdminFinancialSettingsController, verifyBankAccountController, releasePendingEarningsController, } from "./seller-finance.controller.js";
export default async function sellerFinanceRoutes(app) {
    const authenticated = { preHandler: [app.authenticate] };
    const admin = { preHandler: [app.authenticate, adminOnly] };
    app.get("/bank-accounts", authenticated, getBankAccountsController);
    app.post("/bank-accounts", authenticated, createBankAccountController);
    app.patch("/bank-accounts/:id/default", authenticated, setDefaultBankAccountController);
    app.get("/settlements", authenticated, getSellerSettlementsController);
    app.post("/settlements", authenticated, requestSettlementController);
    app.get("/admin/settlements", admin, getAdminSettlementsController);
    app.get("/admin/finance/settings", admin, getAdminFinancialSettingsController);
    app.patch("/admin/finance/settings", admin, updateAdminFinancialSettingsController);
    app.get("/admin/finance/seller-balances", admin, getSellerBalancesOverviewController);
    app.patch("/admin/settlements/:id", admin, reviewSettlementController);
    app.patch("/admin/bank-accounts/:id/verify", admin, verifyBankAccountController);
    app.post("/admin/earnings/release", admin, releasePendingEarningsController);
}
