import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import type {
    ReactNode
} from "react";

import {
    loginUser,
    registerUser
} from "../api/auth";

import type {
    AuthUser,
    LoginData,
    RegisterData
} from "../api/auth";


// =====================================================
// AUTH CONTEXT TYPE
// =====================================================

interface AuthContextType {

    user: AuthUser | null;

    token: string | null;

    isAuthenticated: boolean;

    loading: boolean;

    login: (
        data: LoginData
    ) => Promise<AuthUser>;

    register: (
        data: RegisterData
    ) => Promise<AuthUser>;

    logout: () => void;

}


// =====================================================
// CONTEXT
// =====================================================

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );


// =====================================================
// PROVIDER
// =====================================================

export function AuthProvider({
    children
}: {
    children: ReactNode;
}) {

    const [
        user,
        setUser
    ] = useState<AuthUser | null>(
        null
    );


    const [
        token,
        setToken
    ] = useState<string | null>(
        null
    );


    const [
        loading,
        setLoading
    ] = useState(true);


    // =================================================
    // RESTORE AUTHENTICATION
    // =================================================

    useEffect(() => {

        const savedToken =
            localStorage.getItem(
                "token"
            );


        const savedUser =
            localStorage.getItem(
                "user"
            );


        if (
            savedToken &&
            savedUser
        ) {

            try {

                const parsedUser =
                    JSON.parse(
                        savedUser
                    ) as AuthUser;


                setToken(
                    savedToken
                );


                setUser(
                    parsedUser
                );

            } catch {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

            }

        }


        setLoading(false);

    }, []);


    // =================================================
    // LOGIN
    // =================================================

    async function login(
        data: LoginData
    ): Promise<AuthUser> {

        const response =
            await loginUser(
                data
            );


        localStorage.setItem(
            "token",
            response.token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(
                response.user
            )
        );


        setToken(
            response.token
        );


        setUser(
            response.user
        );


        return response.user;

    }


    // =================================================
    // REGISTER
    // =================================================

    async function register(
        data: RegisterData
    ): Promise<AuthUser> {

        const response =
            await registerUser(
                data
            );


        localStorage.setItem(
            "token",
            response.token
        );


        localStorage.setItem(
            "user",
            JSON.stringify(
                response.user
            )
        );


        setToken(
            response.token
        );


        setUser(
            response.user
        );


        return response.user;

    }


    // =================================================
    // LOGOUT
    // =================================================

    function logout() {

        localStorage.removeItem(
            "token"
        );


        localStorage.removeItem(
            "user"
        );


        setToken(
            null
        );


        setUser(
            null
        );

    }


    // =================================================
    // PROVIDER
    // =================================================

    return (

        <AuthContext.Provider
            value={{

                user,

                token,

                isAuthenticated:
                    Boolean(token),

                loading,

                login,

                register,

                logout

            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


// =====================================================
// HOOK
// =====================================================

export function useAuth() {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

}