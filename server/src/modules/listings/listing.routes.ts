import type { FastifyInstance } from "fastify";
import { authenticate, authorizeAdmin, authorizeSeller } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function listingRoutes(app: FastifyInstance) {

    // ============================
    // GET ALL LISTINGS (Public)
    // ============================
    app.get("/", async (request, reply) => {
        const listings = await prisma.listing.findMany({
            where: { 
                available: true,
                status: "ACTIVE"
            },
            include: {
                images: true,
                category: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        verifiedSeller: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return {
            success: true,
            listings
        };
    });

    // ============================
    // GET LISTING BY ID
    // ============================
    app.get("/:id", async (request, reply) => {
        const { id } = request.params as { id: string };

        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                images: true,
                category: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        verifiedSeller: true
                    }
                },
                reviews: true
            }
        });

        if (!listing) {
            return reply.code(404).send({
                success: false,
                message: "Listing not found"
            });
        }

        // Increment view count (optional)
        // Could add a views field to Listing model

        return {
            success: true,
            listing
        };
    });

    // ============================
    // CREATE LISTING (Authenticated)
    // ============================
    app.post(
        "/",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;
            const body = request.body as {
                title: string;
                description: string;
                price?: number;
                location?: string;
                condition?: string;
                type?: string;
                negotiable?: boolean;
                categoryId?: string;
                currency?: string;
                details?: any;
            };

            const listing = await prisma.listing.create({
                data: {
                    title: body.title,
                    description: body.description,
                    price: body.price,
                    location: body.location,
                    condition: body.condition,
                    type: body.type as any || "PRODUCT",
                    negotiable: body.negotiable ?? true,
                    currency: body.currency as any || "NGN",
                    details: body.details,
                    categoryId: body.categoryId,
                    ownerId: user.id
                },
                include: {
                    images: true,
                    category: true
                }
            });

            return {
                success: true,
                listing
            };
        }
    );

    // ============================
    // UPDATE LISTING (Owner only)
    // ============================
    app.put(
        "/:id",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;
            const body = request.body as {
                title?: string;
                description?: string;
                price?: number;
                location?: string;
                condition?: string;
                negotiable?: boolean;
                available?: boolean;
                categoryId?: string;
                details?: any;
            };

            // Check if listing exists and belongs to user or admin
            const existing = await prisma.listing.findUnique({
                where: { id }
            });

            if (!existing) {
                return reply.code(404).send({
                    success: false,
                    message: "Listing not found"
                });
            }

            if (existing.ownerId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }

            const listing = await prisma.listing.update({
                where: { id },
                data: {
                    title: body.title,
                    description: body.description,
                    price: body.price,
                    location: body.location,
                    condition: body.condition,
                    negotiable: body.negotiable,
                    available: body.available,
                    categoryId: body.categoryId,
                    details: body.details
                },
                include: {
                    images: true,
                    category: true
                }
            });

            return {
                success: true,
                listing
            };
        }
    );

    // ============================
    // DELETE LISTING (Owner or Admin)
    // ============================
    app.delete(
        "/:id",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            const existing = await prisma.listing.findUnique({
                where: { id }
            });

            if (!existing) {
                return reply.code(404).send({
                    success: false,
                    message: "Listing not found"
                });
            }

            if (existing.ownerId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }

            await prisma.listing.delete({
                where: { id }
            });

            return {
                success: true,
                message: "Listing deleted successfully"
            };
        }
    );

    // ============================
    // GET RELATED LISTINGS
    // ============================
    app.get("/:id/related", async (request, reply) => {
        const { id } = request.params as { id: string };

        const listing = await prisma.listing.findUnique({
            where: { id },
            select: { categoryId: true }
        });

        if (!listing) {
            return reply.code(404).send({
                success: false,
                message: "Listing not found"
            });
        }

        const related = await prisma.listing.findMany({
            where: {
                id: { not: id },
                categoryId: listing.categoryId,
                available: true,
                status: "ACTIVE"
            },
            include: {
                images: true,
                category: true
            },
            take: 6,
            orderBy: { createdAt: "desc" }
        });

        return {
            success: true,
            listings: related
        };
    });
}