import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./modules/auth/index.js";

const app = Fastify({
  logger: true,
});

await app.register(cors);

app.get("/", async () => {
  return {
    success: true,
    message: "Community Market API is running 🚀",
    version: "1.0.0",
  };
});

// Authentication routes
await app.register(authRoutes, {
  prefix: "/auth",
});

export default app;