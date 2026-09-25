import bcrypt from "bcrypt";
import { prisma } from "./src/lib/prisma.js";

const sellerEmail = "seller.test@obaaratech.com";
const adminEmail = "admin.test@obaaratech.com";
const password = "TestUser@123456";

async function main() {
    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.user.upsert({
        where: { email: sellerEmail },
        update: {
            name: "Obaaratech Test Seller",
            password: hashedPassword,
            phone: "08000000001",
            role: "SELLER",
            verifiedSeller: true,
        },
        create: {
            name: "Obaaratech Test Seller",
            email: sellerEmail,
            password: hashedPassword,
            phone: "08000000001",
            role: "SELLER",
            verifiedSeller: true,
        },
        select: {
            id: true,
            email: true,
            role: true,
            verifiedSeller: true,
        },
    });

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            name: "Obaaratech Test Admin",
            password: hashedPassword,
            phone: "08000000002",
            role: "SUPER_ADMIN",
        },
        create: {
            name: "Obaaratech Test Admin",
            email: adminEmail,
            password: hashedPassword,
            phone: "08000000002",
            role: "SUPER_ADMIN",
        },
        select: {
            id: true,
            email: true,
            role: true,
            verifiedSeller: true,
        },
    });

    console.log(JSON.stringify({ seller, admin }, null, 2));
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
