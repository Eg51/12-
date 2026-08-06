// app/components/QChat.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    X,
    Check,
    AlertCircle,
    Loader2,
    DollarSign,
    RefreshCw,
    Edit,
    Save,
    Plus,
    Trash2,
    Calendar,
    Clock,
    User,
    Users,
    CreditCard,
    Wallet,
    PieChart,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Send,
    Search,
    Star,
    Eye,
    EyeOff,
    MoreVertical,
} from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

// ============================================================================
// TYPES
// ============================================================================

interface UpcomingBill {
    id: string;
    name: string;
    dueIn: string;
    amount: string;
    category: string;
}

interface Transaction {
    id: string;
    merchant: string;
    type: string;
    category: string;
    date: string;
    status: "completed" | "pending" | "failed";
    amount: string;
    isNegative: boolean;
    icon: React.ReactNode;
}

interface QuickContact {
    id: string;
    name: string;
    avatar: string;
    initials: string;
}

interface SpendingCategory {
    name: string;
    percentage: number;
    color: string;
}

interface QChatProps {
    /** Current portfolio value */
    portfolioValue: string;
    /** Current portfolio change percentage */
    portfolioChange: string;
    /** Callback when portfolio is updated */
    onPortfolioUpdate: (newValue: string, newChange: string) => void;
    /** Callback when recent bills are updated */
    onRecentBillsUpdate?: (newBills: UpcomingBill[]) => void;
    /** Callback when transactions are updated */
    onTransactionsUpdate?: (newTransactions: Transaction[]) => void;
    /** Callback when spending categories are updated */
    onSpendingCategoriesUpdate?: (newCategories: SpendingCategory[]) => void;
    /** Callback when quick contacts are updated */
    onQuickContactsUpdate?: (newContacts: QuickContact[]) => void;
    /** Current recent bills */
    recentBills?: UpcomingBill[];
    /** Current transactions */
    transactions?: Transaction[];
    /** Current spending categories */
    spendingCategories?: SpendingCategory[];
    /** Current quick contacts */
    quickContacts?: QuickContact[];
    /** Optional className for custom styling */
    className?: string;
    /** Optional button label */
    buttonLabel?: string;
    /** Optional admin check - if true, only admins can update */
    requireAdmin?: boolean;
    /** Optional user ID for admin check */
    userId?: string;
}

// ============================================================================
// QCHAT COMPONENT
// ============================================================================

