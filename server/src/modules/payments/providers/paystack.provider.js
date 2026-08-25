const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
export const paystackProvider = {
    name: "PAYSTACK",
    async initialize(input) {
        if (!PAYSTACK_SECRET_KEY) {
            throw new Error("PAYSTACK_SECRET_KEY is not configured");
        }
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: input.email,
                amount: Math.round(input.amount * 100),
                currency: input.currency,
                reference: input.paymentId,
                callback_url: input.callbackUrl,
                metadata: {
                    paymentId: input.paymentId,
                    userId: input.userId,
                    planId: input.planId
                }
            })
        });
        const data = await response.json();
        if (!response.ok || !data.status || !data.data) {
            throw new Error(data.message || "Paystack initialization failed");
        }
        return {
            success: true,
            provider: "PAYSTACK",
            reference: data.data.reference || input.paymentId,
            authorizationUrl: data.data.authorization_url,
            checkoutUrl: data.data.authorization_url,
            metadata: {
                accessCode: data.data.access_code
            }
        };
    },
    async verify(reference) {
        if (!PAYSTACK_SECRET_KEY) {
            throw new Error("PAYSTACK_SECRET_KEY is not configured");
        }
        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });
        const data = await response.json();
        if (!response.ok || !data.status || !data.data) {
            throw new Error(data.message || "Paystack verification failed");
        }
        const providerStatus = data.data.status?.toLowerCase();
        let status = "PENDING";
        if (providerStatus === "success") {
            status = "APPROVED";
        }
        else if (providerStatus === "failed" ||
            providerStatus === "abandoned") {
            status = "REJECTED";
        }
        return {
            success: status === "APPROVED",
            provider: "PAYSTACK",
            reference: data.data.reference || reference,
            status,
            amount: data.data.amount !== undefined
                ? data.data.amount / 100
                : undefined,
            currency: data.data.currency
        };
    }
};
