import { useEffect, useState } from "react";
import {
    ArrowRight,
    BadgeDollarSign,
    Loader2,
    Percent,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    CreditCard,
    Wallet,
    TrendingUp,
    Users,
    DollarSign,
    Save,
    X
} from "lucide-react";
import {
    getAdminFinancialSettings,
    getSellerBalancesOverview,
    updateAdminFinancialSettings,
    type MarketplaceFinancialSettings,
    type SellerBalanceOverview,
} from "../api/sellerFinance";

function formatMoney(value: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(value);
}

const emptySettings: MarketplaceFinancialSettings = {
    id: "",
    defaultCommissionRate: 8,
    freeCommissionRate: 8,
    premiumCommissionRate: 6,
    businessCommissionRate: 5,
    paymentFeeMode: "ABSORB_BY_PLATFORM",
    settlementSchedule: "MANUAL",
    minimumSettlementAmount: 1000,
    settlementEnabled: true,
    marketplaceEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export default function AdminFinance() {
    const [settings, setSettings] = useState<MarketplaceFinancialSettings>(emptySettings);
    const [balances, setBalances] = useState<SellerBalanceOverview[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [hasChanges, setHasChanges] = useState(false);

    // =====================================================
    // LOAD DATA
    // =====================================================

    async function loadData() {
        try {
            setLoading(true);
            const [settingsData, balancesData] = await Promise.all([
                getAdminFinancialSettings(),
                getSellerBalancesOverview(),
            ]);
            setSettings(settingsData);
            setBalances(balancesData);
            setHasChanges(false);
        } catch (requestError: any) {
            showMessage(requestError?.response?.data?.message || "Unable to load finance settings.", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
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
    // HANDLE SETTING CHANGE
    // =====================================================

    function handleSettingChange<K extends keyof MarketplaceFinancialSettings>(
        key: K, 
        value: MarketplaceFinancialSettings[K]
    ) {
        setSettings((current) => ({ ...current, [key]: value }));
        setHasChanges(true);
    }

    // =====================================================
    // HANDLE SAVE
    // =====================================================

    async function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        try {
            setSaving(true);
            setMessage("");

            const updated = await updateAdminFinancialSettings({
                defaultCommissionRate: Number(settings.defaultCommissionRate),
                freeCommissionRate: Number(settings.freeCommissionRate),
                premiumCommissionRate: Number(settings.premiumCommissionRate),
                businessCommissionRate: Number(settings.businessCommissionRate),
                paymentFeeMode: settings.paymentFeeMode,
                settlementSchedule: settings.settlementSchedule,
                minimumSettlementAmount: Number(settings.minimumSettlementAmount),
                settlementEnabled: Boolean(settings.settlementEnabled),
                marketplaceEnabled: Boolean(settings.marketplaceEnabled),
            });

            setSettings(updated);
            setHasChanges(false);
            showMessage("Marketplace finance settings saved successfully!", "success");

        } catch (requestError: any) {
            showMessage(requestError?.response?.data?.message || "Unable to save finance settings.", "error");
        } finally {
            setSaving(false);
        }
    }

    // =====================================================
    // RESET CHANGES
    // =====================================================

    async function resetChanges() {
        if (!hasChanges) return;
        await loadData();
        showMessage("Settings reset to saved values.", "success");
    }

    // =====================================================
    // GET STATUS LABEL
    // =====================================================

    function getStatusLabel(value: boolean) {
        return value ? "Enabled" : "Disabled";
    }

    function getStatusClass(value: boolean) {
        return value ? "active" : "inactive";
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="admin-finance-page">
                <div className="admin-finance-container">
                    <div className="admin-finance-loading">
                        <Loader2 size={32} className="spinning" />
                        <p>Loading finance settings...</p>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="admin-finance-page">

            <div className="admin-finance-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="admin-finance-header">

                    <div className="admin-finance-header-left">

                        <div className="admin-finance-header-icon">
                            <DollarSign size={28} />
                        </div>

                        <div>
                            <h1>Commission &amp; Seller Balance</h1>
                            <p>
                                <span className="admin-finance-badge">
                                    <ShieldCheck size={14} />
                                    Admin
                                </span>
                                Control marketplace commission, settlement policies, and seller cash positions
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="admin-finance-refresh"
                        onClick={loadData}
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
                    <div className={`admin-finance-message ${messageType}`}>
                        {messageType === "success" ? (
                            <CheckCircle2 size={18} />
                        ) : (
                            <AlertCircle size={18} />
                        )}
                        <span>{message}</span>
                    </div>
                )}

                {/* =================================================
                    STATS CARDS
                ================================================= */}

                <div className="admin-finance-stats">

                    <div className="admin-finance-stat">
                        <div className="admin-finance-stat-icon commission">
                            <Percent size={20} />
                        </div>
                        <div className="admin-finance-stat-content">
                            <span className="admin-finance-stat-label">Default Commission</span>
                            <strong className="admin-finance-stat-value">
                                {settings.defaultCommissionRate}%
                            </strong>
                            <span className="admin-finance-stat-sub">Applied to all listings</span>
                        </div>
                    </div>

                    <div className="admin-finance-stat">
                        <div className="admin-finance-stat-icon revenue">
                            <BadgeDollarSign size={20} />
                        </div>
                        <div className="admin-finance-stat-content">
                            <span className="admin-finance-stat-label">Total Available</span>
                            <strong className="admin-finance-stat-value">
                                {formatMoney(balances.reduce((sum, item) => sum + item.availableBalance, 0))}
                            </strong>
                            <span className="admin-finance-stat-sub">Across all sellers</span>
                        </div>
                    </div>

                    <div className="admin-finance-stat">
                        <div className="admin-finance-stat-icon sellers">
                            <Users size={20} />
                        </div>
                        <div className="admin-finance-stat-content">
                            <span className="admin-finance-stat-label">Active Sellers</span>
                            <strong className="admin-finance-stat-value">
                                {balances.filter(b => b.totalSales > 0).length}
                            </strong>
                            <span className="admin-finance-stat-sub">With sales activity</span>
                        </div>
                    </div>

                    <div className="admin-finance-stat">
                        <div className="admin-finance-stat-icon pending">
                            <Wallet size={20} />
                        </div>
                        <div className="admin-finance-stat-content">
                            <span className="admin-finance-stat-label">Total Pending</span>
                            <strong className="admin-finance-stat-value">
                                {formatMoney(balances.reduce((sum, item) => sum + item.pendingBalance, 0))}
                            </strong>
                            <span className="admin-finance-stat-sub">Awaiting settlement</span>
                        </div>
                    </div>

                </div>

                {/* =================================================
                    COMMISSION SETTINGS FORM
                ================================================= */}

                <div className="admin-finance-card">

                    <div className="admin-finance-card-header">
                        <div>
                            <h2>⚙️ Commission Settings</h2>
                            <p>These values drive marketplace take rates across seller plans</p>
                        </div>
                        {hasChanges && (
                            <div className="admin-finance-changes-badge">
                                <AlertCircle size={14} />
                                Unsaved changes
                            </div>
                        )}
                    </div>

                    <form className="admin-finance-form" onSubmit={handleSave}>

                        <div className="admin-finance-form-grid">

                            <div className="admin-finance-field">
                                <label htmlFor="default-commission">
                                    Default Commission
                                    <span className="admin-finance-field-hint">% of sale</span>
                                </label>
                                <input
                                    id="default-commission"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={settings.defaultCommissionRate}
                                    onChange={(e) => handleSettingChange("defaultCommissionRate", Number(e.target.value))}
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-finance-field">
                                <label htmlFor="free-commission">
                                    Free Plan Commission
                                    <span className="admin-finance-field-hint">% of sale</span>
                                </label>
                                <input
                                    id="free-commission"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={settings.freeCommissionRate}
                                    onChange={(e) => handleSettingChange("freeCommissionRate", Number(e.target.value))}
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-finance-field">
                                <label htmlFor="premium-commission">
                                    Premium Plan Commission
                                    <span className="admin-finance-field-hint">% of sale</span>
                                </label>
                                <input
                                    id="premium-commission"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={settings.premiumCommissionRate}
                                    onChange={(e) => handleSettingChange("premiumCommissionRate", Number(e.target.value))}
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-finance-field">
                                <label htmlFor="business-commission">
                                    Business Plan Commission
                                    <span className="admin-finance-field-hint">% of sale</span>
                                </label>
                                <input
                                    id="business-commission"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={settings.businessCommissionRate}
                                    onChange={(e) => handleSettingChange("businessCommissionRate", Number(e.target.value))}
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-finance-field">
                                <label htmlFor="payment-fee-mode">
                                    Payment Fee Mode
                                </label>
                                <select
                                    id="payment-fee-mode"
                                    value={settings.paymentFeeMode}
                                    onChange={(e) => handleSettingChange("paymentFeeMode", e.target.value as MarketplaceFinancialSettings["paymentFeeMode"])}
                                    disabled={saving}
                                >
                                    <option value="ABSORB_BY_PLATFORM">Absorb by platform</option>
                                    <option value="DEDUCT_FROM_SELLER">Deduct from seller</option>
                                    <option value="PASS_TO_CUSTOMER">Pass to customer</option>
                                </select>
                            </div>

                            <div className="admin-finance-field">
                                <label htmlFor="settlement-schedule">
                                    Settlement Schedule
                                </label>
                                <select
                                    id="settlement-schedule"
                                    value={settings.settlementSchedule}
                                    onChange={(e) => handleSettingChange("settlementSchedule", e.target.value as MarketplaceFinancialSettings["settlementSchedule"])}
                                    disabled={saving}
                                >
                                    <option value="MANUAL">Manual</option>
                                    <option value="DAILY">Daily</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="MONTHLY">Monthly</option>
                                </select>
                            </div>

                            <div className="admin-finance-field">
                                <label htmlFor="minimum-payout">
                                    Minimum Payout
                                    <span className="admin-finance-field-hint">₦</span>
                                </label>
                                <input
                                    id="minimum-payout"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={settings.minimumSettlementAmount}
                                    onChange={(e) => handleSettingChange("minimumSettlementAmount", Number(e.target.value))}
                                    disabled={saving}
                                />
                            </div>

                            <div className="admin-finance-field admin-finance-field-toggle">
                                <label htmlFor="marketplace-enabled">
                                    Marketplace Status
                                </label>
                                <div className="admin-finance-toggle-group">
                                    <button
                                        type="button"
                                        className={`admin-finance-toggle-btn ${settings.marketplaceEnabled ? "active" : ""}`}
                                        onClick={() => handleSettingChange("marketplaceEnabled", true)}
                                        disabled={saving}
                                    >
                                        <CheckCircle2 size={14} />
                                        Enabled
                                    </button>
                                    <button
                                        type="button"
                                        className={`admin-finance-toggle-btn ${!settings.marketplaceEnabled ? "active-danger" : ""}`}
                                        onClick={() => handleSettingChange("marketplaceEnabled", false)}
                                        disabled={saving}
                                    >
                                        <X size={14} />
                                        Disabled
                                    </button>
                                </div>
                            </div>

                            <div className="admin-finance-field admin-finance-field-toggle">
                                <label htmlFor="settlement-enabled">
                                    Settlement Status
                                </label>
                                <div className="admin-finance-toggle-group">
                                    <button
                                        type="button"
                                        className={`admin-finance-toggle-btn ${settings.settlementEnabled ? "active" : ""}`}
                                        onClick={() => handleSettingChange("settlementEnabled", true)}
                                        disabled={saving}
                                    >
                                        <CheckCircle2 size={14} />
                                        Enabled
                                    </button>
                                    <button
                                        type="button"
                                        className={`admin-finance-toggle-btn ${!settings.settlementEnabled ? "active-danger" : ""}`}
                                        onClick={() => handleSettingChange("settlementEnabled", false)}
                                        disabled={saving}
                                    >
                                        <X size={14} />
                                        Disabled
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div className="admin-finance-form-actions">
                            {hasChanges && (
                                <button
                                    type="button"
                                    className="admin-finance-reset-btn"
                                    onClick={resetChanges}
                                    disabled={saving}
                                >
                                    <X size={16} />
                                    Reset
                                </button>
                            )}
                            <button
                                type="submit"
                                className="admin-finance-submit-btn"
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
                                        Save Settings
                                    </>
                                )}
                            </button>
                        </div>

                    </form>

                </div>

                {/* =================================================
                    SELLER BALANCES TABLE
                ================================================= */}

                <div className="admin-finance-card">

                    <div className="admin-finance-card-header">
                        <div>
                            <h2>💰 Seller Balances</h2>
                            <p>Live cash position for each seller in the marketplace</p>
                        </div>
                        <span className="admin-finance-count">
                            {balances.length} seller{balances.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    {balances.length === 0 ? (

                        <div className="admin-finance-empty">
                            <Wallet size={40} />
                            <h3>No seller balances</h3>
                            <p>Seller balances will appear here once sales are made</p>
                        </div>

                    ) : (

                        <div className="admin-finance-table-wrap">

                            <table className="admin-finance-table">

                                <thead>
                                    <tr>
                                        <th>Seller</th>
                                        <th>Pending</th>
                                        <th>Available</th>
                                        <th>Total Sales</th>
                                        <th>Commission</th>
                                        <th>Settled</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {balances.map((balance) => (
                                        <tr key={balance.id}>
                                            <td className="admin-finance-table-seller">
                                                <strong>{balance.user?.name ?? "Seller"}</strong>
                                                <span>{balance.user?.email ?? "Unknown email"}</span>
                                            </td>
                                            <td className="admin-finance-table-amount pending">
                                                {formatMoney(balance.pendingBalance)}
                                            </td>
                                            <td className="admin-finance-table-amount available">
                                                {formatMoney(balance.availableBalance)}
                                            </td>
                                            <td className="admin-finance-table-amount">
                                                {formatMoney(balance.totalSales)}
                                            </td>
                                            <td className="admin-finance-table-amount commission">
                                                {formatMoney(balance.totalCommission)}
                                            </td>
                                            <td className="admin-finance-table-amount">
                                                {formatMoney(balance.totalSettled)}
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