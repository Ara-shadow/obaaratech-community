import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    const password = await bcrypt.hash(
        "password",
        10
    );


    const user =
        await prisma.user.update({

            where: {
                email: "testuser@obaaratech.com"
            },

            data: {
                password
            }

        });


    console.log(
        "Password reset for:",
        user.email
    );

}


main()
    .catch((error) => {

        console.error(error);

        process.exit(1);

    })
    .finally(async () => {

        await prisma.$disconnect();

    });