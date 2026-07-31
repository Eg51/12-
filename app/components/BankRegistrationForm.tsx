"use client";

import { useState, useEffect, type FormEvent } from "react";
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
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// ---- Types ----------------------------------------------------------------

type AccountType = "personal" | "business";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormState | "terms" | "form", string>>;

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

// Fields we're comfortable persisting locally to prefill the form on return
// visits. Never persist password / confirmPassword.
const PERSISTED_FIELDS: (keyof FormState)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
];

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

// ---- Local storage helpers --------------------------------------------------

function readAccountFlag(): { email?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_FLAG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeAccountFlag(email: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ACCOUNT_FLAG_KEY,
      JSON.stringify({ email, createdAt: Date.now() })
    );
  } catch {
    // Ignore storage failures (e.g. private browsing) — non-critical.
  }
}

function readDraft(): Partial<FormState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(draft: Partial<FormState>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage failures — prefill is a nice-to-have, not critical.
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // no-op
  }
}

// ---- Component --------------------------------------------------------------

export default function BankRegistrationForm() {
  const router = useRouter();

  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Whether we've finished checking localStorage for an existing account,
  // so we don't flash the form before redirecting.
  const [isCheckingDevice, setIsCheckingDevice] = useState(true);

  // On mount: if this device already has an account, skip the form and go
  // straight to log in. Otherwise, restore any previously entered (non
  // sensitive) form data so the user doesn't have to retype it.
  useEffect(() => {
    const existing = readAccountFlag();
    if (existing) {
      const query = existing.email
        ? `?email=${encodeURIComponent(existing.email)}`
        : "";
      router.replace(`/log-in${query}`);
      return;
    }

    const draft = readDraft();
    if (draft) {
      setForm((prev) => ({ ...prev, ...draft }));
    }

    setIsCheckingDevice(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (PERSISTED_FIELDS.includes(field)) {
        const draft: Partial<FormState> = {};
        for (const key of PERSISTED_FIELDS) draft[key] = next[key];
        writeDraft(draft);
      }

      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";

    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      next.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone)) {
      next.phone = "Enter a valid phone number";
    }

    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 8) {
      next.password = "Use at least 8 characters";
    }

    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      next.terms = "You must accept the terms to continue";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Defense in depth: if somehow a flag exists (e.g. set in another tab)
    // by the time they submit, just send them to log in instead of hitting
    // Firebase again.
    const existing = readAccountFlag();
    if (existing) {
      router.push("/Dashboard");
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        name: `${form.firstName} ${form.lastName}`.trim(),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        accountType,
        uid: user.uid,
        createdAt: new Date(),
      });

      // Remember, on this device, that an account now exists so future
      // visits to this page skip straight to log in.
      writeAccountFlag(form.email);
      clearDraft();

      setIsSubmitting(false);
      setIsSuccess(true);

      // Give the success state a moment to show before redirecting
      setTimeout(() => {
        router.push("/Dashboard");
      }, 1600);
    } catch (error: any) {
      setIsSubmitting(false);

      if (error.code === "auth/email-already-in-use") {
        // The email is already registered (possibly from another device) —
        // remember that on this device too, then send them to log in.
        writeAccountFlag(form.email);
        clearDraft();
        router.push("/Dashboard");
        return;
      }

      setErrors((prev) => ({
        ...prev,
        form: error?.message ?? "Something went wrong. Please try again.",
      }));
    }
  }

  // Avoid flashing the empty/prefilled form for a frame before a device
  // that already has an account gets redirected.
  if (isCheckingDevice) {
    return (
      <div className="lg:relative px-7 flex w-full bg-transparent items-center justify-center py-16">
        <Loader2 className="animate-spin text-cyan-600" size={22} />
      </div>
    );
  }

  return (
    <div className="lg:relative px-7 flex w-full bg-transparent items-left justify-center m-0">
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full  max-w-md rounded-2xl"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
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
                Account request submitted
              </h2>
              <p className="mt-2 max-w-xs text-sm text-slate-600">
                We've received your details. Redirecting you to log in...
              </p>
            </motion.div>
          ) : (
            <motion.div key="form">
              {/* Header */}
              <motion.div
                className="bg-transparent from-blue-200 border-none
                 rounded-lg pt-5"
                variants={fieldVariants}
              >
                <h1 className="text-xl font-bold text-cyan-700 text-center sm:text-2xl">
                  Create Your Account
                </h1>
                <p className="mt-1.5 text-sm font p-2 text-center text-cyan-700">
                  Don't have an account? We've got you covered, create one in minutes.
                </p>
              </motion.div>

              {/* Account type toggle */}
              <motion.div
                variants={fieldVariants}
                className="relative mt-6 grid grid-cols-2 rounded-lg border-none bg-transparent p-1"
              >
                {(["personal", "business"] as AccountType[]).map((type) => {
                  const isActive = accountType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAccountType(type)}
                      className="relative z-10 rounded-md py-2 text-sm font-medium capitalize transition-colors"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="account-type-pill"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          className="absolute inset-0 rounded-md bg-cyan-400/6 border-none cursor-pointer shadow-sm"
                        />
                      )}
                      <span
                        className={`relative ${isActive ? "text-cyan-400 cursor-pointer" : "text-slate-600 cursor-pointer"
                          }`}
                      >
                        {type}
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              {/* Name row */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.div variants={fieldVariants}>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-xs font-medium text-cyan-700"
                  >
                    First name
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl
                    focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600"
                  >
                    <User size={15} className="shrink-0 text-cyan-500" />
                    <input
                      id="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      placeholder="Jane"
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <FieldError message={errors.firstName} />
                </motion.div>

                <motion.div variants={fieldVariants}>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-xs font-medium text-cyan-700"
                  >
                    Last name
                  </label>
                  <div
                    className="flex items-center gap-2 rounded-md border border-none 
                      bg-cyan-400/6 px-3 py-2.5
                      focus-within:border-cyan-600 focus-within:ring-1 shadow-xl focus-within:ring-cyan-600"
                  >
                    <User size={15} className="shrink-0 text-cyan-500" />
                    <input
                      id="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Doe"
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <FieldError message={errors.lastName} />
                </motion.div>
              </div>

              {/* Email */}
              <motion.div variants={fieldVariants} className="mt-4">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-cyan-700"
                >
                  Email address
                </label>
                <div
                  className="flex items-center gap-2 rounded-md border border-none
                  bg-cyan-400/6 px-3 py-2.5
                  focus-within:border-cyan-600 focus-within:ring-1 shadow-xl focus-within:ring-cyan-600"
                >
                  <Mail size={15} className="shrink-0 text-cyan-500" />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="jane.doe@email.com"
                    className="w-full bg-transparent text-sm text-slate-900
                       placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <FieldError message={errors.email} />
              </motion.div>

              {/* Phone */}
              <motion.div variants={fieldVariants} className="mt-4">
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-xs font-medium text-cyan-700"
                >
                  Phone number
                </label>
                <div
                  className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 shadow-xl
                  px-3 py-2.5 focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600"
                >
                  <Phone size={15} className="shrink-0 text-cyan-500" />
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 555 000 1234"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <FieldError message={errors.phone} />
              </motion.div>

              {/* Password */}
              <motion.div variants={fieldVariants} className="mt-4">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-cyan-700"
                >
                  Password
                </label>
                <div
                  className="flex items-center gap-2 rounded-md border-none border-slate-400/60
                   bg-cyan-400/6 shadow-xl px-3 py-2.5 focus-within:border-cyan-600 focus-within:ring-1
                    focus-within:ring-cyan-600"
                >
                  <Lock size={15} className="shrink-0 text-cyan-700" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="text-cyan-700" size={15} />
                    ) : (
                      <Eye size={15} className="text-cyan-700" />
                    )}
                  </button>
                </div>
                <FieldError message={errors.password} />
              </motion.div>

              {/* Confirm password */}
              <motion.div variants={fieldVariants} className="mt-4">
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-medium text-slate-700"
                >
                  Confirm password
                </label>
                <div
                  className="flex items-center gap-2 rounded-md border border-none
                   bg-cyan-400/6 shadow-xl px-3 py-2.5 focus-within:border-cyan-600
                    focus-within:ring-1 focus-within:ring-cyan-600"
                >
                  <Lock size={15} className="shrink-0 text-cyan-700" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
                      if (errors.terms)
                        setErrors((prev) => ({ ...prev, terms: undefined }));
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

              {/* Form-level error (e.g. Firebase auth error) */}
              <FieldError message={errors.form} />

              {/* Submit */}
              <motion.button
                variants={fieldVariants}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 py-2.5 text-sm font-semibold
                  text-white transition-colors hover:bg-cyan-500 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex"
                  >
                    <Loader2 size={16} />
                  </motion.span>
                ) : (
                  "Create Account"
                )}
              </motion.button>

              <motion.p
                variants={fieldVariants}
                className="mt-4 text-center text-xs text-slate-600"
              >
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
// 'use client'
// import React from 'react'
// import { useState } from 'react'
// import { auth, db } from '../../../lib/firebase'
// import { createUserWithEmailAndPassword } from 'firebase/auth'
// import { useRouter } from 'next/navigation'
// import { doc, setDoc } from 'firebase/firestore'



// const Signup = () => {
//   const router = useRouter()

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')


//   async function handleSignup(e: { preventDefault: () => void }) {
//     e.preventDefault()

//     try {
//       const result = await createUserWithEmailAndPassword(auth, email, password);
//       const user = result.user;


//       await setDoc(doc(db, "users", result.user.uid), { // Save user information to Firestore
//         name: name,
//         email: email,
//         uid: user.uid,
//         createdAt: new Date(),
//       });


//       router.push('/login');// Redirect to login page
//     }

//     catch (error: any) {
//       if (error.code === 'auth/email-already-in-use') {
//         router.push('/login');
//       }
//       else{
//         alert(`${error}`);
//       }
//     }