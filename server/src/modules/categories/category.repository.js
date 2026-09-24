import { prisma } from "../../database/prisma.js";
// CREATE CATEGORY
export async function createCategory(name, parentId) {
    return prisma.category.create({
        data: {
            name,
            parentId
        }
    });
}
// GET ALL CATEGORIES
export async function getCategories() {
    return prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
}
// GET CATEGORY BY ID
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
// GET JUMIA STYLE CATEGORY TREE
export async function getCategoryTree() {
    return prisma.category.findMany({
        where: {
            parentId: null
        },
        include: {
            children: {
                include: {
                    children: true
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    });
}
