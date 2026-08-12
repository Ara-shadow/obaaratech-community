import { prisma } from "../../lib/prisma.js";


export async function findUserByEmail(
    email: string
) {

    return prisma.user.findUnique({

        where: {
            email
        }

    });

}


export async function createUser(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
}) {

    return prisma.user.create({

        data: {

            name: data.name,

            email: data.email,

            phone: data.phone ?? null,

            password: data.password

        }

    });

}