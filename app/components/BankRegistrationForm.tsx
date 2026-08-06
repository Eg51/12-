"use client";

import { useState, useEffect, type FormEvent, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  UserPlus,
  X,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

// ---- Types ----------------------------------------------------------------

// Personal Form State
interface PersonalFormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<string, string>>;

// ✅ FIX: Add index signature to match DraftData
interface DraftData {
  [key: string]: unknown;
}

const PERSONAL_INITIAL_STATE: PersonalFormState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const DRAFT_STORAGE_KEY = "bank_signup_draft";
const ACCOUNT_FLAG_KEY = "bank_account_created";

// ---- Animation variants ----------------------------------------------------

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ---- Success Card Animation Variants ---------------------------------------

const successOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const successCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      delay: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
    transition: { duration: 0.3 }
  }
};

const successIconVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 18,
      delay: 0.3
    }
  }
};

const successTextVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.4 }
  }
};

const successButtonVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.5 }
  }
};

// ---- Local storage helpers --------------------------------------------------

function readAccountFlag(): { email?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_FLAG_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { email?: string };
  } catch {
    return null;
  }
}

function writeAccountFlag(email: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ACCOUNT_FLAG_KEY,
      JSON.stringify({ email, createdAt: Date.now() })
    );
  } catch {
    // Ignore storage failures
  }
}

function readDraft(): DraftData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

function writeDraft(draft: DraftData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage failures
  }
}

function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // no-op
  }
}

// ---- Success Card Component ------------------------------------------------

interface SuccessCardProps {
  email: string;
  username: string;
  onClose: () => void;
  onLogin: () => void;
  onDashboard: () => void;
}

