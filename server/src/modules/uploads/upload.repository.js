import { prisma } from "../../database/prisma.js";
export async function findImageById(imageId) {
    return prisma.image.findUnique({
        where: {
            id: imageId
        },
        include: {
            listing: true
        }
    });
}
export async function deleteImage(imageId) {
    return prisma.image.delete({
        where: {
            id: imageId
        }
    });
}
