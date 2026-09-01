import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export default fp(async (app) => {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    
    // 100 years expiration
    const expiresIn = process.env.JWT_EXPIRATION || '36500d';
    
    await app.register(jwt, {
        secret: secret,
        sign: {
            expiresIn: expiresIn
        },
        verify: {
            maxAge: expiresIn
        }
    });
});