import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryTree
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
// GET CATEGORY TREE
// =====================================================

export async function fetchCategoryTree() {

  return getCategoryTree();

}