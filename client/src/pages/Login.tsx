import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    ShoppingBag,
    UserPlus,
    X
} from "lucide-react";

import {
    useAuth
} from "../context/AuthContext";


export default function Login() {

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const {
        login
    } = useAuth();


    // =====================================================
    // FORM STATE
    // =====================================================

    const [
        email,
        setEmail
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        showPassword,
        setShowPassword
    ] = useState(false);


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // LOGIN
    // =====================================================

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError("");


        const cleanEmail =
            email.trim();


        if (!cleanEmail) {

            setError(
                "Please enter your email address."
            );

            return;

        }


        if (!password) {

            setError(
                "Please enter your password."
            );

            return;

        }


        try {

            setSubmitting(true);


            await login({

                email:
                    cleanEmail,

                password

            });


            /*
             * If the user was redirected to login
             * from another page, return them there.
             */

            const state =
                location.state as {
                    from?: string;
                } | null;


            navigate(
                state?.from || "/",
                {
                    replace: true
                }
            );


        } catch (requestError: any) {

            console.error(
                "Login error:",
                requestError
            );


            const message =
                requestError?.response?.data?.message ||
                "Unable to sign in. Please check your email and password.";


            setError(
                message
            );

        } finally {

            setSubmitting(false);

        }

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="auth-page">

            <div className="auth-container">


                {/* BRAND */}

                <div className="auth-brand">

                    <div className="auth-brand-icon">

                        <ShoppingBag
                            size={27}
                        />

                    </div>


                    <div>

                        <strong>
                            Obaaratech
                        </strong>

                        <span>
                            Community Marketplace
                        </span>

                    </div>

                </div>


                {/* CARD */}

                <section className="auth-card">


                    {/* HEADING */}

                    <div className="auth-heading">

                        <h1>
                            Welcome back
                        </h1>


                        <p>
                            Sign in to continue to your
                            Obaaratech marketplace account.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div
                            className="auth-message auth-message-error"
                            role="alert"
                        >

                            <X
                                size={18}
                            />


                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        className="auth-form"
                        onSubmit={
                            handleSubmit
                        }
                    >


                        {/* EMAIL */}

                        <div className="auth-field">

                            <label
                                htmlFor="login-email"
                            >

                                Email address

                            </label>


                            <div className="auth-input-wrapper">

                                <Mail
                                    size={18}
                                />


                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(
                                        event
                                    ) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={
                                        submitting
                                    }
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="auth-field">

                            <label
                                htmlFor="login-password"
                            >

                                Password

                            </label>


                            <div className="auth-input-wrapper">

                                <LockKeyhole
                                    size={18}
                                />


                                <input
                                    id="login-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        password
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={
                                        submitting
                                    }
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            current =>
                                                !current
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    {showPassword ? (

                                        <EyeOff
                                            size={18}
                                        />

                                    ) : (

                                        <Eye
                                            size={18}
                                        />

                                    )}

                                </button>

                            </div>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={
                                submitting
                            }
                        >

                            {submitting ? (

                                <>

                                    <Loader2
                                        size={19}
                                        className="spinning"
                                    />

                                    Signing in...

                                </>

                            ) : (

                                <>

                                    <LockKeyhole
                                        size={19}
                                    />

                                    Sign In

                                </>

                            )}

                        </button>


                    </form>


                    {/* REGISTER */}

                    <div className="auth-footer">

                        <span>
                            Don't have an account?
                        </span>


                        <Link
                            to="/register"
                        >

                            <UserPlus
                                size={17}
                            />

                            Create account

                        </Link>

                    </div>

                </section>


                {/* BACK */}

                <Link
                    to="/"
                    className="auth-back-link"
                >

                    ← Back to marketplace

                </Link>

            </div>

        </main>

    );

}