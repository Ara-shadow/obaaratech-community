import type {
  FastifyReply,
  FastifyRequest
} from "fastify";

import {
  createNewCategory,
  fetchCategories,
  fetchCategoryById,
  fetchCategoryBySlug,
  fetchCategoryChildren,
  searchCategoriesByName,
  fetchCategoryTree,
  updateExistingCategory,
  removeCategory
} from "./category.service.js";


// =====================================================
// CREATE CATEGORY
// =====================================================

export async function createCategoryController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const body = request.body as {
    name: string;
    slug?: string;
    icon?: string;
    image?: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
    isActive?: boolean;
  };

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


export async function updateCategoryController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { id } = request.params as { id: string };
  const body = request.body as {
    name?: string;
    slug?: string;
    icon?: string;
    image?: string;
    description?: string;
    parentId?: string;
    sortOrder?: number;
    isActive?: boolean;
  };

  const category = await updateExistingCategory(id, body);

  return reply.send({
    success: true,
    category
  });

}


export async function deleteCategoryController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { id } = request.params as { id: string };
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

export async function getCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const categories =
    await fetchCategories();


  return reply.send({

    success: true,

    categories

  });

}


// =====================================================
// GET CATEGORY TREE
// =====================================================

export async function getCategoryTreeController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const categories =
    await fetchCategoryTree();


  return reply.send({

    success: true,

    categories

  });

}


// =====================================================
// GET SINGLE CATEGORY
// =====================================================

export async function getCategoryController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { id } =
    request.params as {
      id: string;
    };


  const category =
    await fetchCategoryById(id);


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

export async function getCategoryBySlugController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { slug } =
    request.params as {
      slug: string;
    };


  if (!slug || !slug.trim()) {

    return reply.code(400).send({

      success: false,

      message: "Category slug is required"

    });

  }


  const category =
    await fetchCategoryBySlug(slug);


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

export async function getCategoryChildrenController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { id } =
    request.params as {
      id: string;
    };


  if (!id || !id.trim()) {

    return reply.code(400).send({

      success: false,

      message: "Category ID is required"

    });

  }


  const children =
    await fetchCategoryChildren(id);


  return reply.send({

    success: true,

    children

  });

}


// =====================================================
// SEARCH CATEGORIES
// =====================================================

export async function searchCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply
) {

  const { q } =
    request.query as {
      q?: string;
    };


  if (!q || !q.trim()) {

    return reply.send({

      success: true,

      results: []

    });

  }


  const results =
    await searchCategoriesByName(q);


  return reply.send({

    success: true,

    results

  });

}