function SuccessCard({ email, username, onClose, onLogin, onDashboard }: SuccessCardProps) {
  return (
    <motion.div
      variants={successOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        variants={successCardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-300 p-8 shadow-xl border border-white/30"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-600 hover:bg-white/20 hover:text-slate-800 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative flex flex-col items-center text-center">
          <motion.div
            variants={successIconVariants}
            initial="hidden"
            animate="visible"
            className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle2 size={40} className="text-white" />
          </motion.div>

          <motion.h2
            variants={successTextVariants}
            initial="hidden"
            animate="visible"
            className="mt-4 text-2xl font-bold text-slate-800"
          >
            Account Created! 🎉
          </motion.h2>

          <motion.p
            variants={successTextVariants}
            initial="hidden"
            animate="visible"
            className="mt-2 text-sm text-slate-600"
          >
            Your account has been successfully created. Welcome to FinTech Pro!
          </motion.p>

          <motion.div
            variants={successTextVariants}
            initial="hidden"
            animate="visible"
            className="mt-4 w-full rounded-xl bg-white/50 p-4 backdrop-blur-sm border border-white/30"
          >
            <p className="text-xs text-slate-700">
              <span className="font-semibold">Email:</span> {email}
            </p>
            <p className="text-xs text-slate-700 mt-1">
              <span className="font-semibold">Username:</span> @{username}
            </p>
          </motion.div>

          <motion.div
            variants={successButtonVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogin}
              className="flex-1 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Go to Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDashboard}
              className="flex-1 rounded-lg bg-white/50 px-6 py-2.5 text-sm font-bold text-slate-700 backdrop-blur-sm border border-white/30 hover:bg-white/70 transition-all"
            >
              Go to Dashboard
            </motion.button>
          </motion.div>

          <motion.div
            variants={successTextVariants}
            initial="hidden"
            animate="visible"
            className="mt-4 w-full"
          >
            <p className="text-xs text-slate-500 mb-2">
              Redirecting to login in 5 seconds...
            </p>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/50">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full rounded-full bg-linear-to-r from-cyan-500 to-blue-600"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---- Component --------------------------------------------------------------

export default function BankRegistrationForm() {
  const router = useRouter();

  const [personalForm, setPersonalForm] = useState<PersonalFormState>(PERSONAL_INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isCheckingDevice, setIsCheckingDevice] = useState<boolean>(true);
  const [verificationError, setVerificationError] = useState<string>("");
  const [showSuccessCard, setShowSuccessCard] = useState<boolean>(false);
  const [createdUserEmail, setCreatedUserEmail] = useState<string>("");
  const [createdUsername, setCreatedUsername] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  // ---- Effects --------------------------------------------------------------

  useEffect(() => {
    const checkExistingAccount = async (): Promise<void> => {
      try {
        const existing = readAccountFlag();
        if (existing?.email) {
          try {
            if (auth.currentUser) {
              const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
              if (userDoc.exists()) {
                router.push("/Dashboard");
                return;
              } else {
                clearDraft();
                if (typeof window !== "undefined") {
                  localStorage.removeItem(ACCOUNT_FLAG_KEY);
                }
                setVerificationError("Account data not found. Please create a new account.");
              }
            }
          } catch (error) {
            console.error("Error verifying account:", error);
            if (typeof window !== "undefined") {
              localStorage.removeItem(ACCOUNT_FLAG_KEY);
            }
            setVerificationError("Unable to verify account. Please create a new account.");
          }
        }

        const draft = readDraft();
        if (draft) {
          // ✅ FIX: Safe type casting with proper check
          const personalData: Partial<PersonalFormState> = {};
          const fields: (keyof PersonalFormState)[] = ['firstName', 'lastName', 'username', 'email', 'phone', 'password', 'confirmPassword'];
          for (const field of fields) {
            if (draft[field] !== undefined) {
              personalData[field] = draft[field] as string;
            }
          }
          setPersonalForm((prev) => ({ ...prev, ...personalData }));
        }
      } catch (error) {
        console.error("Error in checkExistingAccount:", error);
      } finally {
        setIsCheckingDevice(false);
      }
    };

    checkExistingAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isCheckingDevice) {
      try {
        // ✅ FIX: Create a proper DraftData object
        const draft: DraftData = { ...personalForm };
        writeDraft(draft);
      } catch (error) {
        console.error("Error saving draft:", error);
      }
    }
  }, [personalForm, isCheckingDevice]);

  // ---- Handlers --------------------------------------------------------------

  const handlePersonalChange = useCallback((field: keyof PersonalFormState, value: string): void => {
    setPersonalForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setSubmitError("");
  }, [errors]);

  const validateUsername = useCallback((username: string): boolean => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
  }, []);

  const validatePersonal = useCallback((): boolean => {
    const next: FormErrors = {};

    if (!personalForm.firstName.trim()) next.firstName = "First name is required";
    if (!personalForm.lastName.trim()) next.lastName = "Last name is required";

    if (!personalForm.username.trim()) {
      next.username = "Username is required";
    } else if (!validateUsername(personalForm.username)) {
      next.username = "Username must be 3-20 characters (letters, numbers, underscores)";
    }

    if (!personalForm.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalForm.email)) {
      next.email = "Enter a valid email address";
    }

    if (!personalForm.phone.trim()) {
      next.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(personalForm.phone)) {
      next.phone = "Enter a valid phone number";
    }

    if (!personalForm.password) {
      next.password = "Password is required";
    } else if (personalForm.password.length < 8) {
      next.password = "Use at least 8 characters";
    }

    if (personalForm.confirmPassword !== personalForm.password) {
      next.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      next.terms = "You must accept the terms to continue";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [personalForm, validateUsername, agreedToTerms]);

  // ---- Navigation Handlers --------------------------------------------------

  const handleLoginRedirect = useCallback(() => {
    setShowSuccessCard(false);
    router.push("/Log-in");
  }, [router]);

  const handleDashboardRedirect = useCallback(() => {
    setShowSuccessCard(false);
    router.push("/Dashboard");
  }, [router]);

  const handleCloseSuccess = useCallback(() => {
    setShowSuccessCard(false);
    router.push("/Log-in");
  }, [router]);

  // ---- Main Submit Handler --------------------------------------------------

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitError("");

    try {
      const isValid = validatePersonal();
      if (!isValid) {
        setSubmitError("Please fix all errors before submitting.");
        return;
      }

      const formData = personalForm;

      setIsSubmitting(true);
      setVerificationError("");

      try {
        // 1. Create user with Firebase Auth
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = result.user;

        // 2. Prepare display name
        const displayName = `${personalForm.firstName} ${personalForm.lastName}`.trim();

        // 3. Prepare user data
        const userData = {
          firstName: personalForm.firstName,
          lastName: personalForm.lastName,
          username: personalForm.username.toLowerCase(),
          displayName: displayName,
          email: formData.email,
          phone: formData.phone,
          accountType: "personal",
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        // 4. Save user profile to Firestore
        await setDoc(doc(db, "users", user.uid), userData);

        // 5. Create username reference
        await setDoc(doc(db, "usernames", formData.username.toLowerCase()), {
          uid: user.uid,
          username: formData.username.toLowerCase(),
          accountType: "personal",
          createdAt: serverTimestamp(),
        });

        // 6. Write account flag and clear draft
        writeAccountFlag(formData.email);
        clearDraft();

        // 7. Set success state
        setCreatedUserEmail(formData.email);
        setCreatedUsername(formData.username);
        setIsSuccess(true);
        setShowSuccessCard(true);
        setIsSubmitting(false);

        // 8. Auto-close after 5 seconds
        setTimeout(() => {
          setShowSuccessCard(false);
          router.push("/log-in");
        }, 5000);

      } catch (error: unknown) {
        setIsSubmitting(false);

        const firebaseError = error as { code?: string; message?: string };
        const errorCode = firebaseError.code;

        if (errorCode === 'auth/email-already-in-use') {
          writeAccountFlag(formData.email);
          clearDraft();
          router.push("/log-in");
          return;
        }

        if (errorCode === 'auth/weak-password') {
          setErrors((prev) => ({
            ...prev,
            password: "Password is too weak. Please use a stronger password.",
          }));
          return;
        }

        if (errorCode === 'auth/invalid-email') {
          setErrors((prev) => ({
            ...prev,
            email: "Invalid email address format.",
          }));
          return;
        }

        if (errorCode === 'auth/network-request-failed') {
          setSubmitError("Network error. Please check your internet connection.");
          return;
        }

        setSubmitError(firebaseError?.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ---- Render ----------------------------------------------------------------

  if (isCheckingDevice) {
    return (
      <div className="lg:relative px-7 flex w-full bg-transparent items-center justify-center py-16">
        <Loader2 className="animate-spin text-cyan-600" size={22} />
      </div>
    );
  }

  return (
    <div className="lg:relative px-7 flex w-full bg-transparent items-left justify-center m-0">
      {/* Success Card */}
      <AnimatePresence>
        {showSuccessCard && (
          <SuccessCard
            email={createdUserEmail}
            username={createdUsername}
            onClose={handleCloseSuccess}
            onLogin={handleLoginRedirect}
            onDashboard={handleDashboardRedirect}
          />
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md rounded-2xl"
      >
        <AnimatePresence mode="wait">
          {isSuccess && !showSuccessCard ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600"
              >
                <CheckCircle2 size={30} />
              </motion.div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Account created successfully!
              </h2>
              <p className="mt-2 max-w-xs text-sm text-slate-600">
                Your account has been created and verified.
              </p>
            </motion.div>
          ) : (
            <motion.div key="form">
              {/* Header */}
              <motion.div
                className="bg-transparent from-blue-200 border-none rounded-lg pt-5"
                variants={fieldVariants}
              >
                <h1 className="text-xl font-bold text-cyan-700 text-center sm:text-2xl">
                  Create Your Account
                </h1>
                <p className="mt-1.5 text-sm p-2 text-center text-cyan-700">
                  Don't have an account? We've got you covered, create one in minutes.
                </p>
              </motion.div>

              {/* Submit Error */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="text-sm font-bold text-red-700">{submitError}</p>
                </motion.div>
              )}

              {/* Verification Error */}
              {verificationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/20 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="text-sm font-bold text-amber-700">{verificationError}</p>
                </motion.div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.div variants={fieldVariants}>
                  <label htmlFor="firstName" className="mb-1.5 block text-xs font-medium text-cyan-700">First name</label>
                  <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                    <User size={15} className="shrink-0 text-cyan-500" />
                    <input
                      id="firstName"
                      type="text"
                      value={personalForm.firstName}
                      onChange={(e) => handlePersonalChange("firstName", e.target.value)}
                      placeholder="Jane"
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <FieldError message={errors.firstName} />
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <label htmlFor="lastName" className="mb-1.5 block text-xs font-medium text-cyan-700">Last name</label>
                  <div className="flex items-center gap-2 rounded-md border border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                    <User size={15} className="shrink-0 text-cyan-500" />
                    <input
                      id="lastName"
                      type="text"
                      value={personalForm.lastName}
                      onChange={(e) => handlePersonalChange("lastName", e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <FieldError message={errors.lastName} />
                </motion.div>
              </div>

              <motion.div variants={fieldVariants} className="mt-4">
                <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-cyan-700">Username <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2 rounded-md border border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                  <UserPlus size={15} className="shrink-0 text-cyan-500" />
                  <input
                    id="username"
                    type="text"
                    value={personalForm.username}
                    onChange={(e) => handlePersonalChange("username", e.target.value)}
                    placeholder="jane_doe"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <FieldError message={errors.username} />
                <p className="mt-1 text-xs text-cyan-500/70">3-20 characters (letters, numbers, underscores)</p>
              </motion.div>

              <motion.div variants={fieldVariants} className="mt-4">
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-cyan-700">Email address</label>
                <div className="flex items-center gap-2 rounded-md border border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                  <Mail size={15} className="shrink-0 text-cyan-500" />
                  <input
                    id="email"
                    type="email"
                    value={personalForm.email}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                    placeholder="jane.doe@email.com"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <FieldError message={errors.email} />
              </motion.div>

              <motion.div variants={fieldVariants} className="mt-4">
                <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-cyan-700">Phone number</label>
                <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 shadow-xl px-3 py-2.5 focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                  <Phone size={15} className="shrink-0 text-cyan-500" />
                  <input
                    id="phone"
                    type="tel"
                    value={personalForm.phone}
                    onChange={(e) => handlePersonalChange("phone", e.target.value)}
                    placeholder="+1 555 000 1234"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <FieldError message={errors.phone} />
              </motion.div>

              <motion.div variants={fieldVariants} className="mt-4">
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-cyan-700">Password</label>
                <div className="flex items-center gap-2 rounded-md border-none border-slate-400/60 bg-cyan-400/6 shadow-xl px-3 py-2.5 focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                  <Lock size={15} className="shrink-0 text-cyan-700" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={personalForm.password}
                    onChange={(e) => handlePersonalChange("password", e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="text-cyan-700" size={15} /> : <Eye size={15} className="text-cyan-700" />}
                  </button>
                </div>
                <FieldError message={errors.password} />
              </motion.div>

              <motion.div variants={fieldVariants} className="mt-4">
                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-slate-700">Confirm password</label>
                <div className="flex items-center gap-2 rounded-md border border-none bg-cyan-400/6 shadow-xl px-3 py-2.5 focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                  <Lock size={15} className="shrink-0 text-cyan-700" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={personalForm.confirmPassword}
                    onChange={(e) => handlePersonalChange("confirmPassword", e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="text-cyan-700 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <FieldError message={errors.confirmPassword} />
              </motion.div>

              {/* Terms */}
              <motion.div variants={fieldVariants} className="mt-5">
                <label className="flex cursor-pointer items-start gap-2.5 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                    }}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-cyan-600"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="#" className="font-medium text-cyan-700 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="font-medium text-cyan-700 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                <FieldError message={errors.terms} />
              </motion.div>

              {errors.form && <FieldError message={errors.form} />}

              <motion.button
                variants={fieldVariants}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="flex">
                    <Loader2 size={16} />
                  </motion.span>
                ) : (
                  "Create Account"
                )}
              </motion.button>

              <motion.p variants={fieldVariants} className="mt-4 text-center text-xs text-slate-600">
                Already have an account?{" "}
                <Link href="/log-in" className="font-medium text-cyan-700 hover:underline">
                  Log in
                </Link>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}

// ---- Helpers ----------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}