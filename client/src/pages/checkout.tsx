// Add to payment methods
const [paymentMethod, setPaymentMethod] = useState<"FLUTTERWAVE" | "PAYSTACK">("FLUTTERWAVE");

// In the payment options section:
<PaymentOption
    value="PAYSTACK"
    icon={<CreditCard size={20} />}
    title="Pay with Paystack"
    description="Pay securely using your card, bank transfer, or USSD"
    selected={paymentMethod === "PAYSTACK"}
    onSelect={() => setPaymentMethod("PAYSTACK")}
/>