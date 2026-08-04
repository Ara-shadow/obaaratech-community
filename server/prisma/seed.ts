import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});


const prisma = new PrismaClient({
  adapter,
});


async function main() {

  await prisma.category.createMany({
    data: [
      {
        name: "Electronics",
      },
      {
        name: "Fashion",
      },
      {
        name: "Services",
      },
      {
        name: "Vehicles",
      },
      {
        name: "Real Estate",
      },
    ],
  });


  console.log("✅ Seed completed successfully");

}


main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });