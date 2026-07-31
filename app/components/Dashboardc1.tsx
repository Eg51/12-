"use client";

import { motion } from "framer-motion";
import { Lock, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function CardsCard() {
  const [locked, setLocked] = useState(true);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Your Cards</h2>
        <button
          className="text-slate-400 hover:text-slate-600"
          aria-label="More options"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <motion.div
        whileHover={{ rotateX: 2, rotateY: -3, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
        className="mt-4 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-4 text-white shadow-lg shadow-blue-200"
      >
        <div className="flex items-start justify-between">
          <span className="h-6 w-6 rounded-full border-2 border-white/70" />
          <span className="text-base font-bold italic tracking-wide">
            VISA
          </span>
        </div>
        <p className="mt-6 text-xs font-medium text-white/80">
          Platinum Credit
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium tracking-widest">
          <span>••••</span>
          <span>••••</span>
          <span>••••</span>
          <span>8824</span>
        </div>
      </motion.div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Lock className="h-4 w-4" strokeWidth={2} />
          Lock Card
        </span>
        <button
          onClick={() => setLocked((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            locked ? "bg-cyan-400" : "bg-slate-200"
          }`}
          aria-pressed={locked}
          aria-label="Toggle card lock"
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
            style={{ left: locked ? "22px" : "2px" }}
          />
        </button>
      </div>
    </motion.section>
  );
}
