// app/payments/page.tsx

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Building,
  Shield,
  Lock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type Frequency = "one-time" | "weekly" | "bi-weekly" | "monthly";

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
// MAIN COMPONENT
// ============================================================================

export default function SchedulePaymentPage() {
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [paymentDate, setPaymentDate] = useState("2024-10-24");
  const [endDate, setEndDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const frequencies: Frequency[] = ["one-time", "weekly", "bi-weekly", "monthly"];

  const frequencyLabels: Record<Frequency, string> = {
    "one-time": "One-time",
    weekly: "Weekly",
    "bi-weekly": "Bi-weekly",
    monthly: "Monthly",
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      setIsReviewed(false);
      setIsConfirmed(false);
    }, 2000);
  };

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
            Schedule Your Payment
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Set up a new payment or recurring bill
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left Column - Form */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm sm:p-8">
              {/* Frequency Section */}
              <motion.div custom={2} variants={itemVariants}>
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Frequency
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {frequencies.map((freq) => (
                    <motion.button
                      key={freq}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFrequency(freq)}
                      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        frequency === freq
                          ? "bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/50"
                          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {frequencyLabels[freq]}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Payment Date Section */}
              <motion.div custom={3} variants={itemVariants} className="mt-6">
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Payment Date
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={!isRecurring}
                        className={`w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                          !isRecurring ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        End Date
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                      Only for recurring payments.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method Section */}
              <motion.div custom={4} variants={itemVariants} className="mt-6">
                <label className="mb-3 block text-sm font-medium text-slate-300">
                  Payment Method
                </label>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-700 bg-slate-800/30 p-4 transition-colors hover:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/20 p-2">
                      <CreditCard size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Lumina Platinum Card (**** B829)
                      </p>
                      <p className="text-xs text-slate-400">
                        Available: $24,500.00
                      </p>
                    </div>
                  </div>
                  <CheckCircle size={18} className="text-cyan-400" />
                </motion.div>
              </motion.div>

              {/* Recurring Toggle */}
              <motion.div custom={5} variants={itemVariants} className="mt-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => {
                      setIsRecurring(e.target.checked);
                      if (!e.target.checked) setEndDate("");
                    }}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  />
                  <span className="text-sm text-slate-300">
                    Make this a recurring payment
                  </span>
                </label>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                custom={6}
                variants={itemVariants}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                >
                  <ChevronLeft size={18} />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsReviewed(true)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-colors hover:from-cyan-400 hover:to-blue-500"
                >
                  Continue to Review
                  <ChevronRight size={18} />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Summary */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <div className="sticky top-6 space-y-6">
              {/* Summary Card */}
              <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white">Summary</h2>

                <div className="mt-4 space-y-4 divide-y divide-slate-800/50">
                  {/* Biller */}
                  <motion.div
                    custom={7}
                    variants={itemVariants}
                    className="flex items-center justify-between pb-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-800/50 p-2">
                        <Building size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Biller Name</p>
                        <p className="text-sm font-medium text-white">
                          Pacific Gas & Electric
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Amount Due */}
                  <motion.div
                    custom={8}
                    variants={itemVariants}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-800/50 p-2">
                        <DollarSign size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Amount Due</p>
                        <p className="text-sm font-medium text-white">
                          $184.50
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Processing Fee */}
                  <motion.div
                    custom={9}
                    variants={itemVariants}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-800/50 p-2">
                        <Clock size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Processing Fee</p>
                        <p className="text-sm font-medium text-emerald-400">
                          $0.00
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Service Charge */}
                  <motion.div
                    custom={10}
                    variants={itemVariants}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-slate-800/50 p-2">
                        <CheckCircle size={18} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Service Charge</p>
                        <p className="text-sm font-medium text-emerald-400">
                          Included
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Total */}
                  <motion.div
                    custom={11}
                    variants={itemVariants}
                    className="flex items-center justify-between pt-4"
                  >
                    <div>
                      <p className="text-xs text-slate-400">Estimated Total</p>
                      <p className="text-2xl font-bold text-white">
                        $184.50
                      </p>
                    </div>
                    <div className="rounded-lg bg-cyan-500/20 px-3 py-1">
                      <span className="text-xs font-medium text-cyan-400">
                        Due today
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Security Badge */}
              <motion.div
                custom={12}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-6 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-cyan-500/20 p-2">
                    <Shield size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Lumina SecurePay™
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Your payment is protected by:
                    </p>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Lock size={12} className="text-cyan-400" />
                        <span className="text-xs text-slate-400">
                          End-to-end 256-bit encryption
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle size={12} className="text-cyan-400" />
                        <span className="text-xs text-slate-400">
                          Multi-currency shield fraud detection
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Frequency Badge */}
              <motion.div
                custom={13}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between rounded-xl bg-slate-800/30 px-4 py-2.5"
              >
                <span className="text-xs text-slate-400">Payment Frequency</span>
                <span className="text-sm font-medium capitalize text-cyan-400">
                  {frequencyLabels[frequency]}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewed && !isConfirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setIsReviewed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20"
                >
                  <CheckCircle size={32} className="text-emerald-400" />
                </motion.div>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  Review Your Payment
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Please confirm the payment details below
                </p>

                <div className="mt-6 space-y-3 rounded-lg bg-slate-800/50 p-4 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Biller</span>
                    <span className="text-white">Pacific Gas & Electric</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Amount</span>
                    <span className="text-white font-medium">$184.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Frequency</span>
                    <span className="text-white capitalize">
                      {frequencyLabels[frequency]}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Payment Date</span>
                    <span className="text-white">
                      {new Date(paymentDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {isRecurring && endDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">End Date</span>
                      <span className="text-white">
                        {new Date(endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsReviewed(false)}
                    className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirm}
                    className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-colors hover:from-emerald-400 hover:to-cyan-400"
                  >
                    Confirm Payment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {isConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-white">Payment Confirmed!</p>
                <p className="text-sm text-slate-400">
                  Your payment has been scheduled successfully.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}