import { useEffect, useState } from "react";
import { 
    Check, 
    Loader2, 
    RefreshCw, 
    ShieldCheck, 
    X,
    CheckCircle2,
    AlertCircle,
    Clock,
    Banknote,
    Users
} from "lucide-react";
import {
    getAdminSettlements,
    reviewSellerSettlement,
    verifySellerBankAccount,
    releasePendingSellerEarnings,
} from "../api/sellerFinance";
import type { SellerSettlement } from "../api/sellerFinance";

function formatMoney(value: number) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

// FIXED: Using replace with global flag instead of replaceAll
function statusLabel(value: string) {
    return value.replace(/_/g, " ").toLowerCase().replace(/^./, (letter: string) => letter.toUpperCase());
}

function getStatusBadge(status: string) {
    const statusMap: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
        PENDING: {
            label: "Pending",
            className: "badge-warning",
            icon: <Clock size={12} />
        },
        COMPLETED: {
            label: "Completed",
            className: "badge-success",
            icon: <CheckCircle2 size={12} />
        },
        FAILED: {
            label: "Failed",
            className: "badge-error",
            icon: <AlertCircle size={12} />
        },
        PROCESSING: {
            label: "Processing",
            className: "badge-info",
            icon: <Loader2 size={12} className="spinning" />
        }
    };

    return statusMap[status] || {
        label: status,
        className: "badge",
        icon: null
    };
}

