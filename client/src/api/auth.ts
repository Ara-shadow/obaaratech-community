import api from "./axios";


// =====================================================
// TYPES
// =====================================================

export interface AuthUser {

    id: string;

    name: string;

    email: string;

    role: string;

}


export interface RegisterData {

    name: string;

    email: string;

    password: string;

    phone?: string;

}


export interface LoginData {

    email: string;

    password: string;

}


export interface AuthResponse {

    success: boolean;

    token: string;

    user: AuthUser;

}


// =====================================================
// REGISTER
// =====================================================

export async function registerUser(
    data: RegisterData
): Promise<AuthResponse> {

    const response =
        await api.post<AuthResponse>(
            "/auth/register",
            data
        );


    return response.data;

}


// =====================================================
// LOGIN
// =====================================================

export async function loginUser(
    data: LoginData
): Promise<AuthResponse> {

    const response =
        await api.post<AuthResponse>(
            "/auth/login",
            data
        );


    return response.data;

}