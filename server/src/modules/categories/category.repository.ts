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

      sortOrder: data.sortOrder

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