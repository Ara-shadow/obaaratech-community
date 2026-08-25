import { me, updateMe, changePassword } from "./users.controller.js";
export default async function usersRoutes(app) {
    // =================================================
    // GET CURRENT USER
    // =================================================
    app.get("/me", {
        preHandler: [
            app.authenticate
        ]
    }, me);
    // =================================================
    // UPDATE CURRENT USER PROFILE
    // =================================================
    app.patch("/me", {
        preHandler: [
            app.authenticate
        ]
    }, updateMe);
    // =================================================
    // CHANGE PASSWORD
    // =================================================
    app.patch("/me/password", {
        preHandler: [
            app.authenticate
        ]
    }, changePassword);
}
