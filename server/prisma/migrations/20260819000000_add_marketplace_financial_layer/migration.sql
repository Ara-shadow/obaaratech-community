-- CreateEnum
CREATE TYPE "PaymentFeeMode" AS ENUM (
  'ABSORB_BY_PLATFORM',
  'DEDUCT_FROM_SELLER',
  'PASS_TO_CUSTOMER'
);

-- CreateEnum
CREATE TYPE "SettlementSchedule" AS ENUM (
  'MANUAL',
  'DAILY',
  'WEEKLY',
  'MONTHLY'
);

-- CreateEnum
CREATE TYPE "MarketplaceTransactionStatus" AS ENUM (
  'PENDING',
  'SUCCESSFUL',
  'FAILED',
  'REFUNDED'
);

-- CreateEnum
CREATE TYPE "SellerEarningStatus" AS ENUM (
  'PENDING',
  'AVAILABLE',
  'SETTLED',
  'REVERSED'
);

-- CreateEnum
CREATE TYPE "SellerLedgerEntryType" AS ENUM (
  'SALE_CREDIT',
  'COMMISSION',
  'PAYMENT_FEE',
  'REFUND',
  'SETTLEMENT',
  'ADJUSTMENT',
  'REVERSAL'
);

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
);

-- CreateTable
CREATE TABLE "SellerBankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "provider" TEXT,
    "providerAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerBalance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pendingBalance" INTEGER NOT NULL DEFAULT 0,
    "availableBalance" INTEGER NOT NULL DEFAULT 0,
    "totalSales" INTEGER NOT NULL DEFAULT 0,
    "totalCommission" INTEGER NOT NULL DEFAULT 0,
    "totalSettled" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceFinancialSetting" (
    "id" TEXT NOT NULL,
    "defaultCommissionRate" DECIMAL(5,2) NOT NULL,
    "freeCommissionRate" DECIMAL(5,2) NOT NULL,
    "premiumCommissionRate" DECIMAL(5,2) NOT NULL,
    "businessCommissionRate" DECIMAL(5,2) NOT NULL,
    "paymentFeeMode" "PaymentFeeMode" NOT NULL DEFAULT 'ABSORB_BY_PLATFORM',
    "settlementSchedule" "SettlementSchedule" NOT NULL DEFAULT 'MANUAL',
    "minimumSettlementAmount" INTEGER NOT NULL DEFAULT 1000,
    "settlementEnabled" BOOLEAN NOT NULL DEFAULT true,
    "marketplaceEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceFinancialSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceTransaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'NGN',
    "paymentMethod" "OrderPaymentMethod" NOT NULL,
    "provider" TEXT,
    "providerReference" TEXT,
    "transactionReference" TEXT,
    "status" "MarketplaceTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "verifiedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerEarning" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "grossAmount" INTEGER NOT NULL,
    "commissionRate" DECIMAL(5,2) NOT NULL,
    "commissionAmount" INTEGER NOT NULL,
    "paymentFee" INTEGER NOT NULL DEFAULT 0,
    "netAmount" INTEGER NOT NULL,
    "status" "SellerEarningStatus" NOT NULL DEFAULT 'PENDING',
    "availableAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerEarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerLedgerEntry" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "type" "SellerLedgerEntryType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellerLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerSettlement" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'NGN',
    "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerReference" TEXT,
    "failureReason" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SellerBankAccount_userId_idx"
ON "SellerBankAccount"("userId");

CREATE INDEX "SellerBankAccount_accountNumber_idx"
ON "SellerBankAccount"("accountNumber");

CREATE UNIQUE INDEX "SellerBalance_userId_key"
ON "SellerBalance"("userId");

CREATE UNIQUE INDEX "MarketplaceTransaction_orderId_key"
ON "MarketplaceTransaction"("orderId");

CREATE INDEX "MarketplaceTransaction_status_idx"
ON "MarketplaceTransaction"("status");

CREATE INDEX "MarketplaceTransaction_providerReference_idx"
ON "MarketplaceTransaction"("providerReference");

CREATE INDEX "MarketplaceTransaction_transactionReference_idx"
ON "MarketplaceTransaction"("transactionReference");

CREATE INDEX "MarketplaceTransaction_createdAt_idx"
ON "MarketplaceTransaction"("createdAt");

CREATE INDEX "SellerEarning_sellerId_idx"
ON "SellerEarning"("sellerId");

CREATE INDEX "SellerEarning_transactionId_idx"
ON "SellerEarning"("transactionId");

CREATE INDEX "SellerEarning_orderItemId_idx"
ON "SellerEarning"("orderItemId");

CREATE INDEX "SellerEarning_status_idx"
ON "SellerEarning"("status");

CREATE INDEX "SellerLedgerEntry_sellerId_idx"
ON "SellerLedgerEntry"("sellerId");

CREATE INDEX "SellerLedgerEntry_balanceId_idx"
ON "SellerLedgerEntry"("balanceId");

CREATE INDEX "SellerLedgerEntry_referenceId_idx"
ON "SellerLedgerEntry"("referenceId");

CREATE INDEX "SellerLedgerEntry_createdAt_idx"
ON "SellerLedgerEntry"("createdAt");

CREATE INDEX "SellerSettlement_sellerId_idx"
ON "SellerSettlement"("sellerId");

CREATE INDEX "SellerSettlement_status_idx"
ON "SellerSettlement"("status");

CREATE INDEX "SellerSettlement_providerReference_idx"
ON "SellerSettlement"("providerReference");

CREATE INDEX "SellerSettlement_createdAt_idx"
ON "SellerSettlement"("createdAt");

-- AddForeignKey
ALTER TABLE "SellerBankAccount"
ADD CONSTRAINT "SellerBankAccount_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerBalance"
ADD CONSTRAINT "SellerBalance_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MarketplaceTransaction"
ADD CONSTRAINT "MarketplaceTransaction_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerEarning"
ADD CONSTRAINT "SellerEarning_transactionId_fkey"
FOREIGN KEY ("transactionId") REFERENCES "MarketplaceTransaction"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerEarning"
ADD CONSTRAINT "SellerEarning_orderItemId_fkey"
FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerEarning"
ADD CONSTRAINT "SellerEarning_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerLedgerEntry"
ADD CONSTRAINT "SellerLedgerEntry_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerLedgerEntry"
ADD CONSTRAINT "SellerLedgerEntry_balanceId_fkey"
FOREIGN KEY ("balanceId") REFERENCES "SellerBalance"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerSettlement"
ADD CONSTRAINT "SellerSettlement_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerSettlement"
ADD CONSTRAINT "SellerSettlement_balanceId_fkey"
FOREIGN KEY ("balanceId") REFERENCES "SellerBalance"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerSettlement"
ADD CONSTRAINT "SellerSettlement_bankAccountId_fkey"
FOREIGN KEY ("bankAccountId") REFERENCES "SellerBankAccount"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
