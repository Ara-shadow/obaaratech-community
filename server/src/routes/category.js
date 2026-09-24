import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
export default async function categoryRoutes(app) {
    // Get all categories
    app.get("/", async () => {
        return await prisma.category.findMany({
            orderBy: {
                name: "asc"
            }
        });
    });
    app.get("/tree", async () => {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc"
            }
        });
        return {
            success: true,
            categories
        };
    });
    // Create category
    app.post("/", {
        preHandler: authenticate
    }, async (req, reply) => {
        const user = req.user;
        if (user.role !== "ADMIN") {
            return reply.code(403).send({
                message: "Admin access required"
            });
        }
        const body = req.body;
        const category = await prisma.category.create({
            data: {
                name: body.name
            }
        });
        return category;
    });
}
