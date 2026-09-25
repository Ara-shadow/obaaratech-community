import { profile, editProfile } from "./profile.controller.js";
import { authenticate } from "../../plugins/auth.js";
export default async function profileRoutes(app) {
    app.get("/", {
        preHandler: authenticate
    }, profile);
    app.patch("/", {
        preHandler: authenticate
    }, editProfile);
}
