DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        WHERE t.typname = 'PaymentMethod'
          AND e.enumlabel = 'FLUTTERWAVE'
    ) THEN
        EXECUTE 'ALTER TYPE "PaymentMethod" ADD VALUE ''FLUTTERWAVE''';
    END IF;
END
$$;
