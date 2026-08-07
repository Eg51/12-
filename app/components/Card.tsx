// app/cards/page.tsx

"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Eye,
  Lock,
  Shield,
  CheckCircle,
  ShoppingBag,
  Coffee,
  Home,
  Copy,
  Download,
  RefreshCw,
  Smartphone,
  DollarSign,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface CardData {
  id: string;
  type: "physical" | "virtual";
  number: string;
  expires: string;
  username?: string;
  brand: "visa" | "mastercard" | "amex";
  isActive: boolean;
  lastUsed?: string;
  limit?: string;
  spent?: string;
}

interface CategorySpending {
  name: string;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  amount: string;
}

interface Transaction {
  id: string;
  merchant: string;
  date: string;
  amount: string;
  isNegative: boolean;
  category: string;
}

// ============================================================================
// DATA
// ============================================================================

const cards: CardData[] = [
  {
    id: "1",
    type: "physical",
    number: "4532 7891 2345 6789",
    expires: "12/26",
    brand: "visa",
    isActive: true,
    lastUsed: "2 days ago",
    limit: "$10,000",
    spent: "$4,280",
  },
  {
    id: "2",
    type: "virtual",
    number: "9876 5432 1098 7654",
    expires: "09/25",
    username: "JOHN.DOE",
    brand: "visa",
    isActive: true,
    lastUsed: "1 hour ago",
    limit: "$5,000",
    spent: "$1,230",
  },
];

const categories: CategorySpending[] = [
  {
    name: "Travel & Dining",
    percentage: 45,
    color: "from-cyan-400 to-blue-500",
    icon: <Coffee size={16} />,
    amount: "$1,926",
  },
  {
    name: "Subscriptions",
    percentage: 30,
    color: "from-purple-400 to-pink-500",
    icon: <ShoppingBag size={16} />,
    amount: "$1,284",
  },
  {
    name: "General Goods",
    percentage: 25,
    color: "from-emerald-400 to-teal-500",
    icon: <Home size={16} />,
    amount: "$1,070",
  },
];

const securityFeatures = [
  { name: "Chip Integrated", status: "ACTIVE", icon: <Shield size={16} /> },
  { name: "3D Secure v2.0", status: "READY", icon: <Lock size={16} /> },
];

const quickActions = [
  { name: "View PIN", icon: <Eye size={18} />, action: "viewPin" },
  { name: "Set Limits", icon: <DollarSign size={18} />, action: "setLimits" },
  { name: "Replace", icon: <RefreshCw size={18} />, action: "replace" },
  { name: "Freeze", icon: <Lock size={18} />, action: "freeze" },
];

const recentTransactions: Transaction[] = [
  {
    id: "1",
    merchant: "Starbucks Coffee",
    date: "2 hours ago",
    amount: "$6.50",
    isNegative: true,
    category: "Dining",
  },
  {
    id: "2",
    merchant: "Amazon Prime",
    date: "1 day ago",
    amount: "$14.99",
    isNegative: true,
    category: "Subscription",
  },
  {
    id: "3",
    merchant: "Uber Eats",
    date: "3 days ago",
    amount: "$32.40",
    isNegative: true,
    category: "Dining",
  },
  {
    id: "4",
    merchant: "Netflix",
    date: "5 days ago",
    amount: "$17.99",
    isNegative: true,
    category: "Subscription",
  },
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
    transition: { delay: delay * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: delay * 0.06, duration: 0.3, ease: "easeOut" as const },
  }),
};

// ============================================================================
// CARD ANALYTICS COMPONENT (formerly lazy-loaded)
// ============================================================================

const CardAnalytics = memo(({ card }: { card: CardData }) => {
  const spentAmount = parseFloat(card.spent?.replace(/[^0-9.]/g, "") || "0");
  const limitAmount = parseFloat(card.limit?.replace(/[^0-9.]/g, "") || "10000");
  const percentage = Math.min((spentAmount / limitAmount) * 100, 100);

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-3"
    >
      <div className="rounded-lg bg-white/20 p-3 text-center backdrop-blur-sm">
        <p className="text-xs text-cyan-700/60">Limit</p>
        <p className="text-lg font-bold text-cyan-900">{card.limit}</p>
      </div>
      <div className="rounded-lg bg-white/20 p-3 text-center backdrop-blur-sm">
        <p className="text-xs text-cyan-700/60">Spent</p>
        <p className="text-lg font-bold text-cyan-900">{card.spent}</p>
      </div>
      <div className="rounded-lg bg-white/20 p-3 text-center backdrop-blur-sm">
        <p className="text-xs text-cyan-700/60">Usage</p>
        <p className="text-lg font-bold text-cyan-900">{percentage.toFixed(0)}%</p>
      </div>
    </motion.div>
  );
});

CardAnalytics.displayName = 'CardAnalytics';

// ============================================================================
// SPENDING CHART COMPONENT (formerly lazy-loaded)
// ============================================================================

