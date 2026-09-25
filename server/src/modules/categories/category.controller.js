import { createNewCategory, fetchCategories, fetchCategoryById, fetchCategoryBySlug, fetchCategoryChildren, searchCategoriesByName, fetchCategoryTree, updateExistingCategory, removeCategory } from "./category.service.js";
// =====================================================
// CREATE CATEGORY
// =====================================================
export async function createCategoryController(request, reply) {
    const body = request.body;
    const category = await createNewCategory({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        icon: body.icon,
        image: body.image,
        description: body.description,
        parentId: body.parentId,
        sortOrder: body.sortOrder,
    });
    return reply.code(201).send({
        success: true,
        category
    });
}
export async function updateCategoryController(request, reply) {
    const { id } = request.params;
    const body = request.body;
    const category = await updateExistingCategory(id, body);
    return reply.send({
        success: true,
        category
    });
}
export async function deleteCategoryController(request, reply) {
    const { id } = request.params;
    const category = await removeCategory(id);
    return reply.send({
        success: true,
        category,
        message: "Category deleted successfully"
    });
}
// =====================================================
// GET ALL CATEGORIES
// =====================================================
export async function getCategoriesController(request, reply) {
    const categories = await fetchCategories();
    return reply.send({
        success: true,
        categories
    });
}
// =====================================================
// GET CATEGORY TREE
// =====================================================
export async function getCategoryTreeController(request, reply) {
    const categories = await fetchCategoryTree();
    return reply.send({
        success: true,
        categories
    });
}
// =====================================================
// GET SINGLE CATEGORY
// =====================================================
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
// =====================================================
// GET CATEGORY BY SLUG
// =====================================================
export async function getCategoryBySlugController(request, reply) {
    const { slug } = request.params;
    if (!slug || !slug.trim()) {
        return reply.code(400).send({
            success: false,
            message: "Category slug is required"
        });
    }
    const category = await fetchCategoryBySlug(slug);
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
// =====================================================
// GET CATEGORY CHILDREN
// =====================================================
export async function getCategoryChildrenController(request, reply) {
    const { id } = request.params;
    if (!id || !id.trim()) {
        return reply.code(400).send({
            success: false,
            message: "Category ID is required"
        });
    }
    const children = await fetchCategoryChildren(id);
    return reply.send({
        success: true,
        children
    });
}
// =====================================================
// SEARCH CATEGORIES
// =====================================================
export async function searchCategoriesController(request, reply) {
    const { q } = request.query;
    if (!q || !q.trim()) {
        return reply.send({
            success: true,
            results: []
        });
    }
    const results = await searchCategoriesByName(q);
    return reply.send({
        success: true,
        results
    });
}
