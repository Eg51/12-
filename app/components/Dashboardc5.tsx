// "use client";

// import { motion } from "framer-motion";
// import { CreditCard, Download, Plane, ShoppingBag, SlidersHorizontal } from "lucide-react";
// import { recentTransactions } from "@/lib/data";
// import { Transaction } from "@/lib/types";

// const iconMap = {
//   bag: ShoppingBag,
//   plane: Plane,
//   card: CreditCard,
// };

// const statusStyles: Record<Transaction["status"], string> = {
//   Completed: "bg-emerald-500",
//   Pending: "bg-amber-500",
//   Failed: "bg-red-500",
// };

// const container = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
// };

// const row = {
//   hidden: { opacity: 0, y: 10 },
//   show: { opacity: 1, y: 0 },
// };

// function AmountText({ amount }: { amount: number }) {
//   const positive = amount > 0;
//   return (
//     <span
//       className={`text-sm font-semibold tabular-nums ${
//         positive ? "text-emerald-500" : "text-slate-800"
//       }`}
//     >
//       {positive ? "+" : "-"}${Math.abs(amount).toFixed(2)}
//     </span>
//   );
// }

// export default function TransactionsTable() {
//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 24 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-40px" }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//       className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
//     >
//       <div className="flex items-center justify-between">
//         <h2 className="text-sm font-semibold text-slate-900">
//           Recent Transactions
//         </h2>
//         <div className="flex items-center gap-2">
//           <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50">
//             <SlidersHorizontal className="h-3.5 w-3.5" />
//             Filter
//           </button>
//           <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50">
//             <Download className="h-3.5 w-3.5" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Desktop table */}
//       <div className="mt-4 hidden overflow-x-auto sm:block">
//         <table className="w-full border-collapse text-left">
//           <thead>
//             <tr className="text-[11px] uppercase tracking-wide text-slate-400">
//               <th className="pb-3 font-medium">Merchant / Type</th>
//               <th className="pb-3 font-medium">Category</th>
//               <th className="pb-3 font-medium">Date</th>
//               <th className="pb-3 font-medium">Status</th>
//               <th className="pb-3 text-right font-medium">Amount</th>
//             </tr>
//           </thead>
//           <motion.tbody
//             variants={container}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true }}
//           >
//             {recentTransactions.map((tx) => {
//               const Icon = iconMap[tx.icon];
//               return (
//                 <motion.tr
//                   key={tx.id}
//                   variants={row}
//                   whileHover={{ backgroundColor: "rgba(241,245,249,0.6)" }}
//                   className="border-t border-slate-50"
//                 >
//                   <td className="py-3">
//                     <div className="flex items-center gap-3">
//                       <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
//                         <Icon className="h-4 w-4" strokeWidth={2} />
//                       </span>
//                       <div>
//                         <p className="text-sm font-medium text-slate-800">
//                           {tx.merchant}
//                         </p>
//                         <p className="text-xs text-slate-400">{tx.type}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-3">
//                     <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
//                       {tx.category}
//                     </span>
//                   </td>
//                   <td className="py-3 text-sm text-slate-500">{tx.date}</td>
//                   <td className="py-3">
//                     <span className="flex items-center gap-1.5 text-sm text-slate-500">
//                       <span
//                         className={`h-1.5 w-1.5 rounded-full ${
//                           statusStyles[tx.status]
//                         }`}
//                       />
//                       {tx.status}
//                     </span>
//                   </td>
//                   <td className="py-3 text-right">
//                     <AmountText amount={tx.amount} />
//                   </td>
//                 </motion.tr>
//               );
//             })}
//           </motion.tbody>
//         </table>
//       </div>

//       {/* Mobile card list */}
//       <motion.ul
//         variants={container}
//         initial="hidden"
//         whileInView="show"
//         viewport={{ once: true }}
//         className="mt-4 space-y-3 sm:hidden"
//       >
//         {recentTransactions.map((tx) => {
//           const Icon = iconMap[tx.icon];
//           return (
//             <motion.li
//               key={tx.id}
//               variants={row}
//               className="flex items-center gap-3 rounded-xl border border-slate-50 p-3"
//             >
//               <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
//                 <Icon className="h-4 w-4" strokeWidth={2} />
//               </span>
//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-sm font-medium text-slate-800">
//                   {tx.merchant}
//                 </p>
//                 <p className="text-xs text-slate-400">
//                   {tx.date} ·{" "}
//                   <span className="inline-flex items-center gap-1">
//                     <span
//                       className={`h-1.5 w-1.5 rounded-full ${
//                         statusStyles[tx.status]
//                       }`}
//                     />
//                     {tx.status}
//                   </span>
//                 </p>
//               </div>
//               <AmountText amount={tx.amount} />
//             </motion.li>
//           );
//         })}
//       </motion.ul>
//     </motion.section>
//   );
// }
