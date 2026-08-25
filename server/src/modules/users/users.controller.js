import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
// =====================================================
// GET CURRENT USER PROFILE
// =====================================================
export async function me(request, reply) {
    const authUser = request.user;
    const user = await prisma.user.findUnique({
        where: {
            id: authUser.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            whatsapp: true,
            avatar: true,
            role: true,
            verifiedSeller: true,
            createdAt: true,
            profile: {
                select: {
                    id: true,
                    bio: true,
                    avatar: true,
                    location: true,
                    website: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    });
    if (!user) {
        return reply.code(404).send({
            success: false,
            message: "User not found"
        });
    }
    return reply.send({
        success: true,
        user
    });
}
// =====================================================
// UPDATE CURRENT USER PROFILE
// =====================================================
export async function updateMe(request, reply) {
    const authUser = request.user;
    const body = request.body;
    // =================================================
    // VALIDATION
    // =================================================
    if (body.name !== undefined &&
        typeof body.name !== "string") {
        return reply.code(400).send({
            success: false,
            message: "Name must be a string"
        });
    }
    if (body.phone !== undefined &&
        typeof body.phone !== "string") {
        return reply.code(400).send({
            success: false,
            message: "Phone must be a string"
        });
    }
    if (body.whatsapp !== undefined &&
        typeof body.whatsapp !== "string") {
        return reply.code(400).send({
            success: false,
            message: "WhatsApp number must be a string"
        });
    }
    if (body.avatar !== undefined &&
        typeof body.avatar !== "string") {
        return reply.code(400).send({
            success: false,
            message: "Avatar must be a string"
        });
    }
    if (body.bio !== undefined &&
        typeof body.bio !== "string") {
        return reply.code(400).send({
            success: false,
            message: "Bio must be a string"
        });
    }
    if (body.location !== undefined &&
        typeof body.location !== "string") {
        return reply.code(400).send({
            success: false,
            message: "Location must be a string"
        });
    }
    if (body.website !== undefined &&
        typeof body.website !== "string") {
        return reply.code(400).send({
            success: false,
            message: "Website must be a string"
        });
    }
    // =================================================
    // PREPARE USER UPDATE
    // =================================================
    const userData = {};
    if (body.name !== undefined) {
        const name = body.name.trim();
        if (name.length < 2) {
            return reply.code(400).send({
                success: false,
                message: "Name must contain at least 2 characters"
            });
        }
        userData.name =
            name;
    }
    if (body.phone !== undefined) {
        userData.phone =
            body.phone.trim() || null;
    }
    if (body.whatsapp !== undefined) {
        userData.whatsapp =
            body.whatsapp.trim() || null;
    }
    if (body.avatar !== undefined) {
        userData.avatar =
            body.avatar.trim() || null;
    }
    // =================================================
    // PREPARE PROFILE UPDATE
    // =================================================
    const profileData = {};
    if (body.bio !== undefined) {
        profileData.bio =
            body.bio.trim() || null;
    }
    if (body.location !== undefined) {
        profileData.location =
            body.location.trim() || null;
    }
    if (body.website !== undefined) {
        profileData.website =
            body.website.trim() || null;
    }
    // =================================================
    // UPDATE USER + PROFILE
    // =================================================
    try {
        const user = await prisma.user.update({
            where: {
                id: authUser.id
            },
            data: {
                ...userData,
                profile: {
                    upsert: {
                        create: {
                            ...profileData
                        },
                        update: {
                            ...profileData
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                whatsapp: true,
                avatar: true,
                role: true,
                verifiedSeller: true,
                createdAt: true,
                profile: {
                    select: {
                        id: true,
                        bio: true,
                        avatar: true,
                        location: true,
                        website: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        });
        return reply.send({
            success: true,
            message: "Profile updated successfully",
            user
        });
    }
    catch (error) {
        request.log.error(error, "Unable to update user profile");
        return reply.code(500).send({
            success: false,
            message: "Unable to update profile"
        });
    }
}
// =====================================================
// CHANGE PASSWORD
// =====================================================
export async function changePassword(request, reply) {
    const authUser = request.user;
    const body = request.body;
    // =================================================
    // VALIDATION
    // =================================================
    if (typeof body.currentPassword !== "string" ||
        typeof body.newPassword !== "string") {
        return reply.code(400).send({
            success: false,
            message: "Current password and new password are required"
        });
    }
    if (body.newPassword.length < 8) {
        return reply.code(400).send({
            success: false,
            message: "New password must contain at least 8 characters"
        });
    }
    // =================================================
    // GET USER PASSWORD
    // =================================================
    const user = await prisma.user.findUnique({
        where: {
            id: authUser.id
        },
        select: {
            id: true,
            password: true
        }
    });
    if (!user) {
        return reply.code(404).send({
            success: false,
            message: "User not found"
        });
    }
    // =================================================
    // VERIFY CURRENT PASSWORD
    // =================================================
    const passwordMatches = await bcrypt.compare(body.currentPassword, user.password);
    if (!passwordMatches) {
        return reply.code(400).send({
            success: false,
            message: "Current password is incorrect"
        });
    }
    // =================================================
    // HASH NEW PASSWORD
    // =================================================
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    // =================================================
    // UPDATE PASSWORD
    // =================================================
    await prisma.user.update({
        where: {
            id: authUser.id
        },
        data: {
            password: hashedPassword
        }
    });
    return reply.send({
        success: true,
        message: "Password changed successfully"
    });
}
