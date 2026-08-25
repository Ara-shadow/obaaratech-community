import "dotenv/config";
import { buildApp } from "./app.js";
import { releaseExpiredReservations } from "./modules/orders/reservation.service.js";
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
    setInterval(async () => {
        try {
            const result = await releaseExpiredReservations();
            if (result.releasedListings > 0) {
                console.log("Expired reservations released:", result);
            }
        }
        catch (error) {
            console.error("Reservation cleanup failed:", error);
        }
    }, 5 * 60 * 1000);
    try {
        await app.listen({
            port: Number(process.env.PORT) || 5000,
            host: "0.0.0.0"
        });
        console.log("🚀 Obaaratech Community API running on port 5000");
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};
start();
