// "use client";

// import Link from 'next/link';
// import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Greet from "@/app/components/Greet";
// import {
//   Wallet,
//   TrendingUp,
//   ArrowUpRight,
//   ArrowDownRight,
//   Send,
//   Search,
//   User,
//   Users,
//   CreditCard,
//   Lock,
//   Unlock,
//   PieChart,
//   DollarSign,
//   Calendar,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   MoreVertical,
//   Eye,
//   EyeOff,
//   Plus,
//   ChevronRight,
//   Home,
//   ShoppingBag,
//   Coffee,
//   Car,
//   Briefcase,
//   Gift,
//   Smartphone,
//   Bitcoin,
//   Gem,
//   LineChart,
//   BarChart3,
//   Coins,
//   Zap,
//   Globe,
//   Star,
//   Activity,
//   SlidersHorizontal,
//   Sun,
//   Moon,
//   Cloud,
// } from "lucide-react";

// // ============================================================================
// // TYPES
// // ============================================================================

// interface Transaction {
//   id: string;
//   merchant: string;
//   type: string;
//   category: string;
//   date: string;
//   status: "completed" | "pending" | "failed";
//   amount: string;
//   isNegative: boolean;
//   icon?: React.ReactNode;
// }

// interface UpcomingBill {
//   id: string;
//   name: string;
//   dueIn: string;
//   amount: string;
//   category: string;
// }

// interface QuickContact {
//   id: string;
//   name: string;
//   avatar: string;
//   initials: string;
// }

// interface Asset {
//   id: string;
//   name: string;
//   symbol: string;
//   type: "crypto" | "stock" | "etf" | "commodity";
//   price: number;
//   change: number;
//   changePercent: number;
//   volume: string;
//   marketCap?: string;
//   description: string;
//   icon: React.ReactNode;
//   color: string;
//   bgGradient: string;
//   isGold?: boolean;
//   isTrending?: boolean;
//   isNew?: boolean;
//   historicalData?: number[];
//   sector?: string;
//   dividend?: string;
//   peRatio?: number;
//   yearHigh?: number;
//   yearLow?: number;
// }

// interface UserDashboardData {
//   portfolioValue: string;
//   portfolioChange: string;
//   transactions: Transaction[];
//   upcomingBills: UpcomingBill[];
//   quickContacts: QuickContact[];
//   spendingCategories: { name: string; percentage: number; color: string }[];
//   watchlist: string[];
//   investments: {
//     assetId: string;
//     amount: number;
//     purchasePrice: number;
//     date: string;
//   }[];
//   recentBills: UpcomingBill[];
//   // ✅ ADDED: New fields from MongoDB (matches your Admin Editor)
//   totalBalance?: { amount: string; change: string };
//   analysisBalance?: { total: string; stocks: string; crypto: string; etfs: string };
// }

// interface UserData {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   displayName: string;
//   email: string;
//   phone: string;
//   accountType: string;
//   isActive: boolean;
//   isVerified: boolean;
//   role: string;
//   isAdmin: boolean;
//   dashboardData?: UserDashboardData;
// }

// // ============================================================================
// // DEFAULT DATA
// // ============================================================================

// const defaultTransactions: Transaction[] = [
//   {
//     id: "1",
//     merchant: "Apple Store",
//     type: "Subscription Services",
//     category: "Tech",
//     date: new Date().toLocaleDateString(),
//     status: "completed",
//     amount: "$19.99",
//     isNegative: true,
//     icon: <Smartphone size={16} />,
//   },
//   {
//     id: "2",
//     merchant: "Dividend Income",
//     type: "Investment Yield",
//     category: "Income",
//     date: new Date().toLocaleDateString(),
//     status: "completed",
//     amount: "$450.00",
//     isNegative: false,
//     icon: <TrendingUp size={16} />,
//   },
// ];

// const defaultUpcomingBills: UpcomingBill[] = [
//   {
//     id: "1",
//     name: "Utility Bill",
//     dueIn: "2 days",
//     amount: "$142.00",
//     category: "Utilities",
//   },
//   {
//     id: "2",
//     name: "AWS Cloud",
//     dueIn: "5 days",
//     amount: "$840.50",
//     category: "Cloud Services",
//   },
// ];

// const defaultRecentBills: UpcomingBill[] = [
//   {
//     id: "1",
//     name: "Electricity Bill",
//     dueIn: "Paid",
//     amount: "$89.00",
//     category: "Utilities",
//   },
//   {
//     id: "2",
//     name: "Internet Service",
//     dueIn: "Paid",
//     amount: "$65.99",
//     category: "Subscription",
//   },
//   {
//     id: "3",
//     name: "Rent Payment",
//     dueIn: "Paid",
//     amount: "$1,200.00",
//     category: "Housing",
//   },
// ];

// const defaultQuickContacts: QuickContact[] = [
//   { id: "1", name: "James", avatar: "", initials: "JD" },
//   { id: "2", name: "Libs", avatar: "", initials: "LM" },
//   { id: "3", name: "Sarah", avatar: "", initials: "SK" },
//   { id: "4", name: "Mike", avatar: "", initials: "MR" },
// ];

// const defaultSpendingCategories = [
//   { name: "Stocks", percentage: 45, color: "from-blue-400 to-cyan-500" },
//   { name: "Crypto", percentage: 35, color: "from-purple-400 to-pink-500" },
//   { name: "ETFs", percentage: 20, color: "from-emerald-400 to-teal-500" },
// ];

// // ============================================================================
// // ASSETS DATA
// // ============================================================================

// const getFixedHistoricalData = (basePrice: number, points: number = 20): number[] => {
//   const data: number[] = [];
//   let price = basePrice;
//   for (let i = 0; i < points; i++) {
//     const variation = Math.sin(i * 0.5 + basePrice) * basePrice * 0.02;
//     price = Math.max(price + variation, basePrice * 0.7);
//     data.push(price);
//   }
//   return data;
// };

