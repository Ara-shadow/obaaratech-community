import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryTree,
  getCategoryBySlug,
  getCategoryChildren,
  searchCategories,
  updateCategoryById,
  deleteCategoryById
} from "./category.repository.js";


// =====================================================
// CATEGORY INPUT
// =====================================================

export type CreateCategoryInput = {

  name: string;

 slug: string;

  icon?: string;

  image?: string;

  description?: string;

  parentId?: string;

  sortOrder?: number;

};


// =====================================================
// CREATE CATEGORY
// =====================================================

export async function createNewCategory(
  data: CreateCategoryInput
) {

  return createCategory(data);

}


export async function updateExistingCategory(
  id: string,
  data: Partial<CreateCategoryInput> & { isActive?: boolean }
) {

  return updateCategoryById(id, data);

}


export async function removeCategory(
  id: string
) {

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

export async function fetchCategoryById(
  id: string
) {

  return getCategoryById(id);

}


// =====================================================
// GET CATEGORY BY SLUG
// =====================================================

export async function fetchCategoryBySlug(
  slug: string
) {

  return getCategoryBySlug(slug);

}


// =====================================================
// GET CATEGORY CHILDREN
// =====================================================

export async function fetchCategoryChildren(
  parentId: string
) {

  return getCategoryChildren(parentId);

}


// =====================================================
// SEARCH CATEGORIES
// =====================================================

export async function searchCategoriesByName(
  query: string
) {

  return searchCategories(query);

}


// =====================================================
// GET CATEGORY TREE
// =====================================================

export async function fetchCategoryTree() {

  return getCategoryTree();

}