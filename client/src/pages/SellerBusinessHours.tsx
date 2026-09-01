import {
    useEffect,
    useState
} from "react";

import {
    ArrowLeft,
    Clock3,
    Loader2,
    Save,
    X,
    CheckCircle2,
    Calendar,
    AlertCircle
} from "lucide-react";

import {
    getSellerBusinessHours,
    updateSellerBusinessHours
} from "../api/sellerHours";

import type {
    SellerBusinessHour
} from "../api/sellerHours";

const DAYS = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

function defaultHours(): SellerBusinessHour[] {
    return DAYS.map((_, dayOfWeek) => ({
        dayOfWeek,
        isOpen: dayOfWeek !== 0,
        openingTime: dayOfWeek === 0 ? null : "08:00",
        closingTime: dayOfWeek === 0 ? null : "18:00"
    }));
}

function normalizeHours(hours: SellerBusinessHour[]): SellerBusinessHour[] {
    const defaults = defaultHours();

    return defaults.map(day =>
        hours.find(hour => hour.dayOfWeek === day.dayOfWeek) ?? day
    );
}

export default function SellerBusinessHours() {

    const [hours, setHours] = useState<SellerBusinessHour[]>(defaultHours);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [hasChanges, setHasChanges] = useState(false);

    // =====================================================
    // LOAD HOURS
    // =====================================================

    useEffect(() => {
        let mounted = true;

        async function loadHours() {
            try {
                const data = await getSellerBusinessHours();

                if (mounted) {
                    setHours(normalizeHours(data));
                }
            } catch (requestError) {
                console.error("Business hours loading error:", requestError);

                if (mounted) {
                    setError("Unable to load your business hours.");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadHours();

        return () => {
            mounted = false;
        };
    }, []);

    // =====================================================
    // UPDATE DAY
    // =====================================================

    function updateDay(dayOfWeek: number, changes: Partial<SellerBusinessHour>) {
        setHours(current => current.map(hour =>
            hour.dayOfWeek === dayOfWeek
                ? { ...hour, ...changes }
                : hour
        ));
        setHasChanges(true);
        // Clear previous messages when user makes changes
        setMessage("");
        setError("");
    }

    // =====================================================
    // TOGGLE DAY
    // =====================================================

    function toggleDay(dayOfWeek: number, isOpen: boolean) {
        updateDay(dayOfWeek, {
            isOpen,
            openingTime: isOpen ? "08:00" : null,
            closingTime: isOpen ? "18:00" : null
        });
    }

    // =====================================================
    // SAVE HOURS
    // =====================================================

    async function saveHours() {

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const saved = await updateSellerBusinessHours(hours.map(hour => ({
                dayOfWeek: hour.dayOfWeek,
                isOpen: hour.isOpen,
                openingTime: hour.isOpen ? hour.openingTime : null,
                closingTime: hour.isOpen ? hour.closingTime : null
            })));

            setHours(normalizeHours(saved));
            setHasChanges(false);
            setMessage("Business hours saved successfully!");

            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage("");
            }, 3000);

        } catch (requestError: any) {
            console.error("Business hours update error:", requestError);
            setError(requestError?.response?.data?.message || "Unable to save your business hours.");
        } finally {
            setSaving(false);
        }

    }

    // =====================================================
    // RESET CHANGES
    // =====================================================

    async function resetChanges() {
        try {
            setLoading(true);
            const data = await getSellerBusinessHours();
            setHours(normalizeHours(data));
            setHasChanges(false);
            setMessage("");
            setError("");
        } catch (requestError) {
            console.error("Reset hours error:", requestError);
            setError("Unable to reload business hours.");
        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // GET DAY ABBREVIATION
    // =====================================================

    function getDayAbbrev(day: string): string {
        return day.substring(0, 3);
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="business-hours-page">
                <div className="business-hours-container">
                    <div className="business-hours-loading">
                        <Loader2 size={32} className="spinning" />
                        <p>Loading business hours...</p>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="business-hours-page">

            <div className="business-hours-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="business-hours-header">

                    <div className="business-hours-header-left">

                        <a href="/account" className="business-hours-back">
                            <ArrowLeft size={18} />
                            Back to Account
                        </a>

                        <div className="business-hours-title">
                            <Clock3 size={28} />
                            <div>
                                <h1>Business Hours</h1>
                                <p>Set when customers can contact and order from you</p>
                            </div>
                        </div>

                    </div>

                    <div className="business-hours-header-actions">
                        {hasChanges && (
                            <button
                                type="button"
                                className="business-hours-reset-btn"
                                onClick={resetChanges}
                                disabled={saving}
                            >
                                <X size={16} />
                                Reset
                            </button>
                        )}
                        <button
                            type="button"
                            className="business-hours-save-btn"
                            onClick={saveHours}
                            disabled={saving || !hasChanges}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="spinning" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Hours
                                </>
                            )}
                        </button>
                    </div>

                </div>

                {/* =================================================
                    MESSAGES
                ================================================= */}

                {message && (
                    <div className="business-hours-message success">
                        <CheckCircle2 size={18} />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="business-hours-message error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* =================================================
                    INFO BOX
                ================================================= */}

                <div className="business-hours-info">
                    <div className="business-hours-info-icon">
                        <Clock3 size={18} />
                    </div>
                    <div className="business-hours-info-content">
                        <strong>How it works</strong>
                        <p>
                            Set your business hours so customers know when you're available.
                            Use 24-hour time format (e.g., 08:00 to 18:00).
                            Toggle a day off by switching the Open/Closed toggle.
                        </p>
                    </div>
                </div>

                {/* =================================================
                    HOURS GRID
                ================================================= */}

                <div className="business-hours-grid">

                    {hours.map((hour) => {

                        const dayName = DAYS[hour.dayOfWeek];
                        const isOpen = hour.isOpen;

                        return (

                            <div
                                key={hour.dayOfWeek}
                                className={`business-hours-day ${!isOpen ? "closed" : ""}`}
                            >

                                <div className="business-hours-day-header">

                                    <div className="business-hours-day-name">
                                        <span className="business-hours-day-abbrev">
                                            {getDayAbbrev(dayName)}
                                        </span>
                                        <span className="business-hours-day-full">
                                            {dayName}
                                        </span>
                                    </div>

                                    <label className="business-hours-toggle">
                                        <input
                                            type="checkbox"
                                            checked={isOpen}
                                            onChange={(e) => toggleDay(hour.dayOfWeek, e.target.checked)}
                                        />
                                        <span className="business-hours-toggle-slider">
                                            <span className="business-hours-toggle-label">
                                                {isOpen ? "Open" : "Closed"}
                                            </span>
                                        </span>
                                    </label>

                                </div>

                                <div className="business-hours-day-times">

                                    <div className="business-hours-time-group">
                                        <label htmlFor={`open-${hour.dayOfWeek}`}>Opens</label>
                                        <input
                                            id={`open-${hour.dayOfWeek}`}
                                            type="time"
                                            value={hour.openingTime || ""}
                                            disabled={!isOpen}
                                            onChange={(e) => updateDay(hour.dayOfWeek, {
                                                openingTime: e.target.value || null
                                            })}
                                            className={!isOpen ? "disabled" : ""}
                                        />
                                    </div>

                                    <span className="business-hours-time-separator">—</span>

                                    <div className="business-hours-time-group">
                                        <label htmlFor={`close-${hour.dayOfWeek}`}>Closes</label>
                                        <input
                                            id={`close-${hour.dayOfWeek}`}
                                            type="time"
                                            value={hour.closingTime || ""}
                                            disabled={!isOpen}
                                            onChange={(e) => updateDay(hour.dayOfWeek, {
                                                closingTime: e.target.value || null
                                            })}
                                            className={!isOpen ? "disabled" : ""}
                                        />
                                    </div>

                                </div>

                                {!isOpen && (
                                    <div className="business-hours-day-closed-badge">
                                        <span>Closed</span>
                                    </div>
                                )}

                            </div>

                        );

                    })}

                </div>

                {/* =================================================
                    SAVE FOOTER
                ================================================= */}

                <div className="business-hours-footer">

                    <div className="business-hours-footer-info">
                        {hasChanges && (
                            <span className="business-hours-footer-changes">
                                <AlertCircle size={16} />
                                You have unsaved changes
                            </span>
                        )}
                        {!hasChanges && !message && (
                            <span className="business-hours-footer-saved">
                                <CheckCircle2 size={16} />
                                All changes saved
                            </span>
                        )}
                    </div>

                    <div className="business-hours-footer-actions">

                        {hasChanges && (
                            <button
                                type="button"
                                className="business-hours-reset-btn"
                                onClick={resetChanges}
                                disabled={saving}
                            >
                                <X size={16} />
                                Reset
                            </button>
                        )}

                        <button
                            type="button"
                            className="business-hours-save-btn"
                            onClick={saveHours}
                            disabled={saving || !hasChanges}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="spinning" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Hours
                                </>
                            )}
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}