// const availableAssets: Asset[] = [
//   {
//     id: "gold",
//     name: "Gold",
//     symbol: "XAU",
//     type: "commodity",
//     price: 2373.11,
//     change: 55.56,
//     changePercent: 2.40,
//     volume: "2.4M",
//     marketCap: "$13.2T",
//     description: "Physical gold bullion - The ultimate store of value and hedge against inflation.",
//     icon: <Gem size={20} />,
//     color: "from-yellow-500 to-amber-600",
//     bgGradient: "from-amber-500/20 via-yellow-500/10 to-orange-500/20",
//     isGold: true,
//     isTrending: true,
//     historicalData: getFixedHistoricalData(2373.11, 30),
//     sector: "Precious Metals",
//     yearHigh: 2450.00,
//     yearLow: 1980.00,
//   },
//   {
//     id: "bitcoin",
//     name: "Bitcoin",
//     symbol: "BTC",
//     type: "crypto",
//     price: 70351.32,
//     change: 1886.87,
//     changePercent: 2.76,
//     volume: "28.5B",
//     marketCap: "$1.32T",
//     description: "The world's leading cryptocurrency. Bitcoin offers decentralized digital gold.",
//     icon: <Bitcoin size={20} />,
//     color: "from-orange-400 to-amber-500",
//     bgGradient: "from-orange-500/20 via-amber-500/10 to-yellow-500/20",
//     isTrending: true,
//     historicalData: getFixedHistoricalData(70351.32, 30),
//     sector: "Cryptocurrency",
//     yearHigh: 73500.00,
//     yearLow: 38500.00,
//   },
//   {
//     id: "ethereum",
//     name: "Ethereum",
//     symbol: "ETH",
//     type: "crypto",
//     price: 3442.88,
//     change: 76.75,
//     changePercent: 2.28,
//     volume: "15.2B",
//     marketCap: "$415B",
//     description: "Smart contract platform enabling decentralized applications and DeFi.",
//     icon: <Coins size={20} />,
//     color: "from-purple-400 to-indigo-500",
//     bgGradient: "from-purple-500/20 via-indigo-500/10 to-blue-500/20",
//     isTrending: true,
//     historicalData: getFixedHistoricalData(3442.88, 30),
//     sector: "Cryptocurrency",
//     yearHigh: 4100.00,
//     yearLow: 2200.00,
//   },
//   {
//     id: "solana",
//     name: "Solana",
//     symbol: "SOL",
//     type: "crypto",
//     price: 143.61,
//     change: 10.49,
//     changePercent: 7.87,
//     volume: "3.8B",
//     marketCap: "$64.5B",
//     description: "High-performance blockchain supporting decentralized apps and marketplaces.",
//     icon: <Zap size={20} />,
//     color: "from-purple-500 to-pink-500",
//     bgGradient: "from-purple-500/20 via-pink-500/10 to-rose-500/20",
//     isTrending: true,
//     isNew: true,
//     historicalData: getFixedHistoricalData(143.61, 30),
//     sector: "Cryptocurrency",
//     yearHigh: 200.00,
//     yearLow: 80.00,
//   },
//   {
//     id: "sp500",
//     name: "S&P 500",
//     symbol: "SPX",
//     type: "etf",
//     price: 5258.85,
//     change: 69.97,
//     changePercent: 1.35,
//     volume: "4.2B",
//     marketCap: "$38.5T",
//     description: "Broad market index tracking 500 leading US companies.",
//     icon: <BarChart3 size={20} />,
//     color: "from-emerald-400 to-teal-500",
//     bgGradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
//     historicalData: getFixedHistoricalData(5258.85, 30),
//     sector: "Index Funds",
//     dividend: "1.45%",
//     peRatio: 22.5,
//     yearHigh: 5400.00,
//     yearLow: 4100.00,
//   },
//   {
//     id: "nasdaq",
//     name: "NASDAQ-100",
//     symbol: "NDX",
//     type: "etf",
//     price: 18037.28,
//     change: -434.35,
//     changePercent: -2.35,
//     volume: "3.8B",
//     marketCap: "$22.1T",
//     description: "Tech-heavy index featuring the world's largest technology companies.",
//     icon: <LineChart size={20} />,
//     color: "from-blue-400 to-cyan-500",
//     bgGradient: "from-blue-500/20 via-cyan-500/10 to-sky-500/20",
//     historicalData: getFixedHistoricalData(18037.28, 30),
//     sector: "Technology ETFs",
//     dividend: "0.85%",
//     peRatio: 28.3,
//     yearHigh: 19000.00,
//     yearLow: 14200.00,
//   },
//   {
//     id: "apple",
//     name: "Apple Inc.",
//     symbol: "AAPL",
//     type: "stock",
//     price: 178.45,
//     change: 2.34,
//     changePercent: 1.33,
//     volume: "55.2M",
//     marketCap: "$2.78T",
//     description: "Global technology leader known for innovative products and services.",
//     icon: <TrendingUp size={20} />,
//     color: "from-gray-400 to-gray-600",
//     bgGradient: "from-gray-500/20 via-slate-500/10 to-zinc-500/20",
//     historicalData: getFixedHistoricalData(178.45, 30),
//     sector: "Technology",
//     dividend: "0.55%",
//     peRatio: 29.2,
//     yearHigh: 195.00,
//     yearLow: 145.00,
//   },
//   {
//     id: "nvidia",
//     name: "NVIDIA Corp",
//     symbol: "NVDA",
//     type: "stock",
//     price: 845.23,
//     change: 34.56,
//     changePercent: 4.26,
//     volume: "32.1M",
//     marketCap: "$2.08T",
//     description: "AI and graphics processing pioneer. NVIDIA powers the future of AI.",
//     icon: <Zap size={20} />,
//     color: "from-green-400 to-emerald-500",
//     bgGradient: "from-green-500/20 via-emerald-500/10 to-teal-500/20",
//     isTrending: true,
//     historicalData: getFixedHistoricalData(845.23, 30),
//     sector: "Technology",
//     peRatio: 45.6,
//     yearHigh: 950.00,
//     yearLow: 400.00,
//   },
//   {
//     id: "microsoft",
//     name: "Microsoft Corp",
//     symbol: "MSFT",
//     type: "stock",
//     price: 378.92,
//     change: 5.67,
//     changePercent: 1.52,
//     volume: "28.4M",
//     marketCap: "$2.82T",
//     description: "Global technology company powering productivity, cloud computing, and AI.",
//     icon: <BarChart3 size={20} />,
//     color: "from-blue-500 to-blue-600",
//     bgGradient: "from-blue-500/20 via-blue-600/10 to-cyan-500/20",
//     historicalData: getFixedHistoricalData(378.92, 30),
//     sector: "Technology",
//     dividend: "0.92%",
//     peRatio: 32.5,
//     yearHigh: 400.00,
//     yearLow: 310.00,
//   },
//   {
//     id: "amazon",
//     name: "Amazon.com",
//     symbol: "AMZN",
//     type: "stock",
//     price: 184.45,
//     change: -2.34,
//     changePercent: -1.25,
//     volume: "42.8M",
//     marketCap: "$1.92T",
//     description: "E-commerce and cloud computing giant. Amazon leads in online retail and AWS.",
//     icon: <ShoppingBag size={20} />,
//     color: "from-orange-500 to-amber-600",
//     bgGradient: "from-orange-500/20 via-amber-500/10 to-yellow-500/20",
//     historicalData: getFixedHistoricalData(184.45, 30),
//     sector: "Consumer Discretionary",
//     peRatio: 48.2,
//     yearHigh: 200.00,
//     yearLow: 130.00,
//   },
//   {
//     id: "google",
//     name: "Alphabet Inc.",
//     symbol: "GOOGL",
//     type: "stock",
//     price: 145.67,
//     change: 1.23,
//     changePercent: 0.85,
//     volume: "22.3M",
//     marketCap: "$1.82T",
//     description: "Google's parent company, leading in search, advertising, and cloud computing.",
//     icon: <Globe size={20} />,
//     color: "from-blue-400 to-green-500",
//     bgGradient: "from-blue-500/20 via-green-500/10 to-emerald-500/20",
//     historicalData: getFixedHistoricalData(145.67, 30),
//     sector: "Technology",
//     dividend: "0.25%",
//     peRatio: 25.8,
//     yearHigh: 160.00,
//     yearLow: 120.00,
//   },
//   {
//     id: "tesla",
//     name: "Tesla Inc.",
//     symbol: "TSLA",
//     type: "stock",
//     price: 245.67,
//     change: -8.90,
//     changePercent: -3.50,
//     volume: "78.5M",
//     marketCap: "$785B",
//     description: "Electric vehicle and clean energy pioneer. Tesla leads the automotive transition.",
//     icon: <Zap size={20} />,
//     color: "from-red-400 to-orange-500",
//     bgGradient: "from-red-500/20 via-orange-500/10 to-amber-500/20",
//     historicalData: getFixedHistoricalData(245.67, 30),
//     sector: "Automotive",
//     peRatio: 72.4,
//     yearHigh: 320.00,
//     yearLow: 160.00,
//   },
//   {
//     id: "silver",
//     name: "Silver",
//     symbol: "XAG",
//     type: "commodity",
//     price: 28.92,
//     change: 1.23,
//     changePercent: 4.44,
//     volume: "1.1M",
//     marketCap: "$1.8T",
//     description: "Industrial and precious metal with dual utility. Essential in electronics.",
//     icon: <DollarSign size={20} />,
//     color: "from-gray-400 to-slate-500",
//     bgGradient: "from-gray-500/20 via-slate-500/10 to-zinc-500/20",
//     isTrending: true,
//     historicalData: getFixedHistoricalData(28.92, 30),
//     sector: "Precious Metals",
//     yearHigh: 32.00,
//     yearLow: 22.00,
//   },
// ];

// // ============================================================================
// // ANIMATION VARIANTS
// // ============================================================================

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.05, delayChildren: 0.05 },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (delay: number = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: delay * 0.08, duration: 0.4, ease: "easeOut" as const },
//   }),
// };

// const itemVariants = {
//   hidden: { opacity: 0, x: -10 },
//   visible: (delay: number = 0) => ({
//     opacity: 1,
//     x: 0,
//     transition: { delay: delay * 0.06, duration: 0.3, ease: "easeOut" as const },
//   }),
// };

// // ============================================================================
// // HELPER: Clean Dashboard Data for Serialization
// // ============================================================================

// /**
//  * Cleans dashboard data by removing React components (icons) that cause circular references
//  */
// const cleanDashboardData = (data: UserDashboardData): UserDashboardData => {
//   return {
//     portfolioValue: data.portfolioValue || "$0.00",
//     portfolioChange: data.portfolioChange || "0.0%",
//     transactions: data.transactions?.map(({ icon, ...rest }) => ({
//       id: rest.id,
//       merchant: rest.merchant,
//       type: rest.type,
//       category: rest.category,
//       date: rest.date,
//       status: rest.status,
//       amount: rest.amount,
//       isNegative: rest.isNegative,
//     })) || [],
//     upcomingBills: data.upcomingBills?.map((b) => ({
//       id: b.id,
//       name: b.name,
//       dueIn: b.dueIn,
//       amount: b.amount,
//       category: b.category,
//     })) || [],
//     quickContacts: data.quickContacts?.map((c) => ({
//       id: c.id,
//       name: c.name,
//       avatar: c.avatar,
//       initials: c.initials,
//     })) || [],
//     spendingCategories: data.spendingCategories?.map((c) => ({
//       name: c.name,
//       percentage: c.percentage,
//       color: c.color,
//     })) || [],
//     watchlist: data.watchlist || [],
//     investments: data.investments?.map((i) => ({
//       assetId: i.assetId,
//       amount: i.amount,
//       purchasePrice: i.purchasePrice,
//       date: i.date,
//     })) || [],
//     recentBills: data.recentBills?.map((b) => ({
//       id: b.id,
//       name: b.name,
//       dueIn: b.dueIn,
//       amount: b.amount,
//       category: b.category,
//     })) || [],
//     // ✅ ADDED: preserve new fields when cleaning
//     totalBalance: data.totalBalance,
//     analysisBalance: data.analysisBalance,
//   };
// };

// // ============================================================================
// // OPTIMIZED SUBCOMPONENTS
// // ============================================================================

// // Memoized Asset Card Component
// const AssetCard = memo(({
//   asset,
//   isExpanded,
//   isInWatchlist,
//   onToggle,
//   onInvest,
//   onWatchlistToggle,
// }: {
//   asset: Asset;
//   isExpanded: boolean;
//   isInWatchlist: boolean;
//   onToggle: () => void;
//   onInvest: (asset: Asset) => void;
//   onWatchlistToggle: (assetId: string) => void;
// }) => {
//   const isPositive = asset.change >= 0;

//   const cardGradients = [
//     "from-amber-400/30 via-yellow-400/20 to-orange-400/30",
//     "from-orange-400/30 via-amber-400/20 to-yellow-400/30",
//     "from-purple-400/30 via-indigo-400/20 to-blue-400/30",
//     "from-pink-400/30 via-purple-400/20 to-rose-400/30",
//     "from-emerald-400/30 via-teal-400/20 to-cyan-400/30",
//     "from-blue-400/30 via-cyan-400/20 to-sky-400/30",
//   ];

//   const gradientIndex = parseInt(asset.id) % cardGradients.length;
//   const gradientClass = cardGradients[gradientIndex];

//   return (
//     <motion.div
//       whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
//       className={`rounded-xl p-4 border-none bg-gradient-to-br ${gradientClass} backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300`}
//       onClick={onToggle}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/30 text-cyan-900 shadow-md">
//             {asset.icon}
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-cyan-900">{asset.symbol}</p>
//             <p className="text-xs text-cyan-800/70">{asset.name}</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-sm font-bold text-cyan-900">${asset.price.toFixed(2)}</p>
//           <p className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
//             {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
//           </p>
//         </div>
//       </div>

