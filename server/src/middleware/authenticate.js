export default async function authenticatePlugin(app) {
    app.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (error) {
            reply.code(401).send({
                message: "Unauthorized"
            });
        }
    });
}
