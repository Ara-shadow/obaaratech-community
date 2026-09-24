import { uploadImageController, deleteImageController } from "./upload.controller.js";
export default async function uploadRoutes(app) {
    app.post("/listing/:listingId", {
        preHandler: [
            app.authenticate
        ]
    }, uploadImageController);
    app.delete("/image/:imageId", {
        preHandler: [
            app.authenticate
        ]
    }, deleteImageController);
}
