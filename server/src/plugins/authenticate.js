import fp from "fastify-plugin";
async function authenticatePlugin(app) {
    app.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch {
            return reply.code(401).send({
                message: "Unauthorized"
            });
        }
    });
}
export default fp(authenticatePlugin);
