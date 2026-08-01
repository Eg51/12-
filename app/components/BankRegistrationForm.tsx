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
  Building2,
  Briefcase,
  MapPin,
  Globe,
  Users,
  Calendar,
  BadgeCheck,
  Landmark,
  Hash,
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type UserCredential
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc, type Timestamp } from "firebase/firestore";

// ---- Types ----------------------------------------------------------------

type AccountType = "personal" | "business";

// Personal Form State
interface PersonalFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Business Form State
interface BusinessFormState {
  companyName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website: string;
  industry: string;
  yearEstablished: string;
  employeeCount: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<string, string>>;

const PERSONAL_INITIAL_STATE: PersonalFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const BUSINESS_INITIAL_STATE: BusinessFormState = {
  companyName: "",
  businessType: "",
  registrationNumber: "",
  taxId: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  website: "",
  industry: "",
  yearEstablished: "",
  employeeCount: "",
  password: "",
  confirmPassword: "",
};

// Fields we're comfortable persisting locally
const PERSISTED_FIELDS_PERSONAL: (keyof PersonalFormState)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
];

const PERSISTED_FIELDS_BUSINESS: (keyof BusinessFormState)[] = [
  "companyName",
  "businessType",
  "email",
  "phone",
  "industry",
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

interface DraftData {
  accountType: AccountType;
  [key: string]: unknown;
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

// ---- Component --------------------------------------------------------------

export default function BankRegistrationForm() {
  const router = useRouter();

  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [personalForm, setPersonalForm] = useState<PersonalFormState>(PERSONAL_INITIAL_STATE);
  const [businessForm, setBusinessForm] = useState<BusinessFormState>(BUSINESS_INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isCheckingDevice, setIsCheckingDevice] = useState<boolean>(true);
  const [verificationError, setVerificationError] = useState<string>("");

  // Business types for dropdown
  const businessTypes: string[] = [
    "Sole Proprietorship",
    "Partnership",
    "Limited Liability Company (LLC)",
    "Corporation",
    "Non-Profit",
    "Cooperative",
    "Franchise",
    "Joint Venture",
  ];

  const industries: string[] = [
    "Technology",
    "Finance",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "Real Estate",
    "Education",
    "Hospitality",
    "Transportation",
    "Agriculture",
    "Energy",
    "Media & Entertainment",
    "Professional Services",
    "Construction",
    "Other",
  ];

  const countries: string[] = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
    "India",
    "Brazil",
    "Mexico",
    "South Africa",
    "Nigeria",
    "Kenya",
    "Ghana",
    "Other",
  ];

  const states: string[] = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", 
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  ];

  const employeeCounts: string[] = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001+",
  ];

  // On mount: check for existing account
  useEffect(() => {
    const checkExistingAccount = async (): Promise<void> => {
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
          } else {
            try {
              await signInWithEmailAndPassword(auth, existing.email, "");
            } catch {
              if (typeof window !== "undefined") {
                localStorage.removeItem(ACCOUNT_FLAG_KEY);
              }
              setVerificationError("Please log in or create a new account.");
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

      // Restore draft if exists
      const draft = readDraft();
      if (draft) {
        if (draft.accountType === "personal") {
          const { accountType: _, ...personalData } = draft;
          setPersonalForm((prev) => ({ ...prev, ...personalData as Partial<PersonalFormState> }));
        } else if (draft.accountType === "business") {
          const { accountType: _, ...businessData } = draft;
          setBusinessForm((prev) => ({ ...prev, ...businessData as Partial<BusinessFormState> }));
        }
        setAccountType(draft.accountType || "personal");
      }

      setIsCheckingDevice(false);
    };

    checkExistingAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save draft whenever form changes
  useEffect(() => {
    if (!isCheckingDevice) {
      const draft: DraftData = accountType === "personal" 
        ? { ...personalForm, accountType }
        : { ...businessForm, accountType };
      writeDraft(draft);
    }
  }, [personalForm, businessForm, accountType, isCheckingDevice]);

  const handlePersonalChange = (field: keyof PersonalFormState, value: string): void => {
    setPersonalForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBusinessChange = (field: keyof BusinessFormState, value: string): void => {
    setBusinessForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validatePersonal = (): boolean => {
    const next: FormErrors = {};

    if (!personalForm.firstName.trim()) next.firstName = "First name is required";
    if (!personalForm.lastName.trim()) next.lastName = "Last name is required";

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
  };

  const validateBusiness = (): boolean => {
    const next: FormErrors = {};

    if (!businessForm.companyName.trim()) next.companyName = "Company name is required";
    if (!businessForm.businessType) next.businessType = "Business type is required";
    if (!businessForm.registrationNumber.trim()) next.registrationNumber = "Registration number is required";
    if (!businessForm.taxId.trim()) next.taxId = "Tax ID is required";

    if (!businessForm.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessForm.email)) {
      next.email = "Enter a valid email address";
    }

    if (!businessForm.phone.trim()) {
      next.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(businessForm.phone)) {
      next.phone = "Enter a valid phone number";
    }

    if (!businessForm.address.trim()) next.address = "Address is required";
    if (!businessForm.city.trim()) next.city = "City is required";
    if (!businessForm.state) next.state = "State is required";
    if (!businessForm.zipCode.trim()) next.zipCode = "ZIP code is required";
    if (!businessForm.country) next.country = "Country is required";
    if (!businessForm.industry) next.industry = "Industry is required";
    if (!businessForm.yearEstablished) next.yearEstablished = "Year established is required";
    if (!businessForm.employeeCount) next.employeeCount = "Employee count is required";

    if (!businessForm.password) {
      next.password = "Password is required";
    } else if (businessForm.password.length < 8) {
      next.password = "Use at least 8 characters";
    }

    if (businessForm.confirmPassword !== businessForm.password) {
      next.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      next.terms = "You must accept the terms to continue";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const existing = readAccountFlag();
    if (existing?.email) {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            router.push("/Dashboard");
            return;
          }
        }
      } catch {
        if (typeof window !== "undefined") {
          localStorage.removeItem(ACCOUNT_FLAG_KEY);
        }
      }
    }

    const isValid = accountType === "personal" ? validatePersonal() : validateBusiness();
    if (!isValid) return;

    const formData = accountType === "personal" ? personalForm : businessForm;

    setIsSubmitting(true);
    setVerificationError("");

    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const displayName = accountType === "personal" 
        ? `${personalForm.firstName} ${personalForm.lastName}`.trim()
        : businessForm.companyName;

      await updateProfile(user, {
        displayName: displayName,
      });

      const userDocRef = doc(db, "users", user.uid);
      
      const userData = accountType === "personal" ? {
        uid: user.uid,
        name: displayName,
        firstName: personalForm.firstName,
        lastName: personalForm.lastName,
        email: personalForm.email,
        phone: personalForm.phone,
        accountType: "personal" as const,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        emailVerified: user.emailVerified,
        isActive: true,
      } : {
        uid: user.uid,
        companyName: businessForm.companyName,
        businessType: businessForm.businessType,
        registrationNumber: businessForm.registrationNumber,
        taxId: businessForm.taxId,
        email: businessForm.email,
        phone: businessForm.phone,
        address: businessForm.address,
        city: businessForm.city,
        state: businessForm.state,
        zipCode: businessForm.zipCode,
        country: businessForm.country,
        website: businessForm.website || "",
        industry: businessForm.industry,
        yearEstablished: businessForm.yearEstablished,
        employeeCount: businessForm.employeeCount,
        accountType: "business" as const,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        emailVerified: user.emailVerified,
        isActive: true,
        isVerified: false,
      };

      await setDoc(userDocRef, userData);

      const verifyDoc = await getDoc(userDocRef);
      if (!verifyDoc.exists()) {
        throw new Error("Failed to save user data. Please try again.");
      }

      writeAccountFlag(formData.email);
      clearDraft();

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/Dashboard");
      }, 1600);
      
    } catch (error: unknown) {
      setIsSubmitting(false);

      const firebaseError = error as { code?: string; message?: string };
      const errorCode = firebaseError.code;
      
      switch (errorCode) {
        case "auth/email-already-in-use":
          // The email is already registered - redirect to login page
          writeAccountFlag(formData.email);
          clearDraft();
          router.push("/Log-in");
          return;

        case "auth/weak-password":
          setErrors((prev) => ({
            ...prev,
            password: "Password is too weak. Please use a stronger password.",
          }));
          break;

        case "auth/invalid-email":
          setErrors((prev) => ({
            ...prev,
            email: "Invalid email address format.",
          }));
          break;

        case "auth/too-many-requests":
          setErrors((prev) => ({
            ...prev,
            form: "Too many requests. Please try again later.",
          }));
          break;

        default:
          if (firebaseError.message?.includes("Firestore")) {
            setErrors((prev) => ({
              ...prev,
              form: "Database error. Please check your connection and try again.",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              form: firebaseError?.message || "Something went wrong. Please try again.",
            }));
          }
      }
    }
  };

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
        className="w-full max-w-md rounded-2xl"
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
                {accountType === "personal" ? "Account" : "Business Account"} created successfully!
              </h2>
              <p className="mt-2 max-w-xs text-sm text-slate-600">
                Your {accountType === "personal" ? "account" : "business account"} has been created and verified. Redirecting you to the dashboard...
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
                  {accountType === "personal" ? "Create Your Account" : "Register Your Business"}
                </h1>
                <p className="mt-1.5 text-sm p-2 text-center text-cyan-700">
                  {accountType === "personal" 
                    ? "Don't have an account? We've got you covered, create one in minutes."
                    : "Register your business to start accepting payments and manage finances."
                  }
                </p>
              </motion.div>

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
                      onClick={() => {
                        setAccountType(type);
                        setErrors({});
                      }}
                      className="relative z-10 rounded-md py-2 text-sm font-medium capitalize transition-colors"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="account-type-pill"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          className="absolute inset-0 rounded-md bg-cyan-400/6 border-none shadow-sm"
                        />
                      )}
                      <span
                        className={`relative ${
                          isActive ? "text-cyan-400" : "text-slate-600"
                        }`}
                      >
                        {type === "personal" ? "Personal" : "Business"}
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              {/* Personal Form */}
              {accountType === "personal" && (
                <motion.div
                  key="personal-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
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
                          value={personalForm.firstName}
                          onChange={(e) => handlePersonalChange("firstName", e.target.value)}
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
                          value={personalForm.lastName}
                          onChange={(e) => handlePersonalChange("lastName", e.target.value)}
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
                        value={personalForm.email}
                        onChange={(e) => handlePersonalChange("email", e.target.value)}
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
                        value={personalForm.phone}
                        onChange={(e) => handlePersonalChange("phone", e.target.value)}
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
                </motion.div>
              )}

              {/* Business Form */}
              {accountType === "business" && (
                <motion.div
                  key="business-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-4"
                >
                  {/* Company Name */}
                  <motion.div variants={fieldVariants}>
                    <label
                      htmlFor="companyName"
                      className="mb-1.5 block text-xs font-medium text-cyan-700"
                    >
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                      <Building2 size={15} className="shrink-0 text-cyan-500" />
                      <input
                        id="companyName"
                        type="text"
                        value={businessForm.companyName}
                        onChange={(e) => handleBusinessChange("companyName", e.target.value)}
                        placeholder="Acme Corporation"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    <FieldError message={errors.companyName} />
                  </motion.div>

                  {/* Business Type & Registration Number */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="businessType"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        Business Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <Briefcase size={15} className="shrink-0 text-cyan-500" />
                        <select
                          id="businessType"
                          value={businessForm.businessType}
                          onChange={(e) => handleBusinessChange("businessType", e.target.value)}
                          className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                        >
                          <option value="">Select type</option>
                          {businessTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <FieldError message={errors.businessType} />
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="registrationNumber"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        Registration Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <Hash size={15} className="shrink-0 text-cyan-500" />
                        <input
                          id="registrationNumber"
                          type="text"
                          value={businessForm.registrationNumber}
                          onChange={(e) => handleBusinessChange("registrationNumber", e.target.value)}
                          placeholder="REG-2024-001"
                          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <FieldError message={errors.registrationNumber} />
                    </motion.div>
                  </div>

                  {/* Tax ID */}
                  <motion.div variants={fieldVariants}>
                    <label
                      htmlFor="taxId"
                      className="mb-1.5 block text-xs font-medium text-cyan-700"
                    >
                      Tax ID / EIN <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                      <Landmark size={15} className="shrink-0 text-cyan-500" />
                      <input
                        id="taxId"
                        type="text"
                        value={businessForm.taxId}
                        onChange={(e) => handleBusinessChange("taxId", e.target.value)}
                        placeholder="12-3456789"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    <FieldError message={errors.taxId} />
                  </motion.div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        Business Email <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <Mail size={15} className="shrink-0 text-cyan-500" />
                        <input
                          id="email"
                          type="email"
                          value={businessForm.email}
                          onChange={(e) => handleBusinessChange("email", e.target.value)}
                          placeholder="contact@company.com"
                          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <FieldError message={errors.email} />
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        Business Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <Phone size={15} className="shrink-0 text-cyan-500" />
                        <input
                          id="phone"
                          type="tel"
                          value={businessForm.phone}
                          onChange={(e) => handleBusinessChange("phone", e.target.value)}
                          placeholder="+1 555 000 1234"
                          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <FieldError message={errors.phone} />
                    </motion.div>
                  </div>

                  {/* Address */}
                  <motion.div variants={fieldVariants}>
                    <label
                      htmlFor="address"
                      className="mb-1.5 block text-xs font-medium text-cyan-700"
                    >
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                      <MapPin size={15} className="shrink-0 text-cyan-500" />
                      <input
                        id="address"
                        type="text"
                        value={businessForm.address}
                        onChange={(e) => handleBusinessChange("address", e.target.value)}
                        placeholder="123 Business Ave, Suite 100"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                    <FieldError message={errors.address} />
                  </motion.div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="city"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <MapPin size={15} className="shrink-0 text-cyan-500" />
                        <input
                          id="city"
                          type="text"
                          value={businessForm.city}
                          onChange={(e) => handleBusinessChange("city", e.target.value)}
                          placeholder="New York"
                          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <FieldError message={errors.city} />
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="state"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        State <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <MapPin size={15} className="shrink-0 text-cyan-500" />
                        <select
                          id="state"
                          value={businessForm.state}
                          onChange={(e) => handleBusinessChange("state", e.target.value)}
                          className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                        >
                          <option value="">Select state</option>
                          {states.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <FieldError message={errors.state} />
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="zipCode"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <MapPin size={15} className="shrink-0 text-cyan-500" />
                        <input
                          id="zipCode"
                          type="text"
                          value={businessForm.zipCode}
                          onChange={(e) => handleBusinessChange("zipCode", e.target.value)}
                          placeholder="10001"
                          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <FieldError message={errors.zipCode} />
                    </motion.div>
                  </div>

                  {/* Country */}
                  <motion.div variants={fieldVariants}>
                    <label
                      htmlFor="country"
                      className="mb-1.5 block text-xs font-medium text-cyan-700"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                      <Globe size={15} className="shrink-0 text-cyan-500" />
                      <select
                        id="country"
                        value={businessForm.country}
                        onChange={(e) => handleBusinessChange("country", e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    <FieldError message={errors.country} />
                  </motion.div>

                  {/* Website */}
                  <motion.div variants={fieldVariants}>
                    <label
                      htmlFor="website"
                      className="mb-1.5 block text-xs font-medium text-cyan-700"
                    >
                      Website (Optional)
                    </label>
                    <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                      <Globe size={15} className="shrink-0 text-cyan-500" />
                      <input
                        id="website"
                        type="url"
                        value={businessForm.website}
                        onChange={(e) => handleBusinessChange("website", e.target.value)}
                        placeholder="https://www.company.com"
                        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </motion.div>

                  {/* Industry & Year Established */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="industry"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <Briefcase size={15} className="shrink-0 text-cyan-500" />
                        <select
                          id="industry"
                          value={businessForm.industry}
                          onChange={(e) => handleBusinessChange("industry", e.target.value)}
                          className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                        >
                          <option value="">Select industry</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                      <FieldError message={errors.industry} />
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <label
                        htmlFor="yearEstablished"
                        className="mb-1.5 block text-xs font-medium text-cyan-700"
                      >
                        Year Established <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                        <Calendar size={15} className="shrink-0 text-cyan-500" />
                        <input
                          id="yearEstablished"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={businessForm.yearEstablished}
                          onChange={(e) => handleBusinessChange("yearEstablished", e.target.value)}
                          placeholder="2020"
                          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                      <FieldError message={errors.yearEstablished} />
                    </motion.div>
                  </div>

                  {/* Employee Count */}
                  <motion.div variants={fieldVariants}>
                    <label
                      htmlFor="employeeCount"
                      className="mb-1.5 block text-xs font-medium text-cyan-700"
                    >
                      Number of Employees <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 rounded-md border-none bg-cyan-400/6 px-3 py-2.5 shadow-xl focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-600">
                      <Users size={15} className="shrink-0 text-cyan-500" />
                      <select
                        id="employeeCount"
                        value={businessForm.employeeCount}
                        onChange={(e) => handleBusinessChange("employeeCount", e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                      >
                        <option value="">Select range</option>
                        {employeeCounts.map((count) => (
                          <option key={count} value={count}>{count}</option>
                        ))}
                      </select>
                    </div>
                    <FieldError message={errors.employeeCount} />
                  </motion.div>

                  {/* Password */}
                  <motion.div variants={fieldVariants} className="mt-4">
                    <label
                      htmlFor="password"
                      className="mb-1.5 block text-xs font-medium text-cyan-700"
                    >
                      Password <span className="text-red-500">*</span>
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
                        value={businessForm.password}
                        onChange={(e) => handleBusinessChange("password", e.target.value)}
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
                      Confirm password <span className="text-red-500">*</span>
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
                        value={businessForm.confirmPassword}
                        onChange={(e) => handleBusinessChange("confirmPassword", e.target.value)}
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

                  <div className="rounded-lg bg-cyan-400/10 p-3 border border-cyan-200/30">
                    <p className="text-xs text-cyan-700 flex items-center gap-2">
                      <BadgeCheck size={14} className="text-cyan-600" />
                      Business accounts require verification. Our team will review your registration.
                    </p>
                  </div>
                </motion.div>
              )}

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

              {/* Form-level error */}
              <FieldError message={errors.form} />

              {/* Submit */}
              <motion.button
                variants={fieldVariants}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 py-2.5 text-sm font-semibold
                  text-white transition-colors hover:bg-cyan-500 disabled:opacity-70"
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
                  accountType === "personal" ? "Create Account" : "Register Business"
                )}
              </motion.button>

              <motion.p
                variants={fieldVariants}
                className="mt-4 text-center text-xs text-slate-600"
              >
                Already have an account?{" "}
                <Link href="/Log-in" className="font-medium text-cyan-700 hover:underline">
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