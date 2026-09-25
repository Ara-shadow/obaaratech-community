import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Banknote,
    Clock3,
    FileText,
    Loader2,
    Plus,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
    getSellerBalance,
    getSellerEarnings,
    getSellerBankAccounts,
    addSellerBankAccount,
    setDefaultSellerBankAccount,
    getSellerSettlements,
    requestSellerSettlement,
} from "../api/sellerFinance";
import type {
    SellerBankAccount,
    SellerBalance,
    SellerEarning,
    SellerSettlement,
} from "../api/sellerFinance";

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
    }).format(new Date(value));
}

// FIXED: Using replace with global flag instead of replaceAll
function statusLabel(value: string) {
    return value.replace(/_/g, " ").toLowerCase().replace(/^./, (letter: string) => letter.toUpperCase());
}

export default function SellerFinance() {
    const [balance, setBalance] = useState<SellerBalance | null>(null);
    const [earnings, setEarnings] = useState<SellerEarning[]>([]);
    const [bankAccounts, setBankAccounts] = useState<SellerBankAccount[]>([]);
    const [settlements, setSettlements] = useState<SellerSettlement[]>([]);
    const [accountForm, setAccountForm] = useState({
        bankName: "",
        bankCode: "",
        accountNumber: "",
        accountName: "",
    });
    const [settlementAmount, setSettlementAmount] = useState("");
    const [savingAccount, setSavingAccount] = useState(false);
    const [requestingSettlement, setRequestingSettlement] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadFinance() {
            try {
                setLoading(true);
                const [balanceData, earningsData, accountsData, settlementsData] = await Promise.all([
                    getSellerBalance(),
                    getSellerEarnings(),
                    getSellerBankAccounts(),
                    getSellerSettlements(),
                ]);

                if (mounted) {
                    setBalance(balanceData);
                    setEarnings(earningsData);
                    setBankAccounts(accountsData);
                    setSettlements(settlementsData);
                    setError("");
                }
            } catch (requestError: any) {
                if (mounted) {
                    setError(
                        requestError?.response?.data?.message ||
                        "Unable to load your finance summary."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadFinance();
        return () => {
            mounted = false;
        };
    }, []);

    async function handleAddAccount(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setSavingAccount(true);
            setActionMessage("");
            const account = await addSellerBankAccount(accountForm);
            setBankAccounts((current) => [account, ...current]);
            setAccountForm({ bankName: "", bankCode: "", accountNumber: "", accountName: "" });
            setActionMessage("Bank account added. It must be verified before settlement.");
        } catch (requestError: any) {
            setActionMessage(requestError?.response?.data?.message || "Unable to add bank account.");
        } finally {
            setSavingAccount(false);
        }
    }

    async function handleSetDefault(accountId: string) {
        try {
            const account = await setDefaultSellerBankAccount(accountId);
            setBankAccounts((current) => current.map((item) => ({
                ...item,
                isDefault: item.id === account.id,
            })));
            setActionMessage("Default bank account updated.");
        } catch (requestError: any) {
            setActionMessage(requestError?.response?.data?.message || "Unable to update default account.");
        }
    }

    async function handleRequestSettlement(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setRequestingSettlement(true);
            setActionMessage("");
            const settlement = await requestSellerSettlement(Number(settlementAmount));
            setSettlements((current) => [settlement, ...current]);
            setBalance((current) => current ? {
                ...current,
                availableBalance: current.availableBalance - settlement.amount,
            } : current);
            setSettlementAmount("");
            setActionMessage("Settlement request submitted for admin review.");
        } catch (requestError: any) {
            setActionMessage(requestError?.response?.data?.message || "Unable to request settlement.");
        } finally {
            setRequestingSettlement(false);
        }
    }

    if (loading) {
        return (
            <main className="page-container">
                <div className="my-listings-loading">
                    <Loader2 size={30} className="spinning" />
                    <p>Loading finance summary...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="page-container seller-finance-page">
            <Link to="/seller-dashboard" className="back-marketplace seller-finance-back">
                <ArrowLeft size={18} />
                Seller workspace
            </Link>

            <header className="seller-finance-header">
                <div>
                    <p className="seller-finance-eyebrow">Seller finance</p>
                    <h1>Earnings & balance</h1>
                    <p>Track what you have earned, what is pending, and every recorded movement.</p>
                </div>
                <div className="seller-finance-header-icon" aria-hidden="true">
                    <Wallet size={28} />
                </div>
            </header>

            {error && <div className="listing-form-message error" role="alert">{error}</div>}
            {actionMessage && <div className="listing-form-message" role="status">{actionMessage}</div>}

            <section className="seller-finance-summary" aria-label="Balance summary">
                <article className="seller-finance-card seller-finance-card-primary">
                    <span><Clock3 size={17} /> Pending balance</span>
                    <strong>{formatMoney(balance?.pendingBalance ?? 0)}</strong>
                    <small>Held during the settlement period</small>
                </article>
                <article className="seller-finance-card">
                    <span><Banknote size={17} /> Available balance</span>
                    <strong>{formatMoney(balance?.availableBalance ?? 0)}</strong>
                    <small>Eligible for settlement when enabled</small>
                </article>
                <article className="seller-finance-card">
                    <span><FileText size={17} /> Total sales</span>
                    <strong>{formatMoney(balance?.totalSales ?? 0)}</strong>
                    <small>{earnings.length} recorded earning{earnings.length === 1 ? "" : "s"}</small>
                </article>
            </section>

            <section className="seller-finance-tools">
                <div className="seller-finance-section seller-finance-account-panel">
                    <div className="seller-finance-section-heading">
                        <div>
                            <h2>Settlement account</h2>
                            <p>Add the bank account that should receive approved settlements.</p>
                        </div>
                        <ShieldCheck size={22} color="#0f766e" />
                    </div>

                    {bankAccounts.map((account) => (
                        <div className="seller-finance-account" key={account.id}>
                            <div>
                                <strong>{account.bankName}</strong>
                                <span>{account.accountName} · ****{account.accountNumber.slice(-4)}</span>
                            </div>
                            <div className="seller-finance-account-actions">
                                <span className={`seller-finance-status ${account.isVerified ? "seller-finance-status-verified" : ""}`}>
                                    {account.isVerified ? "Verified" : "Awaiting verification"}
                                </span>
                                {account.isDefault ? (
                                    <span className="seller-finance-default">Default</span>
                                ) : (
                                    <button type="button" className="seller-finance-text-button" onClick={() => handleSetDefault(account.id)}>
                                        Make default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <form className="seller-finance-account-form" onSubmit={handleAddAccount}>
                        <input required placeholder="Bank name" value={accountForm.bankName} onChange={(event) => setAccountForm({ ...accountForm, bankName: event.target.value })} />
                        <input required placeholder="Bank code" value={accountForm.bankCode} onChange={(event) => setAccountForm({ ...accountForm, bankCode: event.target.value })} />
                        <input required inputMode="numeric" placeholder="10-digit account number" value={accountForm.accountNumber} onChange={(event) => setAccountForm({ ...accountForm, accountNumber: event.target.value })} />
                        <input required placeholder="Account name" value={accountForm.accountName} onChange={(event) => setAccountForm({ ...accountForm, accountName: event.target.value })} />
                        <button type="submit" disabled={savingAccount} className="seller-finance-action-button">
                            <Plus size={17} />
                            {savingAccount ? "Adding..." : "Add account"}
                        </button>
                    </form>
                </div>

                <div className="seller-finance-section seller-finance-settlement-panel">
                    <div className="seller-finance-section-heading">
                        <div>
                            <h2>Request settlement</h2>
                            <p>Manual settlements require a verified default account and start at ₦1,000.</p>
                        </div>
                    </div>
                    <form className="seller-finance-settlement-form" onSubmit={handleRequestSettlement}>
                        <label htmlFor="settlement-amount">Amount</label>
                        <input id="settlement-amount" required type="number" min="1000" step="1" value={settlementAmount} onChange={(event) => setSettlementAmount(event.target.value)} placeholder="1000" />
                        <button type="submit" disabled={requestingSettlement || (balance?.availableBalance ?? 0) < 1000} className="seller-finance-action-button">
                            {requestingSettlement ? "Submitting..." : "Request settlement"}
                        </button>
                    </form>
                    <div className="seller-finance-settlement-list">
                        {settlements.length === 0 ? <p>No settlement requests yet.</p> : settlements.slice(0, 5).map((settlement) => (
                            <div className="seller-finance-settlement-row" key={settlement.id}>
                                <strong>{formatMoney(settlement.amount)}</strong>
                                <span>{statusLabel(settlement.status)} · {formatDate(settlement.requestedAt)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="seller-finance-section">
                <div className="seller-finance-section-heading">
                    <div>
                        <h2>Earnings history</h2>
                        <p>Commission and net earnings for completed marketplace payments.</p>
                    </div>
                </div>

                {earnings.length === 0 ? (
                    <div className="seller-finance-empty">
                        <FileText size={24} />
                        <p>Your earnings will appear here after a customer payment is verified.</p>
                    </div>
                ) : (
                    <div className="seller-finance-table-wrap">
                        <table className="seller-finance-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Sale</th>
                                    <th>Commission</th>
                                    <th>Net earning</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {earnings.map((earning) => (
                                    <tr key={earning.id}>
                                        <td>{earning.orderItem?.title ?? "Marketplace sale"}</td>
                                        <td>{formatMoney(earning.grossAmount)}</td>
                                        <td>{formatMoney(earning.commissionAmount)}</td>
                                        <td className="seller-finance-net">{formatMoney(earning.netAmount)}</td>
                                        <td><span className="seller-finance-status">{statusLabel(earning.status)}</span></td>
                                        <td>{formatDate(earning.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}