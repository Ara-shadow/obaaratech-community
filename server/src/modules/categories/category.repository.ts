import { prisma } from "../../lib/prisma.js";


// =====================================================
// CATEGORY INPUT
// =====================================================

export type CreateCategoryData = {

  name: string;

  slug: string;

  icon?: string;

  image?: string;

  description?: string;

  parentId?: string;

  sortOrder?: number;

  isActive?: boolean;

};


// =====================================================
// CREATE CATEGORY
// =====================================================

export async function createCategory(
  data: CreateCategoryData
) {

  return prisma.category.create({

    data: {

      name: data.name,

      slug: data.slug,

      icon: data.icon,

      image: data.image,

      description: data.description,

      parentId: data.parentId,

      sortOrder: data.sortOrder ?? 0,

      isActive: data.isActive ?? true

    }

  });

}


export async function updateCategoryById(
  id: string,
  data: Partial<CreateCategoryData>
) {

  return prisma.category.update({

    where: {

      id

    },

    data: {

      name: data.name,

      slug: data.slug,

      icon: data.icon,

      image: data.image,

      description: data.description,

      parentId: data.parentId,

      sortOrder: data.sortOrder,

      isActive: data.isActive

    }

  });

}


export async function deleteCategoryById(
  id: string
) {

  return prisma.category.delete({

    where: {

      id

    }

  });

}


// =====================================================
// GET ALL CATEGORIES
// =====================================================

export async function getCategories() {

  return prisma.category.findMany({

    orderBy: {

      createdAt: "desc"

    }

  });

}


// =====================================================
// GET CATEGORY BY ID
// =====================================================

export async function getCategoryById(
  id: string
) {

  return prisma.category.findUnique({

    where: {

      id

    },

    include: {

      children: true,

      parent: true,

      listings: true

    }

  });

}


// =====================================================
// GET CATEGORY BY SLUG
// =====================================================

export async function getCategoryBySlug(
  slug: string
) {

  return prisma.category.findUnique({

    where: {

      slug

    },

    include: {

      children: {
        orderBy: {
          name: "asc"
        }
      },

      parent: true,

      listings: {
        take: 10,
        orderBy: {
          createdAt: "desc"
        }
      }

    }

  });

}


// =====================================================
// GET CATEGORY CHILDREN
// =====================================================

export async function getCategoryChildren(
  parentId: string
) {

  return prisma.category.findMany({

    where: {

      parentId

    },

    orderBy: {

      name: "asc"

    },

    include: {

      children: {
        orderBy: {
          name: "asc"
        }
      }

    }

  });

}


// =====================================================
// SEARCH CATEGORIES
// =====================================================

export async function searchCategories(
  query: string
) {

  if (!query || query.trim().length === 0) {

    return [];

  }

  return prisma.category.findMany({

    where: {

      OR: [

        {

          name: {

            contains: query,

            mode: "insensitive"

          }

        },

        {

          slug: {

            contains: query.toLowerCase(),

            mode: "insensitive"

          }

        }

      ]

    },

    take: 20,

    orderBy: {

      name: "asc"

    }

  });

}


// =====================================================
// GET CATEGORY TREE
// =====================================================

export async function getCategoryTree() {

  const categories =
    await prisma.category.findMany({

      orderBy: {

        name: "asc"

      }

    });


  const buildTree = (
    parentId: string | null
  ): any[] => {

    return categories

      .filter(
        category =>
          category.parentId === parentId
      )

      .map(category => ({

        ...category,

        children:
          buildTree(category.id)

      }));

  };


  return buildTree(null);

}