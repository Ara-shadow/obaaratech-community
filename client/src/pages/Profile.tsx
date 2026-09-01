import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    User,
    Mail,
    Phone,
    Save,
    X,
    Loader2,
    CheckCircle2,
    ArrowLeft,
    ShieldCheck,
    Calendar
} from "lucide-react";

import {
    getProfile,
    updateProfile
} from "../api/profile";

import type {
    Profile as ProfileType
} from "../api/profile";


export default function Profile() {

    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        phone: "",
    });

    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        async function loadProfile() {

            try {
                const data = await getProfile();
                setProfile(data);
                setForm({
                    name: data.name || "",
                    phone: data.phone || "",
                });
            } catch (error) {
                console.error("Profile load error", error);
                setErrorMessage("Unable to load profile data.");
            } finally {
                setLoading(false);
            }

        }

        loadProfile();

    }, []);

    // =====================================================
    // HANDLE SUBMIT – PHONE NOW REQUIRED
    // =====================================================

    async function handleSubmit(event: React.FormEvent) {

        event.preventDefault();

        // Validate name
        if (!form.name.trim()) {
            setErrorMessage("Name is required.");
            return;
        }

        // Validate phone – NOW REQUIRED
        if (!form.phone.trim()) {
            setErrorMessage("Phone number is required. Customers need it to contact you.");
            return;
        }

        // Validate phone format (Nigerian)
        const phoneRegex = /^(?:\+234|234|0)[789][01]\d{8}$/;
        if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) {
            setErrorMessage("Please enter a valid Nigerian phone number (e.g., 08012345678).");
            return;
        }

        try {
            setSaving(true);
            setErrorMessage("");
            setSuccessMessage("");

            const updated = await updateProfile({
                name: form.name.trim(),
                phone: form.phone.trim(),
            });

            setProfile(updated);
            setSuccessMessage("Profile updated successfully!");

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

        } catch (error) {
            console.error("Update error", error);
            setErrorMessage("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }

    }

    // =====================================================
    // HANDLE CANCEL
    // =====================================================

    function handleCancel() {
        if (profile) {
            setForm({
                name: profile.name || "",
                phone: profile.phone || "",
            });
        }
        setErrorMessage("");
        setSuccessMessage("");
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <div className="profile-loading">
                        <Loader2 size={32} className="spinning" />
                        <p>Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="profile-page">

            <div className="profile-container">

                {/* HEADER */}
                <div className="profile-header">

                    <Link to="/account" className="profile-back">
                        <ArrowLeft size={18} />
                        Back to Account
                    </Link>

                    <div className="profile-title">
                        <User size={28} />
                        <div>
                            <h1>My Profile</h1>
                            <p>Manage your account information</p>
                        </div>
                    </div>

                </div>

                {/* MESSAGES */}
                {successMessage && (
                    <div className="profile-message success">
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {errorMessage && (
                    <div className="profile-message error">
                        <X size={18} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* PROFILE CARD */}
                <div className="profile-card">

                    {/* Avatar Section */}
                    <div className="profile-avatar-section">

                        <div className="profile-avatar">
                            {form.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="profile-avatar-info">
                            <h2>{form.name || "User"}</h2>
                            <span className="profile-role">
                                <ShieldCheck size={14} />
                                {profile?.role || "USER"}
                            </span>
                            <span className="profile-member-since">
                                <Calendar size={14} />
                                {profile?.createdAt
                                    ? `Member since ${new Date(profile.createdAt).toLocaleDateString("en-NG", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}`
                                    : "Member"}
                            </span>
                        </div>

                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="profile-form">

                        <div className="profile-form-group">
                            <label htmlFor="profile-name">
                                <User size={16} />
                                Full Name
                                <span className="required">*</span>
                            </label>
                            <input
                                id="profile-name"
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Your full name"
                                disabled={saving}
                                required
                            />
                        </div>

                        <div className="profile-form-group">
                            <label htmlFor="profile-email">
                                <Mail size={16} />
                                Email Address
                            </label>
                            <input
                                id="profile-email"
                                type="email"
                                value={profile?.email || ""}
                                disabled
                                className="profile-disabled"
                            />
                            <small>Email cannot be changed</small>
                        </div>

                        {/* PHONE – NOW REQUIRED */}
                        <div className="profile-form-group">
                            <label htmlFor="profile-phone">
                                <Phone size={16} />
                                Phone Number
                                <span className="required">*</span>
                            </label>
                            <input
                                id="profile-phone"
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                placeholder="08012345678"
                                disabled={saving}
                                required
                            />
                            <small>
                                Customers use this to contact you via WhatsApp. 
                                Must be a valid Nigerian number.
                            </small>
                        </div>

                        <div className="profile-form-group">
                            <label htmlFor="profile-role">
                                <ShieldCheck size={16} />
                                Account Role
                            </label>
                            <input
                                id="profile-role"
                                type="text"
                                value={profile?.role || "USER"}
                                disabled
                                className="profile-disabled"
                            />
                            <small>Role is assigned by the system</small>
                        </div>

                        {/* Actions */}
                        <div className="profile-actions">

                            <button
                                type="submit"
                                className="profile-save-btn"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="spinning" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="profile-cancel-btn"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}