const SpendingChart = memo(({ categories }: { categories: CategorySpending[] }) => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {categories.map((category, index) => (
        <div key={category.name}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-cyan-700/60">{category.icon}</span>
              <span className="text-cyan-800">{category.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-cyan-700/60">{category.amount}</span>
              <span className="font-medium text-cyan-900">
                {category.percentage}%
              </span>
            </div>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-cyan-200/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${category.percentage}%` }}
              transition={{
                duration: 1,
                delay: 0.5 + index * 0.1,
                ease: "easeOut" as const,
              }}
              className={`h-full rounded-full bg-gradient-to-r ${category.color}`}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
});

SpendingChart.displayName = 'SpendingChart';

// ============================================================================
// CARD DISPLAY COMPONENT
// ============================================================================

const CardDisplay = memo(({ 
  card, 
  index, 
  isFlipped, 
  onFlip 
}: { 
  card: CardData; 
  index: number; 
  isFlipped: boolean; 
  onFlip: () => void;
}) => {
  const brandColors = {
    visa: "from-blue-600 to-blue-800",
    mastercard: "from-red-500 to-orange-500",
    amex: "from-blue-400 to-cyan-500",
  };

  const cardNumber = card.number.replace(/\s/g, "");
  const formattedNumber = cardNumber.match(/.{1,4}/g)?.join(" ") || card.number;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="relative perspective-1000"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative h-[200px] w-full cursor-pointer rounded-2xl sm:h-[220px]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={onFlip}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${brandColors[card.brand]} p-5 shadow-xl shadow-${card.brand}-500/20 backface-hidden`}
        >
          {/* Chip */}
          <div className="flex items-start justify-between">
            <div className="rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-500 p-1.5 shadow-lg">
              <div className="h-8 w-12 rounded border border-yellow-400/30" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-white/60">
                {card.type.toUpperCase()}
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
                {card.brand.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Card Number */}
          <div className="mt-4">
            <p className="font-mono text-lg font-semibold tracking-wider text-white sm:text-xl">
              {formattedNumber}
            </p>
          </div>

          {/* Card Details */}
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                Expires
              </p>
              <p className="font-mono text-sm font-semibold text-white">
                {card.expires}
              </p>
            </div>
            {card.type === "virtual" && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                  Username
                </p>
                <p className="font-mono text-sm font-semibold text-white">
                  {card.username}
                </p>
              </div>
            )}
            {card.type === "physical" && (
              <div className="rounded-lg bg-white/20 px-3 py-1">
                <p className="text-xs font-medium text-white">VISA</p>
              </div>
            )}
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-5 shadow-xl backface-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="mt-8 h-10 w-full bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded bg-slate-800 p-2">
                <div className="h-6 w-full rounded bg-slate-700" />
              </div>
              <div className="rounded bg-slate-800 p-2">
                <Shield size={24} className="text-slate-600" />
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-500">
              This card is protected by Lumina SecurePay™
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

CardDisplay.displayName = 'CardDisplay';

// ============================================================================
// TRANSACTION ITEM COMPONENT
// ============================================================================

const TransactionItem = memo(({ 
  transaction, 
  index 
}: { 
  transaction: Transaction; 
  index: number;
}) => {
  const icons: Record<string, React.ReactNode> = {
    "Dining": <Coffee size={14} />,
    "Subscription": <ShoppingBag size={14} />,
  };

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between rounded-lg bg-white/20 p-3 backdrop-blur-sm transition-all hover:bg-white/30"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white/30 p-1.5">
          {icons[transaction.category] || <ShoppingBag size={14} />}
        </div>
        <div>
          <p className="text-sm font-medium text-cyan-900">{transaction.merchant}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-cyan-700/60">{transaction.date}</span>
            <span className="text-xs text-cyan-700/40">•</span>
            <span className="text-xs text-cyan-700/60">{transaction.category}</span>
          </div>
        </div>
      </div>
      <span className={`text-sm font-medium ${transaction.isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
        {transaction.isNegative ? '-' : '+'}{transaction.amount}
      </span>
    </motion.div>
  );
});

TransactionItem.displayName = 'TransactionItem';

// ============================================================================
// SECURITY STATUS COMPONENT
// ============================================================================

const SecurityStatus = memo(() => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {securityFeatures.map((feature, index) => (
        <motion.div
          key={feature.name}
          custom={index}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between rounded-lg bg-white/30 px-4 py-2.5"
        >
          <div className="flex items-center gap-3">
            <div className="text-cyan-600">{feature.icon}</div>
            <span className="text-sm text-cyan-800">
              {feature.name}
            </span>
          </div>
          <span
            className={`text-xs font-medium ${
              feature.status === "ACTIVE"
                ? "text-emerald-600"
                : "text-amber-600"
            }`}
          >
            {feature.status}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
});

SecurityStatus.displayName = 'SecurityStatus';

// ============================================================================
// QUICK ACTIONS COMPONENT
// ============================================================================

const QuickActions = memo(() => {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-2 sm:grid-cols-4"
    >
      {quickActions.map((action, index) => (
        <motion.button
          key={action.name}
          custom={index}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 rounded-lg bg-white/30 p-3 transition-colors hover:bg-white/50"
        >
          <div className="rounded-full bg-cyan-500/20 p-2 text-cyan-700">
            {action.icon}
          </div>
          <span className="text-xs text-cyan-800">
            {action.name}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
});

QuickActions.displayName = 'QuickActions';

// ============================================================================
// MAIN CARDS PAGE COMPONENT
// ============================================================================

export default function CardsPage() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedCard, setSelectedCard] = useState<string>(cards[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const toggleFlip = useCallback((cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  }, []);

  const selectedCardData = useMemo(() => 
    cards.find((c) => c.id === selectedCard),
    [selectedCard]
  );

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return recentTransactions;
    return recentTransactions.filter(t => 
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displayedTransactions = useMemo(() => {
    return showAllTransactions ? filteredTransactions : filteredTransactions.slice(0, 3);
  }, [filteredTransactions, showAllTransactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
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
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-cyan-900 sm:text-3xl">Cards</h1>
            <p className="mt-1 text-sm text-cyan-700/70">
              Manage your physical and virtual cards
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl transition-all"
          >
            <Plus size={18} />
            Add Card
          </motion.button>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left Column - Cards */}
          <div className="lg:col-span-3">
            {/* Card Tabs */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="mb-4 flex flex-wrap gap-2"
            >
              {cards.map((card, index) => (
                <motion.button
                  key={card.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setSelectedCard(card.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    selectedCard === card.id
                      ? "bg-cyan-500/30 text-cyan-900 ring-1 ring-cyan-500/50 shadow-lg"
                      : "bg-white/30 text-cyan-700 hover:bg-white/50"
                  }`}
                >
                  {card.type === "physical" ? (
                    <CreditCard size={16} />
                  ) : (
                    <Smartphone size={16} />
                  )}
                  <span className="capitalize">{card.type}</span>
                  {card.isActive && (
                    <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Card Display */}
            {selectedCardData && (
              <>
                <CardDisplay
                  card={selectedCardData}
                  index={2}
                  isFlipped={flippedCards[selectedCardData.id] || false}
                  onFlip={() => toggleFlip(selectedCardData.id)}
                />
                <CardAnalytics card={selectedCardData} />
              </>
            )}

            {/* Card Actions */}
            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="mt-4 flex flex-wrap gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg border border-cyan-200/50 bg-white/30 px-4 py-2 text-sm text-cyan-800 transition-colors hover:bg-white/50"
              >
                <Copy size={16} />
                Copy Number
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg border border-cyan-200/50 bg-white/30 px-4 py-2 text-sm text-cyan-800 transition-colors hover:bg-white/50"
              >
                <Download size={16} />
                Download Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg border border-cyan-200/50 bg-white/30 px-4 py-2 text-sm text-cyan-800 transition-colors hover:bg-white/50"
              >
                <RefreshCw size={16} />
                Regenerate
              </motion.button>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              custom={4}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 rounded-2xl border-none bg-white/30 p-5 backdrop-blur-sm shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-cyan-900">Recent Transactions</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-700/40" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-32 rounded-lg bg-white/50 px-7 py-1.5 text-xs text-cyan-900 placeholder:text-cyan-700/40 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAllTransactions(!showAllTransactions)}
                    className="text-xs font-medium text-cyan-600 hover:text-cyan-800"
                  >
                    {showAllTransactions ? 'Show Less' : 'View All'}
                  </motion.button>
                </div>
              </div>
              <div className="space-y-2">
                {displayedTransactions.map((transaction, index) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                    index={index} 
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-6">
              {/* Security Status */}
              <motion.div
                custom={5}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                className="rounded-2xl border-none bg-white/30 p-6 backdrop-blur-sm shadow-xl"
              >
                <h2 className="text-sm font-semibold text-cyan-900">
                  Security Status
                </h2>
                <SecurityStatus />
              </motion.div>

              {/* Spending by Category */}
              <motion.div
                custom={7}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                className="rounded-2xl border-none bg-white/30 p-6 backdrop-blur-sm shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-cyan-900">
                    Spending by Category
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs font-medium text-cyan-600 hover:text-cyan-800"
                  >
                    View All
                  </motion.button>
                </div>

                {/* Monthly Total */}
                <motion.div
                  custom={8}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-4 flex items-baseline justify-between border-b border-cyan-200/30 pb-3"
                >
                  <span className="text-sm text-cyan-700/60">Monthly</span>
                  <span className="text-2xl font-bold text-cyan-900">$4,280</span>
                </motion.div>

                {/* Spending Chart */}
                <div className="mt-4">
                  <SpendingChart categories={categories} />
                </div>
              </motion.div>

              {/* Quick Management */}
              <motion.div
                custom={9}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
                className="rounded-2xl border-none bg-white/30 p-6 backdrop-blur-sm shadow-xl"
              >
                <h2 className="text-sm font-semibold text-cyan-900">
                  Quick Management
                </h2>
                <QuickActions />
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                custom={11}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.06)" }}
                className="flex items-center justify-between rounded-xl bg-white/40 px-4 py-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/20 p-1.5">
                    <CheckCircle size={14} className="text-emerald-600" />
                  </div>
                  <span className="text-sm text-cyan-800">
                    All cards are active
                  </span>
                </div>
                <ChevronRight size={18} className="text-cyan-700/40" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}