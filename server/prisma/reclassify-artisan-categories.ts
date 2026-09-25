import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const jobs = await prisma.category.findUnique({
        where: { slug: "jobs" },
        select: { id: true },
    });

    if (!jobs) {
        throw new Error("Jobs category was not found");
    }

    await prisma.category.updateMany({
        where: {
            slug: {
                in: ["services", "trades-labour"],
            },
        },
        data: {
            parentId: jobs.id,
        },
    });

    console.log("Artisan and service branches are now classified under Jobs.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
