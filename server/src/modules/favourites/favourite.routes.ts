import type { FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function favouriteRoutes(app: FastifyInstance) {

    // ============================
    // GET ALL FAVOURITES
    // ============================
    app.get(
        "/",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const favourites = await prisma.favourite.findMany({
                where: { userId: user.id },
                include: {
                    listing: {
                        include: {
                            images: true,
                            category: true,
                            owner: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: "desc" }
            });

            return {
                success: true,
                favourites
            };
        }
    );

    // ============================
    // ADD FAVOURITE
    // ============================
    app.post(
        "/",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as { listingId: string };

            if (!body.listingId) {
                return reply.code(400).send({
                    success: false,
                    message: "Listing ID is required"
                });
            }

            // Check if listing exists
            const listing = await prisma.listing.findUnique({
                where: { id: body.listingId }
            });

            if (!listing) {
                return reply.code(404).send({
                    success: false,
                    message: "Listing not found"
                });
            }

            // Check if already favourited
            const existing = await prisma.favourite.findUnique({
                where: {
                    userId_listingId: {
                        userId: user.id,
                        listingId: body.listingId
                    }
                }
            });

            if (existing) {
                return reply.code(400).send({
                    success: false,
                    message: "Already in favourites"
                });
            }

            const favourite = await prisma.favourite.create({
                data: {
                    userId: user.id,
                    listingId: body.listingId
                },
                include: {
                    listing: {
                        include: {
                            images: true,
                            category: true
                        }
                    }
                }
            });

            return {
                success: true,
                favourite
            };
        }
    );

    // ============================
    // REMOVE FAVOURITE
    // ============================
    app.delete(
        "/:listingId",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { listingId } = request.params as { listingId: string };
            const user = (request as any).user;

            const favourite = await prisma.favourite.findUnique({
                where: {
                    userId_listingId: {
                        userId: user.id,
                        listingId: listingId
                    }
                }
            });

            if (!favourite) {
                return reply.code(404).send({
                    success: false,
                    message: "Favourite not found"
                });
            }

            await prisma.favourite.delete({
                where: {
                    userId_listingId: {
                        userId: user.id,
                        listingId: listingId
                    }
                }
            });

            return {
                success: true,
                message: "Removed from favourites"
            };
        }
    );

    // ============================
    // CHECK IF FAVOURITED
    // ============================
    app.get(
        "/check/:listingId",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { listingId } = request.params as { listingId: string };
            const user = (request as any).user;

            const favourite = await prisma.favourite.findUnique({
                where: {
                    userId_listingId: {
                        userId: user.id,
                        listingId: listingId
                    }
                }
            });

            return {
                success: true,
                isFavourite: !!favourite
            };
        }
    );
}