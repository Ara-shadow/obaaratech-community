import type { FastifyReply, FastifyRequest } from "fastify";

export async function register(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send({
    success: true,
    message: "Register endpoint working",
    data: request.body,
  });
}

export async function login(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.send({
    success: true,
    message: "Login endpoint working",
    data: request.body,
  });
}