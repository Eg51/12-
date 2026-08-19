// app/userz/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Edit, 
  Save, 
  X, 
  RefreshCw,
  Shield,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,   // new icon for edit link
  Wallet,         // for balance
  FileText,       // for bills
  Activity,       // for transactions
  CreditCard,     // for payment methods
  Settings        // for preferences
} from 'lucide-react';
import Link from 'next/link';   // added for navigation
import Analytic from '@/app/components/Analytic';

// ---- Types ----------------------------------------------------------------

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  role: string;
  isAdmin: boolean;
  isActive: boolean;
  isVerified: boolean;
  accountType: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  loginAttempts?: number;
  lockUntil?: string | null;
  dashboardData?: {
    portfolioValue?: string;
    portfolioChange?: string;
    totalBalance?: { amount: string; change: string };
    analysisBalance?: { total: string; stocks: string; crypto: string; etfs: string };
    bills?: any[];
    recentTransactions?: any[];
    paymentMethods?: any[];
    preferences?: Record<string, any>;
  };
}

interface EditState {
  isEditing: boolean;
  userId: string | null;
  field: string | null;
  value: any;
}

// ---- Main Component --------------------------------------------------------

export default function UserzPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showAllFields, setShowAllFields] = useState(false);
  
  // Edit state for user fields
  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    userId: null,
    field: null,
    value: null
  });

  // ---- Fetch Users ---------------------------------------------------------

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const result = await response.json();
      const userList = result.data || [];
      setUsers(userList);
      setFilteredUsers(userList);
      
      // Auto-select first user only if no user is selected yet
      if (userList.length > 0 && !selectedUser) {
        setSelectedUser(userList[0]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ---- Search Filter -------------------------------------------------------

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = users.filter(user => 
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query) ||
      user.displayName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // ---- Handle Edit (user fields) -------------------------------------------

  const startEditing = (userId: string, field: string, value: any) => {
    setEditState({
      isEditing: true,
      userId,
      field,
      value: value !== undefined && value !== null ? value : ''
    });
  };

  const cancelEditing = () => {
    setEditState({
      isEditing: false,
      userId: null,
      field: null,
      value: null
    });
  };

  const handleEditChange = (value: any) => {
    setEditState(prev => ({ ...prev, value }));
  };

  const saveEdit = async () => {
    if (!editState.userId || !editState.field) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/users/${editState.userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [editState.field]: editState.value
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const updatedUser = await response.json();
      
      // The API returns { success: true, data: updatedUser }
      const userData = updatedUser.data || updatedUser;

      // Update users list
      setUsers(prev => prev.map(user => 
        user._id === userData._id ? userData : user
      ));
      setFilteredUsers(prev => prev.map(user => 
        user._id === userData._id ? userData : user
      ));
      
      // Update selected user
      if (selectedUser?._id === userData._id) {
        setSelectedUser(userData);
      }

      setSaveMessage({ type: 'success', text: 'User updated successfully!' });
      cancelEditing();
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Error updating user:', err);
      setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update user. Please try again.' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Render Editable Field ------------------------------------------------

  const renderEditableField = (
    label: string,
    field: string,
    value: any,
    type: 'text' | 'number' | 'boolean' | 'select' = 'text',
    options?: { value: string; label: string }[]
  ) => {
    if (!selectedUser) return null;

    const isEditing = editState.isEditing && editState.userId === selectedUser._id && editState.field === field;
    const displayValue = value !== undefined && value !== null ? String(value) : '—';

    if (isEditing) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {type === 'boolean' ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEditChange(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    editState.value === true 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  True
                </button>
                <button
                  onClick={() => handleEditChange(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    editState.value === false 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  False
                </button>
              </div>
            ) : type === 'select' && options ? (
              <select
                value={editState.value}
                onChange={(e) => handleEditChange(e.target.value)}
                className="w-full rounded-lg border border-cyan-200 bg-white/50 px-3 py-2 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={type === 'number' ? 'number' : 'text'}
                value={editState.value}
                onChange={(e) => handleEditChange(e.target.value)}
                className="w-full rounded-lg border border-cyan-200 bg-white/50 px-3 py-2 text-sm text-cyan-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            )}
            <button
              onClick={saveEdit}
              disabled={isSaving}
              className="rounded-lg bg-emerald-500 px-3 py-2 text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={cancelEditing}
              className="rounded-lg bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {isSaving && <p className="text-xs text-cyan-600">Saving...</p>}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-cyan-100/30 transition-all group">
        <span className="text-sm text-cyan-700 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-cyan-900">
            {type === 'boolean' ? (
              displayValue === 'true' || displayValue === 'True' ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )
            ) : (
              displayValue
            )}
          </span>
          <button
            onClick={() => startEditing(selectedUser._id, field, value)}
            className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 hover:bg-cyan-200/50"
          >
            <Edit className="h-4 w-4 text-cyan-600" />
          </button>
        </div>
      </div>
    );
  };

  // ---- Loading State -------------------------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-10 w-48 animate-pulse rounded-xl bg-[#C4F8FD]" />
            <div className="mt-2 h-5 w-32 animate-pulse rounded bg-[#C4F8FD]" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-2xl bg-[#C4F8FD]" />
            <div className="h-96 animate-pulse rounded-2xl bg-[#C4F8FD] lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  // ---- Render -------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="md:ml-9">
              <p className="text-md font-bold text-cyan-600/80">User Management</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              <Shield className="h-3 w-3" />
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 rounded-lg bg-cyan-600/20 px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-600/30 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-center text-red-600 flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
        {saveMessage && (
          <div className={`mb-6 rounded-lg p-4 text-center flex items-center justify-center gap-2 ${
            saveMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
          }`}>
            {saveMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {saveMessage.text}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* User List - Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-[#C4F8FD] p-4 shadow-xl backdrop-blur-sm h-[calc(100vh-200px)] flex flex-col"
          >
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-600/60" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-white/50 pl-9 pr-4 py-2 text-sm text-cyan-900 placeholder:text-cyan-600/60 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <p className="text-xs text-cyan-700 mt-2">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-cyan-600">
                  <Users className="h-12 w-12 mx-auto text-cyan-400/60 mb-2" />
                  <p className="text-sm">No users found</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <motion.div
                    key={user._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedUser?._id === user._id
                        ? 'bg-cyan-600/20 shadow-md'
                        : 'hover:bg-cyan-200/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-700 font-semibold">
                        {user.displayName?.[0] || user.username?.[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cyan-900 truncate">
                          {user.displayName || user.username}
                        </p>
                        <p className="text-xs text-cyan-600 truncate">{user.email}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-block h-2 w-2 rounded-full ${
                          user.isActive ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* User Details - Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-[#C4F8FD] p-6 shadow-xl backdrop-blur-sm lg:col-span-2 h-[calc(100vh-200px)] overflow-y-auto"
          >
            {selectedUser ? (
              <div>
                {/* User Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/30 text-2xl font-bold text-cyan-900">
                      {selectedUser.displayName?.[0] || selectedUser.username?.[0] || 'U'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-cyan-900">
                        {selectedUser.displayName || selectedUser.username}
                      </h2>
                      <p className="text-sm text-cyan-600">{selectedUser.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          selectedUser.isAdmin 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {selectedUser.isAdmin ? 'Admin' : 'User'}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          selectedUser.isActive 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {selectedUser.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          selectedUser.isVerified 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* --- NEW: Edit Dashboard Data button --- */}
                  <Link
                    href={`/me/users/${selectedUser._id}`}
                    className="flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-2 text-sm font-bold text-white hover:bg-cyan-500 transition-all shadow-md"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Dashboard
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </div>

                {/* User Details Sections */}
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="rounded-xl bg-white/30 p-4">
                    <h3 className="text-sm font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Basic Information
                    </h3>
                    <div className="space-y-1">
                      {renderEditableField('First Name', 'firstName', selectedUser.firstName)}
                      {renderEditableField('Last Name', 'lastName', selectedUser.lastName)}
                      {renderEditableField('Username', 'username', selectedUser.username)}
                      {renderEditableField('Display Name', 'displayName', selectedUser.displayName)}
                      {renderEditableField('Email', 'email', selectedUser.email)}
                      {renderEditableField('Phone', 'phone', selectedUser.phone)}
                      {renderEditableField('Account Type', 'accountType', selectedUser.accountType)}
                    </div>
                  </div>

                  {/* Status & Permissions */}
                  <div className="rounded-xl bg-white/30 p-4">
                    <h3 className="text-sm font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Status & Permissions
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-cyan-100/30 transition-all group">
                        <span className="text-sm text-cyan-700 font-medium">Role</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-cyan-900">
                            {selectedUser.isAdmin ? 'Admin' : 'User'}
                          </span>
                          <button
                            onClick={() => startEditing(selectedUser._id, 'isAdmin', selectedUser.isAdmin)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 hover:bg-cyan-200/50"
                          >
                            <Edit className="h-4 w-4 text-cyan-600" />
                          </button>
                        </div>
                      </div>
                      {renderEditableField('Active', 'isActive', selectedUser.isActive, 'boolean')}
                      {renderEditableField('Verified', 'isVerified', selectedUser.isVerified, 'boolean')}
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="rounded-xl bg-white/30 p-4">
                    <h3 className="text-sm font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Account Statistics
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 rounded-lg">
                        <span className="text-sm text-cyan-700 font-medium">Created</span>
                        <span className="text-sm text-cyan-900">
                          {new Date(selectedUser.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {selectedUser.lastLogin && (
                        <div className="flex items-center justify-between p-2 rounded-lg">
                          <span className="text-sm text-cyan-700 font-medium">Last Login</span>
                          <span className="text-sm text-cyan-900">
                            {new Date(selectedUser.lastLogin).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedUser.loginAttempts !== undefined && (
                        <div className="flex items-center justify-between p-2 rounded-lg">
                          <span className="text-sm text-cyan-700 font-medium">Login Attempts</span>
                          <span className="text-sm text-cyan-900">{selectedUser.loginAttempts}</span>
                        </div>
                      )}
                      {selectedUser.lockUntil && (
                        <div className="flex items-center justify-between p-2 rounded-lg">
                          <span className="text-sm text-cyan-700 font-medium">Locked Until</span>
                          <span className="text-sm text-cyan-900">
                            {new Date(selectedUser.lockUntil).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dashboard Data – Enhanced Display */}
                  {selectedUser.dashboardData && (
                    <div className="rounded-xl bg-white/30 p-4">
                      <button
                        onClick={() => setShowAllFields(!showAllFields)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <h3 className="text-sm font-semibold text-cyan-800 flex items-center gap-2">
                          <Analytic />
                          Dashboard Data
                        </h3>
                        {showAllFields ? (
                          <ChevronUp className="h-4 w-4 text-cyan-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-cyan-600" />
                        )}
                      </button>

                      {/* Summary view (always visible) */}
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        {selectedUser.dashboardData.totalBalance && (
                          <div className="bg-white/40 p-2 rounded-lg flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-cyan-600" />
                            <div>
                              <p className="text-xs text-cyan-600">Balance</p>
                              <p className="font-bold text-cyan-900">
                                ${selectedUser.dashboardData.totalBalance.amount}
                                <span className="text-xs font-normal text-cyan-600 ml-1">
                                  ({selectedUser.dashboardData.totalBalance.change})
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="bg-white/40 p-2 rounded-lg flex items-center gap-2">
                          <FileText className="h-4 w-4 text-cyan-600" />
                          <div>
                            <p className="text-xs text-cyan-600">Bills</p>
                            <p className="font-bold text-cyan-900">
                              {selectedUser.dashboardData.bills?.length || 0}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/40 p-2 rounded-lg flex items-center gap-2">
                          <Activity className="h-4 w-4 text-cyan-600" />
                          <div>
                            <p className="text-xs text-cyan-600">Transactions</p>
                            <p className="font-bold text-cyan-900">
                              {selectedUser.dashboardData.recentTransactions?.length || 0}
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/40 p-2 rounded-lg flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-cyan-600" />
                          <div>
                            <p className="text-xs text-cyan-600">Payment Methods</p>
                            <p className="font-bold text-cyan-900">
                              {selectedUser.dashboardData.paymentMethods?.length || 0}
                            </p>
                          </div>
                        </div>
                        {selectedUser.dashboardData.preferences && (
                          <div className="bg-white/40 p-2 rounded-lg flex items-center gap-2 col-span-2">
                            <Settings className="h-4 w-4 text-cyan-600" />
                            <div>
                              <p className="text-xs text-cyan-600">Preferences</p>
                              <p className="font-bold text-cyan-900">
                                {Object.keys(selectedUser.dashboardData.preferences).length} keys
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Full JSON (collapsible) */}
                      {showAllFields && (
                        <div className="mt-3 space-y-1 text-sm text-cyan-700">
                          <pre className="bg-white/50 p-3 rounded-lg overflow-x-auto text-xs text-cyan-900">
                            {JSON.stringify(selectedUser.dashboardData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-cyan-600">
                <Users className="h-16 w-16 text-cyan-400/60 mb-4" />
                <p className="text-lg font-medium">Select a user to view details</p>
                <p className="text-sm">Click on a user from the left panel</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}