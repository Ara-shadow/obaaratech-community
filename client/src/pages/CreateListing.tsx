import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    ChangeEvent,
    FormEvent
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Loader2,
    MapPin,
    Trash2,
    Upload,
    AlertCircle,
    Camera,
    Package
} from "lucide-react";

import {
    createListing,
    uploadListingImage
} from "../api/listings";

import {
    getCategoryTree
} from "../api/categories";

import {
    CURRENCY_OPTIONS,
    DEFAULT_CURRENCY,
    getCurrencySymbol,
    type Currency
} from "../services/currency";

interface Category {
    id: string;
    name: string;
    slug?: string | null;
    icon?: string | null;
    parentId?: string | null;
    children?: Category[];
}

interface SelectedImage {
    id: string;
    file: File;
    preview: string;
    progress: number;
    uploaded: boolean;
    error: string;
}

const LISTING_TYPES = [
    { value: "PRODUCT", label: "Product" },
    { value: "SERVICE", label: "Service" },
    { value: "PROPERTY", label: "Property" },
    { value: "VEHICLE", label: "Vehicle" },
    { value: "JOB", label: "Job" },
    { value: "COURSE", label: "Course" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" }
] as const;

type ListingType = typeof LISTING_TYPES[number]["value"];
type ListingCondition =
    | "NEW"
    | "USED"
    | "UK_USED"
    | "NIGERIA_USED"
    | "BRAND_NEW"
    | "FOREIGN_USED"
    | "NEW_BUILD"
    | "OLD_BUILDING"
    | "RENOVATED";

const CONDITION_OPTIONS = {
    PRODUCT: [
        { value: "NEW", label: "New" },
        { value: "USED", label: "Used" },
        { value: "NIGERIA_USED", label: "Nigeria Used" },
        { value: "UK_USED", label: "UK Used" }
    ],
    VEHICLE: [
        { value: "BRAND_NEW", label: "Brand New" },
        { value: "FOREIGN_USED", label: "Foreign Used" },
        { value: "NIGERIA_USED", label: "Nigeria Used" }
    ],
    PROPERTY: [
        { value: "NEW_BUILD", label: "New Build" },
        { value: "OLD_BUILDING", label: "Old Building" },
        { value: "RENOVATED", label: "Renovated" }
    ]
} as const;

const DETAILS_FIELDS = {
    PRODUCT: [
        { key: "brand", label: "Brand" },
        { key: "model", label: "Model" },
        { key: "color", label: "Color" },
        { key: "warranty", label: "Warranty" }
    ],
    VEHICLE: [
        { key: "make", label: "Make" },
        { key: "model", label: "Model" },
        { key: "year", label: "Year" },
        { key: "mileage", label: "Mileage" },
        { key: "fuel", label: "Fuel Type" },
        { key: "transmission", label: "Transmission" }
    ],
    PROPERTY: [
        { key: "propertyType", label: "Property Type" },
        { key: "bedrooms", label: "Bedrooms" },
        { key: "bathrooms", label: "Bathrooms" },
        { key: "landSize", label: "Land Size" }
    ]
} as const;

export default function CreateListing() {

    const navigate = useNavigate();

    // =====================================================
    // FORM STATE
    // =====================================================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
    const [condition, setCondition] = useState<ListingCondition | "">("");
    const [negotiable, setNegotiable] = useState(false);
    const [type, setType] = useState<ListingType>("PRODUCT");
    const [location, setLocation] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [parentCategoryId, setParentCategoryId] = useState("");
    const [details, setDetails] = useState<Record<string, any>>({});

    // =====================================================
    // CATEGORY STATE
    // =====================================================

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoryError, setCategoryError] = useState("");

    // =====================================================
    // IMAGE STATE
    // =====================================================

    const [images, setImages] = useState<SelectedImage[]>([]);

    // =====================================================
    // SUBMISSION STATE
    // =====================================================

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [uploadStep, setUploadStep] = useState("");

    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    useEffect(() => {

        let mounted = true;

        getCategoryTree()
            .then((data) => {
                if (!mounted) return;
                setCategories(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Category loading error:", error);
                if (!mounted) return;
                setCategoryError("Unable to load categories.");
            })
            .finally(() => {
                if (mounted) {
                    setCategoriesLoading(false);
                }
            });

        return () => {
            mounted = false;
        };

    }, []);

    // =====================================================
    // CATEGORY LOOKUP
    // =====================================================

    const categoryLookup = useMemo(() => {
        const lookup = new Map<string, Category>();

        function walk(items: Category[]) {
            for (const item of items) {
                lookup.set(item.id, item);
                if (item.children?.length) {
                    walk(item.children);
                }
            }
        }

        walk(categories);
        return lookup;
    }, [categories]);

    const visibleChildCategories = useMemo(() => {
        if (!parentCategoryId) return [];
        const parent = categoryLookup.get(parentCategoryId);
        return parent?.children ?? [];
    }, [categoryLookup, parentCategoryId]);

    const selectedCategory = categoryId ? categoryLookup.get(categoryId) : undefined;

    useEffect(() => {
        if (!categoryId) {
            setParentCategoryId("");
            return;
        }

        for (const category of categories) {
            const findParent = (items: Category[]): string | null => {
                for (const item of items) {
                    if (item.id === categoryId) {
                        return item.parentId ?? "";
                    }
                    if (item.children?.length) {
                        const nestedParent = findParent(item.children);
                        if (nestedParent !== null) {
                            return nestedParent;
                        }
                    }
                }
                return null;
            };

            const matchedParent = findParent([category]);
            if (matchedParent !== null) {
                setParentCategoryId(matchedParent || "");
                return;
            }
        }

        setParentCategoryId("");
    }, [categories, categoryId]);

    // =====================================================
    // IMAGE HANDLERS
    // =====================================================

    function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {

        const selectedFiles = Array.from(event.target.files ?? []);
        if (!selectedFiles.length) return;

        const remainingSlots = Math.max(0, 10 - images.length);
        const filesToAdd = selectedFiles.slice(0, remainingSlots);

        const newImages = filesToAdd.map((file) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            error: ""
        }));

        setImages((current) => [...current, ...newImages]);
        event.target.value = "";
    }

    function removeImage(imageId: string) {
        setImages((current) => {
            const image = current.find(item => item.id === imageId);
            if (image) {
                URL.revokeObjectURL(image.preview);
            }
            return current.filter(item => item.id !== imageId);
        });
    }

    // =====================================================
    // VALIDATE FORM
    // =====================================================

    function validateForm(): string {
        if (title.trim().length < 3) {
            return "Please enter a product title of at least 3 characters.";
        }
        if (description.trim().length < 10) {
            return "Please provide a description of at least 10 characters.";
        }
        if (location.trim().length < 2) {
            return "Please enter the listing location.";
        }
        if (!categoryId) {
            return "Please select a category for your listing.";
        }
        if (price.trim()) {
            const numericPrice = Number(price);
            if (!Number.isFinite(numericPrice) || numericPrice < 0) {
                return "Please enter a valid price.";
            }
        }
        return "";
    }

    // =====================================================
    // SUBMIT LISTING
    // =====================================================

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();

        setSubmitError("");
        setSuccessMessage("");
        setUploadStep("");

        const validationError = validateForm();
        if (validationError) {
            setSubmitError(validationError);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            setSubmitting(true);

            setUploadStep("Creating your listing...");

            const listing = await createListing({
                title: title.trim(),
                description: description.trim(),
                ...(price.trim() ? { price: Number(price) } : {}),
                currency: "NGN",
                negotiable,
                condition: condition || undefined,
                type,
                location: location.trim(),
                ...(categoryId ? { categoryId } : {}),
                details
            });

            // Upload images
            if (images.length) {
                for (let index = 0; index < images.length; index++) {
                    const image = images[index];
                    setUploadStep(`Uploading image ${index + 1} of ${images.length}...`);

                    try {
                        await uploadListingImage(
                            listing.id,
                            image.file,
                            (progress) => {
                                setImages(current =>
                                    current.map(item =>
                                        item.id === image.id
                                            ? { ...item, progress }
                                            : item
                                    )
                                );
                            }
                        );

                        setImages(current =>
                            current.map(item =>
                                item.id === image.id
                                    ? { ...item, progress: 100, uploaded: true, error: "" }
                                    : item
                            )
                        );

                    } catch (error) {
                        console.error("Image upload error:", error);
                        setImages(current =>
                            current.map(item =>
                                item.id === image.id
                                    ? { ...item, error: "Image upload failed." }
                                    : item
                            )
                        );
                    }
                }
            }

            setSuccessMessage("Your listing has been published successfully!");
            setUploadStep("Opening your listing...");

            setTimeout(() => {
                navigate(`/product/${listing.id}`);
            }, 900);

        } catch (error: any) {
            console.error("Create listing error:", error);
            setSubmitError(
                error?.response?.data?.message ||
                "Unable to create your listing. Please try again."
            );
            setUploadStep("");
        } finally {
            setSubmitting(false);
        }

    }

    // =====================================================
    // CLEAN UP PREVIEWS
    // =====================================================

    useEffect(() => {
        return () => {
            images.forEach(image => {
                URL.revokeObjectURL(image.preview);
            });
        };
    }, []);

    // =====================================================
    // GET TYPE LABEL
    // =====================================================

    function getTypeLabel(type: string): string {
        return LISTING_TYPES.find(t => t.value === type)?.label || type;
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="create-listing-page">

            <div className="create-listing-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="create-listing-header">

                    <div className="create-listing-header-left">

                        <Link to="/" className="create-listing-back">
                            <ArrowLeft size={18} />
                            Back to Marketplace
                        </Link>

                        <div className="create-listing-title">
                            <Package size={28} />
                            <div>
                                <h1>Sell on Obaaratech</h1>
                                <p>Create a listing and connect with buyers</p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* =================================================
                    MESSAGES
                ================================================= */}

                {submitError && (
                    <div className="create-listing-message error">
                        <AlertCircle size={18} />
                        <span>{submitError}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="create-listing-message success">
                        <CheckCircle2 size={18} />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form className="create-listing-form" onSubmit={handleSubmit}>

                    {/* =================================================
                        BASIC INFORMATION
                    ================================================= */}

                    <div className="create-listing-card">

                        <div className="create-listing-card-header">
                            <span className="create-listing-step">01</span>
                            <div>
                                <h2>Basic Information</h2>
                                <p>Tell buyers what you are offering</p>
                            </div>
                        </div>

                        <div className="create-listing-card-body">

                            <div className="create-listing-field">
                                <label htmlFor="listing-title">
                                    Listing Title <span className="required">*</span>
                                </label>
                                <input
                                    id="listing-title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. iPhone 15 Pro Max 256GB"
                                    maxLength={120}
                                    disabled={submitting}
                                />
                                <small>{title.length}/120</small>
                            </div>

                            <div className="create-listing-field">
                                <label htmlFor="listing-description">
                                    Description <span className="required">*</span>
                                </label>
                                <textarea
                                    id="listing-description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the item, service, condition, important features and anything buyers should know..."
                                    rows={6}
                                    maxLength={3000}
                                    disabled={submitting}
                                />
                                <small>{description.length}/3000</small>
                            </div>

                            <div className="create-listing-field">
                                <label htmlFor="listing-type">
                                    Listing Type <span className="required">*</span>
                                </label>
                                <select
                                    id="listing-type"
                                    value={type}
                                    onChange={(e) => {
                                        const selectedType = e.target.value as ListingType;
                                        setType(selectedType);
                                        setCondition("");
                                    }}
                                    disabled={submitting}
                                >
                                    {LISTING_TYPES.map(item => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        ADDITIONAL DETAILS
                    ================================================= */}

                    {(() => {
                        const fields = DETAILS_FIELDS[type as keyof typeof DETAILS_FIELDS];
                        // Use type assertion to check if fields is an array with length
                        // Since TypeScript knows it's never empty, we just check if it exists
                        if (!fields) return null;

                        return (
                            <div className="create-listing-card">

                                <div className="create-listing-card-header">
                                    <span className="create-listing-step">02</span>
                                    <div>
                                        <h2>Additional Details</h2>
                                        <p>Provide more information about your {getTypeLabel(type).toLowerCase()}</p>
                                    </div>
                                </div>

                                <div className="create-listing-card-body create-listing-details-grid">

                                    {fields.map((field) => (
                                        <div key={field.key} className="create-listing-field">
                                            <label htmlFor={`detail-${field.key}`}>
                                                {field.label}
                                            </label>
                                            <input
                                                id={`detail-${field.key}`}
                                                type="text"
                                                value={details[field.key] || ""}
                                                onChange={(e) => {
                                                    setDetails({
                                                        ...details,
                                                        [field.key]: e.target.value
                                                    });
                                                }}
                                                placeholder={`Enter ${field.label.toLowerCase()}`}
                                                disabled={submitting}
                                            />
                                        </div>
                                    ))}

                                </div>

                            </div>
                        );
                    })()}

                    {/* =================================================
                        PRICE & CATEGORY
                    ================================================= */}

                    <div className="create-listing-card">

                        <div className="create-listing-card-header">
                            <span className="create-listing-step">03</span>
                            <div>
                                <h2>Price & Category</h2>
                                <p>Help buyers find and understand your listing</p>
                            </div>
                        </div>

                        <div className="create-listing-card-body create-listing-price-grid">

                            <div className="create-listing-field">
                                <label htmlFor="listing-currency">Currency</label>
                                <select
                                    id="listing-currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as Currency)}
                                    disabled={submitting}
                                >
                                    {CURRENCY_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="create-listing-field">
                                <label htmlFor="listing-price">Price</label>
                                <div className="create-listing-price-input">
                                    <span>{getCurrencySymbol(currency)}</span>
                                    <input
                                        id="listing-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0"
                                        disabled={submitting}
                                    />
                                </div>
                                <small>Leave empty if buyers should contact you for pricing</small>
                            </div>

                            {(() => {
                                const options = CONDITION_OPTIONS[type as keyof typeof CONDITION_OPTIONS];
                                // Use type assertion to check if options is an array with length
                                // Since TypeScript knows it's never empty, we just check if it exists
                                if (!options) return null;

                                return (
                                    <div className="create-listing-field">
                                        <label htmlFor="listing-condition">Condition</label>
                                        <select
                                            id="listing-condition"
                                            value={condition}
                                            onChange={(e) => setCondition(e.target.value as any)}
                                            disabled={submitting}
                                        >
                                            <option value="">Select condition</option>
                                            {options.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })()}

                            <div className="create-listing-field">
                                <label htmlFor="listing-category-main">Category <span className="required">*</span></label>
                                <select
                                    id="listing-category-main"
                                    value={parentCategoryId}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setParentCategoryId(value);
                                        if (!value) {
                                            setCategoryId("");
                                            return;
                                        }
                                        const parent = categoryLookup.get(value);
                                        if (!parent?.children?.length) {
                                            setCategoryId(value);
                                            return;
                                        }
                                        setCategoryId("");
                                    }}
                                    disabled={submitting || categoriesLoading}
                                >
                                    <option value="">
                                        {categoriesLoading ? "Loading categories..." : "Select a main category"}
                                    </option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {categoryError && <small className="error">{categoryError}</small>}
                            </div>

                            {visibleChildCategories.length > 0 && (
                                <div className="create-listing-field">
                                    <label htmlFor="listing-category-subcategory">Subcategory</label>
                                    <select
                                        id="listing-category-subcategory"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        disabled={submitting || categoriesLoading}
                                    >
                                        <option value="">Select a subcategory</option>
                                        {visibleChildCategories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedCategory && (
                                <div className="create-listing-field">
                                    <small className="create-listing-selected-category">
                                        Selected: {selectedCategory.name}
                                    </small>
                                </div>
                            )}

                        </div>

                        <div className="create-listing-card-body">
                            <label className="create-listing-checkbox">
                                <input
                                    type="checkbox"
                                    checked={negotiable}
                                    onChange={(e) => setNegotiable(e.target.checked)}
                                    disabled={submitting}
                                />
                                <span>
                                    <strong>Price is negotiable</strong>
                                    <small>Buyers can contact you to negotiate the price</small>
                                </span>
                            </label>
                        </div>

                    </div>

                    {/* =================================================
                        LOCATION
                    ================================================= */}

                    <div className="create-listing-card">

                        <div className="create-listing-card-header">
                            <span className="create-listing-step">04</span>
                            <div>
                                <h2>Location</h2>
                                <p>Let buyers know where the listing is located</p>
                            </div>
                        </div>

                        <div className="create-listing-card-body">

                            <div className="create-listing-field">
                                <label htmlFor="listing-location">
                                    Location <span className="required">*</span>
                                </label>
                                <div className="create-listing-location-input">
                                    <MapPin size={18} />
                                    <input
                                        id="listing-location"
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Ikeja, Lagos"
                                        maxLength={150}
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        IMAGES
                    ================================================= */}

                    <div className="create-listing-card">

                        <div className="create-listing-card-header">
                            <span className="create-listing-step">05</span>
                            <div>
                                <h2>Product Images</h2>
                                <p>Good photos help buyers trust your listing</p>
                            </div>
                        </div>

                        <div className="create-listing-card-body">

                            <div className="create-listing-images">

                                {images.map((image, index) => (
                                    <div key={image.id} className="create-listing-image-preview">
                                        <img src={image.preview} alt={`Listing image ${index + 1}`} />
                                        <span className="create-listing-image-number">{index + 1}</span>
                                        {!submitting && (
                                            <button
                                                type="button"
                                                className="create-listing-image-remove"
                                                onClick={() => removeImage(image.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                        {submitting && (
                                            <div className="create-listing-image-progress">
                                                {image.uploaded ? "✅" : image.error ? "❌" : `${image.progress}%`}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {images.length < 10 && (
                                    <label className={`create-listing-image-upload ${submitting ? "disabled" : ""}`}>
                                        <Camera size={28} />
                                        <strong>Add Photos</strong>
                                        <span>JPG, PNG or WEBP</span>
                                        <small>Up to 10 images</small>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            multiple
                                            onChange={handleImageSelection}
                                            disabled={submitting}
                                        />
                                    </label>
                                )}

                            </div>

                            <p className="create-listing-image-note">
                                <Upload size={14} />
                                You can upload up to 10 images. Your first image will be used as the main product image.
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <div className="create-listing-submit">

                        {uploadStep && (
                            <div className="create-listing-upload-status">
                                <Loader2 size={18} className="spinning" />
                                <span>{uploadStep}</span>
                            </div>
                        )}

                        <div className="create-listing-submit-actions">

                            <Link to="/" className="create-listing-cancel">
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="create-listing-publish"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="spinning" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Publish Listing
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>

    );

}