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
    AlertCircle,
    CheckCircle2,
    LogIn,
    ShieldCheck
} from "lucide-react";

import {
    useAuth
} from "../context/AuthContext";


export default function Login() {

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // =====================================================
    // FORM STATE
    // =====================================================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // =====================================================
    // VALIDATION
    // =====================================================

    function validateForm(): boolean {

        const cleanEmail = email.trim();

        setError("");

        if (!cleanEmail) {
            setError("Please enter your email address.");
            return false;
        }

        if (!password) {
            setError("Please enter your password.");
            return false;
        }

        return true;

    }

    // =====================================================
    // LOGIN
    // =====================================================

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();

        if (!validateForm()) return;

        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            const cleanEmail = email.trim();

            await login({
                email: cleanEmail,
                password
            });

            setSuccessMessage("Welcome back! Redirecting...");

            // Get redirect path from location state
            const state = location.state as { from?: string } | null;
            const redirectPath = state?.from || "/";

            setTimeout(() => {
                navigate(redirectPath, { replace: true });
            }, 1000);

        } catch (requestError: any) {
            console.error("Login error:", requestError);

            const message =
                requestError?.response?.data?.message ||
                "Unable to sign in. Please check your email and password.";

            setError(message);

        } finally {
            setSubmitting(false);
        }

    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="auth-page-wrapper">

            <div className="auth-page-container">

                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="auth-brand">

                    <div className="auth-brand-icon">
                        <ShoppingBag size={24} />
                    </div>

                    <div>
                        <strong>Obaara<span>tech</span></strong>
                        <span>Community Marketplace</span>
                    </div>

                </div>

                {/* =================================================
                    CARD
                ================================================= */}

                <div className="auth-card">

                    {/* HEADING */}
                    <div className="auth-card-header">

                        <div className="auth-card-header-icon">
                            <LogIn size={24} />
                        </div>

                        <div>
                            <h1>Welcome back</h1>
                            <p>Sign in to continue to your Obaaratech account</p>
                        </div>

                    </div>

                    {/* MESSAGES */}
                    {error && (
                        <div className="auth-message error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="auth-message success">
                            <CheckCircle2 size={18} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* FORM */}
                    <form className="auth-form" onSubmit={handleSubmit}>

                        {/* EMAIL */}
                        <div className="auth-field">
                            <label htmlFor="login-email">
                                <Mail size={16} />
                                Email Address
                                <span className="required">*</span>
                            </label>
                            <div className="auth-input-wrapper">
                                <Mail size={18} className="auth-input-icon" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={submitting}
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="auth-field">
                            <label htmlFor="login-password">
                                <LockKeyhole size={16} />
                                Password
                                <span className="required">*</span>
                            </label>
                            <div className="auth-input-wrapper">
                                <LockKeyhole size={18} className="auth-input-icon" />
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={submitting}
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    disabled={submitting}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="spinning" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Sign In
                                </>
                            )}
                        </button>

                    </form>

                    {/* REGISTER LINK */}
                    <div className="auth-footer">

                        <span>Don't have an account?</span>

                        <Link to="/register">
                            <UserPlus size={16} />
                            Create account
                        </Link>

                    </div>

                </div>

                {/* =================================================
                    BACK LINK
                ================================================= */}

                <Link to="/" className="auth-back-link">
                    ← Back to marketplace
                </Link>

            </div>

        </div>

    );

}