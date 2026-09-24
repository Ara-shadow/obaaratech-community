import { prisma } from "../../database/prisma.js";
export async function createConversation(data) {
    return prisma.conversation.create({
        data: {
            buyerId: data.buyerId,
            sellerId: data.sellerId,
            listingId: data.listingId,
        },
    });
}
export async function findConversation(id) {
    return prisma.conversation.findUnique({
        where: {
            id,
        },
        include: {
            messages: true,
        },
    });
}
export async function getUserConversations(userId) {
    return prisma.conversation.findMany({
        where: {
            OR: [
                {
                    buyerId: userId,
                },
                {
                    sellerId: userId,
                },
            ],
        },
        include: {
            listing: true,
            buyer: {
                select: {
                    id: true,
                    name: true,
                },
            },
            seller: {
                select: {
                    id: true,
                    name: true,
                },
            },
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
}
export async function createMessage(data) {
    return prisma.message.create({
        data: {
            conversationId: data.conversationId,
            senderId: data.senderId,
            content: data.content,
        },
    });
}