//       {isExpanded && (
//         <motion.div
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//           className="mt-3 space-y-3 border-t border-cyan-200/30 pt-3"
//         >
//           <p className="text-xs text-cyan-800">{asset.description}</p>
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             {asset.marketCap && (
//               <div>
//                 <p className="text-cyan-700/60">Market Cap</p>
//                 <p className="text-cyan-900 font-medium">{asset.marketCap}</p>
//               </div>
//             )}
//             {asset.sector && (
//               <div>
//                 <p className="text-cyan-700/60">Sector</p>
//                 <p className="text-cyan-900 font-medium">{asset.sector}</p>
//               </div>
//             )}
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onInvest(asset);
//               }}
//               className="flex-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white shadow-md hover:shadow-lg transition-all"
//             >
//               Invest
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onWatchlistToggle(asset.id);
//               }}
//               className={`rounded-lg px-3 py-1.5 text-xs font-medium ${isInWatchlist
//                   ? "bg-amber-500/30 text-amber-700"
//                   : "bg-white/30 text-cyan-700 hover:text-cyan-900"
//                 } border-none shadow-sm hover:shadow-md transition-all`}
//             >
//               <Star size={14} className={isInWatchlist ? "fill-amber-500" : ""} />
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// });

// AssetCard.displayName = 'AssetCard';

// // Memoized Upcoming Bill Item
// const UpcomingBillItem = memo(({ bill, index }: { bill: UpcomingBill; index: number }) => {
//   const billGradients = [
//     "from-amber-400/20 via-yellow-400/10 to-orange-400/20",
//     "from-blue-400/20 via-cyan-400/10 to-sky-400/20",
//     "from-purple-400/20 via-indigo-400/10 to-violet-400/20",
//   ];

//   const gradientIndex = index % billGradients.length;
//   const gradientClass = billGradients[gradientIndex];

//   return (
//     <motion.div
//       custom={index}
//       variants={itemVariants}
//       initial="hidden"
//       animate="visible"
//       whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
//       className={`flex items-center justify-between rounded-lg bg-gradient-to-br ${gradientClass} p-3 backdrop-blur-sm border-none cursor-pointer hover:shadow-xl transition-all duration-300`}
//     >
//       <div className="flex items-center gap-3">
//         <div className="rounded-lg bg-amber-500/30 p-2 shadow-sm">
//           <Calendar size={16} className="text-amber-600" />
//         </div>
//         <div>
//           <p className="text-sm font-medium text-cyan-900">{bill.name}</p>
//           <div className="flex items-center gap-2">
//             <Clock size={12} className="text-cyan-700/50" />
//             <span className="text-xs text-cyan-700/60">
//               Due in {bill.dueIn}
//             </span>
//           </div>
//         </div>
//       </div>
//       <span className="text-sm font-semibold text-cyan-900">
//         {bill.amount}
//       </span>
//     </motion.div>
//   );
// });

// UpcomingBillItem.displayName = 'UpcomingBillItem';

// // Memoized Recent Bills Item
// const RecentBillItem = memo(({ bill, index }: { bill: UpcomingBill; index: number }) => {
//   const billGradients = [
//     "from-emerald-400/20 via-green-400/10 to-teal-400/20",
//     "from-blue-400/20 via-cyan-400/10 to-sky-400/20",
//     "from-purple-400/20 via-indigo-400/10 to-violet-400/20",
//     "from-amber-400/20 via-yellow-400/10 to-orange-400/20",
//     "from-pink-400/20 via-rose-400/10 to-red-400/20",
//   ];

//   const gradientIndex = index % billGradients.length;
//   const gradientClass = billGradients[gradientIndex];

//   return (
//     <motion.div
//       custom={index}
//       variants={itemVariants}
//       initial="hidden"
//       animate="visible"
//       whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
//       className={`flex items-center justify-between rounded-lg bg-gradient-to-br ${gradientClass} p-3 backdrop-blur-sm border-none cursor-pointer hover:shadow-xl transition-all duration-300`}
//     >
//       <div className="flex items-center gap-3">
//         <div className="rounded-lg bg-emerald-500/30 p-2 shadow-sm">
//           <CheckCircle size={16} className="text-emerald-600" />
//         </div>
//         <div>
//           <p className="text-sm font-medium text-cyan-900">{bill.name}</p>
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-emerald-600">{bill.dueIn}</span>
//             <span className="text-xs text-cyan-700/50">•</span>
//             <span className="text-xs text-cyan-700/60">{bill.category}</span>
//           </div>
//         </div>
//       </div>
//       <span className="text-sm font-semibold text-cyan-900">
//         {bill.amount}
//       </span>
//     </motion.div>
//   );
// });

// RecentBillItem.displayName = 'RecentBillItem';

// // ============================================================================
// // INVESTMENT DASHBOARD COMPONENT
// // ============================================================================

// function InvestmentDashboard({
//   userData,
//   onAddInvestment
// }: {
//   userData: UserDashboardData;
//   onAddInvestment: (assetId: string, amount: number) => void;
// }) {
//   const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
//   const [showInvestModal, setShowInvestModal] = useState(false);
//   const [investmentAmount, setInvestmentAmount] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [watchlist, setWatchlist] = useState<string[]>(userData.watchlist || []);
//   const [assets, setAssets] = useState<Asset[]>(availableAssets);

//   useEffect(() => {
//     let isMounted = true;
//     let intervalId: NodeJS.Timeout;

//     const updatePrices = () => {
//       if (!isMounted) return;

//       setAssets((prev) =>
//         prev.map((asset) => {
//           const volatility = asset.type === "crypto" ? 0.008 :
//             asset.type === "stock" ? 0.005 :
//               asset.type === "etf" ? 0.003 : 0.004;

//           const change = (Math.random() - 0.5) * asset.price * volatility;
//           const newPrice = Math.max(asset.price + change, asset.price * 0.85);

//           const newChange = newPrice - asset.price;
//           const newChangePercent = (newChange / asset.price) * 100;

//           return {
//             ...asset,
//             price: newPrice,
//             change: asset.change + newChange,
//             changePercent: asset.changePercent + newChangePercent,
//           };
//         })
//       );
//     };

//     intervalId = setInterval(updatePrices, 5000);

//     return () => {
//       isMounted = false;
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, []);

//   const filteredAssets = useMemo(() => {
//     return assets.filter((asset) => {
//       const matchesFilter = activeFilter === "all" || asset.type === activeFilter;
//       const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
//       return matchesFilter && matchesSearch;
//     });
//   }, [assets, activeFilter, searchQuery]);

//   const handleInvest = useCallback((asset: Asset) => {
//     setSelectedAsset(asset);
//     setShowInvestModal(true);
//   }, []);

//   const handleConfirmInvestment = useCallback(() => {
//     if (!selectedAsset || !investmentAmount) return;
//     const amount = parseFloat(investmentAmount);
//     if (isNaN(amount) || amount <= 0) return;

//     onAddInvestment(selectedAsset.id, amount);
//     setShowInvestModal(false);
//     setInvestmentAmount("");
//     setSelectedAsset(null);
//   }, [selectedAsset, investmentAmount, onAddInvestment]);

//   const toggleWatchlist = useCallback((assetId: string) => {
//     setWatchlist((prev) =>
//       prev.includes(assetId)
//         ? prev.filter((id) => id !== assetId)
//         : [...prev, assetId]
//     );
//   }, []);

//   const handleToggle = useCallback((id: string) => {
//     setExpandedId((prev) => prev === id ? null : id);
//   }, []);

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <div className="flex gap-2 w-full flex-wrap">
//           <div className="relative flex-1 min-w-[140px]">
//             <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-900" />
//             <input
//               type="text"
//               placeholder="Search assets..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full rounded-lg bg-[#C4F8FD] pl-8 pr-3 py-2 text-sm text-cyan-900 placeholder:text-cyan-700/60
//                focus:outline-none cursor-pointer shadow-xl border-none hover:shadow-2xl transition-all duration-300"
//             />
//           </div>
//           <select
//             value={activeFilter}
//             onChange={(e) => setActiveFilter(e.target.value)}
//             className="rounded-lg bg-[#C4F8FD] px-4 py-2 text-sm text-cyan-900 focus:outline-none cursor-pointer shadow-xl 
//             border-none hover:shadow-2xl transition-all duration-300"
//           >
//             <option value="all" className="bg-[#C4F8FD] text-cyan-900">All</option>
//             <option value="crypto" className="bg-[#C4F8FD] text-cyan-900">Crypto</option>
//             <option value="stock" className="bg-[#C4F8FD] text-cyan-900">Stocks</option>
//             <option value="etf" className="bg-[#C4F8FD] text-cyan-900">ETFs</option>
//             <option value="commodity" className="bg-[#C4F8FD] text-cyan-900">Commodities</option>
//             <Link href={'/Bills'}><option value="commodity" className="bg-[#C4F8FD] cursor-pointer text-cyan-900">More</option></Link>
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//         {filteredAssets.slice(0, 6).map((asset) => (
//           <AssetCard
//             key={asset.id}
//             asset={asset}
//             isExpanded={expandedId === asset.id}
//             isInWatchlist={watchlist.includes(asset.id)}
//             onToggle={() => handleToggle(asset.id)}
//             onInvest={handleInvest}
//             onWatchlistToggle={toggleWatchlist}
//           />
//         ))}
//       </div>

//       <AnimatePresence>
//         {showInvestModal && selectedAsset && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
//             onClick={() => setShowInvestModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl border border-white/10"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-white">Invest in {selectedAsset.name}</h2>
//                 <button
//                   onClick={() => setShowInvestModal(false)}
//                   className="rounded-lg p-1 hover:bg-white/10 transition-colors"
//                 >
//                   <div className="font-lg text-slate-400">X</div>
//                 </button>
//               </div>

//               <div className={`rounded-xl p-4 mb-4 bg-gradient-to-br ${selectedAsset.bgGradient} border border-white/10`}>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-white/70">{selectedAsset.symbol}</p>
//                     <p className="text-2xl font-bold text-white">${selectedAsset.price.toFixed(2)}</p>
//                   </div>
//                   <div className={`flex items-center gap-1 font-medium ${selectedAsset.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
//                     {selectedAsset.change >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
//                     <span>{Math.abs(selectedAsset.changePercent).toFixed(2)}%</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <label className="text-xs font-medium text-slate-400 block mb-1">Amount to Invest (USD)</label>
//                   <input
//                     type="number"
//                     placeholder="0.00"
//                     value={investmentAmount}
//                     onChange={(e) => setInvestmentAmount(e.target.value)}
//                     className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                   />
//                 </div>
//                 <div className="flex gap-2 flex-wrap">
//                   {[100, 500, 1000, 5000].map((amount) => (
//                     <button
//                       key={amount}
//                       onClick={() => setInvestmentAmount(amount.toString())}
//                       className="flex-1 min-w-[60px] rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600"
//                     >
//                       ${amount}
//                     </button>
//                   ))}
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleConfirmInvestment}
//                   className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 transition-all"
//                 >
//                   <span className="flex items-center justify-center gap-2">
//                     <Send size={18} />
//                     Confirm Investment
//                   </span>
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // ============================================================================
// // UPCOMING BILLS COMPONENT
// // ============================================================================

