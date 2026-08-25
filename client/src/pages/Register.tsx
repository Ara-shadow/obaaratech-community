import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    Phone,
    ShoppingBag,
    User,
    UserPlus,
    X
} from "lucide-react";

import {
    useAuth
} from "../context/AuthContext";


export default function Register() {

    const navigate =
        useNavigate();


    const {
        register
    } = useAuth();


    // =====================================================
    // FORM STATE
    // =====================================================

    const [
        name,
        setName
    ] = useState("");


    const [
        email,
        setEmail
    ] = useState("");


    const [
        phone,
        setPhone
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        confirmPassword,
        setConfirmPassword
    ] = useState("");


    const [
        showPassword,
        setShowPassword
    ] = useState(false);


    const [
        showConfirmPassword,
        setShowConfirmPassword
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
    // SUBMIT
    // =====================================================

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError("");


        const cleanName =
            name.trim();


        const cleanEmail =
            email.trim();


        const cleanPhone =
            phone.trim();


        // =================================================
        // VALIDATION
        // =================================================

        if (
            cleanName.length < 3
        ) {

            setError(
                "Name must be at least 3 characters."
            );

            return;

        }


        if (
            !cleanEmail
        ) {

            setError(
                "Please enter your email address."
            );

            return;

        }


        if (
            cleanPhone &&
            cleanPhone.length < 11
        ) {

            setError(
                "Please enter a valid phone number."
            );

            return;

        }


        if (
            password.length < 6
        ) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (
            password !==
            confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        // =================================================
        // CREATE ACCOUNT
        // =================================================

        try {

            setSubmitting(true);


            await register({

                name:
                    cleanName,

                email:
                    cleanEmail,

                password,

                ...(cleanPhone
                    ? {
                        phone:
                            cleanPhone
                    }
                    : {})

            });


            navigate(
                "/",
                {
                    replace: true
                }
            );


        } catch (requestError: any) {

            console.error(
                "Registration error:",
                requestError
            );


            const message =
                requestError?.response?.data?.message ||
                "Unable to create your account. Please try again.";


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
                            Create your account
                        </h1>


                        <p>
                            Join Obaaratech and start
                            buying, selling and connecting.
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


                        {/* NAME */}

                        <div className="auth-field">

                            <label
                                htmlFor="register-name"
                            >

                                Full name

                            </label>


                            <div className="auth-input-wrapper">

                                <User
                                    size={18}
                                />


                                <input
                                    id="register-name"
                                    type="text"
                                    value={name}
                                    onChange={(
                                        event
                                    ) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Your full name"
                                    autoComplete="name"
                                    disabled={
                                        submitting
                                    }
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="auth-field">

                            <label
                                htmlFor="register-email"
                            >

                                Email address

                            </label>


                            <div className="auth-input-wrapper">

                                <Mail
                                    size={18}
                                />


                                <input
                                    id="register-email"
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


                        {/* PHONE */}

                        <div className="auth-field">

                            <label
                                htmlFor="register-phone"
                            >

                                Phone number

                                <span className="optional-label">
                                    Optional
                                </span>

                            </label>


                            <div className="auth-input-wrapper">

                                <Phone
                                    size={18}
                                />


                                <input
                                    id="register-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(
                                        event
                                    ) =>
                                        setPhone(
                                            event.target.value
                                        )
                                    }
                                    placeholder="08012345678"
                                    autoComplete="tel"
                                    disabled={
                                        submitting
                                    }
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="auth-field">

                            <label
                                htmlFor="register-password"
                            >

                                Password

                            </label>


                            <div className="auth-input-wrapper">

                                <LockKeyhole
                                    size={18}
                                />


                                <input
                                    id="register-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(
                                        event
                                    ) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="At least 6 characters"
                                    autoComplete="new-password"
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


                        {/* CONFIRM PASSWORD */}

                        <div className="auth-field">

                            <label
                                htmlFor="register-confirm-password"
                            >

                                Confirm password

                            </label>


                            <div className="auth-input-wrapper">

                                <LockKeyhole
                                    size={18}
                                />


                                <input
                                    id="register-confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        confirmPassword
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setConfirmPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    disabled={
                                        submitting
                                    }
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            current =>
                                                !current
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    {showConfirmPassword ? (

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

                                    Creating account...

                                </>

                            ) : (

                                <>

                                    <UserPlus
                                        size={19}
                                    />

                                    Create Account

                                </>

                            )}

                        </button>

                    </form>


                    {/* LOGIN */}

                    <div className="auth-footer">

                        <span>
                            Already have an account?
                        </span>


                        <Link
                            to="/login"
                        >

                            <LockKeyhole
                                size={17}
                            />

                            Sign in

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