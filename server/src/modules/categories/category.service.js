import { createCategory, getCategories, getCategoryById, getCategoryTree } from "./category.repository.js";
// =====================================================
// CREATE CATEGORY
// =====================================================
export async function createNewCategory(data) {
    return createCategory(data);
}
// =====================================================
// GET ALL CATEGORIES
// =====================================================
export async function fetchCategories() {
    return getCategories();
}
// =====================================================
// GET CATEGORY BY ID
// =====================================================
export async function fetchCategoryById(id) {
    return getCategoryById(id);
}
// =====================================================
// GET CATEGORY TREE
// =====================================================
export async function fetchCategoryTree() {
    return getCategoryTree();
}
