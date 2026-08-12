import { z } from "zod";


export const registerSchema = z.object({

    name: z
        .string()
        .min(
            3,
            "Name must be at least 3 characters"
        ),


    email: z
        .string()
        .email(
            "Invalid email address"
        ),


    phone: z
        .string()
        .min(
            11,
            "Phone number must be at least 11 digits"
        )
        .optional(),


    password: z
        .string()
        .min(
            6,
            "Password must be at least 6 characters"
        )

});


export const loginSchema = z.object({

    email: z
        .string()
        .email(
            "Invalid email address"
        ),


    password: z
        .string()
        .min(
            6,
            "Password must be at least 6 characters"
        )

});


export type RegisterInput =
    z.infer<typeof registerSchema>;


export type LoginInput =
    z.infer<typeof loginSchema>;