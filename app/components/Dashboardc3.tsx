// "use client";

// import { motion, useInView, animate } from "framer-motion";
// import { ArrowUpRight } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { portfolioHistory } from "@/lib/data";

// function useCountUp(target: number, start: boolean) {
//   const [value, setValue] = useState(0);

//   useEffect(() => {
//     if (!start) return;
//     const controls = animate(0, target, {
//       duration: 1.1,
//       ease: [0.22, 1, 0.36, 1],
//       onUpdate: (v) => setValue(v),
//     });
//     return () => controls.stop();
//   }, [start, target]);

//   return value;
// }

// export default function PortfolioValueCard() {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, margin: "-40px" });
//   const animatedValue = useCountUp(284500, inView);
//   const max = Math.max(...portfolioHistory.map((d) => d.value));

//   return (
//     <motion.section
//       ref={ref}
//       initial={{ opacity: 0, y: 24 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//       className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
//     >
//       <div className="flex items-start justify-between">
//         <p className="text-xs font-medium text-slate-400">
//           Total Portfolio Value
//         </p>
//         <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
//           <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
//           +12.4%
//         </span>
//       </div>

//       <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 tabular-nums sm:text-4xl">
//         $
//         {animatedValue.toLocaleString(undefined, {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}
//       </p>

//       <div className="mt-6 flex h-32 items-end justify-between gap-2 sm:gap-3">
//         {portfolioHistory.map((point, i) => {
//           const isLast = i === portfolioHistory.length - 1;
//           const heightPercent = (point.value / max) * 100;
//           return (
//             <div
//               key={point.label}
//               className="flex flex-1 flex-col items-center gap-2"
//             >
//               <div className="flex h-24 w-full items-end sm:h-28">
//                 <motion.div
//                   initial={{ height: 0 }}
//                   animate={inView ? { height: `${heightPercent}%` } : {}}
//                   transition={{
//                     duration: 0.6,
//                     delay: 0.15 + i * 0.06,
//                     ease: "easeOut",
//                   }}
//                   whileHover={{ opacity: 0.85 }}
//                   className={`w-full rounded-t-md ${
//                     isLast ? "bg-cyan-400" : "bg-slate-100"
//                   }`}
//                 />
//               </div>
//               <span
//                 className={`text-[10px] font-medium sm:text-xs ${
//                   isLast ? "text-cyan-500" : "text-slate-400"
//                 }`}
//               >
//                 {point.label}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </motion.section>
//   );
// }
