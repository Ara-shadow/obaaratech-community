import { FastifyRequest, FastifyReply } from "fastify";

// Extend FastifyRequest to include user
declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: string;
            email: string;
            role: string;
        };
    }
}

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await request.jwtVerify();
        
        // Attach user to request
        (request as any).user = request.user;
        
    } catch(error) {
        return reply.code(401).send({
            success: false,
            message: "Unauthorized"
        });
    }
}

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

// Pre-built authorization middleware
export const authorizeAdmin = authorize('ADMIN', 'SUPER_ADMIN');
export const authorizeSeller = authorize('SELLER', 'ADMIN', 'SUPER_ADMIN');
export const authorizeUser = authorize('USER', 'SELLER', 'ADMIN', 'SUPER_ADMIN');