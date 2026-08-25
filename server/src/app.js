import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import rawBody from "fastify-raw-body";
import path from "node:path";
import { prisma } from "./lib/prisma.js";
import jwtPlugin from "./plugins/jwt.js";
import authenticatePlugin from "./plugins/authenticate.js";
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
import { listingImageRoutes } from "./modules/listings/listing.image.routes.js";
import listingRoutes from "./modules/listings/listing.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import { marketplaceRoutes } from "./modules/marketplace/marketplace.routes.js";
// ===============================
// SELLERS
// ===============================
import sellerRoutes from "./modules/sellers/seller.routes.js";
import sellerSubscriptionRoutes from "./modules/sellers/seller.subscription.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import sellerListingRoutes from "./modules/sellers/seller.listings.routes.js";
import marketplacePaymentRoutes from "./modules/marketplace-payments/marketplace-payment.routes.js";
// ===============================
// BUILD APP
// ===============================
export async function buildApp() {
    const app = Fastify({
        logger: true,
        trustProxy: true
    });
    // ===============================
    // GLOBAL ERROR HANDLER
    // ===============================
    app.setErrorHandler((error, request, reply) => {
        request.log.error(error);
        const statusCode = typeof error === "object" &&
            error !== null &&
            "statusCode" in error &&
            typeof error.statusCode === "number"
            ? error.statusCode
            : 500;
        const message = error instanceof Error
            ? error.message
            : "Internal server error";
        return reply
            .code(statusCode)
            .send({
            success: false,
            message
        });
    });
    // ===============================
    // CORS
    // ===============================
    await app.register(cors, {
        origin: true
    });
    // ===============================
    // RAW BODY
    // ===============================
    //
    // Required by Flutterwave webhook
    // signature verification.
    //
    // Flutterwave signs the ORIGINAL
    // request body.
    //
    // ===============================
    await app.register(rawBody, {
        field: "rawBody",
        global: true,
        encoding: "utf8",
        runFirst: true
    });
    // ===============================
    // MULTIPART
    // ===============================
    await app.register(multipart, {
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });
    // ===============================
    // STATIC FILES
    // ===============================
    await app.register(fastifyStatic, {
        root: path.join(process.cwd(), "uploads"),
        prefix: "/uploads/"
    });
    // ===============================
    // JWT
    // ===============================
    await app.register(jwtPlugin);
    // ===============================
    // AUTHENTICATION
    // ===============================
    await app.register(authenticatePlugin);
    // ===============================
    // AUTH
    // ===============================
    await app.register(authRoutes, {
        prefix: "/api/auth"
    });
    // ===============================
    // USERS
    // ===============================
    await app.register(usersRoutes, {
        prefix: "/api/users"
    });
    // ===============================
    // PROFILE
    // ===============================
    await app.register(profileRoutes, {
        prefix: "/api/profile"
    });
    // ===============================
    // CATEGORIES
    // ===============================
    await app.register(categoryRoutes, {
        prefix: "/api/categories"
    });
    // ===============================
    // MARKETPLACE
    // ===============================
    await app.register(marketplaceRoutes, {
        prefix: "/api/marketplace"
    });
    // ===============================
    // LISTINGS
    // ===============================
    await app.register(listingRoutes, {
        prefix: "/api/listings"
    });
    await app.register(listingImageRoutes, {
        prefix: "/api/listings"
    });
    // ===============================
    // POSTS
    // ===============================
    await app.register(postsRoutes, {
        prefix: "/api/posts"
    });
    // ===============================
    // COMMENTS
    // ===============================
    await app.register(commentsRoutes, {
        prefix: "/api"
    });
    // ===============================
    // LIKES
    // ===============================
    await app.register(likesRoutes, {
        prefix: "/api"
    });
    // ===============================
    // NOTIFICATIONS
    // ===============================
    await app.register(notificationsRoutes, {
        prefix: "/api"
    });
    // ===============================
    // FAVOURITES
    // ===============================
    await app.register(favouriteRoutes, {
        prefix: "/api/favourites"
    });
    // ===============================
    // CART
    // ===============================
    await app.register(cartRoutes, {
        prefix: "/api/cart"
    });
    // ===============================
    // ORDERS
    // ===============================
    await app.register(orderRoutes, {
        prefix: "/api"
    });
    // ===============================
    // SELLER PROFILE
    // ===============================
    await app.register(sellerRoutes, {
        prefix: "/api/sellers"
    });
    // ===============================
    // SELLER SUBSCRIPTION
    // ===============================
    await app.register(sellerSubscriptionRoutes, {
        prefix: "/api/sellers/subscription"
    });
    // ===============================
    // SELLER LISTING MANAGEMENT
    // ===============================
    await app.register(sellerListingRoutes, {
        prefix: "/api/sellers"
    });
    // ===============================
    // SELLER PLANS
    // ===============================
    await app.register(planRoutes, {
        prefix: "/api/plans"
    });
    // ===============================
    // PAYMENTS
    // ===============================
    await app.register(paymentRoutes, {
        prefix: "/api/payments"
    });
    // ===============================
    // MARKETPLACE PAYMENTS
    // ===============================
    await app.register(marketplacePaymentRoutes, {
        prefix: "/api/marketplace/payments"
    });
    // ===============================
    // ROOT
    // ===============================
    app.get("/", async () => {
        return {
            name: "Obaaratech Community API",
            status: "running",
            version: "1.0.0"
        };
    });
    // ===============================
    // HEALTH
    // ===============================
    app.get("/health", async () => {
        return {
            success: true,
            message: "API is healthy"
        };
    });
    // ===============================
    // DATABASE CHECK
    // ===============================
    app.get("/database", async () => {
        const users = await prisma.user.count();
        return {
            success: true,
            database: "connected",
            users
        };
    });
    // ===============================
    // PRINT ROUTES
    // ===============================
    console.log(app.printRoutes());
    return app;
}
