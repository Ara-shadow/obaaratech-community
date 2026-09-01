import { createCategory, getCategories, getCategoryById, getCategoryTree, getCategoryBySlug, getCategoryChildren, searchCategories, updateCategoryById, deleteCategoryById } from "./category.repository.js";
// =====================================================
// CREATE CATEGORY
// =====================================================
export async function createNewCategory(data) {
    return createCategory(data);
}
export async function updateExistingCategory(id, data) {
    return updateCategoryById(id, data);
}
export async function removeCategory(id) {
    return deleteCategoryById(id);
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
// GET CATEGORY BY SLUG
// =====================================================
export async function fetchCategoryBySlug(slug) {
    return getCategoryBySlug(slug);
}
// =====================================================
// GET CATEGORY CHILDREN
// =====================================================
export async function fetchCategoryChildren(parentId) {
    return getCategoryChildren(parentId);
}
// =====================================================
// SEARCH CATEGORIES
// =====================================================
export async function searchCategoriesByName(query) {
    return searchCategories(query);
}
// =====================================================
// GET CATEGORY TREE
// =====================================================
export async function fetchCategoryTree() {
    return getCategoryTree();
}
