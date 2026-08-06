// app/payments/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Iconpack from '@/app/components/Iconpack';
import ChatWidgett from '@/app/components/ChatWidgett';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Send,
  ArrowUpRight,
} from "lucide-react";

interface Bill {
  id: string;
  name: string;
  dueIn: string;
  amount: string;
  category: string;
  status?: "pending" | "paid" | "overdue";
}

// Mock bill data (in a real app, this would come from your database)
const mockBills: Bill[] = [
  {
    id: "1",
    name: "Electricity Bill",
    dueIn: "2 days",
    amount: "$89.00",
    category: "Utilities",
    status: "pending",
  },
  {
    id: "2",
    name: "Internet Service",
    dueIn: "5 days",
    amount: "$65.99",
    category: "Subscription",
    status: "pending",
  },
  {
    id: "3",
    name: "Rent Payment",
    dueIn: "Paid",
    amount: "$1,200.00",
    category: "Housing",
    status: "paid",
  },
];

export default function BillPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Simulate fetching bill data
    const fetchBill = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const foundBill = mockBills.find(b => b.id === params.id);
      setBill(foundBill || null);
      if (foundBill) {
        setAmount(foundBill.amount.replace('$', ''));
      }
      setLoading(false);
    };
    fetchBill();
  }, [params.id]);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    // Show success or redirect
    alert('Payment successful!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-cyan-600 font-bold">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-cyan-600/50 mx-auto" />
          <p className="mt-4 text-cyan-600 font-bold">Bill not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 rounded-lg bg-cyan-600 text-white font-bold shadow-xl hover:bg-cyan-500 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-800 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Bills
        </motion.button>

        {/* Bill Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[#C4F8FD] p-6 shadow-xl border-none"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-600">{bill.name}</h1>
              <p className="text-sm text-cyan-600/70">{bill.category}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
              bill.status === 'paid' 
                ? 'bg-emerald-500/20 text-emerald-600' 
                : bill.status === 'overdue'
                ? 'bg-red-500/20 text-red-600'
                : 'bg-amber-500/20 text-amber-600'
            }`}>
              {bill.status || 'Pending'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/30 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-600/70">
                <DollarSign size={16} />
                <span className="text-sm font-bold">Amount</span>
              </div>
              <p className="text-2xl font-bold text-cyan-600">{bill.amount}</p>
            </div>
            <div className="bg-white/30 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-600/70">
                <Clock size={16} />
                <span className="text-sm font-bold">Due</span>
              </div>
              <p className="text-2xl font-bold text-cyan-600">
                {bill.dueIn === 'Paid' ? 'Paid' : bill.dueIn}
              </p>
            </div>
          </div>

          {/* Payment Section */}
          {bill.status !== 'paid' && (
            <div className="border-t border-cyan-200/30 pt-6">
              <h2 className="text-sm font-bold text-slate-600 mb-4">Make Payment</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-cyan-600/70 block mb-1">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600/50 font-bold">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full rounded-xl border border-cyan-900/20 bg-white/50 px-4 py-3 pl-8 text-cyan-600 font-bold placeholder:text-cyan-600/40 focus:border-cyan-600/50 focus:outline-none shadow-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {[10, 25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className="flex-1 rounded-lg bg-white/50 px-3 py-2 text-xs font-bold text-cyan-600 hover:bg-white/70 transition-colors shadow-xl border border-cyan-900/20"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-bold text-white shadow-xl
                   shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Pay Now
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </div>
          )}

          {bill.status === 'paid' && (
            <div className="border-t border-cyan-200/30 pt-6">
              <div className="flex items-center justify-center gap-3 text-emerald-600">
                <CheckCircle size={24} />
                <span className="text-sm font-bold">This bill has been paid</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <ChatWidgett />
      <Iconpack />
    </div>
  );
}