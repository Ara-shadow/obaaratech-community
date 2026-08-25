import { prisma } from "../lib/prisma.js";
;
import { authenticate } from "../middlewares/auth.js";
export default async function listingRoutes(app) {
    // ==========================
    // CREATE LISTING
    // ==========================
    app.post("/", {
        preHandler: [authenticate]
    }, async (req, reply) => {
        const user = req.user;
        const body = req.body;
        const listing = await prisma.listing.create({
            data: {
                title: body.title,
                description: body.description,
                price: body.price,
                location: body.location,
                condition: body.condition,
                categoryId: body.categoryId,
                ownerId: user.id
            }
        });
        return listing;
    });
    // ==========================
    // GET ALL LISTINGS
    // ==========================
    app.get("/", async () => {
        return prisma.listing.findMany({
            where: {
                available: true
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                category: true,
                images: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    });
    // ==========================
    // MY LISTINGS
    // ==========================
    app.get("/my", {
        preHandler: [authenticate]
    }, async (req) => {
        const user = req.user;
        return prisma.listing.findMany({
            where: {
                ownerId: user.id
            },
            include: {
                category: true,
                images: true
            }
        });
    });
    // ==========================
    // DELETE LISTING
    // ==========================
    app.delete("/:id", {
        preHandler: [authenticate]
    }, async (req, reply) => {
        const user = req.user;
        const params = req.params;
        const listing = await prisma.listing.findUnique({
            where: {
                id: params.id
            }
        });
        if (!listing) {
            return reply.code(404).send({
                message: "Listing not found"
            });
        }
        if (listing.ownerId !== user.id) {
            return reply.code(403).send({
                message: "Not allowed"
            });
        }
        await prisma.listing.delete({
            where: {
                id: params.id
            }
        });
        return {
            message: "Listing deleted"
        };
    });
}