export default function AdminSettlements() {
    const [settlements, setSettlements] = useState<SellerSettlement[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
        totalAmount: 0
    });

    // =====================================================
    // LOAD SETTLEMENTS
    // =====================================================

    async function loadSettlements() {
        try {
            setLoading(true);
            const data = await getAdminSettlements();
            setSettlements(data);
            
            // Calculate stats
            const total = data.length;
            const pending = data.filter(s => s.status === "PENDING").length;
            const completed = data.filter(s => s.status === "COMPLETED").length;
            const failed = data.filter(s => s.status === "FAILED").length;
            const totalAmount = data.reduce((sum, s) => sum + s.amount, 0);
            
            setStats({ total, pending, completed, failed, totalAmount });
        } catch (requestError: any) {
            showMessage(requestError?.response?.data?.message || "Unable to load settlements.", "error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSettlements();
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
    // VERIFY BANK ACCOUNT
    // =====================================================

    async function verifyAccount(accountId: string) {
        try {
            setBusyId(accountId);
            await verifySellerBankAccount(accountId);
            showMessage("Bank account verified successfully!", "success");
            await loadSettlements();
        } catch (requestError: any) {
            showMessage(requestError?.response?.data?.message || "Unable to verify bank account.", "error");
        } finally {
            setBusyId("");
        }
    }

    // =====================================================
    // REVIEW SETTLEMENT
    // =====================================================

    async function review(settlement: SellerSettlement, status: "COMPLETED" | "FAILED") {
        const failureReason = status === "FAILED" 
            ? window.prompt("Reason for failure") || "Settlement failed during admin review" 
            : undefined;
            
        if (status === "FAILED" && !failureReason) return;

        try {
            setBusyId(settlement.id);
            await reviewSellerSettlement(settlement.id, status, failureReason);
            
            const message = status === "COMPLETED" 
                ? "Settlement marked completed successfully!" 
                : "Settlement marked failed and funds returned.";
            showMessage(message, "success");
            await loadSettlements();
        } catch (requestError: any) {
            showMessage(requestError?.response?.data?.message || "Unable to review settlement.", "error");
        } finally {
            setBusyId("");
        }
    }

    // =====================================================
    // RELEASE EARNINGS
    // =====================================================

    async function releaseEarnings() {
        try {
            setBusyId("release-earnings");
            const result = await releasePendingSellerEarnings();
            showMessage(
                `${result.releasedCount} pending earning${result.releasedCount === 1 ? "" : "s"} released to available balance.`,
                "success"
            );
            await loadSettlements();
        } catch (requestError: any) {
            showMessage(requestError?.response?.data?.message || "Unable to release pending earnings.", "error");
        } finally {
            setBusyId("");
        }
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="admin-settlements-page">
                <div className="admin-settlements-container">
                    <div className="admin-settlements-loading">
                        <Loader2 size={32} className="spinning" />
                        <p>Loading settlements...</p>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="admin-settlements-page">

            <div className="admin-settlements-container">

                {/* HEADER */}
                <div className="admin-settlements-header">

                    <div className="admin-settlements-header-left">

                        <div className="admin-settlements-header-icon">
                            <Banknote size={28} />
                        </div>

                        <div>
                            <h1>Settlement Review</h1>
                            <p>
                                <span className="admin-settlements-badge">
                                    <ShieldCheck size={14} />
                                    Admin
                                </span>
                                Verify accounts and record manual payouts to keep seller funds auditable
                            </p>
                        </div>

                    </div>

                    <div className="admin-settlements-header-actions">

                        <button
                            type="button"
                            className="admin-settlements-release-btn"
                            onClick={releaseEarnings}
                            disabled={busyId === "release-earnings"}
                        >
                            {busyId === "release-earnings" ? (
                                <Loader2 size={16} className="spinning" />
                            ) : (
                                <RefreshCw size={16} />
                            )}
                            Release Pending Earnings
                        </button>

                        <button
                            type="button"
                            className="admin-settlements-refresh"
                            onClick={loadSettlements}
                            disabled={loading}
                        >
                            <RefreshCw size={16} className={loading ? "spinning" : ""} />
                            Refresh
                        </button>

                    </div>

                </div>

                {/* MESSAGES */}
                {message && (
                    <div className={`admin-settlements-message ${messageType}`}>
                        {messageType === "success" ? (
                            <CheckCircle2 size={18} />
                        ) : (
                            <AlertCircle size={18} />
                        )}
                        <span>{message}</span>
                    </div>
                )}

                {/* STATS CARDS */}
                <div className="admin-settlements-stats">

                    <div className="admin-settlements-stat">
                        <div className="admin-settlements-stat-icon total">
                            <Users size={20} />
                        </div>
                        <div className="admin-settlements-stat-content">
                            <span className="admin-settlements-stat-label">Total Requests</span>
                            <strong className="admin-settlements-stat-value">
                                {stats.total}
                            </strong>
                            <span className="admin-settlements-stat-sub">
                                {formatMoney(stats.totalAmount)} total
                            </span>
                        </div>
                    </div>

                    <div className="admin-settlements-stat">
                        <div className="admin-settlements-stat-icon pending">
                            <Clock size={20} />
                        </div>
                        <div className="admin-settlements-stat-content">
                            <span className="admin-settlements-stat-label">Pending</span>
                            <strong className="admin-settlements-stat-value">
                                {stats.pending}
                            </strong>
                            <span className="admin-settlements-stat-sub">
                                Awaiting review
                            </span>
                        </div>
                    </div>

                    <div className="admin-settlements-stat">
                        <div className="admin-settlements-stat-icon completed">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="admin-settlements-stat-content">
                            <span className="admin-settlements-stat-label">Completed</span>
                            <strong className="admin-settlements-stat-value">
                                {stats.completed}
                            </strong>
                            <span className="admin-settlements-stat-sub">
                                Successfully processed
                            </span>
                        </div>
                    </div>

                    <div className="admin-settlements-stat">
                        <div className="admin-settlements-stat-icon failed">
                            <AlertCircle size={20} />
                        </div>
                        <div className="admin-settlements-stat-content">
                            <span className="admin-settlements-stat-label">Failed</span>
                            <strong className="admin-settlements-stat-value">
                                {stats.failed}
                            </strong>
                            <span className="admin-settlements-stat-sub">
                                Rejected or failed
                            </span>
                        </div>
                    </div>

                </div>

                {/* SETTLEMENTS TABLE */}
                <div className="admin-settlements-card">

                    <div className="admin-settlements-card-header">
                        <div>
                            <h2>📋 Settlement Requests</h2>
                            <p>{settlements.length} request{settlements.length === 1 ? "" : "s"} to review</p>
                        </div>
                        {stats.pending > 0 && (
                            <span className="admin-settlements-pending-badge">
                                <AlertCircle size={14} />
                                {stats.pending} pending
                            </span>
                        )}
                    </div>

                    {settlements.length === 0 ? (

                        <div className="admin-settlements-empty">
                            <Banknote size={40} />
                            <h3>No settlement requests</h3>
                            <p>Settlement requests will appear here when sellers request payouts</p>
                        </div>

                    ) : (

                        <div className="admin-settlements-table-wrap">

                            <table className="admin-settlements-table">

                                <thead>
                                    <tr>
                                        <th>Seller</th>
                                        <th>Bank Account</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Requested</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {settlements.map((settlement) => {
                                        const statusInfo = getStatusBadge(settlement.status);
                                        const isPending = settlement.status === "PENDING";
                                        const isBusy = busyId === settlement.id;

                                        return (
                                            <tr key={settlement.id}>
                                                <td className="admin-settlements-table-seller">
                                                    <strong>{settlement.seller?.name ?? "Seller"}</strong>
                                                    <span>{settlement.seller?.email}</span>
                                                </td>
                                                <td className="admin-settlements-table-bank">
                                                    <strong>{settlement.bankAccount.bankName}</strong>
                                                    <span>
                                                        {settlement.bankAccount.accountName} · ****
                                                        {settlement.bankAccount.accountNumber.slice(-4)}
                                                    </span>
                                                </td>
                                                <td className="admin-settlements-table-amount">
                                                    {formatMoney(settlement.amount)}
                                                </td>
                                                <td>
                                                    <span className={`admin-settlements-status ${statusInfo.className}`}>
                                                        {statusInfo.icon}
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="admin-settlements-table-date">
                                                    {formatDate(settlement.requestedAt)}
                                                </td>
                                                <td>
                                                    <div className="admin-settlements-actions">

                                                        {isPending && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="admin-settlements-action verify"
                                                                    onClick={() => verifyAccount(settlement.bankAccountId)}
                                                                    disabled={isBusy}
                                                                    title="Verify bank account"
                                                                >
                                                                    <ShieldCheck size={15} />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="admin-settlements-action complete"
                                                                    onClick={() => review(settlement, "COMPLETED")}
                                                                    disabled={isBusy}
                                                                    title="Mark as completed"
                                                                >
                                                                    <Check size={15} />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="admin-settlements-action fail"
                                                                    onClick={() => review(settlement, "FAILED")}
                                                                    disabled={isBusy}
                                                                    title="Mark as failed"
                                                                >
                                                                    <X size={15} />
                                                                </button>
                                                            </>
                                                        )}

                                                        {!isPending && (
                                                            <span className="admin-settlements-action-disabled">
                                                                {settlement.status === "COMPLETED" ? (
                                                                    <CheckCircle2 size={15} className="text-success" />
                                                                ) : (
                                                                    <AlertCircle size={15} className="text-error" />
                                                                )}
                                                            </span>
                                                        )}

                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}