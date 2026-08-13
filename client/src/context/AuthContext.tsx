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
    registerUser,
    getCurrentUser
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

        let mounted = true;


        async function restoreAuthentication() {

            const savedToken =
                localStorage.getItem(
                    "token"
                );


            if (!savedToken) {

                if (mounted) {

                    setLoading(false);

                }

                return;

            }


            try {

                // -----------------------------------------
                // Restore token immediately
                // -----------------------------------------

                if (mounted) {

                    setToken(
                        savedToken
                    );

                }


                // -----------------------------------------
                // Get fresh user from database
                // -----------------------------------------

                const currentUser =
                    await getCurrentUser();


                if (!mounted) {

                    return;

                }


                setUser(
                    currentUser
                );


                // -----------------------------------------
                // Keep localStorage synchronized
                // -----------------------------------------

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        currentUser
                    )
                );


            } catch (error) {

                console.error(
                    "Authentication restore failed:",
                    error
                );


                // -----------------------------------------
                // Token is invalid or expired
                // -----------------------------------------

                localStorage.removeItem(
                    "token"
                );


                localStorage.removeItem(
                    "user"
                );


                if (mounted) {

                    setToken(
                        null
                    );

                    setUser(
                        null
                    );

                }

            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        }


        restoreAuthentication();


        return () => {

            mounted = false;

        };

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


        // ---------------------------------------------
        // Save token
        // ---------------------------------------------

        localStorage.setItem(
            "token",
            response.token
        );


        // ---------------------------------------------
        // Save user
        // ---------------------------------------------

        localStorage.setItem(
            "user",
            JSON.stringify(
                response.user
            )
        );


        // ---------------------------------------------
        // Update React state
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Save token
        // ---------------------------------------------

        localStorage.setItem(
            "token",
            response.token
        );


        // ---------------------------------------------
        // Save user
        // ---------------------------------------------

        localStorage.setItem(
            "user",
            JSON.stringify(
                response.user
            )
        );


        // ---------------------------------------------
        // Update React state
        // ---------------------------------------------

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