import dotenv from "dotenv";

dotenv.config({
    path: "./server/.env",
    override: true
});

const {
    flutterwaveMarketplaceProvider
} = await import(
    "./src/modules/marketplace-payments/providers/flutterwave-marketplace.provider.js"
);

const reference = "OBA-FW-1787083051340";

console.log("");
console.log("=====================================");
console.log("FLUTTERWAVE VERIFICATION TEST");
console.log("=====================================");
console.log("Reference:", reference);
console.log("");

const result =
    await flutterwaveMarketplaceProvider.verify(
        reference
    );

console.log("");
console.log("Verification Result:");
console.log(result);
console.log("");
console.log("=====================================");
console.log("");
