"use client";

import { motion } from "framer-motion";
import { Cloud, Zap } from "lucide-react";
// import { upcomingBills } from "@/lib/data";

const iconMap = {
  bolt: Zap,
  cloud: Cloud,
};

const iconStyles = {
  bolt: "bg-amber-50 text-amber-500",
  cloud: "bg-sky-50 text-sky-500",
};

const badgeStyles = {
  urgent: "bg-orange-50 text-orange-500",
  auto: "bg-blue-50 text-blue-500",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0 },
};

export default function UpcomingBillsCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Upcoming Bills
        </h2>
        <button className="text-xs font-medium text-cyan-500 hover:underline">
          View All
        </button>
      </div>

      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-4 space-y-3"
      >
        {/* {upcomingBills.map((bill) => { */}
          const Icon = iconMap[bill.icon];
          return (
            <motion.li
            //   key={bill.id}
              variants={item}
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 rounded-xl border border-slate-50 p-2 transition-colors hover:bg-slate-50"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                //   iconStyles[bill.icon]
                }`}
              >
                {/* <Icon className="h-4 w-4" strokeWidth={2} /> */}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {/* {bill.name} */}
                </p>
                <p className="text-xs text-slate-400">
                  {/* Due in {bill.dueInDays} days */}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-semibold text-slate-800">
                  {/* ${bill.amount.toFixed(2)} */}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    // badgeStyles[bill.badge.tone]
                  }`}
                >
                  {/* {bill.badge.label} */}
                </span>
              </div>
            </motion.li>
          );
        {/* })} */}
      </motion.ul>
    </motion.section>
  );
}
