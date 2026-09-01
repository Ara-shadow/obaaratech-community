import type { FastifyInstance } from "fastify";
import { authenticate, authorizeAdmin } from "../../middleware/auth.js";

export default async function usersRoutes(app: FastifyInstance) {

    // ============================
    // GET ALL USERS (Admin only)
    // ============================
    app.get(
        "/",
        {
            preHandler: [authenticate, authorizeAdmin]
        },
        async (request, reply) => {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    verifiedSeller: true,
                    createdAt: true
                }
            });
            
            return {
                success: true,
                users
            };
        }
    );

    // ============================
    // GET USER BY ID
    // ============================
    app.get(
        "/:id",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    verifiedSeller: true,
                    createdAt: true
                }
            });
            
            if (!user) {
                return reply.code(404).send({
                    success: false,
                    message: "User not found"
                });
            }
            
            return {
                success: true,
                user
            };
        }
    );

    // ============================
    // UPDATE USER
    // ============================
    app.put(
        "/:id",
        {
            preHandler: [authenticate]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            const body = request.body as {
                name?: string;
                phone?: string;
                avatar?: string;
            };
            
            // Users can only update their own profile unless admin
            const user = (request as any).user;
            if (user.id !== id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
                return reply.code(403).send({
                    success: false,
                    message: "Forbidden"
                });
            }
            
            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    name: body.name,
                    phone: body.phone,
                    avatar: body.avatar
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    verifiedSeller: true,
                    avatar: true
                }
            });
            
            return {
                success: true,
                user: updatedUser
            };
        }
    );

    // ============================
    // DELETE USER (Admin only)
    // ============================
    app.delete(
        "/:id",
        {
            preHandler: [authenticate, authorizeAdmin]
        },
        async (request, reply) => {
            const { id } = request.params as { id: string };
            
            // Prevent deleting self
            const user = (request as any).user;
            if (user.id === id) {
                return reply.code(400).send({
                    success: false,
                    message: "Cannot delete your own account"
                });
            }
            
            await prisma.user.delete({
                where: { id }
            });
            
            return {
                success: true,
                message: "User deleted successfully"
            };
        }
    );
}