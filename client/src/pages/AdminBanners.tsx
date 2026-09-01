import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
    Plus, 
    Trash2, 
    Pencil, 
    Loader2, 
    Eye, 
    EyeOff, 
    ShieldCheck,
    X,
    CheckCircle2,
    AlertCircle,
    Image,
    MoveUp,
    MoveDown,
    RefreshCw
} from "lucide-react";
import { 
    getAllBanners, 
    createBanner, 
    updateBanner, 
    deleteBanner, 
    toggleBanner,
    type BannerItem 
} from "../api/banner";

export default function AdminBanners() {
    const [banners, setBanners] = useState<BannerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        emoji: "🛍️",
        link: "",
    });

    // =====================================================
    // LOAD BANNERS
    // =====================================================

    useEffect(() => {
        loadBanners();
    }, []);

    async function loadBanners() {
        try {
            setLoading(true);
            const data = await getAllBanners();
            setBanners(data);
        } catch (error) {
            setMessage("Failed to load banners");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    function showMessage(text: string, type: "success" | "error") {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 4000);
    }

    // =====================================================
    // HANDLE FORM SUBMIT
    // =====================================================

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        try {
            setSaving(true);
            setMessage("");

            const data = {
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                price: form.price ? Number(form.price) : undefined,
                emoji: form.emoji || "🛍️",
                link: form.link.trim() || undefined,
                isActive: true,
            };

            if (editingId) {
                await updateBanner(editingId, data);
                showMessage("Banner updated successfully!", "success");
            } else {
                await createBanner(data);
                showMessage("Banner created successfully!", "success");
            }

            // Reset form
            setForm({ title: "", description: "", price: "", emoji: "🛍️", link: "" });
            setEditingId(null);
            await loadBanners();

        } catch (error) {
            showMessage("Failed to save banner. Please try again.", "error");
        } finally {
            setSaving(false);
        }
    }

    // =====================================================
    // EDIT BANNER
    // =====================================================

    function handleEdit(banner: BannerItem) {
        setEditingId(banner.id);
        setForm({
            title: banner.title,
            description: banner.description || "",
            price: banner.price?.toString() || "",
            emoji: banner.emoji || "🛍️",
            link: banner.link || "",
        });
        // Scroll to form
        document.getElementById("banner-form")?.scrollIntoView({ behavior: "smooth" });
    }

    // =====================================================
    // TOGGLE BANNER
    // =====================================================

    async function handleToggle(id: string) {
        try {
            await toggleBanner(id);
            await loadBanners();
            showMessage("Banner status updated!", "success");
        } catch (error) {
            showMessage("Failed to toggle banner", "error");
        }
    }

    // =====================================================
    // DELETE BANNER
    // =====================================================

    async function handleDelete(id: string) {
        if (!confirm("Delete this banner? This action cannot be undone.")) return;
        
        try {
            await deleteBanner(id);
            await loadBanners();
            showMessage("Banner deleted successfully!", "success");
        } catch (error) {
            showMessage("Failed to delete banner", "error");
        }
    }

    // =====================================================
    // CANCEL EDIT
    // =====================================================

    function cancelEdit() {
        setEditingId(null);
        setForm({ title: "", description: "", price: "", emoji: "🛍️", link: "" });
    }

    // =====================================================
    // RENDER BANNER PREVIEW
    // =====================================================

    function renderBannerPreview() {
        const previewBanner = {
            emoji: form.emoji || "🛍️",
            title: form.title || "Preview",
            description: form.description || "",
            price: form.price ? Number(form.price) : undefined,
        };

        return (
            <div className="admin-banner-preview">
                <span className="admin-banner-preview-dot" />
                {previewBanner.emoji} <strong>{previewBanner.title}</strong>
                {previewBanner.description && ` ${previewBanner.description}`}
                {previewBanner.price && (
                    <span className="admin-banner-preview-price">
                        ₦{previewBanner.price.toLocaleString()}
                    </span>
                )}
            </div>
        );
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="admin-banners-page">
                <div className="admin-banners-container">
                    <div className="admin-banners-loading">
                        <Loader2 size={32} className="spinning" />
                        <p>Loading banners...</p>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="admin-banners-page">

            <div className="admin-banners-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="admin-banners-header">

                    <div className="admin-banners-header-left">

                        <div className="admin-banners-header-icon">
                            <Image size={28} />
                        </div>

                        <div>
                            <h1>Banner Management</h1>
                            <p>
                                <span className="admin-banners-badge">
                                    <ShieldCheck size={14} />
                                    Admin
                                </span>
                                Create and manage scrolling banners for the homepage
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="admin-banners-refresh"
                        onClick={loadBanners}
                        disabled={loading}
                    >
                        <RefreshCw size={16} className={loading ? "spinning" : ""} />
                        Refresh
                    </button>

                </div>

                {/* =================================================
                    MESSAGES
                ================================================= */}

                {message && (
                    <div className={`admin-banners-message ${messageType}`}>
                        {messageType === "success" ? (
                            <CheckCircle2 size={18} />
                        ) : (
                            <AlertCircle size={18} />
                        )}
                        <span>{message}</span>
                    </div>
                )}

                {/* =================================================
                    CREATE / EDIT FORM
                ================================================= */}

                <div className="admin-banners-card" id="banner-form">

                    <div className="admin-banners-card-header">
                        <div>
                            <h2>{editingId ? "✏️ Edit Banner" : "➕ Create New Banner"}</h2>
                            <p>{editingId ? "Update an existing banner" : "Add a new scrolling banner to the homepage"}</p>
                        </div>
                        {editingId && (
                            <button
                                type="button"
                                className="admin-banners-cancel-btn"
                                onClick={cancelEdit}
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        )}
                    </div>

                    <form className="admin-banners-form" onSubmit={handleSubmit}>

                        <div className="admin-banners-form-grid">

                            <div className="admin-banners-field">
                                <label htmlFor="banner-emoji">
                                    Emoji <span className="optional">(optional)</span>
                                </label>
                                <input
                                    id="banner-emoji"
                                    type="text"
                                    value={form.emoji}
                                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                                    placeholder="🔥"
                                    maxLength={4}
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-banners-field">
                                <label htmlFor="banner-title">
                                    Title <span className="required">*</span>
                                </label>
                                <input
                                    id="banner-title"
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Flash Sale!"
                                    required
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-banners-field">
                                <label htmlFor="banner-description">
                                    Description <span className="optional">(optional)</span>
                                </label>
                                <input
                                    id="banner-description"
                                    type="text"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="iPhone 15 Pro"
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-banners-field">
                                <label htmlFor="banner-price">
                                    Price <span className="optional">(optional)</span>
                                </label>
                                <input
                                    id="banner-price"
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    placeholder="899000"
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-banners-field admin-banners-field-full">
                                <label htmlFor="banner-link">
                                    Link URL <span className="optional">(optional)</span>
                                </label>
                                <input
                                    id="banner-link"
                                    type="text"
                                    value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    placeholder="/product/123"
                                    disabled={saving}
                                />
                                <small>Leave empty for no link</small>
                            </div>

                        </div>

                        {/* Preview */}
                        <div className="admin-banners-preview-section">
                            <span className="admin-banners-preview-label">Live Preview</span>
                            {renderBannerPreview()}
                        </div>

                        <div className="admin-banners-form-actions">
                            <button
                                type="submit"
                                className="admin-banners-submit-btn"
                                disabled={saving || !form.title.trim()}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="spinning" />
                                        {editingId ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        {editingId ? "Update Banner" : "Create Banner"}
                                    </>
                                )}
                            </button>
                        </div>

                    </form>

                </div>

                {/* =================================================
                    BANNER LIST
                ================================================= */}

                <div className="admin-banners-card">

                    <div className="admin-banners-card-header">
                        <div>
                            <h2>📋 All Banners</h2>
                            <p>{banners.length} banner{banners.length === 1 ? "" : "s"} configured</p>
                        </div>
                    </div>

                    {banners.length === 0 ? (

                        <div className="admin-banners-empty">
                            <Image size={40} />
                            <h3>No banners created yet</h3>
                            <p>Create your first banner using the form above</p>
                        </div>

                    ) : (

                        <div className="admin-banners-table-wrap">

                            <table className="admin-banners-table">

                                <thead>
                                    <tr>
                                        <th>Emoji</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {banners.map((banner) => (
                                        <tr key={banner.id}>
                                            <td className="admin-banners-table-emoji">
                                                {banner.emoji || "🛍️"}
                                            </td>
                                            <td className="admin-banners-table-title">
                                                <strong>{banner.title}</strong>
                                            </td>
                                            <td className="admin-banners-table-description">
                                                {banner.description || "—"}
                                            </td>
                                            <td className="admin-banners-table-price">
                                                {banner.price ? `₦${banner.price.toLocaleString()}` : "—"}
                                            </td>
                                            <td>
                                                <span className={`admin-banners-status ${banner.isActive ? "active" : "inactive"}`}>
                                                    {banner.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="admin-banners-actions">

                                                    <button
                                                        type="button"
                                                        className="admin-banners-action toggle"
                                                        onClick={() => handleToggle(banner.id)}
                                                        title={banner.isActive ? "Deactivate" : "Activate"}
                                                    >
                                                        {banner.isActive ? (
                                                            <EyeOff size={15} />
                                                        ) : (
                                                            <Eye size={15} />
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-banners-action edit"
                                                        onClick={() => handleEdit(banner)}
                                                        title="Edit banner"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-banners-action delete"
                                                        onClick={() => handleDelete(banner.id)}
                                                        title="Delete banner"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}