// app/me/users/[userId]/page.tsx/ Ui editor
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getUserDashData, updateUserDashData } from "@/app/actions/admin";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Loader2 
} from "lucide-react";

export default function AdminUserDashboardEditor() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [dashData, setDashData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBill, setEditingBill] = useState<any>(null);

  // ---- Load Data ----
  useEffect(() => {
    const loadData = async () => {
      const result = await getUserDashData(userId);
      if (result.success) {
        setDashData(result.data);
      }
      setLoading(false);
    };
    loadData();
  }, [userId]);

  // ---- Helpers ----
  const handleSave = async () => {
    setSaving(true);
    await updateUserDashData(userId, dashData);
    setSaving(false);
  };

  const addBill = () => {
    const newBill = { 
      id: Date.now().toString(), 
      name: "New Bill", 
      amount: "0.00", 
      dueDate: new Date().toISOString().split('T')[0], 
      status: "pending" 
    };
    setDashData((prev: any) => ({ 
      ...prev, 
      bills: [...(prev.bills || []), newBill] 
    }));
  };

  const updateBill = (index: number, field: string, value: string) => {
    const updatedBills = [...(dashData.bills || [])];
    updatedBills[index][field] = value;
    setDashData((prev: any) => ({ ...prev, bills: updatedBills }));
  };

  const deleteBill = (index: number) => {
    const updatedBills = (dashData.bills || []).filter((_: any, i: number) => i !== index);
    setDashData((prev: any) => ({ ...prev, bills: updatedBills }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-6 flex justify-center items-center">
        <div className="text-center text-cyan-700">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="font-bold">Loading user dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-cyan-700 hover:text-cyan-900 font-bold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Users
          </button>
          <h1 className="text-2xl font-bold text-cyan-900">Editing Dashboard for User ID: {userId}</h1>
        </div>

        {/* BILLS CRUD Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#C4F8FD] rounded-2xl p-6 shadow-xl mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-cyan-800">Manage User Bills</h2>
            <button 
              onClick={addBill}
              className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-lg"
            >
              <Plus size={16} /> Add Bill
            </button>
          </div>

          <div className="space-y-3">
            {(dashData?.bills || []).map((bill: any, index: number) => (
              <div key={bill.id || index} className="flex flex-wrap items-center gap-2 sm:gap-4 bg-white/40 p-3 rounded-xl backdrop-blur-sm border border-cyan-200/30">
                <input 
                  type="text" 
                  value={bill.name} 
                  onChange={(e) => updateBill(index, "name", e.target.value)}
                  className="flex-1 min-w-[120px] bg-white/50 px-3 py-1.5 rounded-lg text-sm font-bold text-cyan-900 border border-cyan-200/50 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="Bill Name"
                />
                <input 
                  type="text" 
                  value={bill.amount} 
                  onChange={(e) => updateBill(index, "amount", e.target.value)}
                  className="w-24 bg-white/50 px-3 py-1.5 rounded-lg text-sm font-bold text-cyan-900 border border-cyan-200/50 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="$0.00"
                />
                <input 
                  type="date" 
                  value={bill.dueDate} 
                  onChange={(e) => updateBill(index, "dueDate", e.target.value)}
                  className="w-32 bg-white/50 px-3 py-1.5 rounded-lg text-sm font-bold text-cyan-900 border border-cyan-200/50 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <select 
                  value={bill.status}
                  onChange={(e) => updateBill(index, "status", e.target.value)}
                  className="w-24 bg-white/50 px-2 py-1.5 rounded-lg text-sm font-bold border border-cyan-200/50 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <button 
                  onClick={() => deleteBill(index)}
                  className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {(!dashData?.bills || dashData.bills.length === 0) && (
              <p className="text-center text-cyan-600/50 font-bold py-4">No bills for this user yet.</p>
            )}
          </div>
        </motion.div>

        {/* SAVE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className={`w-full rounded-xl py-3.5 font-extrabold text-white shadow-xl transition-all ${
            saving 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/30 hover:shadow-cyan-500/50"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {saving ? "Saving Changes..." : "Save Changes to User Dashboard"}
          </span>
        </motion.button>

      </div>
    </div>
  );
}