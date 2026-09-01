import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";

const TOKEN_EXPIRY = process.env.JWT_EXPIRATION || '36500d';

export async function registerUser(
    app: FastifyInstance,
    data: {
        name: string;
        email: string;
        phone?: string;
        password: string;
    }
) {
    // ... existing validation code ...

    const token = app.jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        {
            expiresIn: TOKEN_EXPIRY // 100 years
        }
    );

    return {
        message: "Registration successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            verifiedSeller: user.verifiedSeller,
            role: user.role
        },
        token,
        expiresIn: '100 years'
    };
}

export async function loginUser(
    app: FastifyInstance,
    email: string,
    password: string
) {
    // ... existing validation code ...

    const token = app.jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        {
            expiresIn: TOKEN_EXPIRY // 100 years
        }
    );

    return {
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            verifiedSeller: user.verifiedSeller,
            role: user.role
        },
        token,
        expiresIn: '100 years'
    };
}