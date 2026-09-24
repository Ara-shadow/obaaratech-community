import { createNewCategory, fetchCategories, fetchCategoryById, fetchCategoryTree } from "./category.service.js";
// CREATE CATEGORY
export async function createCategoryController(request, reply) {
    const body = request.body;
    const category = await createNewCategory(body.name);
    return reply.code(201).send({
        success: true,
        category
    });
}
// GET ALL CATEGORIES
export async function getCategoriesController(request, reply) {
    const categories = await fetchCategories();
    return reply.send({
        success: true,
        categories
    });
}
// GET CATEGORY TREE
export async function getCategoryTreeController(request, reply) {
    const categories = await fetchCategoryTree();
    return reply.send({
        success: true,
        categories
    });
}
// GET SINGLE CATEGORY
export async function getCategoryController(request, reply) {
    const { id } = request.params;
    const category = await fetchCategoryById(id);
    if (!category) {
        return reply.code(404).send({
            success: false,
            message: "Category not found"
        });
    }
    return reply.send({
        success: true,
        category
    });
}
