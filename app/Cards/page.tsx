// app/cards/page.tsx

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ShoppingBag,
  Coffee,
  Home,
  Car,
  MoreVertical,
  Copy,
  Download,
  RefreshCw,
  Smartphone,
  CreditCard as CardIcon,
  DollarSign,
  Calendar,
  User,
  ChevronRight,
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
}

interface CategorySpending {
  name: string;
  percentage: number;
  color: string;
  icon: React.ReactNode;
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
  },
  {
    id: "2",
    type: "virtual",
    number: "9876 5432 1098 7654",
    expires: "09/25",
    username: "JOHN.DOE",
    brand: "visa",
    isActive: true,
  },
];

const categories: CategorySpending[] = [
  {
    name: "Travel & Dining",
    percentage: 45,
    color: "from-cyan-400 to-blue-500",
    icon: <Coffee size={16} />,
  },
  {
    name: "Subscriptions",
    percentage: 30,
    color: "from-purple-400 to-pink-500",
    icon: <ShoppingBag size={16} />,
  },
  {
    name: "General Goods",
    percentage: 25,
    color: "from-emerald-400 to-teal-500",
    icon: <Home size={16} />,
  },
];

const securityFeatures = [
  { name: "Chip Integrated", status: "ACTIVE", icon: <Shield size={16} /> },
  { name: "3D Secure v2.0", status: "READY", icon: <Lock size={16} /> },
];

const quickActions = [
  { name: "Freeze Card", icon: <Lock size={18} /> },
  { name: "View PIN", icon: <Eye size={18} /> },
  { name: "Set Limits", icon: <DollarSign size={18} /> },
  { name: "Replace Card", icon: <RefreshCw size={18} /> },
];

// ============================================================================
// ANIMATION VARIANTS - FIXED
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

// ✅ FIX: Added 'as const' to ease values
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
// CARD COMPONENT
// ============================================================================

interface CardDisplayProps {
  card: CardData;
  index: number;
  isFlipped: boolean;
  onFlip: () => void;
}

function CardDisplay({ card, index, isFlipped, onFlip }: CardDisplayProps) {
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
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CardsPage() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedCard, setSelectedCard] = useState<string>(cards[0].id);

  const toggleFlip = (cardId: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const selectedCardData = cards.find((c) => c.id === selectedCard);

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
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Cards</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your physical and virtual cards
          </p>
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
              className="mb-4 flex gap-2"
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
                      ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/50"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {card.type === "physical" ? (
                    <CreditCard size={16} />
                  ) : (
                    <Smartphone size={16} />
                  )}
                  <span className="capitalize">{card.type}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Card Display */}
            {selectedCardData && (
              <CardDisplay
                card={selectedCardData}
                index={2}
                isFlipped={flippedCards[selectedCardData.id] || false}
                onFlip={() => toggleFlip(selectedCardData.id)}
              />
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
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800"
              >
                <Copy size={16} />
                Copy Number
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800"
              >
                <Download size={16} />
                Download Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800"
              >
                <RefreshCw size={16} />
                Regenerate
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 space-y-6">
              {/* Security Status */}
              <motion.div
                custom={4}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm"
              >
                <h2 className="text-lg font-semibold text-white">
                  Security Status
                </h2>
                <div className="mt-4 space-y-3">
                  {securityFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      custom={5 + index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center justify-between rounded-lg bg-slate-800/30 px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-cyan-400">{feature.icon}</div>
                        <span className="text-sm text-slate-300">
                          {feature.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          feature.status === "ACTIVE"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {feature.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Spending by Category */}
              <motion.div
                custom={6}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Spending by Category
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    View All
                  </motion.button>
                </div>

                {/* Monthly Total */}
                <motion.div
                  custom={7}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-4 flex items-baseline justify-between border-b border-slate-800/50 pb-3"
                >
                  <span className="text-sm text-slate-400">Monthly</span>
                  <span className="text-2xl font-bold text-white">$4,280</span>
                </motion.div>

                {/* Category Bars */}
                <div className="mt-4 space-y-3">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      custom={8 + index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">{category.icon}</span>
                          <span className="text-slate-300">{category.name}</span>
                        </div>
                        <span className="font-medium text-white">
                          {category.percentage}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Management */}
              <motion.div
                custom={9}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm"
              >
                <h2 className="text-lg font-semibold text-white">
                  Quick Management
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.name}
                      custom={10 + index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 rounded-lg bg-slate-800/30 p-3 transition-colors hover:bg-slate-800/50"
                    >
                      <div className="rounded-full bg-cyan-500/20 p-2 text-cyan-400">
                        {action.icon}
                      </div>
                      <span className="text-xs text-slate-300">
                        {action.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                custom={11}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between rounded-xl bg-slate-800/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/20 p-1.5">
                    <CheckCircle size={14} className="text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300">
                    All cards are active
                  </span>
                </div>
                <ChevronRight size={18} className="text-slate-500" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}