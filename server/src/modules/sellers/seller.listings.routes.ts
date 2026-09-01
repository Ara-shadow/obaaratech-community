import type { FastifyInstance } from "fastify";
import { authenticate, authorizeSeller } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export default async function sellerListingRoutes(app: FastifyInstance) {

    // ============================
    // GET SELLER LISTINGS
    // ============================
    app.get(
        "/listings",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const user = (request as any).user;

            const listings = await prisma.listing.findMany({
                where: { ownerId: user.id },
                include: {
                    images: true,
                    category: true
                },
                orderBy: { createdAt: "desc" }
            });

            return {
                success: true,
                listings
            };
        }
    );

    // ============================
    // GET SELLER LISTING BY ID
    // ============================
    app.get(
        "/listings/:id",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            const listing = await prisma.listing.findFirst({
                where: {
                    id,
                    ownerId: user.id
                },
                include: {
                    images: true,
                    category: true,
                    reviews: true
                }
            });

            if (!listing) {
                return reply.code(404).send({
                    success: false,
                    message: "Listing not found"
                });
            }

            return {
                success: true,
                listing
            };
        }
    );

    // ============================
    // MARK LISTING AS SOLD
    // ============================
    app.put(
        "/listings/:id/sold",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            const listing = await prisma.listing.findFirst({
                where: {
                    id,
                    ownerId: user.id
                }
            });

            if (!listing) {
                return reply.code(404).send({
                    success: false,
                    message: "Listing not found"
                });
            }

            if (listing.status === "SOLD") {
                return reply.code(400).send({
                    success: false,
                    message: "Listing is already marked as sold"
                });
            }

            const updated = await prisma.listing.update({
                where: { id },
                data: {
                    status: "SOLD",
                    available: false
                },
                include: {
                    images: true,
                    category: true
                }
            });

            return {
                success: true,
                listing: updated
            };
        }
    );

    // ============================
    // DELETE LISTING
    // ============================
    app.delete(
        "/listings/:id",
        {
            preHandler: [authenticate, authorizeSeller]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const user = (request as any).user;

            const listing = await prisma.listing.findFirst({
                where: {
                    id,
                    ownerId: user.id
                }
            });

            if (!listing) {
                return reply.code(404).send({
                    success: false,
                    message: "Listing not found"
                });
            }

            // Delete associated images first
            await prisma.listingImage.deleteMany({
                where: { listingId: id }
            });

            // Delete the listing
            await prisma.listing.delete({
                where: { id }
            });

            return {
                success: true,
                message: "Listing deleted successfully"
            };
        }
    );
}