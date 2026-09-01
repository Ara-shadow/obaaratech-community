import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CategorySeed = {
    name: string;
    slug: string;
    children?: CategorySeed[];
};

const additions: CategorySeed[] = [
    {
        name: "Services",
        slug: "services",
        children: [
            {
                name: "Home Services",
                slug: "home-services",
                children: [
                    { name: "Carpenters", slug: "carpenters" },
                    { name: "Plumbers", slug: "plumbers" },
                    { name: "Electricians", slug: "electricians" },
                    { name: "Painters & Decorators", slug: "painters-decorators" },
                    { name: "Welders & Fabricators", slug: "welders-fabricators" },
                    { name: "Bricklayers & Builders", slug: "bricklayers-builders" },
                    { name: "Furniture Makers", slug: "furniture-makers" },
                    { name: "Cleaners", slug: "cleaners" },
                ],
            },
            {
                name: "Auto Services",
                slug: "auto-services",
                children: [
                    { name: "Auto Mechanics", slug: "auto-mechanics" },
                    { name: "Auto Electricians", slug: "auto-electricians" },
                    { name: "Panel Beaters & Sprayers", slug: "panel-beaters-sprayers" },
                    { name: "Tyre & Vulcanizing Services", slug: "tyre-vulcanizing" },
                    { name: "Car Wash & Detailing", slug: "car-wash-detailing" },
                    { name: "Motorcycle Repairs", slug: "motorcycle-repairs" },
                ],
            },
            {
                name: "Beauty & Personal Care",
                slug: "beauty-personal-care",
                children: [
                    { name: "Barbers", slug: "barbers" },
                    { name: "Hair Stylists", slug: "hair-stylists" },
                    { name: "Makeup Artists", slug: "makeup-artists" },
                    { name: "Tailors & Fashion Designers", slug: "tailors-fashion-designers" },
                ],
            },
            {
                name: "Professional Services",
                slug: "professional-services",
                children: [
                    { name: "Tutors", slug: "tutors" },
                    { name: "Photographers & Videographers", slug: "photographers-videographers" },
                    { name: "Graphic Designers", slug: "graphic-designers" },
                    { name: "Repair Technicians", slug: "repair-technicians" },
                    { name: "Delivery & Dispatch", slug: "delivery-dispatch" },
                ],
            },
        ],
    },
    {
        name: "Trades & Labour",
        slug: "trades-labour",
        children: [
            { name: "Skilled Artisans", slug: "skilled-artisans" },
            { name: "Construction Workers", slug: "construction-workers" },
            { name: "Drivers", slug: "drivers" },
            { name: "Domestic Staff", slug: "domestic-staff" },
            { name: "Event Staff", slug: "event-staff" },
        ],
    },
];

async function upsertTree(items: CategorySeed[], parentId?: string) {
    for (const item of items) {
        const category = await prisma.category.upsert({
            where: { slug: item.slug },
            update: { name: item.name, parentId },
            create: { name: item.name, slug: item.slug, parentId },
        });

        if (item.children) {
            await upsertTree(item.children, category.id);
        }
    }
}

async function main() {
    await upsertTree(additions);
    console.log("Artisan and service categories added successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
