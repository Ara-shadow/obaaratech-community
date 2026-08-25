import fp from "fastify-plugin";

export default fp(async (fastify) => {

    const jwtSecret =
        process.env.JWT_SECRET?.trim();

    if (!jwtSecret) {

        throw new Error(
            "JWT_SECRET environment variable is required"
        );

    }

    await fastify.register(
        import("@fastify/jwt"),
        {
            secret: jwtSecret
        }
    );

});