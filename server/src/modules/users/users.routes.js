import { me } from "./users.controller.js";
export default async function usersRoutes(app) {
    app.get("/me", {
        preHandler: [
            app.authenticate
        ]
    }, me);
}
