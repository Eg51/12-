"use client";

import { motion } from "framer-motion";
import { Bell, Moon, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const [searchOpenMobile, setSearchOpenMobile] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex items-center gap-3 sm:gap-4"
    >
      {/* Search — full width on desktop, collapsible on mobile */}
      <div
        className={`relative flex-1 ${
          searchOpenMobile ? "flex" : "hidden"
        } sm:flex`}
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          strokeWidth={2}
        />
        <input
          type="text"
          placeholder="Search transactions, accounts, or help..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      {/* Mobile search toggle */}
      <button
        onClick={() => setSearchOpenMobile((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 sm:hidden"
        aria-label="Toggle search"
      >
        <Search className="h-4 w-4" strokeWidth={2} />
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" strokeWidth={2} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 sm:flex"
          aria-label="Toggle theme"
        >
          <Moon className="h-4 w-4" strokeWidth={2} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 rounded-xl bg-cyan-400 px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm shadow-cyan-200 sm:px-4"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">New Transfer</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
