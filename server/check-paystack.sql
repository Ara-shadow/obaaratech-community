SELECT 'Order' AS source, COUNT(*) AS paystack_count
FROM "Order"
WHERE "paymentMethod"::text = 'PAYSTACK'

UNION ALL

SELECT 'OrderPayment' AS source, COUNT(*) AS paystack_count
FROM "OrderPayment"
WHERE "paymentMethod"::text = 'PAYSTACK';
