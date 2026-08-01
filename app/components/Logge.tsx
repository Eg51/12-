// app/login/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWidgett from '@/app/components/ChatWidgett'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  TrendingUp,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

interface FormData {
  username: string;
  password: string;
}

interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoURL: string | null;
  transactionPin: string;
  createdAt: string;
  updatedAt: string;
}

interface MarketStatus {
  label: string;
  value: string;
  status: "active" | "inactive" | "up" | "down" | "neutral";
}

// ============================================================================
// ANIMATION VARIANTS - FIXED
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// ✅ FIX: Added 'as const' to ease values
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [marketData, setMarketData] = useState<MarketStatus[]>([
    { label: "MARKET STATUS", value: "LOADING", status: "neutral" },
    { label: "BTC", value: "---", status: "neutral" },
    { label: "ETH", value: "---", status: "neutral" },
  ]);
  const [isMarketLoading, setIsMarketLoading] = useState(true);
  const [marketError, setMarketError] = useState(false);

  useEffect(() => {
    setMounted(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/Dashboard");
      }
    });

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [router]);

  const fetchMarketData = async () => {
    setIsMarketLoading(true);
    setMarketError(false);

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const isMarketOpen = checkMarketHours();

      const formattedData: MarketStatus[] = [
        {
          label: "MARKET STATUS",
          value: isMarketOpen ? "OPEN" : "CLOSED",
          status: isMarketOpen ? "active" : "inactive",
        },
        {
          label: "BTC",
          value: formatPriceChange(data.bitcoin?.usd_24h_change || 0),
          status: getStatus(data.bitcoin?.usd_24h_change || 0),
        },
        {
          label: "ETH",
          value: formatPriceChange(data.ethereum?.usd_24h_change || 0),
          status: getStatus(data.ethereum?.usd_24h_change || 0),
        },
      ];

      setMarketData(formattedData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setMarketError(true);

      const isMarketOpen = checkMarketHours();
      setMarketData([
        {
          label: "MARKET STATUS",
          value: isMarketOpen ? "OPEN" : "CLOSED",
          status: isMarketOpen ? "active" : "inactive",
        },
        {
          label: "BTC",
          value: formatPriceChange(1.24),
          status: "up",
        },
        {
          label: "ETH",
          value: formatPriceChange(0.82),
          status: "up",
        },
      ]);
    } finally {
      setIsMarketLoading(false);
    }
  };

  const checkMarketHours = (): boolean => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (day === 0 || day === 6) return false;

    const estHours = (hours - 5 + 24) % 24;
    const estMinutes = minutes;

    if (estHours > 9 || (estHours === 9 && estMinutes >= 30)) {
      if (estHours < 16 || (estHours === 16 && estMinutes === 0)) {
        return true;
      }
    }

    return false;
  };

  const getStatus = (change: number): "up" | "down" | "neutral" => {
    if (change > 0.1) return "up";
    if (change < -0.1) return "down";
    return "neutral";
  };

  const formatPriceChange = (change: number): string => {
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.username,
        formData.password
      );

      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          email: user.email || "",
          phone: "",
          photoURL: user.photoURL || null,
          transactionPin: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", user.uid), newProfile);
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/Dashboard");
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later");
          break;
        default:
          setError(err.message || "Login failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    setIsResetting(true);
    setError("");
    setSuccess("");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetEmail("");
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      console.error("Reset error:", err);
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        default:
          setError(err.message || "Failed to send reset email");
      }
    } finally {
      setIsResetting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-600";
      case "inactive":
        return "text-red-600";
      case "up":
        return "text-emerald-600";
      case "down":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500";
      case "inactive":
        return "bg-red-500";
      case "up":
        return "bg-emerald-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 px-4 py-6 sm:px-6 md:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={itemVariants} className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20">
            <Shield className="h-5 w-5 text-cyan-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
              Lumina <span className="text-cyan-700">Elite</span>
            </h1>
            <p className="text-xs text-slate-600">Secure Banking Platform</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            variants={cardVariants}
            className="rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm sm:p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Welcome Back
                </h2>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Sign in to your Lumina Elite account
                </p>
              </div>
              <div className="rounded-lg bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
                Elite
              </div>
            </div>

            <motion.div
              variants={itemVariants}
              className="mt-4 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-700 p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">ALEX THOMPSON</p>
                  <p className="mt-1 font-mono text-sm tracking-widest sm:text-base">
                    •••• •••• •••• 8820
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5"
                >
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-500">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!isForgotPassword ? (
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Username or Account ID
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-2.5 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Enter your email or account ID"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Passcode
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Enter your passcode"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Secure Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="hover:text-slate-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                  <span>
                    New here?{" "}
                    <Link
                      href="/sign-up"
                      className="font-medium text-cyan-700 hover:underline"
                    >
                      Create Account
                    </Link>
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Enter your email address"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isResetting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-500 disabled:opacity-50"
                >
                  {isResetting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
                >
                  ← Back to Sign In
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="space-y-4"
          >
            <div className="rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Market Status
                </h3>
                {isMarketLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
                ) : marketError ? (
                  <button
                    onClick={fetchMarketData}
                    className="text-xs text-cyan-600 hover:underline"
                  >
                    Retry
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">Live</span>
                )}
              </div>
              <div className="mt-3 space-y-2">
                {marketData.map((item, index) => (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    custom={index}
                    className="flex items-center justify-between rounded-lg bg-white/50 px-4 py-2.5"
                  >
                    <span className="text-xs font-medium text-slate-600">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {item.status === "active" && (
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(item.status)}`}
                        />
                      )}
                      {item.status === "inactive" && (
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(item.status)}`} />
                      )}
                      <span
                        className={`text-sm font-semibold ${getStatusColor(item.status)}`}
                      >
                        {item.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Elite Benefits
              </h3>
              <div className="mt-3 space-y-2">
                {[
                  { icon: Shield, text: "End-to-end 256-bit encryption" },
                  { icon: TrendingUp, text: "Real-time market insights" },
                  { icon: Globe, text: "Global multi-currency support" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    custom={index + 3}
                    className="flex items-center gap-3 rounded-lg bg-white/50 px-4 py-2.5"
                  >
                    <div className="rounded-full bg-cyan-500/20 p-1.5">
                      <feature.icon className="h-3.5 w-3.5 text-cyan-700" />
                    </div>
                    <span className="text-xs text-slate-700">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Total Assets</p>
                  <p className="text-xl font-bold text-white">$284,500</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">24h Change</p>
                  <p className="text-sm font-semibold text-emerald-300">+2.4%</p>
                </div>
              </div>
              <div className="mt-4 flex h-12 items-end gap-0.5">
                {[40, 60, 45, 75, 55, 85, 70, 90, 65, 80, 72, 88].map(
                  (height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height * 0.3 + 4}px` }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.05,
                        ease: "easeOut" as const,
                      }}
                      className={`w-full rounded-t-sm ${
                        i > 6 ? "bg-emerald-400/60" : "bg-white/30"
                      }`}
                    />
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-xs text-slate-500"
        >
          <p>© 2024 Lumina Elite. All rights reserved.</p>
          <p className="mt-1">
            Secure banking for the modern world. Member FDIC.
          </p>
        </motion.div>
      </motion.div>
      <ChatWidgett />
    </div>
  );
}