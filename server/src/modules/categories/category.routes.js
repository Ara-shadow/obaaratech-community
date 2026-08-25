import { createCategoryController, getCategoriesController, getCategoryController, getCategoryTreeController } from "./category.controller.js";
export default async function categoryRoutes(app) {
    app.post("/", createCategoryController);
    app.get("/", getCategoriesController);
    app.get("/tree", getCategoryTreeController);
    app.get("/:id", getCategoryController);
}
