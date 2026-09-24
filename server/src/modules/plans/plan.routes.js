import { getPlansController, getMyPlanController } from "./plan.controller.js";
export default async function planRoutes(app) {
    app.get("/", getPlansController);
    app.get("/me", {
        preHandler: [
            app.authenticate
        ]
    }, getMyPlanController);
}
