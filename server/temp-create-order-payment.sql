CREATE TABLE IF NOT EXISTS "OrderPayment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'NGN',
    "paymentMethod" "OrderPaymentMethod" NOT NULL,
    "status" "OrderPaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "provider" TEXT,
    "proofUrl" TEXT,
    "metadata" JSONB,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderPayment_pkey"
        PRIMARY KEY ("id"),

    CONSTRAINT "OrderPayment_orderId_key"
        UNIQUE ("orderId"),

    CONSTRAINT "OrderPayment_orderId_fkey"
        FOREIGN KEY ("orderId")
        REFERENCES "Order"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "OrderPayment_status_idx"
    ON "OrderPayment"("status");

CREATE INDEX IF NOT EXISTS "OrderPayment_reference_idx"
    ON "OrderPayment"("reference");

CREATE INDEX IF NOT EXISTS "OrderPayment_createdAt_idx"
    ON "OrderPayment"("createdAt");
