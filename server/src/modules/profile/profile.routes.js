import { authenticate } from "../../plugins/auth.js";
export default async function profileRoutes(app) {
    app.get("/", {
        preHandler: authenticate
    }, async (request) => {
        return {
            message: "Profile route protected successfully",
            user: request.user
        };
    });
}
