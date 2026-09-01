import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import rawBody from "fastify-raw-body";
import rateLimit from "@fastify/rate-limit";

import path from "node:path";
import { fileURLToPath } from 'node:url';

import { prisma } from "./lib/prisma.js";

import jwtPlugin from "./plugins/jwt.js";

// ===============================
// ROUTES
// ===============================

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";

import planRoutes from "./modules/plans/plan.routes.js";

import { favouriteRoutes } from "./modules/favourites/index.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";

import postsRoutes from "./modules/posts/posts.routes.js";
import commentsRoutes from "./modules/comments/comments.routes.js";
import likesRoutes from "./modules/likes/likes.routes.js";

import notificationsRoutes from "./modules/notifications/notifications.routes.js";

import {
    listingImageRoutes
} from "./modules/listings/listing.image.routes.js";

import listingRoutes from "./modules/listings/listing.routes.js";

import categoryRoutes from "./modules/categories/category.routes.js";

import {
    marketplaceRoutes
} from "./modules/marketplace/marketplace.routes.js";

// ===============================
// SELLERS
// ===============================

import sellerRoutes from "./modules/sellers/seller.routes.js";
import sellerSubscriptionRoutes from "./modules/sellers/seller.subscription.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import sellerListingRoutes from "./modules/sellers/seller.listings.routes.js";

import marketplacePaymentRoutes from "./modules/marketplace-payments/marketplace-payment.routes.js";
import sellerFinanceRoutes from "./modules/seller-finance/seller-finance.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// BUILD APP
// ===============================

export async function buildApp() {

    const app = Fastify({
        logger: {
            level: process.env.LOG_LEVEL || 'info',
            transport: process.env.NODE_ENV === 'development' ? {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname'
                }
            } : undefined
        },
        trustProxy: true
    });

    // ===============================
    // RATE LIMITING
    // ===============================

    await app.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        keyGenerator: (request) => {
            return (request as any).ip || 'unknown';
        },
        skip: (request) => {
            const url = (request as any).url || '';
            return url.includes('/admin') || url.includes('/webhook');
        }
    });

    // ===============================
    // GLOBAL ERROR HANDLER
    // ===============================

    app.setErrorHandler(
        (error, request, reply) => {
            
            request.log.error({
                error: error.message,
                stack: error.stack,
                url: request.url,
                method: request.method
            });

            if (error.name === 'ZodError') {
                return reply.code(400).send({
                    success: false,
                    message: 'Validation error',
                    errors: (error as any).errors?.map((e: any) => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                });
            }

            if (error.validation) {
                return reply.code(400).send({
                    success: false,
                    message: 'Validation error',
                    errors: error.validation
                });
            }

            const statusCode =
                typeof error === "object" &&
                error !== null &&
                "statusCode" in error &&
                typeof error.statusCode === "number"
                    ? error.statusCode
                    : 500;

            const message =
                error instanceof Error
                    ? error.message
                    : "Internal server error";

            return reply
                .code(statusCode)
                .send({
                    success: false,
                    message
                });

        }
    );

    // ===============================
    // CORS
    // ===============================

    const allowedOrigins = process.env.NODE_ENV === 'production'
        ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
        : true;

    await app.register(
        cors,
        {
            origin: allowedOrigins,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
        }
    );

    // ===============================
    // RAW BODY (for Flutterwave webhooks)
    // ===============================

    await app.register(
        rawBody,
        {
            field: "rawBody",
            global: true,
            encoding: "utf8",
            runFirst: true
        }
    );

    // ===============================
    // MULTIPART (for file uploads)
    // ===============================

    await app.register(
        multipart,
        {
            limits: {
                fileSize: 5 * 1024 * 1024
            }
        }
    );

    // ===============================
    // STATIC FILES - REGISTERED ONCE
    // ===============================

    // Check if already registered to avoid duplicate
    const uploadsPath = path.join(process.cwd(), "uploads");
    
    // Only register if not already registered
    try {
        await app.register(
            fastifyStatic,
            {
                root: uploadsPath,
                prefix: "/uploads/",
                decorateReply: true
            }
        );
    } catch (error) {
        console.log("⚠️ Static files already registered, skipping...");
    }

    // ===============================
    // JWT
    // ===============================

    await app.register(jwtPlugin);

    // ===============================
    // ROUTES
    // ===============================

    await app.register(authRoutes, { prefix: "/api/auth" });
    await app.register(usersRoutes, { prefix: "/api/users" });
    await app.register(profileRoutes, { prefix: "/api/profile" });
    await app.register(categoryRoutes, { prefix: "/api/categories" });
    await app.register(marketplaceRoutes, { prefix: "/api/marketplace" });
    await app.register(listingRoutes, { prefix: "/api/listings" });
    await app.register(listingImageRoutes, { prefix: "/api/listings" });
    await app.register(postsRoutes, { prefix: "/api/posts" });
    await app.register(commentsRoutes, { prefix: "/api/comments" });
    await app.register(likesRoutes, { prefix: "/api/likes" });
    await app.register(notificationsRoutes, { prefix: "/api/notifications" });
    await app.register(favouriteRoutes, { prefix: "/api/favourites" });
    await app.register(cartRoutes, { prefix: "/api/cart" });
    await app.register(orderRoutes, { prefix: "/api/orders" });
    await app.register(sellerRoutes, { prefix: "/api/sellers" });
    await app.register(sellerSubscriptionRoutes, { prefix: "/api/sellers/subscription" });
    await app.register(sellerListingRoutes, { prefix: "/api/sellers" });
    await app.register(planRoutes, { prefix: "/api/plans" });
    await app.register(paymentRoutes, { prefix: "/api/payments" });
    await app.register(marketplacePaymentRoutes, { prefix: "/api/marketplace/payments" });
    await app.register(sellerFinanceRoutes, { prefix: "/api/seller-finance" });

    // ===============================
    // ROOT & HEALTH
    // ===============================

    app.get("/", async () => {
        return {
            name: "Obaaratech Community API",
            status: "running",
            version: "1.0.0",
            timestamp: new Date().toISOString()
        };
    });

    app.get("/health", async () => {
        return {
            success: true,
            message: "API is healthy",
            timestamp: new Date().toISOString()
        };
    });

    app.get("/database", async () => {
        const users = await prisma.user.count();
        const listings = await prisma.listing.count();
        const orders = await prisma.order.count();

        return {
            success: true,
            database: "connected",
            stats: {
                users,
                listings,
                orders
            }
        };
    });

    // ===============================
    // PRINT ROUTES (in development)
    // ===============================

    if (process.env.NODE_ENV === 'development') {
        console.log("\n📋 Registered Routes:");
        console.log(app.printRoutes());
    }

    return app;

}