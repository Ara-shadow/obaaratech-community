import "dotenv/config";

import { buildApp } from "./app.js";

import { releaseExpiredReservations } 
from "./modules/orders/reservation.service.js";

// Graceful shutdown handler
const gracefulShutdown = async (app: any) => {
    console.log("\n🛑 Received shutdown signal. Closing connections...");
    
    try {
        await app.close();
        console.log("✅ Server closed gracefully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during shutdown:", error);
        process.exit(1);
    }
};

const start = async () => {

    const app = await buildApp();

    // =====================================================
    // RESERVATION CLEANUP WORKER
    // =====================================================
    //
    // Runs every 5 minutes
    //
    // Releases products where payment time expired
    //
    // RESERVED → ACTIVE
    //
    // =====================================================

    let cleanupInterval: NodeJS.Timeout;

    cleanupInterval = setInterval(
        async () => {
            try {
                const result = await releaseExpiredReservations();

                if (result.releasedListings > 0) {
                    console.log(
                        "✅ Expired reservations released:",
                        result
                    );
                }
            } catch (error) {
                console.error(
                    "❌ Reservation cleanup failed:",
                    error
                );
            }
        },
        5 * 60 * 1000
    );

    // =====================================================
    // START SERVER
    // =====================================================

    try {
        const port = Number(process.env.PORT) || 5000;
        const host = process.env.HOST || "0.0.0.0";

        await app.listen({
            port,
            host
        });

        console.log(`\n🚀 Obaaratech Community API running on port ${port}`);
        console.log(`📡 Health check: http://localhost:${port}/health`);
        console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);

    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }

    // =====================================================
    // GRACEFUL SHUTDOWN
    // =====================================================

    process.on('SIGTERM', () => gracefulShutdown(app));
    process.on('SIGINT', () => gracefulShutdown(app));

    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', error);
        gracefulShutdown(app);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    });

};

start();