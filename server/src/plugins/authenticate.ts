import fp from "fastify-plugin";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;
  }
}

async function authenticatePlugin(app: FastifyInstance) {

  app.decorate(
    "authenticate",
    async function (
      request: FastifyRequest,
      reply: FastifyReply
    ) {

      try {

        await request.jwtVerify();

      } catch {

        return reply.code(401).send({
          message: "Unauthorized"
        });

      }

    }
  );

}

export default fp(authenticatePlugin);