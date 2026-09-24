import { create, allComments, remove } from "./comments.controller.js";
import { authenticate } from "../../middleware/auth.js";
export default async function commentsRoutes(app) {
    // Add comment to post
    app.post("/posts/:postId/comments", {
        preHandler: authenticate
    }, create);
    // Get post comments
    app.get("/posts/:postId/comments", allComments);
    // Delete comment
    app.delete("/comments/:id", {
        preHandler: authenticate
    }, remove);
}
