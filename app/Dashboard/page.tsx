// app/dashboard/page.tsx

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Iconpack from "../components/Iconpack";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Search,
  User,
  Users,
  CreditCard,
  Lock,
  Unlock,
  PieChart,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  EyeOff,
  Plus,
  ChevronRight,
  Home,
  ShoppingBag,
  Coffee,
  Car,
  Briefcase,
  Gift,
  Smartphone,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

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

interface UpcomingBill {
  id: string;
  name: string;
  dueIn: string;
  amount: string;
  category: string;
}

interface QuickContact {
  id: string;
  name: string;
  avatar: string;
  initials: string;
}

// ============================================================================
// DATA
// ============================================================================

const quickContacts: QuickContact[] = [
  { id: "1", name: "James", avatar: "", initials: "JD" },
  { id: "2", name: "Libs", avatar: "", initials: "LM" },
  { id: "3", name: "Sarah", avatar: "", initials: "SK" },
  { id: "4", name: "Mike", avatar: "", initials: "MR" },
];

const transactions: Transaction[] = [
  {
    id: "1",
    merchant: "Apple Store",
    type: "Subscription Services",
    category: "Tech",
    date: "July 12, 2024",
    status: "completed",
    amount: "$19.99",
    isNegative: true,
    icon: <Smartphone size={16} />,
  },
  {
    id: "2",
    merchant: "Emirates Airlines",
    type: "Travel Booking",
    category: "Travel",
    date: "July 10, 2024",
    status: "pending",
    amount: "$2,450.00",
    isNegative: true,
    icon: <Car size={16} />,
  },
  {
    id: "3",
    merchant: "Dividend Income",
    type: "Investment Yield",
    category: "Income",
    date: "July 08, 2024",
    status: "completed",
    amount: "$450.00",
    isNegative: false,
    icon: <TrendingUp size={16} />,
  },
];

const upcomingBills: UpcomingBill[] = [
  {
    id: "1",
    name: "Utility Bill",
    dueIn: "2 days",
    amount: "$142.00",
    category: "Utilities",
  },
  {
    id: "2",
    name: "AWS Cloud",
    dueIn: "5 days",
    amount: "$840.50",
    category: "Cloud Services",
  },
];

const spendingCategories = [
  { name: "Entertainment", percentage: 45, color: "from-purple-400 to-pink-500" },
  { name: "Investments", percentage: 35, color: "from-cyan-400 to-blue-500" },
  { name: "Others", percentage: 20, color: "from-emerald-400 to-teal-500" },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: delay * 0.06, duration: 0.3, ease: "easeOut" },
  }),
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

// ---- QuickTransfer --------------------------------------------------------

