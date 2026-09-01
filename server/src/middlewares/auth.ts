import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        await request.jwtVerify();
        
        // Attach user to request for controllers to use
        (request as any).user = request.user;
        
    } catch(error) {
        return reply.code(401).send({
            success: false,
            message: "Unauthorized"
        });
    }
}

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