export default function QChat({
    portfolioValue,
    portfolioChange,
    onPortfolioUpdate,
    onRecentBillsUpdate,
    onTransactionsUpdate,
    onSpendingCategoriesUpdate,
    onQuickContactsUpdate,
    recentBills = [],
    transactions = [],
    spendingCategories = [],
    quickContacts = [],
    className = "",
    buttonLabel = "Update Portfolio",
    requireAdmin = false,
    userId = "",
}: QChatProps) {
    // ============================================================================
    // STATE
    // ============================================================================

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"portfolio" | "bills" | "transactions" | "categories" | "contacts">("portfolio");
    const [newValue, setNewValue] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
    const [history, setHistory] = useState<Array<{ value: string, change: string, timestamp: string }>>([]);

    // Bill state
    const [editingBill, setEditingBill] = useState<UpcomingBill | null>(null);
    const [billForm, setBillForm] = useState<Partial<UpcomingBill>>({});
    const [isAddingBill, setIsAddingBill] = useState(false);

    // Transaction state
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [transactionForm, setTransactionForm] = useState<Partial<Transaction>>({});
    const [isAddingTransaction, setIsAddingTransaction] = useState(false);

    // Category state
    const [editingCategory, setEditingCategory] = useState<SpendingCategory | null>(null);
    const [categoryForm, setCategoryForm] = useState<Partial<SpendingCategory>>({});
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    // Contact state
    const [editingContact, setEditingContact] = useState<QuickContact | null>(null);
    const [contactForm, setContactForm] = useState<Partial<QuickContact>>({});
    const [isAddingContact, setIsAddingContact] = useState(false);

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (requireAdmin && userId) {
            checkAdminStatus();
        } else if (!requireAdmin) {
            setIsAdmin(true);
        }
    }, [requireAdmin, userId]);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('portfolioHistory');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (err) {
            console.warn('Could not load portfolio history:', err);
        }
    }, []);

    useEffect(() => {
        try {
            if (history.length > 0) {
                localStorage.setItem('portfolioHistory', JSON.stringify(history));
            }
        } catch (err) {
            console.warn('Could not save portfolio history:', err);
        }
    }, [history]);

    // ============================================================================
    // HELPERS
    // ============================================================================

    const checkAdminStatus = async () => {
        if (!userId) return;

        setIsCheckingAdmin(true);
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsAdmin(userData?.role === "admin" || userData?.isAdmin === true);
            } else {
                setIsAdmin(false);
            }
        } catch (err) {
            console.error("Error checking admin status:", err);
            setIsAdmin(false);
        } finally {
            setIsCheckingAdmin(false);
        }
    };

    const parseCurrency = (value: string): number => {
        return parseFloat(value.replace(/[^0-9.]/g, ""));
    };

    const formatCurrency = (value: number): string => {
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const validateValue = (value: string): boolean => {
        if (!value) {
            setError("Please enter a value");
            return false;
        }

        const numericValue = parseCurrency(value);
        if (isNaN(numericValue) || numericValue <= 0) {
            setError("Please enter a valid positive number");
            return false;
        }

        if (numericValue > 9999999999) {
            setError("Value is too large. Please enter a smaller number.");
            return false;
        }

        return true;
    };

    const saveToFirestore = async (data: any) => {
        if (!userId) return;
        try {
            const userDocRef = doc(db, "users", userId);
            await setDoc(userDocRef, {
                dashboardData: data,
                updatedAt: serverTimestamp(),
            }, { merge: true });
        } catch (err) {
            console.warn("Could not save to Firestore:", err);
        }
    };

    // ============================================================================
    // PORTFOLIO HANDLERS
    // ============================================================================

    const handlePortfolioUpdate = async () => {
        if (!validateValue(newValue)) return;

        setIsLoading(true);
        setError("");

        try {
            const newNumeric = parseCurrency(newValue);
            const currentNumeric = parseCurrency(portfolioValue);

            let change = 0;
            if (currentNumeric > 0) {
                change = ((newNumeric - currentNumeric) / currentNumeric) * 100;
            }
            const changeFormatted = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
            const formattedValue = formatCurrency(newNumeric);

            // Save to Firestore
            await saveToFirestore({
                portfolioValue: formattedValue,
                portfolioChange: changeFormatted,
            });

            const newHistoryEntry = {
                value: formattedValue,
                change: changeFormatted,
                timestamp: new Date().toLocaleString(),
            };
            setHistory(prev => [newHistoryEntry, ...prev].slice(0, 20));

            onPortfolioUpdate(formattedValue, changeFormatted);

            setIsSuccess(true);
            setNewValue("");

            setTimeout(() => {
                setIsSuccess(false);
                setIsOpen(false);
            }, 1500);

        } catch (err) {
            console.error("Error updating portfolio:", err);
            setError("Failed to update portfolio. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (percentage: number) => {
        const currentNumeric = parseCurrency(portfolioValue);
        const newNumeric = currentNumeric * (1 + percentage / 100);
        setNewValue(formatCurrency(newNumeric));
        setError("");
    };

    // ============================================================================
    // BILLS HANDLERS
    // ============================================================================

    const handleAddBill = () => {
        setIsAddingBill(true);
        setBillForm({
            name: "",
            dueIn: "30 days",
            amount: "$0.00",
            category: "Utilities",
        });
    };

    const handleEditBill = (bill: UpcomingBill) => {
        setEditingBill(bill);
        setBillForm(bill);
    };

    const handleSaveBill = async () => {
        if (!billForm.name || !billForm.amount) {
            setError("Please fill in all fields");
            return;
        }

        let updatedBills = [...recentBills];

        if (isAddingBill) {
            const newBill: UpcomingBill = {
                id: Date.now().toString(),
                name: billForm.name || "New Bill",
                dueIn: billForm.dueIn || "30 days",
                amount: billForm.amount || "$0.00",
                category: billForm.category || "Utilities",
            };
            updatedBills = [newBill, ...updatedBills];
        } else if (editingBill) {
            updatedBills = updatedBills.map(b =>
                b.id === editingBill.id ? { ...b, ...billForm } as UpcomingBill : b
            );
        }

        if (onRecentBillsUpdate) {
            onRecentBillsUpdate(updatedBills);
        }

        await saveToFirestore({ recentBills: updatedBills });

        setIsAddingBill(false);
        setEditingBill(null);
        setBillForm({});
        setError("");
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
    };

    const handleDeleteBill = async (id: string) => {
        const updatedBills = recentBills.filter(b => b.id !== id);
        if (onRecentBillsUpdate) {
            onRecentBillsUpdate(updatedBills);
        }
        await saveToFirestore({ recentBills: updatedBills });
    };

    // ============================================================================
    // TRANSACTION HANDLERS
    // ============================================================================

    const handleAddTransaction = () => {
        setIsAddingTransaction(true);
        setTransactionForm({
            merchant: "",
            type: "",
            category: "",
            amount: "$0.00",
            status: "completed",
            isNegative: true,
        });
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setTransactionForm(transaction);
    };

    const handleSaveTransaction = async () => {
        if (!transactionForm.merchant || !transactionForm.amount) {
            setError("Please fill in all fields");
            return;
        }

        let updatedTransactions = [...transactions];

        if (isAddingTransaction) {
            const newTransaction: Transaction = {
                id: Date.now().toString(),
                merchant: transactionForm.merchant || "New Merchant",
                type: transactionForm.type || "Other",
                category: transactionForm.category || "Other",
                date: new Date().toLocaleDateString(),
                status: transactionForm.status || "completed",
                amount: transactionForm.amount || "$0.00",
                isNegative: transactionForm.isNegative !== undefined ? transactionForm.isNegative : true,
                icon: <TrendingUp size={16} />,
            };
            updatedTransactions = [newTransaction, ...updatedTransactions];
        } else if (editingTransaction) {
            updatedTransactions = updatedTransactions.map(t =>
                t.id === editingTransaction.id ? { ...t, ...transactionForm } as Transaction : t
            );
        }

        if (onTransactionsUpdate) {
            onTransactionsUpdate(updatedTransactions);
        }

        await saveToFirestore({ transactions: updatedTransactions });

        setIsAddingTransaction(false);
        setEditingTransaction(null);
        setTransactionForm({});
        setError("");
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
    };

    const handleDeleteTransaction = async (id: string) => {
        const updatedTransactions = transactions.filter(t => t.id !== id);
        if (onTransactionsUpdate) {
            onTransactionsUpdate(updatedTransactions);
        }
        await saveToFirestore({ transactions: updatedTransactions });
    };

    // ============================================================================
    // CATEGORY HANDLERS
    // ============================================================================

    const handleAddCategory = () => {
        setIsAddingCategory(true);
        setCategoryForm({
            name: "",
            percentage: 10,
            color: "from-blue-400 to-cyan-500",
        });
    };

    const handleEditCategory = (category: SpendingCategory) => {
        setEditingCategory(category);
        setCategoryForm(category);
    };

    const handleSaveCategory = async () => {
        if (!categoryForm.name) {
            setError("Please enter a category name");
            return;
        }

        let updatedCategories = [...spendingCategories];

        if (isAddingCategory) {
            const newCategory: SpendingCategory = {
                name: categoryForm.name || "New Category",
                percentage: categoryForm.percentage || 10,
                color: categoryForm.color || "from-blue-400 to-cyan-500",
            };
            updatedCategories = [...updatedCategories, newCategory];
        } else if (editingCategory) {
            updatedCategories = updatedCategories.map(c =>
                c.name === editingCategory.name ? { ...c, ...categoryForm } as SpendingCategory : c
            );
        }

        if (onSpendingCategoriesUpdate) {
            onSpendingCategoriesUpdate(updatedCategories);
        }

        await saveToFirestore({ spendingCategories: updatedCategories });

        setIsAddingCategory(false);
        setEditingCategory(null);
        setCategoryForm({});
        setError("");
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
    };

    const handleDeleteCategory = async (name: string) => {
        const updatedCategories = spendingCategories.filter(c => c.name !== name);
        if (onSpendingCategoriesUpdate) {
            onSpendingCategoriesUpdate(updatedCategories);
        }
        await saveToFirestore({ spendingCategories: updatedCategories });
    };

    // ============================================================================
    // CONTACT HANDLERS
    // ============================================================================

    const handleAddContact = () => {
        setIsAddingContact(true);
        setContactForm({
            name: "",
            initials: "",
        });
    };

    const handleEditContact = (contact: QuickContact) => {
        setEditingContact(contact);
        setContactForm(contact);
    };

    const handleSaveContact = async () => {
        if (!contactForm.name || !contactForm.initials) {
            setError("Please fill in all fields");
            return;
        }

        let updatedContacts = [...quickContacts];

        if (isAddingContact) {
            const newContact: QuickContact = {
                id: Date.now().toString(),
                name: contactForm.name || "New Contact",
                initials: contactForm.initials || "NC",
                avatar: "",
            };
            updatedContacts = [...updatedContacts, newContact];
        } else if (editingContact) {
            updatedContacts = updatedContacts.map(c =>
                c.id === editingContact.id ? { ...c, ...contactForm } as QuickContact : c
            );
        }

        if (onQuickContactsUpdate) {
            onQuickContactsUpdate(updatedContacts);
        }

        await saveToFirestore({ quickContacts: updatedContacts });

        setIsAddingContact(false);
        setEditingContact(null);
        setContactForm({});
        setError("");
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
    };

    const handleDeleteContact = async (id: string) => {
        const updatedContacts = quickContacts.filter(c => c.id !== id);
        if (onQuickContactsUpdate) {
            onQuickContactsUpdate(updatedContacts);
        }
        await saveToFirestore({ quickContacts: updatedContacts });
    };

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleClose = () => {
        setIsOpen(false);
        setError("");
        setNewValue("");
        setIsSuccess(false);
        setIsAddingBill(false);
        setEditingBill(null);
        setIsAddingTransaction(false);
        setEditingTransaction(null);
        setIsAddingCategory(false);
        setEditingCategory(null);
        setIsAddingContact(false);
        setEditingContact(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (activeTab === "portfolio") handlePortfolioUpdate();
        }
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            handleClose();
        }
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    if (requireAdmin && isCheckingAdmin) {
        return (
            <button
                className={`inline-flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-400 ${className}`}
                disabled
            >
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
            </button>
        );
    }

    if (requireAdmin && !isAdmin) {
        return (
            <button
                className={`inline-flex items-center gap-2 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-400 cursor-not-allowed ${className}`}
                disabled
                title="Admin access required"
            >
                <TrendingUp size={14} />
                {buttonLabel}
            </button>
        );
    }

    return (
        <div className={`relative inline-block ${className}`}>
            {/* Main Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500"
            >
                <TrendingUp size={14} />
                {buttonLabel}
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={handleClickOutside}
                    >
                        <motion.div
                            ref={modalRef}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="mb-4 flex items-center justify-between sticky top-0 bg-white/95 z-10 pb-4 border-b border-cyan-200/30">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-cyan-500/20 p-2">
                                        <Wallet className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-cyan-900">Admin Control Panel</h3>
                                        <p className="text-xs text-cyan-600">Manage dashboard content</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[
                                    { id: "portfolio", label: "💰 Portfolio", icon: <TrendingUp size={14} /> },
                                    { id: "bills", label: "📋 Bills", icon: <Calendar size={14} /> },
                                    { id: "transactions", label: "💳 Transactions", icon: <CreditCard size={14} /> },
                                    { id: "categories", label: "📊 Categories", icon: <PieChart size={14} /> },
                                    { id: "contacts", label: "👤 Contacts", icon: <Users size={14} /> },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === tab.id
                                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                                                : "bg-cyan-100/50 text-cyan-700 hover:bg-cyan-200/50"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1">
                                            {tab.icon}
                                            {tab.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Success/Error Messages */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-3 flex items-center gap-1 text-xs text-red-600 bg-red-50 p-2 rounded-lg"
                                >
                                    <AlertCircle size={12} />
                                    {error}
                                </motion.p>
                            )}
                            {isSuccess && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-3 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg"
                                >
                                    <Check size={12} />
                                    Updated successfully!
                                </motion.p>
                            )}

                            {/* Tab Content */}
                            <div className="max-h-[60vh] overflow-y-auto pr-2">
                                {/* Portfolio Tab */}
                                {activeTab === "portfolio" && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3 rounded-lg bg-cyan-50/50 p-3">
                                            <div>
                                                <p className="text-xs text-cyan-600">Current Value</p>
                                                <p className="text-sm font-bold text-cyan-900">{portfolioValue}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-cyan-600">Current Change</p>
                                                <p className={`text-sm font-bold ${portfolioChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {portfolioChange}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-bold text-cyan-700">
                                                New Portfolio Value
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-cyan-400">
                                                    $
                                                </span>
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={newValue}
                                                    onChange={(e) => {
                                                        setNewValue(e.target.value);
                                                        setError("");
                                                    }}
                                                    onKeyDown={handleKeyPress}
                                                    placeholder="Enter new value (e.g., 300000)"
                                                    className="w-full rounded-lg border border-cyan-200/50 bg-white/50 pl-7 pr-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-300/50 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                                    disabled={isLoading || isSuccess}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs font-medium text-cyan-700">Quick Adjustments</p>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { label: "+5%", value: 5 },
                                                    { label: "+10%", value: 10 },
                                                    { label: "+25%", value: 25 },
                                                    { label: "-5%", value: -5 },
                                                    { label: "-10%", value: -10 },
                                                    { label: "Reset", value: 0 },
                                                ].map((action) => (
                                                    <button
                                                        key={action.label}
                                                        onClick={() => {
                                                            if (action.value === 0) {
                                                                const currentValue = parseCurrency(portfolioValue);
                                                                setNewValue(formatCurrency(currentValue));
                                                            } else {
                                                                handleQuickAction(action.value);
                                                            }
                                                        }}
                                                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${action.value > 0
                                                                ? "bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30"
                                                                : action.value < 0
                                                                    ? "bg-red-500/20 text-red-700 hover:bg-red-500/30"
                                                                    : "bg-slate-500/20 text-slate-700 hover:bg-slate-500/30"
                                                            }`}
                                                        disabled={isLoading || isSuccess}
                                                    >
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {history.length > 0 && (
                                            <div className="max-h-24 overflow-y-auto rounded-lg bg-slate-50/50 p-2">
                                                <p className="mb-1 text-[10px] font-bold uppercase text-slate-400">Recent Updates</p>
                                                {history.slice(0, 5).map((entry, index) => (
                                                    <div key={index} className="flex items-center justify-between border-b border-slate-100/50 py-1 text-xs">
                                                        <span className="font-medium text-cyan-900">{entry.value}</span>
                                                        <span className={entry.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}>
                                                            {entry.change}
                                                        </span>
                                                        <span className="text-slate-400">{entry.timestamp}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            onClick={handlePortfolioUpdate}
                                            disabled={isLoading || isSuccess}
                                            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Updating...
                                                </span>
                                            ) : isSuccess ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Check className="h-4 w-4" />
                                                    Updated!
                                                </span>
                                            ) : (
                                                "Update Portfolio"
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Bills Tab */}
                                {activeTab === "bills" && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-cyan-600">{recentBills.length} bills</p>
                                            <button
                                                onClick={handleAddBill}
                                                className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-700 hover:bg-cyan-500/30"
                                            >
                                                <Plus size={14} /> Add Bill
                                            </button>
                                        </div>

                                        {/* Add/Edit Bill Form */}
                                        {(isAddingBill || editingBill) && (
                                            <div className="rounded-lg bg-cyan-50/50 p-3 space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Bill Name"
                                                    value={billForm.name || ""}
                                                    onChange={(e) => setBillForm({ ...billForm, name: e.target.value })}
                                                    className="w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Due In"
                                                        value={billForm.dueIn || ""}
                                                        onChange={(e) => setBillForm({ ...billForm, dueIn: e.target.value })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Amount"
                                                        value={billForm.amount || ""}
                                                        onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Category"
                                                        value={billForm.category || ""}
                                                        onChange={(e) => setBillForm({ ...billForm, category: e.target.value })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                    <button
                                                        onClick={handleSaveBill}
                                                        className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700"
                                                    >
                                                        <Save size={14} className="inline mr-1" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsAddingBill(false);
                                                            setEditingBill(null);
                                                            setBillForm({});
                                                        }}
                                                        className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bill List */}
                                        {recentBills.map((bill) => (
                                            <div key={bill.id} className="flex items-center justify-between rounded-lg bg-slate-50/50 p-3">
                                                <div>
                                                    <p className="text-sm font-medium text-cyan-900">{bill.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-cyan-600">
                                                        <Clock size={12} />
                                                        <span>{bill.dueIn}</span>
                                                        <span className="text-slate-400">•</span>
                                                        <span>{bill.category}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-cyan-900">{bill.amount}</span>
                                                    <button
                                                        onClick={() => handleEditBill(bill)}
                                                        className="p-1 hover:bg-cyan-100 rounded-lg text-cyan-600"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBill(bill.id)}
                                                        className="p-1 hover:bg-red-100 rounded-lg text-red-600"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Transactions Tab */}
                                {activeTab === "transactions" && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-cyan-600">{transactions.length} transactions</p>
                                            <button
                                                onClick={handleAddTransaction}
                                                className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-700 hover:bg-cyan-500/30"
                                            >
                                                <Plus size={14} /> Add Transaction
                                            </button>
                                        </div>

                                        {/* Add/Edit Transaction Form */}
                                        {(isAddingTransaction || editingTransaction) && (
                                            <div className="rounded-lg bg-cyan-50/50 p-3 space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Merchant"
                                                    value={transactionForm.merchant || ""}
                                                    onChange={(e) => setTransactionForm({ ...transactionForm, merchant: e.target.value })}
                                                    className="w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Type"
                                                        value={transactionForm.type || ""}
                                                        onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Amount"
                                                        value={transactionForm.amount || ""}
                                                        onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Category"
                                                        value={transactionForm.category || ""}
                                                        onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                    <select
                                                        value={transactionForm.status || "completed"}
                                                        onChange={(e) => setTransactionForm({ ...transactionForm, status: e.target.value as any })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    >
                                                        <option value="completed">Completed</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="failed">Failed</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-2">
                                                    <label className="flex items-center gap-2 text-xs text-cyan-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={transactionForm.isNegative !== false}
                                                            onChange={(e) => setTransactionForm({ ...transactionForm, isNegative: e.target.checked })}
                                                        />
                                                        Is Negative (Expense)
                                                    </label>
                                                    <button
                                                        onClick={handleSaveTransaction}
                                                        className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700"
                                                    >
                                                        <Save size={14} className="inline mr-1" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsAddingTransaction(false);
                                                            setEditingTransaction(null);
                                                            setTransactionForm({});
                                                        }}
                                                        className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Transaction List */}
                                        {transactions.map((tx) => (
                                            <div key={tx.id} className="flex items-center justify-between rounded-lg bg-slate-50/50 p-3">
                                                <div>
                                                    <p className="text-sm font-medium text-cyan-900">{tx.merchant}</p>
                                                    <div className="flex items-center gap-2 text-xs text-cyan-600">
                                                        <span>{tx.type}</span>
                                                        <span className="text-slate-400">•</span>
                                                        <span>{tx.category}</span>
                                                        <span className="text-slate-400">•</span>
                                                        <span className={tx.status === 'completed' ? 'text-emerald-600' : tx.status === 'pending' ? 'text-amber-600' : 'text-red-600'}>
                                                            {tx.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-semibold ${tx.isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        {tx.isNegative ? '-' : '+'}{tx.amount}
                                                    </span>
                                                    <button
                                                        onClick={() => handleEditTransaction(tx)}
                                                        className="p-1 hover:bg-cyan-100 rounded-lg text-cyan-600"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTransaction(tx.id)}
                                                        className="p-1 hover:bg-red-100 rounded-lg text-red-600"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Categories Tab */}
                                {activeTab === "categories" && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-cyan-600">{spendingCategories.length} categories</p>
                                            <button
                                                onClick={handleAddCategory}
                                                className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-700 hover:bg-cyan-500/30"
                                            >
                                                <Plus size={14} /> Add Category
                                            </button>
                                        </div>

                                        {/* Add/Edit Category Form */}
                                        {(isAddingCategory || editingCategory) && (
                                            <div className="rounded-lg bg-cyan-50/50 p-3 space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Category Name"
                                                    value={categoryForm.name || ""}
                                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                                    className="w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Percentage"
                                                        value={categoryForm.percentage || 0}
                                                        onChange={(e) => setCategoryForm({ ...categoryForm, percentage: Number(e.target.value) })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    />
                                                    <select
                                                        value={categoryForm.color || "from-blue-400 to-cyan-500"}
                                                        onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                                                        className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                    >
                                                        <option value="from-blue-400 to-cyan-500">Blue-Cyan</option>
                                                        <option value="from-purple-400 to-pink-500">Purple-Pink</option>
                                                        <option value="from-emerald-400 to-teal-500">Emerald-Teal</option>
                                                        <option value="from-amber-400 to-orange-500">Amber-Orange</option>
                                                        <option value="from-rose-400 to-red-500">Rose-Red</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleSaveCategory}
                                                        className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700"
                                                    >
                                                        <Save size={14} className="inline mr-1" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsAddingCategory(false);
                                                            setEditingCategory(null);
                                                            setCategoryForm({});
                                                        }}
                                                        className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Category List */}
                                        {spendingCategories.map((cat) => (
                                            <div key={cat.name} className="flex items-center justify-between rounded-lg bg-slate-50/50 p-3">
                                                <div>
                                                    <p className="text-sm font-medium text-cyan-900">{cat.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2 w-8 rounded-full bg-gradient-to-r ${cat.color}`} />
                                                        <span className="text-xs text-cyan-600">{cat.percentage}%</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditCategory(cat)}
                                                        className="p-1 hover:bg-cyan-100 rounded-lg text-cyan-600"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat.name)}
                                                        className="p-1 hover:bg-red-100 rounded-lg text-red-600"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Contacts Tab */}
                                {activeTab === "contacts" && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-cyan-600">{quickContacts.length} contacts</p>
                                            <button
                                                onClick={handleAddContact}
                                                className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-700 hover:bg-cyan-500/30"
                                            >
                                                <Plus size={14} /> Add Contact
                                            </button>
                                        </div>

                                        {/* Add/Edit Contact Form */}
                                        {(isAddingContact || editingContact) && (
                                            <div className="rounded-lg bg-cyan-50/50 p-3 space-y-2">
                                                <input
                                                    type="text"
                                                    placeholder="Contact Name"
                                                    value={contactForm.name || ""}
                                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                    className="w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Initials (e.g., JD)"
                                                    value={contactForm.initials || ""}
                                                    onChange={(e) => setContactForm({ ...contactForm, initials: e.target.value.toUpperCase().slice(0, 2) })}
                                                    className="w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-1.5 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleSaveContact}
                                                        className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700"
                                                    >
                                                        <Save size={14} className="inline mr-1" />
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsAddingContact(false);
                                                            setEditingContact(null);
                                                            setContactForm({});
                                                        }}
                                                        className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact List */}
                                        {quickContacts.map((contact) => (
                                            <div key={contact.id} className="flex items-center justify-between rounded-lg bg-slate-50/50 p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                                                        {contact.initials}
                                                    </div>
                                                    <p className="text-sm font-medium text-cyan-900">{contact.name}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditContact(contact)}
                                                        className="p-1 hover:bg-cyan-100 rounded-lg text-cyan-600"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteContact(contact.id)}
                                                        className="p-1 hover:bg-red-100 rounded-lg text-red-600"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-4 pt-4 border-t border-cyan-200/30 flex justify-end">
                                <button
                                    onClick={handleClose}
                                    className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-300"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}