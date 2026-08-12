-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'PAYSTACK');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "SellerPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "proofUrl" TEXT,
    "adminNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SellerPayment_userId_idx" ON "SellerPayment"("userId");

-- CreateIndex
CREATE INDEX "SellerPayment_status_idx" ON "SellerPayment"("status");

-- AddForeignKey
ALTER TABLE "SellerPayment" ADD CONSTRAINT "SellerPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerPayment" ADD CONSTRAINT "SellerPayment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SellerPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
