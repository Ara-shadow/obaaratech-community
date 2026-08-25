import { prisma } from "../../lib/prisma.js";
// =================================
// GET PROFILE
// =================================
export function getProfile(userId) {
    return prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            role: true,
            createdAt: true
        }
    });
}
// =================================
// UPDATE PROFILE
// =================================
export function updateProfile(userId, data) {
    return prisma.user.update({
        where: {
            id: userId
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            role: true
        }
    });
}
