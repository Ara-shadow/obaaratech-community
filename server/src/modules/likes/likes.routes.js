import { like, unlike, allLikes } from "./likes.controller.js";
import { authenticate } from "../../middleware/auth.js";
export default async function likesRoutes(app) {
    // Like a post
    app.post("/posts/:postId/like", {
        preHandler: authenticate
    }, like);
    // Unlike a post
    app.delete("/posts/:postId/like", {
        preHandler: authenticate
    }, unlike);
    // Get post likes
    app.get("/posts/:postId/likes", allLikes);
}
