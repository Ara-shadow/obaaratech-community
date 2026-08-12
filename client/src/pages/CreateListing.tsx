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
    ImagePlus,
    Loader2,
    MapPin,
    Trash2,
    Upload,
    X
} from "lucide-react";

import {
    createListing,
    uploadListingImage
} from "../api/listings";

import {
    getCategoryTree
} from "../api/categories";


interface Category {

    id: string;

    name: string;

    slug?: string | null;

    icon?: string | null;

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

    {
        value: "PRODUCT",
        label: "Product"
    },

    {
        value: "SERVICE",
        label: "Service"
    },

    {
        value: "PROPERTY",
        label: "Property"
    },

    {
        value: "VEHICLE",
        label: "Vehicle"
    },

    {
        value: "JOB",
        label: "Job"
    },

    {
        value: "COURSE",
        label: "Course"
    },

    {
        value: "EVENT",
        label: "Event"
    },

    {
        value: "ANNOUNCEMENT",
        label: "Announcement"
    }

] as const;


type ListingType =
    typeof LISTING_TYPES[number]["value"];

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
 
// =====================================================
// CONDITION OPTIONS BY LISTING TYPE
// =====================================================

const CONDITION_OPTIONS = {

    PRODUCT: [
        {
            value: "NEW",
            label: "New"
        },
        {
            value: "USED",
            label: "Used"
        },
        {
            value: "NIGERIA_USED",
            label: "Nigeria Used"
        },
        {
            value: "UK_USED",
            label: "UK Used"
        }
    ],


    VEHICLE: [
        {
            value: "BRAND_NEW",
            label: "Brand New"
        },
        {
            value: "FOREIGN_USED",
            label: "Foreign Used"
        },
        {
            value: "NIGERIA_USED",
            label: "Nigeria Used"
        }
    ],


    PROPERTY: [
        {
            value: "NEW_BUILD",
            label: "New Build"
        },
        {
            value: "OLD_BUILDING",
            label: "Old Building"
        },
        {
            value: "RENOVATED",
            label: "Renovated"
        }
    ]

} as const;
// =====================================================
// DYNAMIC DETAILS FIELDS
// =====================================================

const DETAILS_FIELDS = {

    PRODUCT: [
        {
            key: "brand",
            label: "Brand"
        },
        {
            key: "model",
            label: "Model"
        },
        {
            key: "color",
            label: "Color"
        },
        {
            key: "warranty",
            label: "Warranty"
        }
    ],


    VEHICLE: [
        {
            key: "make",
            label: "Make"
        },
        {
            key: "model",
            label: "Model"
        },
        {
            key: "year",
            label: "Year"
        },
        {
            key: "mileage",
            label: "Mileage"
        },
        {
            key: "fuel",
            label: "Fuel Type"
        },
        {
            key: "transmission",
            label: "Transmission"
        }
    ],


    PROPERTY: [
        {
            key: "propertyType",
            label: "Property Type"
        },
        {
            key: "bedrooms",
            label: "Bedrooms"
        },
        {
            key: "bathrooms",
            label: "Bathrooms"
        },
        {
            key: "landSize",
            label: "Land Size"
        }
    ]

} as const;


