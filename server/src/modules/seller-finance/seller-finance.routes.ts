import type { FastifyInstance } from "fastify";
import { authenticate, authorizeSeller } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function sellerFinanceRoutes(app: FastifyInstance) {

    // ============================
    // GET SELLER BALANCE
    // ============================
    app.get(
        "/balance",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            let balance = await prisma.sellerBalance.findUnique({
                where: { userId: user.id }
            });

            if (!balance) {
                balance = await prisma.sellerBalance.create({
                    data: {
                        userId: user.id,
                        pendingBalance: 0,
                        availableBalance: 0,
                        totalSales: 0,
                        totalCommission: 0,
                        totalSettled: 0
                    }
                });
            }

            return {
                success: true,
                balance
            };
        }
    );

    // ============================
    // GET SELLER EARNINGS
    // ============================
    app.get(
        "/earnings",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const earnings = await prisma.sellerEarning.findMany({
                where: { sellerId: user.id },
                include: {
                    orderItem: {
                        select: {
                            title: true,
                            listingId: true
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            return {
                success: true,
                earnings
            };
        }
    );

    // ============================
    // GET SELLER BANK ACCOUNTS
    // ============================
    app.get(
        "/bank-accounts",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const accounts = await prisma.sellerBankAccount.findMany({
                where: { userId: user.id },
                orderBy: { isDefault: "desc" }
            });

            return {
                success: true,
                accounts
            };
        }
    );

    // ============================
    // ADD BANK ACCOUNT
    // ============================
    app.post(
        "/bank-accounts",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                bankName: string;
                bankCode: string;
                accountNumber: string;
                accountName: string;
            };

            // Check if account already exists
            const existing = await prisma.sellerBankAccount.findFirst({
                where: {
                    userId: user.id,
                    accountNumber: body.accountNumber,
                    bankCode: body.bankCode
                }
            });

            if (existing) {
                return reply.code(400).send({
                    success: false,
                    message: "Bank account already added"
                });
            }

            // If this is the first account, make it default
            const count = await prisma.sellerBankAccount.count({
                where: { userId: user.id }
            });

            const account = await prisma.sellerBankAccount.create({
                data: {
                    userId: user.id,
                    bankName: body.bankName,
                    bankCode: body.bankCode,
                    accountNumber: body.accountNumber,
                    accountName: body.accountName,
                    isDefault: count === 0
                }
            });

            return {
                success: true,
                account
            };
        }
    );

    // ============================
    // SET DEFAULT BANK ACCOUNT
    // ============================
    app.put(
        "/bank-accounts/:id/default",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            // Check if account exists and belongs to user
            const account = await prisma.sellerBankAccount.findFirst({
                where: {
                    id,
                    userId: user.id
                }
            });

            if (!account) {
                return reply.code(404).send({
                    success: false,
                    message: "Bank account not found"
                });
            }

            // Remove default from all accounts
            await prisma.sellerBankAccount.updateMany({
                where: { userId: user.id },
                data: { isDefault: false }
            });

            // Set as default
            const updated = await prisma.sellerBankAccount.update({
                where: { id },
                data: { isDefault: true }
            });

            return {
                success: true,
                account: updated
            };
        }
    );

    // ============================
    // REQUEST SETTLEMENT
    // ============================
    app.post(
        "/settlements",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as { amount: number };

            if (!body.amount || body.amount <= 0) {
                return reply.code(400).send({
                    success: false,
                    message: "Invalid amount"
                });
            }

            // Get balance
            const balance = await prisma.sellerBalance.findUnique({
                where: { userId: user.id }
            });

            if (!balance || balance.availableBalance < body.amount) {
                return reply.code(400).send({
                    success: false,
                    message: "Insufficient available balance"
                });
            }

            // Get default bank account
            const bankAccount = await prisma.sellerBankAccount.findFirst({
                where: {
                    userId: user.id,
                    isDefault: true,
                    isVerified: true
                }
            });

            if (!bankAccount) {
                return reply.code(400).send({
                    success: false,
                    message: "No verified default bank account found"
                });
            }

            // Create settlement request
            const settlement = await prisma.sellerSettlement.create({
                data: {
                    sellerId: user.id,
                    balanceId: balance.id,
                    bankAccountId: bankAccount.id,
                    amount: body.amount,
                    status: "PENDING"
                }
            });

            // Update balance
            await prisma.sellerBalance.update({
                where: { id: balance.id },
                data: {
                    availableBalance: balance.availableBalance - body.amount,
                    pendingBalance: balance.pendingBalance + body.amount
                }
            });

            return {
                success: true,
                settlement
            };
        }
    );

    // ============================
    // GET SELLER SETTLEMENTS
    // ============================
    app.get(
        "/settlements",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const settlements = await prisma.sellerSettlement.findMany({
                where: { sellerId: user.id },
                orderBy: { requestedAt: "desc" }
            });

            return {
                success: true,
                settlements
            };
        }
    );
}