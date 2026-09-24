import { createCategory, getCategories, getCategoryById, getCategoryTree } from "./category.repository.js";
export async function createNewCategory(name) {
    return createCategory(name);
}
export async function fetchCategories() {
    return getCategories();
}
export async function fetchCategoryById(id) {
    return getCategoryById(id);
}
export async function fetchCategoryTree() {
    return getCategoryTree();
}