// function UpcomingBillsSection({ bills }: { bills: UpcomingBill[] }) {
//   return (
//     <div className="space-y-3">
//       {bills.map((bill, index) => (
//         <UpcomingBillItem key={bill.id} bill={bill} index={index} />
//       ))}
//     </div>
//   );
// }

// // ============================================================================
// // RECENT BILLS COMPONENT
// // ============================================================================

// function RecentBillsSection({ bills }: { bills: UpcomingBill[] }) {
//   return (
//     <div className="space-y-2">
//       {bills.map((bill, index) => (
//         <RecentBillItem key={bill.id} bill={bill} index={index} />
//       ))}
//     </div>
//   );
// }

// // ============================================================================
// // MAIN DASHBOARD COMPONENT
// // ============================================================================

// /**
//  * Dash - Main Dashboard Component
//  * Displays user portfolio, investments, bills, and analytics
//  */
// export default function Dash() {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [userName, setUserName] = useState("User");
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState<UserDashboardData>({
//     portfolioValue: "$0.00",
//     portfolioChange: "0.0%",
//     transactions: defaultTransactions,
//     upcomingBills: defaultUpcomingBills,
//     quickContacts: defaultQuickContacts,
//     spendingCategories: defaultSpendingCategories,
//     watchlist: [],
//     investments: [],
//     recentBills: defaultRecentBills,
//   });

//   const isMounted = useRef(true);
//   const dataLoaded = useRef(false);

//   // ---- Authentication Check ------------------------------------------------

//   useEffect(() => {
//     isMounted.current = true;

//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem('auth_token');
//         const userData = localStorage.getItem('user');

//         if (!token || !userData) {
//           if (typeof window !== 'undefined') {
//             window.location.href = "/log-in";
//           }
//           setLoading(false);
//           return;
//         }

//         const parsedUser = JSON.parse(userData) as UserData;
//         setUser(parsedUser);
//         setUserName(parsedUser.displayName || parsedUser.firstName || 'User');

//         if (!dataLoaded.current) {
//           await loadUserDashboard(parsedUser._id);
//           dataLoaded.current = true;
//         }
//         setLoading(false);

//       } catch (error) {
//         console.error("Auth error:", error);
//         localStorage.removeItem('auth_token');
//         localStorage.removeItem('user');
//         if (typeof window !== 'undefined') {
//           window.location.href = "/log-in";
//         }
//         setLoading(false);
//       }
//     };

//     checkAuth();

//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   // ---- Load User Dashboard Data -------------------------------------------

//   const loadUserDashboard = async (userId: string) => {
//     try {
//       const response = await fetch(`/api/user/dashboard?userId=${userId}`);
//       const result = await response.json();

//       if (!isMounted.current) return;

//       if (response.ok && result.success && result.data) {
//         const userData = result.data;
        
//         // ✅ UPDATED: Map the new totalBalance and analysisBalance fields into state
//         setDashboardData({
//           portfolioValue: userData.totalBalance?.amount || "$0.00",
//           portfolioChange: userData.totalBalance?.change || "0.0%",
//           transactions: userData.recentTransactions || defaultTransactions,
//           upcomingBills: userData.upcomingBills || defaultUpcomingBills,
//           quickContacts: defaultQuickContacts,
//           spendingCategories: [
//             { name: "Stocks", percentage: parseInt(userData.analysisBalance?.stocks) || 45, color: "from-blue-400 to-cyan-500" },
//             { name: "Crypto", percentage: parseInt(userData.analysisBalance?.crypto) || 35, color: "from-purple-400 to-pink-500" },
//             { name: "ETFs", percentage: parseInt(userData.analysisBalance?.etfs) || 20, color: "from-emerald-400 to-teal-500" },
//           ],
//           watchlist: [],
//           investments: [],
//           recentBills: userData.bills?.filter((b: any) => b.status === 'paid') || defaultRecentBills,
//           // ✅ Store the raw objects so we can save them back later
//           totalBalance: userData.totalBalance,
//           analysisBalance: userData.analysisBalance,
//         });
//       }
//     } catch (error) {
//       console.error("Error loading dashboard:", error);
//     }
//   };

//   // ---- Save Dashboard Data (with cleaning) --------------------------------

//   const saveDashboardData = async (userId: string, data: UserDashboardData) => {
//     try {
//       // ✅ UPDATED: Transform the frontend state back into MongoDB structure
//       const preparedData = {
//         totalBalance: {
//           amount: data.portfolioValue,
//           change: data.portfolioChange
//         },
//         analysisBalance: {
//           total: data.portfolioValue,
//           stocks: data.spendingCategories[0]?.percentage + "%" || "45%",
//           crypto: data.spendingCategories[1]?.percentage + "%" || "35%",
//           etfs: data.spendingCategories[2]?.percentage + "%" || "20%"
//         },
//         bills: data.recentBills.map(b => ({ ...b, status: 'paid' })),
//         recentTransactions: data.transactions,
//         upcomingBills: data.upcomingBills,
//         paymentMethods: [], // Add if you have this
//         preferences: {}, // Add if you have this
//       };

//       const response = await fetch('/api/user/dashboard', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, dashboardData: preparedData }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to save dashboard data');
//       }
//     } catch (error) {
//       console.error("Error saving dashboard:", error);
//     }
//   };

//   // ---- Handlers -----------------------------------------------------------

//   const handlePortfolioUpdate = useCallback((newValue: string, newChange: string) => {
//     setDashboardData((prev) => ({
//       ...prev,
//       portfolioValue: newValue,
//       portfolioChange: newChange,
//     }));

//     if (user && isMounted.current) {
//       saveDashboardData(user._id, {
//         ...dashboardData,
//         portfolioValue: newValue,
//         portfolioChange: newChange,
//       });
//     }
//   }, [user, dashboardData]);

//   const handleAddInvestment = useCallback((assetId: string, amount: number) => {
//     const asset = availableAssets.find(a => a.id === assetId);
//     if (!asset || !isMounted.current) return;

//     const newInvestment = {
//       assetId,
//       amount,
//       purchasePrice: asset.price,
//       date: new Date().toISOString(),
//     };

//     setDashboardData((prev) => {
//       const currentValue = parseFloat(prev.portfolioValue.replace(/[^0-9.]/g, ""));
//       const newValue = currentValue + amount;
//       const formattedValue = `$${newValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//       const change = ((newValue - currentValue) / (currentValue || 1)) * 100;
//       const changeFormatted = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;

//       return {
//         ...prev,
//         investments: [...(prev.investments || []), newInvestment],
//         portfolioValue: formattedValue,
//         portfolioChange: changeFormatted,
//       };
//     });

//     if (user && isMounted.current) {
//       saveDashboardData(user._id, {
//         ...dashboardData,
//         investments: [...(dashboardData.investments || []), newInvestment],
//       });
//     }
//   }, [user, dashboardData]);

//   const handleRecentBillsUpdate = useCallback((newBills: UpcomingBill[]) => {
//     setDashboardData((prev) => ({
//       ...prev,
//       recentBills: newBills,
//     }));

//     if (user && isMounted.current) {
//       saveDashboardData(user._id, {
//         ...dashboardData,
//         recentBills: newBills,
//       });
//     }
//   }, [user, dashboardData]);

//   const handleUpcomingBillsUpdate = useCallback((newBills: UpcomingBill[]) => {
//     setDashboardData((prev) => ({
//       ...prev,
//       upcomingBills: newBills,
//     }));

//     if (user && isMounted.current) {
//       saveDashboardData(user._id, {
//         ...dashboardData,
//         upcomingBills: newBills,
//       });
//     }
//   }, [user, dashboardData]);

//   // ---- Loading State ------------------------------------------------------

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
//         <div className="mx-auto max-w-6xl space-y-4">
//           <div className="h-20 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//             <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
//             <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
//             <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
//           </div>
//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//             <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
//             <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
//             <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ---- Render -------------------------------------------------------------

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="mx-auto max-w-6xl"
//       >
//         <motion.div
//           custom={0}
//           variants={cardVariants}
//           className="mb-6 flex flex-wrap items-center justify-between gap-4"
//         >
//           <Greet 
//             username={userName} 
//             className="mb-0"
//             iconSize={48}
//           />
//         </motion.div>

//         <motion.div
//           custom={1}
//           variants={cardVariants}
//           whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}
//           className="mb-6 rounded-2xl bg-gradient-to-br from-[#C4F8FD] via-[#B0F0F8] to-[#9AE8F2] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-none"
//         >
//           <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//             <div>
//               <p className="text-sm font-medium text-cyan-700">
//                 Total Balance
//               </p>
//               <div className="flex items-baseline gap-3">
//                 <span className="text-3xl font-bold text-cyan-900 sm:text-4xl">
//                   {dashboardData.portfolioValue}
//                 </span>
//                 <span className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${dashboardData.portfolioChange.startsWith('+')
//                     ? 'bg-emerald-400/30 text-emerald-700'
//                     : 'bg-red-400/30 text-red-700'
//                   }`}>
//                   {dashboardData.portfolioChange}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-1">
//           <motion.div
//             custom={2}
//             whileHover={{ scale: 1.01, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
//             whileTap={{ scale: 0.99 }}
//             variants={cardVariants}
//             className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-[#C4F8FD] via-[#B5F0F8] to-[#A5E8F2] p-5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
//           >
//             <InvestmentDashboard
//               userData={dashboardData}
//               onAddInvestment={handleAddInvestment}
//             />
//           </motion.div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//           <motion.div
//             custom={3}
//             whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
//             whileTap={{ scale: 0.98 }}
//             variants={cardVariants}
//             className="rounded-2xl border-none bg-gradient-to-br from-[#C4F8FD] via-[#B0F0F8] to-[#9AE8F2] shadow-xl p-5 backdrop-blur-xl hover:shadow-2xl transition-all duration-300"
//           >
//             <div className="flex items-center justify-between">
//               <h2 className="text-sm font-semibold text-slate-600">Analysis</h2>
//               <Link href={'/Investment'}>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
//                 >
//                   View All
//                 </motion.button>
//               </Link>
//             </div>

//             <div className="mt-3 flex items-end justify-between">
//               <div>
//                 <p className="text-2xl font-bold text-cyan-900">{dashboardData.portfolioValue}</p>
//                 <p className="text-xs text-cyan-700">Total</p>
//               </div>
//               <div className={`flex items-center font-bold gap-1 text-sm ${dashboardData.portfolioChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
//                 {dashboardData.portfolioChange.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
//                 <span className="font-medium">{dashboardData.portfolioChange}</span>
//               </div>
//             </div>

//             <div className="mt-4 space-y-2.5">
//               {dashboardData.spendingCategories.map((category, index) => (
//                 <motion.div
//                   key={category.name}
//                   custom={4 + index}
//                   variants={itemVariants}
//                   initial="hidden"
//                   animate="visible"
//                 >
//                   <div className="flex items-center justify-between text-xs">
//                     <span className="text-cyan-800">{category.name}</span>
//                     <span className="font-medium text-cyan-800">
//                       {category.percentage}%
//                     </span>
//                   </div>
//                   <div className="mt-0.5 h-1.5 w-full overflow-hidden cursor-pointer rounded-full bg-cyan-200/50">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: `${category.percentage}%` }}
//                       transition={{
//                         duration: 0.8,
//                         delay: 0.3 + index * 0.08,
//                         ease: "easeOut" as const,
//                       }}
//                       className={`h-full rounded-full hover:shadow-xl bg-gradient-to-r ${category.color}`}
//                     />
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div
//             custom={4}
//             variants={cardVariants}
//             whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
//             whileTap={{ scale: 0.98 }}
//             className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-[#C4F8FD] via-[#B5F0F8] to-[#A5E8F2] p-5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
//           >
//             <div className="flex items-center justify-between">
//               <h2 className="text-sm font-semibold text-slate-600">Upcoming Bills</h2>
//               <Link href={"/Bills"}>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
//                 >
//                   View All
//                 </motion.button>
//               </Link>
//             </div>

//             <UpcomingBillsSection bills={dashboardData.upcomingBills} />
//           </motion.div>
//         </div>

//         <motion.div
//           custom={5}
//           variants={cardVariants}
//           whileHover={{ scale: 1.01, boxShadow: "0 20px 50px rgba(0,0,0,0.06)" }}
//           whileTap={{ scale: 0.99 }}
//           className="mt-4 rounded-2xl border-none bg-gradient-to-br from-[#C4F8FD] via-[#B0F0F8] to-[#9AE8F2] shadow-xl p-5 hover:shadow-2xl transition-all duration-300"
//         >
//           <div className="flex items-center text-cyan-700 justify-between">
//             <h2 className="text-sm font-semibold text-slate-600">Recent Bills</h2>
//           </div>
//           <RecentBillsSection bills={dashboardData.recentBills} />
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import Link from 'next/link';
import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Greet from "@/app/components/Greet";
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
  Bitcoin,
  Gem,
  LineChart,
  BarChart3,
  Coins,
  Zap,
  Globe,
  Star,
  Activity,
  SlidersHorizontal,
  Sun,
  Moon,
  Cloud,
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
  icon?: React.ReactNode;
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

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: "crypto" | "stock" | "etf" | "commodity";
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap?: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  isGold?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  historicalData?: number[];
  sector?: string;
  dividend?: string;
  peRatio?: number;
  yearHigh?: number;
  yearLow?: number;
}

interface UserDashboardData {
  portfolioValue: string;
  portfolioChange: string;
  transactions: Transaction[];
  upcomingBills: UpcomingBill[];
  quickContacts: QuickContact[];
  spendingCategories: { name: string; percentage: number; color: string }[];
  watchlist: string[];
  investments: {
    assetId: string;
    amount: number;
    purchasePrice: number;
    date: string;
  }[];
  recentBills: UpcomingBill[];
  // ✅ ADDED: New fields from MongoDB (matches your Admin Editor)
  totalBalance?: { amount: string; change: string };
  analysisBalance?: { total: string; stocks: string; crypto: string; etfs: string };
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  accountType: string;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  isAdmin: boolean;
  dashboardData?: UserDashboardData;
}

// ============================================================================
// DEFAULT DATA
// ============================================================================

const defaultTransactions: Transaction[] = [
  {
    id: "1",
    merchant: "Apple Store",
    type: "Subscription Services",
    category: "Tech",
    date: new Date().toLocaleDateString(),
    status: "completed",
    amount: "$19.99",
    isNegative: true,
    icon: <Smartphone size={16} />,
  },
  {
    id: "2",
    merchant: "Dividend Income",
    type: "Investment Yield",
    category: "Income",
    date: new Date().toLocaleDateString(),
    status: "completed",
    amount: "$450.00",
    isNegative: false,
    icon: <TrendingUp size={16} />,
  },
];

const defaultUpcomingBills: UpcomingBill[] = [
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

const defaultRecentBills: UpcomingBill[] = [
  {
    id: "1",
    name: "Electricity Bill",
    dueIn: "Paid",
    amount: "$89.00",
    category: "Utilities",
  },
  {
    id: "2",
    name: "Internet Service",
    dueIn: "Paid",
    amount: "$65.99",
    category: "Subscription",
  },
  {
    id: "3",
    name: "Rent Payment",
    dueIn: "Paid",
    amount: "$1,200.00",
    category: "Housing",
  },
];

const defaultQuickContacts: QuickContact[] = [
  { id: "1", name: "James", avatar: "", initials: "JD" },
  { id: "2", name: "Libs", avatar: "", initials: "LM" },
  { id: "3", name: "Sarah", avatar: "", initials: "SK" },
  { id: "4", name: "Mike", avatar: "", initials: "MR" },
];

const defaultSpendingCategories = [
  { name: "Stocks", percentage: 45, color: "from-blue-400 to-cyan-500" },
  { name: "Crypto", percentage: 35, color: "from-purple-400 to-pink-500" },
  { name: "ETFs", percentage: 20, color: "from-emerald-400 to-teal-500" },
];

// ============================================================================
// ASSETS DATA
// ============================================================================

const getFixedHistoricalData = (basePrice: number, points: number = 20): number[] => {
  const data: number[] = [];
  let price = basePrice;
  for (let i = 0; i < points; i++) {
    const variation = Math.sin(i * 0.5 + basePrice) * basePrice * 0.02;
    price = Math.max(price + variation, basePrice * 0.7);
    data.push(price);
  }
  return data;
};

const availableAssets: Asset[] = [
  {
    id: "gold",
    name: "Gold",
    symbol: "XAU",
    type: "commodity",
    price: 2373.11,
    change: 55.56,
    changePercent: 2.40,
    volume: "2.4M",
    marketCap: "$13.2T",
    description: "Physical gold bullion - The ultimate store of value and hedge against inflation.",
    icon: <Gem size={20} />,
    color: "from-yellow-500 to-amber-600",
    bgGradient: "from-amber-500/20 via-yellow-500/10 to-orange-500/20",
    isGold: true,
    isTrending: true,
    historicalData: getFixedHistoricalData(2373.11, 30),
    sector: "Precious Metals",
    yearHigh: 2450.00,
    yearLow: 1980.00,
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    type: "crypto",
    price: 70351.32,
    change: 1886.87,
    changePercent: 2.76,
    volume: "28.5B",
    marketCap: "$1.32T",
    description: "The world's leading cryptocurrency. Bitcoin offers decentralized digital gold.",
    icon: <Bitcoin size={20} />,
    color: "from-orange-400 to-amber-500",
    bgGradient: "from-orange-500/20 via-amber-500/10 to-yellow-500/20",
    isTrending: true,
    historicalData: getFixedHistoricalData(70351.32, 30),
    sector: "Cryptocurrency",
    yearHigh: 73500.00,
    yearLow: 38500.00,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    type: "crypto",
    price: 3442.88,
    change: 76.75,
    changePercent: 2.28,
    volume: "15.2B",
    marketCap: "$415B",
    description: "Smart contract platform enabling decentralized applications and DeFi.",
    icon: <Coins size={20} />,
    color: "from-purple-400 to-indigo-500",
    bgGradient: "from-purple-500/20 via-indigo-500/10 to-blue-500/20",
    isTrending: true,
    historicalData: getFixedHistoricalData(3442.88, 30),
    sector: "Cryptocurrency",
    yearHigh: 4100.00,
    yearLow: 2200.00,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    type: "crypto",
    price: 143.61,
    change: 10.49,
    changePercent: 7.87,
    volume: "3.8B",
    marketCap: "$64.5B",
    description: "High-performance blockchain supporting decentralized apps and marketplaces.",
    icon: <Zap size={20} />,
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 via-pink-500/10 to-rose-500/20",
    isTrending: true,
    isNew: true,
    historicalData: getFixedHistoricalData(143.61, 30),
    sector: "Cryptocurrency",
    yearHigh: 200.00,
    yearLow: 80.00,
  },
  {
    id: "sp500",
    name: "S&P 500",
    symbol: "SPX",
    type: "etf",
    price: 5258.85,
    change: 69.97,
    changePercent: 1.35,
    volume: "4.2B",
    marketCap: "$38.5T",
    description: "Broad market index tracking 500 leading US companies.",
    icon: <BarChart3 size={20} />,
    color: "from-emerald-400 to-teal-500",
    bgGradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    historicalData: getFixedHistoricalData(5258.85, 30),
    sector: "Index Funds",
    dividend: "1.45%",
    peRatio: 22.5,
    yearHigh: 5400.00,
    yearLow: 4100.00,
  },
  {
    id: "nasdaq",
    name: "NASDAQ-100",
    symbol: "NDX",
    type: "etf",
    price: 18037.28,
    change: -434.35,
    changePercent: -2.35,
    volume: "3.8B",
    marketCap: "$22.1T",
    description: "Tech-heavy index featuring the world's largest technology companies.",
    icon: <LineChart size={20} />,
    color: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-500/20 via-cyan-500/10 to-sky-500/20",
    historicalData: getFixedHistoricalData(18037.28, 30),
    sector: "Technology ETFs",
    dividend: "0.85%",
    peRatio: 28.3,
    yearHigh: 19000.00,
    yearLow: 14200.00,
  },
  {
    id: "apple",
    name: "Apple Inc.",
    symbol: "AAPL",
    type: "stock",
    price: 178.45,
    change: 2.34,
    changePercent: 1.33,
    volume: "55.2M",
    marketCap: "$2.78T",
    description: "Global technology leader known for innovative products and services.",
    icon: <TrendingUp size={20} />,
    color: "from-gray-400 to-gray-600",
    bgGradient: "from-gray-500/20 via-slate-500/10 to-zinc-500/20",
    historicalData: getFixedHistoricalData(178.45, 30),
    sector: "Technology",
    dividend: "0.55%",
    peRatio: 29.2,
    yearHigh: 195.00,
    yearLow: 145.00,
  },
  {
    id: "nvidia",
    name: "NVIDIA Corp",
    symbol: "NVDA",
    type: "stock",
    price: 845.23,
    change: 34.56,
    changePercent: 4.26,
    volume: "32.1M",
    marketCap: "$2.08T",
    description: "AI and graphics processing pioneer. NVIDIA powers the future of AI.",
    icon: <Zap size={20} />,
    color: "from-green-400 to-emerald-500",
    bgGradient: "from-green-500/20 via-emerald-500/10 to-teal-500/20",
    isTrending: true,
    historicalData: getFixedHistoricalData(845.23, 30),
    sector: "Technology",
    peRatio: 45.6,
    yearHigh: 950.00,
    yearLow: 400.00,
  },
  {
    id: "microsoft",
    name: "Microsoft Corp",
    symbol: "MSFT",
    type: "stock",
    price: 378.92,
    change: 5.67,
    changePercent: 1.52,
    volume: "28.4M",
    marketCap: "$2.82T",
    description: "Global technology company powering productivity, cloud computing, and AI.",
    icon: <BarChart3 size={20} />,
    color: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-500/20 via-blue-600/10 to-cyan-500/20",
    historicalData: getFixedHistoricalData(378.92, 30),
    sector: "Technology",
    dividend: "0.92%",
    peRatio: 32.5,
    yearHigh: 400.00,
    yearLow: 310.00,
  },
  {
    id: "amazon",
    name: "Amazon.com",
    symbol: "AMZN",
    type: "stock",
    price: 184.45,
    change: -2.34,
    changePercent: -1.25,
    volume: "42.8M",
    marketCap: "$1.92T",
    description: "E-commerce and cloud computing giant. Amazon leads in online retail and AWS.",
    icon: <ShoppingBag size={20} />,
    color: "from-orange-500 to-amber-600",
    bgGradient: "from-orange-500/20 via-amber-500/10 to-yellow-500/20",
    historicalData: getFixedHistoricalData(184.45, 30),
    sector: "Consumer Discretionary",
    peRatio: 48.2,
    yearHigh: 200.00,
    yearLow: 130.00,
  },
  {
    id: "google",
    name: "Alphabet Inc.",
    symbol: "GOOGL",
    type: "stock",
    price: 145.67,
    change: 1.23,
    changePercent: 0.85,
    volume: "22.3M",
    marketCap: "$1.82T",
    description: "Google's parent company, leading in search, advertising, and cloud computing.",
    icon: <Globe size={20} />,
    color: "from-blue-400 to-green-500",
    bgGradient: "from-blue-500/20 via-green-500/10 to-emerald-500/20",
    historicalData: getFixedHistoricalData(145.67, 30),
    sector: "Technology",
    dividend: "0.25%",
    peRatio: 25.8,
    yearHigh: 160.00,
    yearLow: 120.00,
  },
  {
    id: "tesla",
    name: "Tesla Inc.",
    symbol: "TSLA",
    type: "stock",
    price: 245.67,
    change: -8.90,
    changePercent: -3.50,
    volume: "78.5M",
    marketCap: "$785B",
    description: "Electric vehicle and clean energy pioneer. Tesla leads the automotive transition.",
    icon: <Zap size={20} />,
    color: "from-red-400 to-orange-500",
    bgGradient: "from-red-500/20 via-orange-500/10 to-amber-500/20",
    historicalData: getFixedHistoricalData(245.67, 30),
    sector: "Automotive",
    peRatio: 72.4,
    yearHigh: 320.00,
    yearLow: 160.00,
  },
  {
    id: "silver",
    name: "Silver",
    symbol: "XAG",
    type: "commodity",
    price: 28.92,
    change: 1.23,
    changePercent: 4.44,
    volume: "1.1M",
    marketCap: "$1.8T",
    description: "Industrial and precious metal with dual utility. Essential in electronics.",
    icon: <DollarSign size={20} />,
    color: "from-gray-400 to-slate-500",
    bgGradient: "from-gray-500/20 via-slate-500/10 to-zinc-500/20",
    isTrending: true,
    historicalData: getFixedHistoricalData(28.92, 30),
    sector: "Precious Metals",
    yearHigh: 32.00,
    yearLow: 22.00,
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
// HELPER: Clean Dashboard Data for Serialization
// ============================================================================

/**
 * Cleans dashboard data by removing React components (icons) that cause circular references
 */
const cleanDashboardData = (data: UserDashboardData): UserDashboardData => {
  return {
    portfolioValue: data.portfolioValue || "$0.00",
    portfolioChange: data.portfolioChange || "0.0%",
    transactions: data.transactions?.map(({ icon, ...rest }) => ({
      id: rest.id,
      merchant: rest.merchant,
      type: rest.type,
      category: rest.category,
      date: rest.date,
      status: rest.status,
      amount: rest.amount,
      isNegative: rest.isNegative,
    })) || [],
    upcomingBills: data.upcomingBills?.map((b) => ({
      id: b.id,
      name: b.name,
      dueIn: b.dueIn,
      amount: b.amount,
      category: b.category,
    })) || [],
    quickContacts: data.quickContacts?.map((c) => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar,
      initials: c.initials,
    })) || [],
    spendingCategories: data.spendingCategories?.map((c) => ({
      name: c.name,
      percentage: c.percentage,
      color: c.color,
    })) || [],
    watchlist: data.watchlist || [],
    investments: data.investments?.map((i) => ({
      assetId: i.assetId,
      amount: i.amount,
      purchasePrice: i.purchasePrice,
      date: i.date,
    })) || [],
    recentBills: data.recentBills?.map((b) => ({
      id: b.id,
      name: b.name,
      dueIn: b.dueIn,
      amount: b.amount,
      category: b.category,
    })) || [],
    // ✅ ADDED: preserve new fields when cleaning
    totalBalance: data.totalBalance,
    analysisBalance: data.analysisBalance,
  };
};

// ============================================================================
// OPTIMIZED SUBCOMPONENTS
// ============================================================================

// Memoized Asset Card Component
const AssetCard = memo(({
  asset,
  isExpanded,
  isInWatchlist,
  onToggle,
  onInvest,
  onWatchlistToggle,
}: {
  asset: Asset;
  isExpanded: boolean;
  isInWatchlist: boolean;
  onToggle: () => void;
  onInvest: (asset: Asset) => void;
  onWatchlistToggle: (assetId: string) => void;
}) => {
  const isPositive = asset.change >= 0;

  const cardGradients = [
    "from-amber-400/30 via-yellow-400/20 to-orange-400/30",
    "from-orange-400/30 via-amber-400/20 to-yellow-400/30",
    "from-purple-400/30 via-indigo-400/20 to-blue-400/30",
    "from-pink-400/30 via-purple-400/20 to-rose-400/30",
    "from-emerald-400/30 via-teal-400/20 to-cyan-400/30",
    "from-blue-400/30 via-cyan-400/20 to-sky-400/30",
  ];

  const gradientIndex = parseInt(asset.id) % cardGradients.length;
  const gradientClass = cardGradients[gradientIndex];

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      className={`rounded-xl p-4 border-none bg-gradient-to-br ${gradientClass} backdrop-blur-sm cursor-pointer hover:shadow-xl transition-all duration-300`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/30 text-cyan-900 shadow-md">
            {asset.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-cyan-900">{asset.symbol}</p>
            <p className="text-xs text-cyan-800/70">{asset.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-cyan-900">${asset.price.toFixed(2)}</p>
          <p className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 space-y-3 border-t border-cyan-200/30 pt-3"
        >
          <p className="text-xs text-cyan-800">{asset.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {asset.marketCap && (
              <div>
                <p className="text-cyan-700/60">Market Cap</p>
                <p className="text-cyan-900 font-medium">{asset.marketCap}</p>
              </div>
            )}
            {asset.sector && (
              <div>
                <p className="text-cyan-700/60">Sector</p>
                <p className="text-cyan-900 font-medium">{asset.sector}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInvest(asset);
              }}
              className="flex-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white shadow-md hover:shadow-lg transition-all"
            >
              Invest
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWatchlistToggle(asset.id);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${isInWatchlist
                  ? "bg-amber-500/30 text-amber-700"
                  : "bg-white/30 text-cyan-700 hover:text-cyan-900"
                } border-none shadow-sm hover:shadow-md transition-all`}
            >
              <Star size={14} className={isInWatchlist ? "fill-amber-500" : ""} />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

AssetCard.displayName = 'AssetCard';

// Memoized Upcoming Bill Item
const UpcomingBillItem = memo(({ bill, index }: { bill: UpcomingBill; index: number }) => {
  const billGradients = [
    "from-amber-400/20 via-yellow-400/10 to-orange-400/20",
    "from-blue-400/20 via-cyan-400/10 to-sky-400/20",
    "from-purple-400/20 via-indigo-400/10 to-violet-400/20",
  ];

  const gradientIndex = index % billGradients.length;
  const gradientClass = billGradients[gradientIndex];

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
      className={`flex items-center justify-between rounded-lg bg-gradient-to-br ${gradientClass} p-3 backdrop-blur-sm border-none cursor-pointer hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-amber-500/30 p-2 shadow-sm">
          <Calendar size={16} className="text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-cyan-900">{bill.name}</p>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-cyan-700/50" />
            <span className="text-xs text-cyan-700/60">
              Due in {bill.dueIn}
            </span>
          </div>
        </div>
      </div>
      <span className="text-sm font-semibold text-cyan-900">
        {bill.amount}
      </span>
    </motion.div>
  );
});

UpcomingBillItem.displayName = 'UpcomingBillItem';

// Memoized Recent Bills Item
const RecentBillItem = memo(({ bill, index }: { bill: UpcomingBill; index: number }) => {
  const billGradients = [
    "from-emerald-400/20 via-green-400/10 to-teal-400/20",
    "from-blue-400/20 via-cyan-400/10 to-sky-400/20",
    "from-purple-400/20 via-indigo-400/10 to-violet-400/20",
    "from-amber-400/20 via-yellow-400/10 to-orange-400/20",
    "from-pink-400/20 via-rose-400/10 to-red-400/20",
  ];

  const gradientIndex = index % billGradients.length;
  const gradientClass = billGradients[gradientIndex];

  return (
    <motion.div
      custom={index}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
      className={`flex items-center justify-between rounded-lg bg-gradient-to-br ${gradientClass} p-3 backdrop-blur-sm border-none cursor-pointer hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-emerald-500/30 p-2 shadow-sm">
          <CheckCircle size={16} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-cyan-900">{bill.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600">{bill.dueIn}</span>
            <span className="text-xs text-cyan-700/50">•</span>
            <span className="text-xs text-cyan-700/60">{bill.category}</span>
          </div>
        </div>
      </div>
      <span className="text-sm font-semibold text-cyan-900">
        {bill.amount}
      </span>
    </motion.div>
  );
});

RecentBillItem.displayName = 'RecentBillItem';

// ============================================================================
// INVESTMENT DASHBOARD COMPONENT
// ============================================================================

function InvestmentDashboard({
  userData,
  onAddInvestment
}: {
  userData: UserDashboardData;
  onAddInvestment: (assetId: string, amount: number) => void;
}) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(userData.watchlist || []);
  const [assets, setAssets] = useState<Asset[]>(availableAssets);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const updatePrices = () => {
      if (!isMounted) return;

      setAssets((prev) =>
        prev.map((asset) => {
          const volatility = asset.type === "crypto" ? 0.008 :
            asset.type === "stock" ? 0.005 :
              asset.type === "etf" ? 0.003 : 0.004;

          const change = (Math.random() - 0.5) * asset.price * volatility;
          const newPrice = Math.max(asset.price + change, asset.price * 0.85);

          const newChange = newPrice - asset.price;
          const newChangePercent = (newChange / asset.price) * 100;

          return {
            ...asset,
            price: newPrice,
            change: asset.change + newChange,
            changePercent: asset.changePercent + newChangePercent,
          };
        })
      );
    };

    intervalId = setInterval(updatePrices, 5000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesFilter = activeFilter === "all" || asset.type === activeFilter;
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [assets, activeFilter, searchQuery]);

  const handleInvest = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setShowInvestModal(true);
  }, []);

  const handleConfirmInvestment = useCallback(() => {
    if (!selectedAsset || !investmentAmount) return;
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) return;

    onAddInvestment(selectedAsset.id, amount);
    setShowInvestModal(false);
    setInvestmentAmount("");
    setSelectedAsset(null);
  }, [selectedAsset, investmentAmount, onAddInvestment]);

  const toggleWatchlist = useCallback((assetId: string) => {
    setWatchlist((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  }, []);

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => prev === id ? null : id);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 w-full flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-900" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-[#C4F8FD] pl-8 pr-3 py-2 text-sm text-cyan-900 placeholder:text-cyan-700/60 focus:outline-none cursor-pointer shadow-xl border-none hover:shadow-2xl transition-all duration-300"
            />
          </div>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="rounded-lg bg-[#C4F8FD] px-4 py-2 text-sm text-cyan-900 focus:outline-none cursor-pointer shadow-xl border-none hover:shadow-2xl transition-all duration-300"
          >
            <option value="all" className="bg-[#C4F8FD] text-cyan-900">All</option>
            <option value="crypto" className="bg-[#C4F8FD] text-cyan-900">Crypto</option>
            <option value="stock" className="bg-[#C4F8FD] text-cyan-900">Stocks</option>
            <option value="etf" className="bg-[#C4F8FD] text-cyan-900">ETFs</option>
            <option value="commodity" className="bg-[#C4F8FD] text-cyan-900">Commodities</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filteredAssets.slice(0, 6).map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            isExpanded={expandedId === asset.id}
            isInWatchlist={watchlist.includes(asset.id)}
            onToggle={() => handleToggle(asset.id)}
            onInvest={handleInvest}
            onWatchlistToggle={toggleWatchlist}
          />
        ))}
      </div>

      <AnimatePresence>
        {showInvestModal && selectedAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowInvestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Invest in {selectedAsset.name}</h2>
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="rounded-lg p-1 hover:bg-white/10 transition-colors"
                >
                  <div className="font-lg text-slate-400">X</div>
                </button>
              </div>

              <div className={`rounded-xl p-4 mb-4 bg-gradient-to-br ${selectedAsset.bgGradient} border border-white/10`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">{selectedAsset.symbol}</p>
                    <p className="text-2xl font-bold text-white">${selectedAsset.price.toFixed(2)}</p>
                  </div>
                  <div className={`flex items-center gap-1 font-medium ${selectedAsset.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {selectedAsset.change >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    <span>{Math.abs(selectedAsset.changePercent).toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Amount to Invest (USD)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[100, 500, 1000, 5000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setInvestmentAmount(amount.toString())}
                      className="flex-1 min-w-[60px] rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmInvestment}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-bold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Send size={18} />
                    Confirm Investment
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// UPCOMING BILLS COMPONENT
// ============================================================================

function UpcomingBillsSection({ bills }: { bills: UpcomingBill[] }) {
  return (
    <div className="space-y-3">
      {bills.map((bill, index) => (
        <UpcomingBillItem key={bill.id} bill={bill} index={index} />
      ))}
    </div>
  );
}

// ============================================================================
// RECENT BILLS COMPONENT
// ============================================================================

function RecentBillsSection({ bills }: { bills: UpcomingBill[] }) {
  return (
    <div className="space-y-2">
      {bills.map((bill, index) => (
        <RecentBillItem key={bill.id} bill={bill} index={index} />
      ))}
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

/**
 * Dash - Main Dashboard Component
 * Displays user portfolio, investments, bills, and analytics
 */
export default function Dash() {
  const [user, setUser] = useState<UserData | null>(null);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<UserDashboardData>({
    portfolioValue: "$0.00",
    portfolioChange: "0.0%",
    transactions: defaultTransactions,
    upcomingBills: defaultUpcomingBills,
    quickContacts: defaultQuickContacts,
    spendingCategories: defaultSpendingCategories,
    watchlist: [],
    investments: [],
    recentBills: defaultRecentBills,
  });

  const isMounted = useRef(true);
  const dataLoaded = useRef(false);

  // ---- Authentication Check ------------------------------------------------

  useEffect(() => {
    isMounted.current = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          if (typeof window !== 'undefined') {
            window.location.href = "/log-in";
          }
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(userData) as UserData;
        setUser(parsedUser);
        setUserName(parsedUser.displayName || parsedUser.firstName || 'User');

        if (!dataLoaded.current) {
          await loadUserDashboard(parsedUser._id);
          dataLoaded.current = true;
        }
        setLoading(false);

      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = "/log-in";
        }
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // ---- Load User Dashboard Data -------------------------------------------
  const loadUserDashboard = async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/user/dashboard?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!isMounted.current) return;

      if (response.ok && result.success && result.data) {
        const userData = result.data;
        
        console.log("DB Data fetched:", userData); // Keep this for debugging

        // ✅ SAFE EXTRACTION: Use empty arrays if the fields are undefined
        const rawBills = userData.bills || [];
        const rawTransactions = userData.recentTransactions || [];

        // Calculate 'dueIn' for the UI from 'dueDate'
        const formattedUpcomingBills = rawBills
          .filter((b: any) => {
            const status = (b.status || '').trim().toLowerCase();
            return status === 'pending' || status === 'unpaid';
          })
          .map((b: any) => {
            let dueInText = "Unknown";
            if (b.dueDate) {
              const daysLeft = Math.ceil((new Date(b.dueDate).getTime() - Date.now()) / (1000 * 3600 * 24));
              dueInText = daysLeft <= 0 ? "Overdue" : `${daysLeft} days`;
            }
            return {
              id: b.id || Date.now().toString(),
              name: b.name || b.title || "Unnamed Bill",
              dueIn: dueInText,
              amount: typeof b.amount === 'number' ? `$${b.amount.toFixed(2)}` : b.amount || "$0.00",
              category: b.category || "General",
            };
          });

        const formattedRecentBills = rawBills
          .filter((b: any) => {
            const status = (b.status || '').trim().toLowerCase();
            return status === 'paid';
          })
          .map((b: any) => ({
            id: b.id || Date.now().toString(),
            name: b.name || b.title || "Unnamed Bill",
            dueIn: "Paid",
            amount: typeof b.amount === 'number' ? `$${b.amount.toFixed(2)}` : b.amount || "$0.00",
            category: b.category || "General",
          }));

        // ✅ CORRECTLY MAP THE DATABASE FIELDS TO FRONTEND STATE
        console.log("🔍 RAW API RESPONSE:", userData); // ADD THIS LINE
setDashboardData({
          // 1. Map totalBalance to Portfolio
          portfolioValue: userData.totalBalance?.amount || "$0.00",
          portfolioChange: userData.totalBalance?.change || "0.0%",
          
          
          // 2. Map recentTransactions
          transactions: rawTransactions.map((t: any) => ({
            id: t.id || Date.now().toString(),
            merchant: t.merchant || "Unknown",
            type: t.type || "Purchase",
            category: t.category || "General",
            date: t.date || new Date().toLocaleDateString(),
            status: t.status || "completed",
            amount: typeof t.amount === 'number' ? `$${t.amount.toFixed(2)}` : t.amount || "$0.00",
            isNegative: t.isNegative ?? true,
          })),
          
          // 3. Map upcomingBills
          upcomingBills: formattedUpcomingBills,
          
          // 4. Keep QuickContacts as static for now
          quickContacts: defaultQuickContacts,
          
          // 5. Map analysisBalance to Spending Categories
          spendingCategories: [
            { name: "Stocks", percentage: parseInt(userData.analysisBalance?.stocks) || 45, color: "from-blue-400 to-cyan-500" },
            { name: "Crypto", percentage: parseInt(userData.analysisBalance?.crypto) || 35, color: "from-purple-400 to-pink-500" },
            { name: "ETFs", percentage: parseInt(userData.analysisBalance?.etfs) || 20, color: "from-emerald-400 to-teal-500" },
          ],
          watchlist: [],
          investments: [],
          
          // 6. Map bills to Recent Bills
          recentBills: formattedRecentBills,
          
          // 7. Store raw objects so we can save them back later
          totalBalance: userData.totalBalance,
          analysisBalance: userData.analysisBalance,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };
  // ---- Save Dashboard Data (with cleaning) --------------------------------

  const saveDashboardData = async (userId: string, data: UserDashboardData) => {
    try {
      // ✅ UPDATED: Transform the frontend state back into MongoDB structure
      const preparedData = {
        totalBalance: {
          amount: data.portfolioValue,
          change: data.portfolioChange
        },
        analysisBalance: {
          total: data.portfolioValue,
          stocks: data.spendingCategories[0]?.percentage + "%" || "45%",
          crypto: data.spendingCategories[1]?.percentage + "%" || "35%",
          etfs: data.spendingCategories[2]?.percentage + "%" || "20%"
        },
        bills: data.recentBills.map(b => ({ ...b, status: 'paid' })),
        recentTransactions: data.transactions,
        upcomingBills: data.upcomingBills,
        paymentMethods: [], // Add if you have this
        preferences: {}, // Add if you have this
      };

      const response = await fetch('/api/user/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, dashboardData: preparedData }),
      });

      if (!response.ok) {
        throw new Error('Failed to save dashboard data');
      }
    } catch (error) {
      console.error("Error saving dashboard:", error);
    }
  };

  // ---- Handlers -----------------------------------------------------------

  const handlePortfolioUpdate = useCallback((newValue: string, newChange: string) => {
    setDashboardData((prev) => ({
      ...prev,
      portfolioValue: newValue,
      portfolioChange: newChange,
    }));

    if (user && isMounted.current) {
      saveDashboardData(user._id, {
        ...dashboardData,
        portfolioValue: newValue,
        portfolioChange: newChange,
      });
    }
  }, [user, dashboardData]);

  const handleAddInvestment = useCallback((assetId: string, amount: number) => {
    const asset = availableAssets.find(a => a.id === assetId);
    if (!asset || !isMounted.current) return;

    const newInvestment = {
      assetId,
      amount,
      purchasePrice: asset.price,
      date: new Date().toISOString(),
    };

    setDashboardData((prev) => {
      const currentValue = parseFloat(prev.portfolioValue.replace(/[^0-9.]/g, ""));
      const newValue = currentValue + amount;
      const formattedValue = `$${newValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const change = ((newValue - currentValue) / (currentValue || 1)) * 100;
      const changeFormatted = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;

      return {
        ...prev,
        investments: [...(prev.investments || []), newInvestment],
        portfolioValue: formattedValue,
        portfolioChange: changeFormatted,
      };
    });

    if (user && isMounted.current) {
      saveDashboardData(user._id, {
        ...dashboardData,
        investments: [...(dashboardData.investments || []), newInvestment],
      });
    }
  }, [user, dashboardData]);

  const handleRecentBillsUpdate = useCallback((newBills: UpcomingBill[]) => {
    setDashboardData((prev) => ({
      ...prev,
      recentBills: newBills,
    }));

    if (user && isMounted.current) {
      saveDashboardData(user._id, {
        ...dashboardData,
        recentBills: newBills,
      });
    }
  }, [user, dashboardData]);

  const handleUpcomingBillsUpdate = useCallback((newBills: UpcomingBill[]) => {
    setDashboardData((prev) => ({
      ...prev,
      upcomingBills: newBills,
    }));

    if (user && isMounted.current) {
      saveDashboardData(user._id, {
        ...dashboardData,
        upcomingBills: newBills,
      });
    }
  }, [user, dashboardData]);

  // ---- Loading State ------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-20 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
            <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
            <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
            <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
            <div className="h-64 animate-pulse rounded-xl shadow-xl bg-[#C4F8FD]" />
          </div>
        </div>
      </div>
    );
  }

  // ---- Render -------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl"
      >
        <motion.div
          custom={0}
          variants={cardVariants}
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
        >
          <Greet 
            username={userName} 
            className="mb-0"
            iconSize={48}
          />
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}
          className="mb-6 rounded-2xl bg-gradient-to-br from-[#C4F8FD] via-[#B0F0F8] to-[#9AE8F2] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-none"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-cyan-700">
                Total Balance
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-cyan-900 sm:text-4xl">
                 <span className="text-3xl text-amber-400 sm:text-4xl font-normal">$</span>{dashboardData.portfolioValue}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${dashboardData.portfolioChange.startsWith('+')
                    ? 'bg-emerald-400/30 text-emerald-700'
                    : 'bg-red-400/30 text-red-700'
                  }`}>
                  {dashboardData.portfolioChange}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-1">
          <motion.div
            custom={2}
            whileHover={{ scale: 1.01, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.99 }}
            variants={cardVariants}
            className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-[#C4F8FD] via-[#B5F0F8] to-[#A5E8F2] p-5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
          >
            <InvestmentDashboard
              userData={dashboardData}
              onAddInvestment={handleAddInvestment}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <motion.div
            custom={3}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
            variants={cardVariants}
            className="rounded-2xl border-none bg-gradient-to-br from-[#C4F8FD] via-[#B0F0F8] to-[#9AE8F2] shadow-xl p-5 backdrop-blur-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-600">Analysis</h2>
              <Link href={'/Buy'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  View All
                </motion.button>
              </Link>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-cyan-900">
                <span className="text-md text-amber-400 sm:text-2xl font-normal">$</span>
                  {dashboardData.portfolioValue}</p>
                <p className="text-xs text-cyan-700">Total</p>
              </div>
              <div className={`flex items-center font-bold gap-1 text-sm ${dashboardData.portfolioChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {dashboardData.portfolioChange.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span className="font-medium">{dashboardData.portfolioChange}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {dashboardData.spendingCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  custom={4 + index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-800">{category.name}</span>
                    <span className="font-medium text-cyan-800">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="mt-0.5 h-1.5 w-full overflow-hidden cursor-pointer rounded-full bg-cyan-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + index * 0.08,
                        ease: "easeOut" as const,
                      }}
                      className={`h-full rounded-full hover:shadow-xl bg-gradient-to-r ${category.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            custom={4}
            variants={cardVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl border-none shadow-xl bg-gradient-to-br from-[#C4F8FD] via-[#B5F0F8] to-[#A5E8F2] p-5 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-600">Upcoming Bills</h2>
              <Link href={"/Bills"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  View All
                </motion.button>
              </Link>
            </div>

            <UpcomingBillsSection bills={dashboardData.upcomingBills} />
          </motion.div>
        </div>

        <motion.div
          custom={5}
          variants={cardVariants}
          whileHover={{ scale: 1.01, boxShadow: "0 20px 50px rgba(0,0,0,0.06)" }}
          whileTap={{ scale: 0.99 }}
          className="mt-4 rounded-2xl border-none bg-gradient-to-br from-[#C4F8FD] via-[#B0F0F8] to-[#9AE8F2] shadow-xl p-5 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center text-cyan-700 justify-between">
            <h2 className="text-sm font-semibold text-slate-600">Recent Bills</h2>
          </div>
          <RecentBillsSection bills={dashboardData.recentBills} />
        </motion.div>
      </motion.div>
    </div>
  );
}