export default function CreateListing() {

    const navigate =
        useNavigate();


    // =====================================================
    // FORM STATE
    // =====================================================

    const [
        title,
        setTitle
    ] = useState("");


    const [
    description,
    setDescription
] = useState("");


    const [
        price,
        setPrice
    ] = useState("");

const [
    condition,
    setCondition
] = useState<ListingCondition | "">("");

    const [
        negotiable,
        setNegotiable
    ] = useState(false);


    const [
        type,
        setType
    ] = useState<ListingType>(
        "PRODUCT"
    );

    const availableConditions =
    CONDITION_OPTIONS[
        type as keyof typeof CONDITION_OPTIONS
    ] || [];

    const detailFields =
    DETAILS_FIELDS[
        type as keyof typeof DETAILS_FIELDS
    ] || [];

    const [
        location,
        setLocation
    ] = useState("");


    const [
        categoryId,
        setCategoryId
    ] = useState("");

// =====================================================
// DYNAMIC LISTING DETAILS
// =====================================================

const [
    details,
    setDetails
] = useState<Record<string, any>>({});

    // =====================================================
    // CATEGORY STATE
    // =====================================================

    const [
        categories,
        setCategories
    ] = useState<Category[]>([]);


    const [
        categoriesLoading,
        setCategoriesLoading
    ] = useState(true);


    const [
        categoryError,
        setCategoryError
    ] = useState("");


    // =====================================================
    // IMAGE STATE
    // =====================================================

    const [
        images,
        setImages
    ] = useState<SelectedImage[]>([]);


    // =====================================================
    // SUBMISSION STATE
    // =====================================================

    const [
        submitting,
        setSubmitting
    ] = useState(false);


    const [
        submitError,
        setSubmitError
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage
    ] = useState("");


    const [
        uploadStep,
        setUploadStep
    ] = useState("");


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    useEffect(() => {

        let mounted = true;


        getCategoryTree()

            .then((data) => {

                if (!mounted) {
                    return;
                }


                setCategories(
                    Array.isArray(data)
                        ? data
                        : []
                );

            })

            .catch((error) => {

                console.error(
                    "Category loading error:",
                    error
                );


                if (!mounted) {
                    return;
                }


                setCategoryError(
                    "Unable to load categories."
                );

            })

            .finally(() => {

                if (mounted) {

                    setCategoriesLoading(
                        false
                    );

                }

            });


        return () => {

            mounted = false;

        };

    }, []);


    // =====================================================
    // FLATTEN CATEGORY TREE
    // =====================================================

    const flattenedCategories =
        useMemo(() => {

            const result: {
                id: string;
                name: string;
                level: number;
            }[] = [];


            function walk(
                items: Category[],
                level = 0
            ) {

                for (
                    const category
                    of items
                ) {

                    result.push({

                        id:
                            category.id,

                        name:
                            category.name,

                        level

                    });


                    if (
                        category.children &&
                        category.children.length
                    ) {

                        walk(
                            category.children,
                            level + 1
                        );

                    }

                }

            }


            walk(
                categories
            );


            return result;

        }, [
            categories
        ]);


    // =====================================================
    // IMAGE SELECTION
    // =====================================================

    function handleImageSelection(
        event: ChangeEvent<HTMLInputElement>
    ) {

        const selectedFiles =
            Array.from(
                event.target.files ?? []
            );


        if (!selectedFiles.length) {
            return;
        }


        const remainingSlots =
            Math.max(
                0,
                10 - images.length
            );


        const filesToAdd =
            selectedFiles.slice(
                0,
                remainingSlots
            );


        const newImages =
            filesToAdd.map(
                (file) => ({

                    id:
                        `${Date.now()}-${Math.random()
                            .toString(36)
                            .slice(2)}`,

                    file,

                    preview:
                        URL.createObjectURL(
                            file
                        ),

                    progress: 0,

                    uploaded: false,

                    error: ""

                })
            );


        setImages(
            (current) => [
                ...current,
                ...newImages
            ]
        );


        // Allow selecting the same
        // file again later.

        event.target.value = "";

    }


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    function removeImage(
        imageId: string
    ) {

        setImages(
            (current) => {

                const image =
                    current.find(
                        item =>
                            item.id === imageId
                    );


                if (image) {

                    URL.revokeObjectURL(
                        image.preview
                    );

                }


                return current.filter(
                    item =>
                        item.id !== imageId
                );

            }
        );

    }


    // =====================================================
    // VALIDATE FORM
    // =====================================================

    function validateForm(): string {

        if (
            title.trim().length < 3
        ) {

            return "Please enter a product title of at least 3 characters.";

        }


        if (
            description.trim().length < 10
        ) {

            return "Please provide a description of at least 10 characters.";

        }


        if (
            location.trim().length < 2
        ) {

            return "Please enter the listing location.";

        }


        if (
            price.trim()
        ) {

            const numericPrice =
                Number(price);


            if (
                !Number.isFinite(
                    numericPrice
                ) ||
                numericPrice < 0
            ) {

                return "Please enter a valid price.";

            }

        }


        return "";

    }


    // =====================================================
    // SUBMIT LISTING
    // =====================================================

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();


        setSubmitError("");

        setSuccessMessage("");

        setUploadStep("");


        const validationError =
            validateForm();


        if (validationError) {

            setSubmitError(
                validationError
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;

        }


        try {

            setSubmitting(true);


            // =================================================
            // CREATE LISTING
            // =================================================

            setUploadStep(
                "Creating your listing..."
            );


            const listing =
     await createListing({

    title:
        title.trim(),

    description:
        description.trim(),

    ...(price.trim()
        ? {
            price:
                Number(price)
        }
        : {}),

    negotiable,

    condition:
        condition || undefined,

    type,

    location:
        location.trim(),

    ...(categoryId
        ? {
            categoryId
        }
        : {}),

    details

});


            // =================================================
            // UPLOAD IMAGES
            // =================================================

            if (images.length) {

                for (
                    let index = 0;
                    index < images.length;
                    index++
                ) {

                    const image =
                        images[index];


                    setUploadStep(
                        `Uploading image ${index + 1} of ${images.length}...`
                    );


                    try {

                        await uploadListingImage(

                            listing.id,

                            image.file,

                            (progress) => {

                                setImages(
                                    current =>
                                        current.map(
                                            item =>
                                                item.id === image.id
                                                    ? {
                                                        ...item,
                                                        progress
                                                    }
                                                    : item
                                        )
                                );

                            }

                        );


                        setImages(
                            current =>
                                current.map(
                                    item =>
                                        item.id === image.id
                                            ? {
                                                ...item,
                                                progress: 100,
                                                uploaded: true,
                                                error: ""
                                            }
                                            : item
                                )
                        );

                    } catch (error) {

                        console.error(
                            "Image upload error:",
                            error
                        );


                        setImages(
                            current =>
                                current.map(
                                    item =>
                                        item.id === image.id
                                            ? {
                                                ...item,
                                                error:
                                                    "Image upload failed."
                                            }
                                            : item
                                )
                        );

                    }

                }

            }


            // =================================================
            // SUCCESS
            // =================================================

            setSuccessMessage(
                "Your listing has been published successfully."
            );


            setUploadStep(
                "Opening your listing..."
            );


            setTimeout(() => {

                navigate(
                    `/product/${listing.id}`
                );

            }, 900);


        } catch (error: any) {

            console.error(
                "Create listing error:",
                error
            );


            const message =
                error?.response?.data?.message ||
                "Unable to create your listing. Please try again.";


            setSubmitError(
                message
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

            images.forEach(
                image => {

                    URL.revokeObjectURL(
                        image.preview
                    );

                }
            );

        };

    }, []);


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <main className="create-listing-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="create-listing-header">

                <div>

                    <Link
                        to="/"
                        className="back-marketplace"
                    >

                        <ArrowLeft
                            size={18}
                        />

                        Back to Marketplace

                    </Link>


                    <h1>
                        Sell on Obaaratech
                    </h1>


                    <p>
                        Create a listing and connect
                        with buyers across the marketplace.
                    </p>

                </div>

            </div>


            {/* =================================================
                MESSAGES
            ================================================= */}

            {submitError && (

                <div
                    className="listing-form-message error"
                    role="alert"
                >

                    <X size={20} />

                    <span>
                        {submitError}
                    </span>

                </div>

            )}


            {successMessage && (

                <div
                    className="listing-form-message success"
                    role="status"
                >

                    <CheckCircle2
                        size={20}
                    />

                    <span>
                        {successMessage}
                    </span>

                </div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <form
                className="create-listing-form"
                onSubmit={handleSubmit}
            >


                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <section className="listing-form-card">

                    <div className="listing-form-section-heading">

                        <div>

                            <span>
                                01
                            </span>

                            <div>

                                <h2>
                                    Basic Information
                                </h2>

                                <p>
                                    Tell buyers what you are offering.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TITLE */}

                    <div className="form-field">

                        <label htmlFor="listing-title">

                            Listing Title

                            <span>
                                *
                            </span>

                        </label>


                        <input
                            id="listing-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. iPhone 15 Pro Max 256GB"
                            maxLength={120}
                            disabled={submitting}
                        />


                        <small>
                            {title.length}/120
                        </small>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-field">

                        <label htmlFor="listing-description">

                            Description

                            <span>
                                *
                            </span>

                        </label>


                 <textarea
    id="listing-description"
    value={description}
    onChange={(event) =>
        setDescription(
            event.target.value
        )
    }
    placeholder="Describe the item, service, condition, important features and anything buyers should know..."
    rows={7}
    maxLength={3000}
    disabled={submitting}
/>

                        <small>
                            {description.length}/3000
                        </small>

                    </div>


                    {/* TYPE */}

                    <div className="form-field">

                        <label htmlFor="listing-type">

                            Listing Type

                            <span>
                                *
                            </span>

                        </label>


                        <select
                            id="listing-type"
                            value={type}
                           onChange={(event) => {

    const selectedType =
        event.target.value as ListingType;


    setType(
        selectedType
    );


    setCondition("");

}}
                            disabled={submitting}
                        >

                            {LISTING_TYPES.map(
                                item => (

                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >

                                        {item.label}

                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </section>

{
detailFields.length > 0 && (

<section className="listing-form-card">

<h3>
Additional Details
</h3>


{
detailFields.map((field)=> (

<div 
className="form-field"
key={field.key}
>

<label>
{field.label}
</label>


<input

type="text"

value={
details[field.key] || ""
}

onChange={(event)=>{

setDetails({

...details,

[field.key]:
event.target.value

});

}}

/>

</div>

))

}


</section>

)
}

                {/* =================================================
                    PRICE & CATEGORY
                ================================================= */}

                <section className="listing-form-card">

                    <div className="listing-form-section-heading">

                        <div>

                            <span>
                                02
                            </span>

                            <div>

                                <h2>
                                    Price & Category
                                </h2>

                                <p>
                                    Help buyers find and understand your listing.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="form-row">


                        {/* PRICE */}

                        <div className="form-field">

                            <label htmlFor="listing-price">

                                Price

                            </label>


                            <div className="price-input-wrapper">

                                <span>
                                    ₦
                                </span>


                                <input
                                    id="listing-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(event) =>
                                        setPrice(
                                            event.target.value
                                        )
                                    }
                                    placeholder="0"
                                    disabled={submitting}
                                />

                            </div>


                            <small>
                                Leave empty if buyers should contact you for pricing.
                            </small>

                        </div>

                    <div className="form-field">

    <label htmlFor="listing-condition">

        Condition

    </label>

    <select
        id="listing-condition"
        value={condition}
        onChange={(event) =>
            setCondition(
                event.target.value as
                    | "NEW"
                    | "USED"
                    | "UK_USED"
                    | "NIGERIA_USED"
                    | ""
            )
        }
        disabled={submitting}
    >

       {
    availableConditions.map(
        option => (

            <option
                key={option.value}
                value={option.value}
            >

                {option.label}

            </option>

        )
    )
}

    </select>

</div>

                        {/* CATEGORY */}

                        <div className="form-field">

                            <label htmlFor="listing-category">

                                Category

                            </label>


                            <select
                                id="listing-category"
                                value={categoryId}
                                onChange={(event) =>
                                    setCategoryId(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    submitting ||
                                    categoriesLoading
                                }
                            >

                                <option value="">

                                    {categoriesLoading
                                        ? "Loading categories..."
                                        : "Select a category"}

                                </option>


                                {flattenedCategories.map(
                                    category => (

                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >

                                            {"— ".repeat(
                                                category.level
                                            )}

                                            {category.name}

                                        </option>

                                    )
                                )}

                            </select>


                            {categoryError && (

                                <small className="field-error">

                                    {categoryError}

                                </small>

                            )}

                        </div>

                    </div>


                    {/* NEGOTIABLE */}

                    <label className="checkbox-field">

                        <input
                            type="checkbox"
                            checked={negotiable}
                            onChange={(event) =>
                                setNegotiable(
                                    event.target.checked
                                )
                            }
                            disabled={submitting}
                        />


                        <span>

                            <strong>
                                Price is negotiable
                            </strong>

                            <small>
                                Buyers can contact you to negotiate the price.
                            </small>

                        </span>

                    </label>

                </section>


                {/* =================================================
                    LOCATION
                ================================================= */}

                <section className="listing-form-card">

                    <div className="listing-form-section-heading">

                        <div>

                            <span>
                                03
                            </span>

                            <div>

                                <h2>
                                    Location
                                </h2>

                                <p>
                                    Let buyers know where the listing is located.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="form-field">

                        <label htmlFor="listing-location">

                            Location

                            <span>
                                *
                            </span>

                        </label>


                        <div className="location-input-wrapper">

                            <MapPin
                                size={19}
                            />


                            <input
                                id="listing-location"
                                type="text"
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Ikeja, Lagos"
                                maxLength={150}
                                disabled={submitting}
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    IMAGES
                ================================================= */}

                <section className="listing-form-card">

                    <div className="listing-form-section-heading">

                        <div>

                            <span>
                                04
                            </span>

                            <div>

                                <h2>
                                    Product Images
                                </h2>

                                <p>
                                    Good photos help buyers trust your listing.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="image-upload-area">


                        {/* UPLOAD BUTTON */}

                        {images.length < 10 && (

                            <label
                                className={
                                    submitting
                                        ? "image-upload-button disabled"
                                        : "image-upload-button"
                                }
                            >

                                <ImagePlus
                                    size={28}
                                />


                                <strong>
                                    Add Photos
                                </strong>


                                <span>
                                    JPG, PNG or WEBP
                                </span>


                                <small>
                                    Up to 10 images
                                </small>


                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={
                                        handleImageSelection
                                    }
                                    disabled={submitting}
                                />

                            </label>

                        )}


                        {/* PREVIEWS */}

                        {images.length > 0 && (

                            <div className="selected-images">

                                {images.map(
                                    (image, index) => (

                                        <div
                                            className="selected-image"
                                            key={image.id}
                                        >

                                            <img
                                                src={image.preview}
                                                alt={
                                                    `Selected listing image ${index + 1}`
                                                }
                                            />


                                            <div className="selected-image-number">

                                                {index + 1}

                                            </div>


                                            {!submitting && (

                                                <button
                                                    type="button"
                                                    className="remove-image-button"
                                                    onClick={() =>
                                                        removeImage(
                                                            image.id
                                                        )
                                                    }
                                                    aria-label={
                                                        `Remove image ${index + 1}`
                                                    }
                                                >

                                                    <Trash2
                                                        size={17}
                                                    />

                                                </button>

                                            )}


                                            {submitting && (

                                                <div className="image-upload-progress">

                                                    {image.uploaded
                                                        ? "Uploaded"
                                                        : image.error
                                                            ? "Failed"
                                                            : `${image.progress}%`}

                                                </div>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    <p className="image-upload-note">

                        <Upload
                            size={16}
                        />

                        You can upload up to 10 images.
                        Your first image will be used as the main
                        product image.

                    </p>

                </section>


                {/* =================================================
                    SUBMIT
                ================================================= */}

                <section className="listing-submit-card">

                    {uploadStep && (

                        <div className="listing-upload-status">

                            <Loader2
                                size={18}
                                className="spinning"
                            />

                            <span>
                                {uploadStep}
                            </span>

                        </div>

                    )}


                    <div className="listing-submit-actions">

                        <Link
                            to="/"
                            className="cancel-listing-button"
                        >

                            Cancel

                        </Link>


                        <button
                            type="submit"
                            className="publish-listing-button"
                            disabled={submitting}
                        >

                            {submitting ? (

                                <>

                                    <Loader2
                                        size={19}
                                        className="spinning"
                                    />

                                    Publishing...

                                </>

                            ) : (

                                <>

                                    <Upload
                                        size={19}
                                    />

                                    Publish Listing

                                </>

                            )}

                        </button>

                    </div>

                </section>

            </form>

        </main>

    );

}