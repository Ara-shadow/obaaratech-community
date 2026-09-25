import { useEffect, useMemo, useState } from "react";
import { 
    Loader2, 
    Pencil, 
    Plus, 
    Trash2,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    X,
    FolderTree,
    FolderOpen,
    ChevronRight,
    ChevronDown,
    RefreshCw,
    Search
} from "lucide-react";
import { 
    createCategory, 
    deleteCategory, 
    getCategoryTree, 
    updateCategory, 
    type Category 
} from "../api/categories";

interface CategoryNode extends Category {
    children?: CategoryNode[];
}

const emptyForm = {
    name: "",
    slug: "",
    description: "",
    icon: "",
    parentId: "",
};

export default function AdminCategories() {
    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    async function loadCategories() {
        try {
            setLoading(true);
            const tree = await getCategoryTree();
            setCategories(tree);
            
            // Auto-expand all nodes on load
            const allIds = new Set<string>();
            const collectIds = (nodes: CategoryNode[]) => {
                for (const node of nodes) {
                    allIds.add(node.id);
                    if (node.children?.length) {
                        collectIds(node.children);
                    }
                }
            };
            collectIds(tree);
            setExpandedNodes(allIds);
            
        } catch (error: any) {
            showMessage(error?.response?.data?.message || "Unable to load categories.", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

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
    // FLATTEN CATEGORIES
    // =====================================================

    const flattenedCategories = useMemo(() => {
        const result: { id: string; name: string; level: number }[] = [];

        function walk(nodes: CategoryNode[], level = 0) {
            for (const node of nodes) {
                result.push({ id: node.id, name: node.name, level });
                if (node.children?.length) walk(node.children, level + 1);
            }
        }

        walk(categories);
        return result;
    }, [categories]);

    // =====================================================
    // FILTERED CATEGORIES
    // =====================================================

    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return flattenedCategories;
        const term = searchTerm.toLowerCase().trim();
        return flattenedCategories.filter(cat => 
            cat.name.toLowerCase().includes(term)
        );
    }, [flattenedCategories, searchTerm]);

    // =====================================================
    // RESET FORM
    // =====================================================

    function resetForm() {
        setForm(emptyForm);
        setEditingId(null);
    }

    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        const payload = {
            name: form.name.trim(),
            slug: (form.slug || form.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            description: form.description.trim() || undefined,
            icon: form.icon.trim() || undefined,
            parentId: form.parentId || undefined,
        };

        if (!payload.name) {
            showMessage("Category name is required.", "error");
            return;
        }

        async function save() {
            try {
                setMessage("");
                if (editingId) {
                    await updateCategory(editingId, payload);
                    showMessage("Category updated successfully!", "success");
                } else {
                    await createCategory(payload);
                    showMessage("Category created successfully!", "success");
                }
                resetForm();
                await loadCategories();
            } catch (error: any) {
                showMessage(error?.response?.data?.message || "Unable to save category.", "error");
            }
        }

        save();
    }

    // =====================================================
    // HANDLE EDIT
    // =====================================================

    async function handleEdit(category: CategoryNode) {
        setEditingId(category.id);
        setForm({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            icon: category.icon || "",
            parentId: category.parentId || "",
        });
        // Scroll to form
        document.getElementById("category-form")?.scrollIntoView({ behavior: "smooth" });
    }

    // =====================================================
    // HANDLE DELETE
    // =====================================================

    async function handleDelete(id: string) {
        const confirmed = window.confirm("Delete this category and any nested children?");
        if (!confirmed) return;

        try {
            setBusyId(id);
            await deleteCategory(id);
            showMessage("Category deleted successfully!", "success");
            await loadCategories();
        } catch (error: any) {
            showMessage(error?.response?.data?.message || "Unable to delete category.", "error");
        } finally {
            setBusyId(null);
        }
    }

    // =====================================================
    // TOGGLE EXPAND
    // =====================================================

    function toggleExpand(id: string) {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }

    // =====================================================
    // RENDER CATEGORY TREE
    // =====================================================

    function renderCategoryTree(nodes: CategoryNode[], level: number = 0): React.ReactNode {
        return nodes.map(node => {
            const hasChildren = node.children && node.children.length > 0;
            const isExpanded = expandedNodes.has(node.id);
            const isBusy = busyId === node.id;

            return (
                <div key={node.id} className="admin-categories-tree-item">
                    <div 
                        className="admin-categories-tree-row"
                        style={{ paddingLeft: `${level * 24 + 12}px` }}
                    >
                        {hasChildren && (
                            <button
                                type="button"
                                className="admin-categories-tree-toggle"
                                onClick={() => toggleExpand(node.id)}
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        )}
                        {!hasChildren && <span className="admin-categories-tree-spacer" />}
                        
                        <span className="admin-categories-tree-name">
                            {node.icon && <span className="admin-categories-tree-icon">{node.icon}</span>}
                            {node.name}
                        </span>
                        
                        <span className="admin-categories-tree-count">
                            {hasChildren ? `${node.children!.length} subcategories` : "No children"}
                        </span>

                        <div className="admin-categories-tree-actions">
                            <button
                                type="button"
                                className="admin-categories-tree-action edit"
                                onClick={() => handleEdit(node)}
                                disabled={isBusy}
                            >
                                <Pencil size={15} />
                            </button>
                            <button
                                type="button"
                                className="admin-categories-tree-action delete"
                                onClick={() => handleDelete(node.id)}
                                disabled={isBusy}
                            >
                                {isBusy ? (
                                    <Loader2 size={15} className="spinning" />
                                ) : (
                                    <Trash2 size={15} />
                                )}
                            </button>
                        </div>
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="admin-categories-tree-children">
                            {renderCategoryTree(node.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="admin-categories-page">
                <div className="admin-categories-container">
                    <div className="admin-categories-loading">
                        <Loader2 size={32} className="spinning" />
                        <p>Loading categories...</p>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="admin-categories-page">

            <div className="admin-categories-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="admin-categories-header">

                    <div className="admin-categories-header-left">

                        <div className="admin-categories-header-icon">
                            <FolderTree size={28} />
                        </div>

                        <div>
                            <h1>Category Management</h1>
                            <p>
                                <span className="admin-categories-badge">
                                    <ShieldCheck size={14} />
                                    Admin
                                </span>
                                Create, edit, and organize the marketplace category tree
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="admin-categories-refresh"
                        onClick={loadCategories}
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
                    <div className={`admin-categories-message ${messageType}`}>
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

                <div className="admin-categories-card" id="category-form">

                    <div className="admin-categories-card-header">
                        <div>
                            <h2>{editingId ? "✏️ Edit Category" : "➕ Create New Category"}</h2>
                            <p>{editingId ? "Update an existing category" : "Add a new category to the marketplace"}</p>
                        </div>
                        {editingId && (
                            <button
                                type="button"
                                className="admin-categories-cancel-btn"
                                onClick={resetForm}
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        )}
                    </div>

                    <form className="admin-categories-form" onSubmit={handleSubmit}>

                        <div className="admin-categories-form-grid">

                            <div className="admin-categories-field">
                                <label htmlFor="category-name">
                                    Category Name <span className="required">*</span>
                                </label>
                                <input
                                    id="category-name"
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Food & Groceries"
                                    required
                                    disabled={!!busyId}
                                />
                            </div>

                            <div className="admin-categories-field">
                                <label htmlFor="category-slug">
                                    Slug <span className="optional">(auto-generated)</span>
                                </label>
                                <input
                                    id="category-slug"
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    placeholder="food-groceries"
                                    disabled={!!busyId}
                                />
                                <small>Leave blank to auto-generate from name</small>
                            </div>

                            <div className="admin-categories-field">
                                <label htmlFor="category-icon">
                                    Icon <span className="optional">(optional)</span>
                                </label>
                                <input
                                    id="category-icon"
                                    type="text"
                                    value={form.icon}
                                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                    placeholder="🛒"
                                    disabled={!!busyId}
                                />
                            </div>

                            <div className="admin-categories-field">
                                <label htmlFor="category-parent">
                                    Parent Category <span className="optional">(optional)</span>
                                </label>
                                <select
                                    id="category-parent"
                                    value={form.parentId}
                                    onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                                    disabled={!!busyId}
                                >
                                    <option value="">No parent (top-level)</option>
                                    {flattenedCategories.map((category) => (
                                        <option 
                                            key={category.id} 
                                            value={category.id} 
                                            disabled={editingId === category.id}
                                        >
                                            {"— ".repeat(category.level)}{category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-categories-field admin-categories-field-full">
                                <label htmlFor="category-description">
                                    Description <span className="optional">(optional)</span>
                                </label>
                                <textarea
                                    id="category-description"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Optional description for this category"
                                    rows={3}
                                    disabled={!!busyId}
                                />
                            </div>

                        </div>

                        <div className="admin-categories-form-actions">
                            <button
                                type="submit"
                                className="admin-categories-submit-btn"
                                disabled={!!busyId || !form.name.trim()}
                            >
                                {busyId ? (
                                    <>
                                        <Loader2 size={18} className="spinning" />
                                        {editingId ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        {editingId ? "Update Category" : "Create Category"}
                                    </>
                                )}
                            </button>
                        </div>

                    </form>

                </div>

                {/* =================================================
                    CATEGORY TREE / LIST
                ================================================= */}

                <div className="admin-categories-card">

                    <div className="admin-categories-card-header">
                        <div>
                            <h2>📂 Category Tree</h2>
                            <p>{flattenedCategories.length} categories total</p>
                        </div>
                        <div className="admin-categories-search">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredCategories.length === 0 ? (

                        <div className="admin-categories-empty">
                            <FolderTree size={40} />
                            <h3>No categories found</h3>
                            <p>
                                {searchTerm 
                                    ? `No categories match "${searchTerm}"` 
                                    : "Create your first category using the form above"}
                            </p>
                            {searchTerm && (
                                <button
                                    type="button"
                                    className="admin-categories-clear-search"
                                    onClick={() => setSearchTerm("")}
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>

                    ) : searchTerm ? (

                        <div className="admin-categories-flat-list">
                            {filteredCategories.map((cat) => (
                                <div key={cat.id} className="admin-categories-flat-item">
                                    <span className="admin-categories-flat-indent">
                                        {"— ".repeat(cat.level)}
                                    </span>
                                    <span>{cat.name}</span>
                                </div>
                            ))}
                        </div>

                    ) : (

                        <div className="admin-categories-tree">
                            {categories.length === 0 ? (
                                <div className="admin-categories-empty">
                                    <FolderTree size={40} />
                                    <h3>No categories</h3>
                                    <p>Create your first category using the form above</p>
                                </div>
                            ) : (
                                renderCategoryTree(categories)
                            )}
                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}