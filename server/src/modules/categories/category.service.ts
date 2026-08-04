import {
  createCategory,
  getCategories,
  getCategoryById,
} from "./category.repository.js";



export async function createNewCategory(
  name:string
){

  return createCategory(name);

}



export async function fetchCategories(){

  return getCategories();

}



export async function fetchCategoryById(
  id:string
){

  return getCategoryById(id);

}