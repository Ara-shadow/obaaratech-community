import {
    useEffect,
    useState
} from "react";

import {
    ArrowLeft,
    Clock3,
    Loader2,
    Save
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

    function updateDay(dayOfWeek: number, changes: Partial<SellerBusinessHour>) {
        setHours(current => current.map(hour =>
            hour.dayOfWeek === dayOfWeek
                ? { ...hour, ...changes }
                : hour
        ));
    }

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
            setMessage("Business hours saved successfully.");
        } catch (requestError: any) {
            console.error("Business hours update error:", requestError);
            setError(requestError?.response?.data?.message || "Unable to save your business hours.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="account-page">
                <div className="account-container account-loading">
                    <Loader2 size={24} className="spinning" />
                    <span>Loading business hours...</span>
                </div>
            </main>
        );
    }

    return (
        <main className="account-page">
            <div className="account-container">
                <section className="account-header">
                    <div className="account-profile">
                        <div className="account-avatar"><Clock3 size={30} /></div>
                        <div>
                            <h1>Business Hours</h1>
                            <p>Set when customers can contact and order from you.</p>
                        </div>
                    </div>
                    <a href="/account" className="account-logout-button">
                        <ArrowLeft size={17} /> Back to account
                    </a>
                </section>

                <section className="account-info-card">
                    <p style={{ marginTop: 0, color: "#4b5563" }}>
                        Use 24-hour time. A closing time earlier than the opening time means the business stays open overnight. Set <strong>00:00 to 00:00</strong> for a 24-hour day.
                    </p>

                    {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
                    {message && <p style={{ color: "#15803d" }}>{message}</p>}

                    <div style={{ display: "grid", gap: "12px" }}>
                        {hours.map(hour => (
                            <div key={hour.dayOfWeek} style={{ display: "grid", gridTemplateColumns: "minmax(105px, 1fr) auto minmax(105px, 1fr) minmax(105px, 1fr)", gap: "12px", alignItems: "center", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
                                <strong>{DAYS[hour.dayOfWeek]}</strong>
                                <label style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                    <input type="checkbox" checked={hour.isOpen} onChange={event => updateDay(hour.dayOfWeek, { isOpen: event.target.checked, openingTime: event.target.checked ? (hour.openingTime || "08:00") : null, closingTime: event.target.checked ? (hour.closingTime || "18:00") : null })} />
                                    Open
                                </label>
                                <input aria-label={`${DAYS[hour.dayOfWeek]} opening time`} type="time" value={hour.openingTime || ""} disabled={!hour.isOpen} onChange={event => updateDay(hour.dayOfWeek, { openingTime: event.target.value })} />
                                <input aria-label={`${DAYS[hour.dayOfWeek]} closing time`} type="time" value={hour.closingTime || ""} disabled={!hour.isOpen} onChange={event => updateDay(hour.dayOfWeek, { closingTime: event.target.value })} />
                            </div>
                        ))}
                    </div>

                    <button type="button" className="create-listing-button" disabled={saving} onClick={saveHours} style={{ marginTop: "20px" }}>
                        {saving ? <Loader2 size={18} className="spinning" /> : <Save size={18} />} {saving ? "Saving..." : "Save business hours"}
                    </button>
                </section>
            </div>
        </main>
    );
}
