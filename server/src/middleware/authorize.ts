import { FastifyRequest, FastifyReply } from "fastify";

export function authorize(...allowedRoles: string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const user = (request as any).user;
        
        if (!user) {
            return reply.code(401).send({
                success: false,
                message: "Unauthorized"
            });
        }
        
        if (!allowedRoles.includes(user.role)) {
            return reply.code(403).send({
                success: false,
                message: "Forbidden: Insufficient permissions"
            });
        }
    };
}

// Pre-built authorization middleware for common roles
export const authorizeAdmin = authorize('ADMIN', 'SUPER_ADMIN');
export const authorizeSeller = authorize('SELLER', 'ADMIN', 'SUPER_ADMIN');
export const authorizeUser = authorize('USER', 'SELLER', 'ADMIN', 'SUPER_ADMIN');