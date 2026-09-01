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
    X,
    CheckCircle2,
    AlertCircle,
    ShieldCheck
} from "lucide-react";

import {
    useAuth
} from "../context/AuthContext";


export default function Register() {

    const navigate = useNavigate();
    const { register } = useAuth();

    // =====================================================
    // FORM STATE
    // =====================================================

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // =====================================================
    // VALIDATION
    // =====================================================

    function validateForm(): boolean {

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanPhone = phone.trim();

        setError("");

        if (cleanName.length < 3) {
            setError("Name must be at least 3 characters.");
            return false;
        }

        if (!cleanEmail) {
            setError("Please enter your email address.");
            return false;
        }

        if (cleanPhone && cleanPhone.length < 11) {
            setError("Please enter a valid phone number.");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return false;
        }

        return true;

    }

    // =====================================================
    // SUBMIT
    // =====================================================

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();

        if (!validateForm()) return;

        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            const cleanName = name.trim();
            const cleanEmail = email.trim();
            const cleanPhone = phone.trim();

            await register({
                name: cleanName,
                email: cleanEmail,
                password,
                ...(cleanPhone ? { phone: cleanPhone } : {})
            });

            setSuccessMessage("Account created successfully! Redirecting...");

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 1500);

        } catch (requestError: any) {
            console.error("Registration error:", requestError);

            const message =
                requestError?.response?.data?.message ||
                "Unable to create your account. Please try again.";

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
                            <UserPlus size={24} />
                        </div>

                        <div>
                            <h1>Create your account</h1>
                            <p>Join Obaaratech and start buying, selling and connecting</p>
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

                        {/* NAME */}
                        <div className="auth-field">
                            <label htmlFor="register-name">
                                <User size={16} />
                                Full Name
                                <span className="required">*</span>
                            </label>
                            <div className="auth-input-wrapper">
                                <User size={18} className="auth-input-icon" />
                                <input
                                    id="register-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    autoComplete="name"
                                    disabled={submitting}
                                    required
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="auth-field">
                            <label htmlFor="register-email">
                                <Mail size={16} />
                                Email Address
                                <span className="required">*</span>
                            </label>
                            <div className="auth-input-wrapper">
                                <Mail size={18} className="auth-input-icon" />
                                <input
                                    id="register-email"
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

                        {/* PHONE */}
                        <div className="auth-field">
                            <label htmlFor="register-phone">
                                <Phone size={16} />
                                Phone Number
                                <span className="optional">(Optional)</span>
                            </label>
                            <div className="auth-input-wrapper">
                                <Phone size={18} className="auth-input-icon" />
                                <input
                                    id="register-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="08012345678"
                                    autoComplete="tel"
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="auth-field">
                            <label htmlFor="register-password">
                                <LockKeyhole size={16} />
                                Password
                                <span className="required">*</span>
                            </label>
                            <div className="auth-input-wrapper">
                                <LockKeyhole size={18} className="auth-input-icon" />
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    autoComplete="new-password"
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

                        {/* CONFIRM PASSWORD */}
                        <div className="auth-field">
                            <label htmlFor="register-confirm-password">
                                <LockKeyhole size={16} />
                                Confirm Password
                                <span className="required">*</span>
                            </label>
                            <div className="auth-input-wrapper">
                                <LockKeyhole size={18} className="auth-input-icon" />
                                <input
                                    id="register-confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    disabled={submitting}
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    disabled={submitting}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Create Account
                                </>
                            )}
                        </button>

                    </form>

                    {/* LOGIN LINK */}
                    <div className="auth-footer">

                        <span>Already have an account?</span>

                        <Link to="/login">
                            <LockKeyhole size={16} />
                            Sign in
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