SELECT
    sp.*
FROM public."SellerPlan" sp;

SELECT
    p."planId" AS payment_plan_id,
    s."planId" AS subscription_plan_id
FROM public."SellerPayment" p
FULL OUTER JOIN public."SellerSubscription" s
    ON p."planId" = s."planId";
