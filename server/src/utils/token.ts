import type { FastifyInstance } from "fastify";


export function generateToken(
    app: FastifyInstance,
    payload: {
        id: string;
        email: string;
        role: string;
    }
) {

    return app.jwt.sign(payload, {
        expiresIn: "7d",
    });

}