function QuickTransfer() {
  const [amount, setAmount] = useState("");
  const [selectedContact, setSelectedContact] = useState<string>("1");
  const [isSearching, setIsSearching] = useState(false);

  return (
    <motion.div
      custom={2}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Quick Transfer</h2>
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-400"
          >
            New
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSearching(!isSearching)}
            className="rounded-lg bg-slate-800/50 px-2.5 py-1 text-xs font-medium text-slate-400"
          >
            <Search size={14} />
          </motion.button>
        </div>
      </div>

      {/* Contacts */}
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {quickContacts.map((contact) => (
          <motion.button
            key={contact.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedContact(contact.id)}
            className={`flex flex-col items-center gap-1 ${
              selectedContact === contact.id ? "opacity-100" : "opacity-60"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium ${
                selectedContact === contact.id
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {contact.initials}
            </div>
            <span className="text-[10px] text-slate-400">{contact.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Amount Input */}
      <div className="mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            $
          </span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/50 pl-7 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20"
        >
          <Send size={16} />
          Send Funds
        </motion.button>
      </div>
    </motion.div>
  );
}

// ---- YourCards ------------------------------------------------------------

function YourCards() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <motion.div
      custom={3}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Your Cards</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-cyan-400 hover:text-cyan-300"
        >
          View All
        </motion.button>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="mt-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-700 p-4 shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-white/70">Platinum Credit</p>
            <p className="text-2xl font-bold text-white">$824</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
              VISA
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${
                isLocked
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
              {isLocked ? "Locked" : "Lock Card"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---- SpendingAnalysis -----------------------------------------------------

function SpendingAnalysis() {
  return (
    <motion.div
      custom={4}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Spending Analysis</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-cyan-400 hover:text-cyan-300"
        >
          View All
        </motion.button>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">$12,450</p>
          <p className="text-xs text-slate-400">Total Spends</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-emerald-400">
          <ArrowUpRight size={16} />
          <span className="font-medium">+8.2%</span>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {spendingCategories.map((category, index) => (
          <motion.div
            key={category.name}
            custom={5 + index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{category.name}</span>
              <span className="font-medium text-white">
                {category.percentage}%
              </span>
            </div>
            <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${category.percentage}%` }}
                transition={{
                  duration: 1,
                  delay: 0.5 + index * 0.1,
                  ease: "easeOut",
                }}
                className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---- UpcomingBills --------------------------------------------------------

function UpcomingBills() {
  return (
    <motion.div
      custom={5}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Upcoming Bills</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-cyan-400 hover:text-cyan-300"
        >
          View All
        </motion.button>
      </div>

      <div className="mt-3 space-y-3">
        {upcomingBills.map((bill, index) => (
          <motion.div
            key={bill.id}
            custom={6 + index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/20 p-2">
                <Calendar size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{bill.name}</p>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-slate-500" />
                  <span className="text-xs text-slate-400">
                    Due in {bill.dueIn}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-white">
              {bill.amount}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---- RecentTransactions ---------------------------------------------------

function RecentTransactions() {
  return (
    <motion.div
      custom={6}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-5 backdrop-blur-sm lg:col-span-2"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Recent Transactions</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-cyan-400 hover:text-cyan-300"
        >
          View All
        </motion.button>
      </div>

      {/* Table Header */}
      <div className="mt-4 hidden grid-cols-5 gap-2 border-b border-slate-800/50 pb-2 text-xs font-medium uppercase tracking-wider text-slate-500 sm:grid">
        <span className="col-span-2">Merchant / Type</span>
        <span>Category</span>
        <span>Date</span>
        <span>Status</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Transactions */}
      <div className="mt-2 space-y-2">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            custom={7 + index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-1 rounded-lg bg-slate-800/30 p-3 sm:grid-cols-5 sm:gap-2 sm:p-2.5"
          >
            {/* Merchant & Type */}
            <div className="flex items-center gap-2 sm:col-span-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50 text-slate-400">
                {tx.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{tx.merchant}</p>
                <p className="text-xs text-slate-400">{tx.type}</p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center sm:block">
              <span className="text-xs text-slate-500 sm:hidden">Category: </span>
              <span className="text-xs text-slate-400">{tx.category}</span>
            </div>

            {/* Date */}
            <div className="flex items-center sm:block">
              <span className="text-xs text-slate-500 sm:hidden">Date: </span>
              <span className="text-xs text-slate-400">{tx.date}</span>
            </div>

            {/* Status */}
            <div className="flex items-center sm:block">
              <span className="text-xs text-slate-500 sm:hidden">Status: </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  tx.status === "completed"
                    ? "text-emerald-400"
                    : tx.status === "pending"
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    tx.status === "completed"
                      ? "bg-emerald-400"
                      : tx.status === "pending"
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </span>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between sm:justify-end">
              <span className="text-xs text-slate-500 sm:hidden">Amount: </span>
              <span
                className={`text-sm font-semibold ${
                  tx.isNegative ? "text-white" : "text-emerald-400"
                }`}
              >
                {tx.isNegative ? "-" : "+"}
                {tx.amount}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl"
      >
        {/* Header */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back, John! Here's your financial overview.
          </p>
        </motion.div>

        {/* Portfolio Value */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 rounded-2xl bg-gradient-to-br from-blue-900 to-cyan-800 p-6 shadow-xl"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-white/70">
                Total Portfolio Value
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white sm:text-4xl">
                  $284,500.00
                </span>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-sm font-medium text-emerald-300">
                  +12.4%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20"
              >
                View Details
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Top Grid - Quick Transfer, Cards, Spending */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QuickTransfer />
          <YourCards />
          <SpendingAnalysis />
        </div>

        {/* Bottom Grid - Upcoming Bills & Recent Transactions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <UpcomingBills />
          <RecentTransactions />
        </div>
      </motion.div>
      <Iconpack/>
    </div>
  );
}