import { prisma } from "../../lib/prisma.js";
// =====================================================
// CREATE CATEGORY
// =====================================================
export async function createCategory(data) {
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
export async function getCategoryById(id) {
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
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc"
        }
    });
    const buildTree = (parentId) => {
        return categories
            .filter(category => category.parentId === parentId)
            .map(category => ({
            ...category,
            children: buildTree(category.id)
        }));
    };
    return buildTree(null);
}
