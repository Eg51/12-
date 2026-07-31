// import React from 'react'
// import Link from 'next/link'
// import ChatWidgett from '@/app/components/ChatWidgett'
// import DashboardHero from '@/app/components/DashboardHero'
// import Iconpack from '../components/Iconpack'
// import DashboardContent from '../components/DashboardContent'


// const page = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 2000))


//   return (
//     <section className="flex flex-col not-last-of-type:p-9
//         min-h-screen bg-cover w-auto overflow-y-hidden md:m-0 md:p-0
//         bg-linear-to-br from-blue-200 via-cyan-100 to-gray-300 p-auto">


//       <div className="flex p-auto">
//         <div className="flex sticky bg-transparent overflow-x-hidden">
//           <DashboardHero />
//         </div>
//         <div className="flex  left-0 top-0 right-0 w-screen flex-col
//            scrollbar-track-transparent scrollbar-thin scrollbar-thumb-cyan-900
//             overflow-y-scroll overflow-x-hidden h-auto p-auto md:p-4 m-0">
//           <DashboardContent />
//         </div>
//       </div>

//       <ChatWidgett />
//       <div className="flex bg-cyan-200/6 place-items-baseline justify-baseline"><Iconpack /></div>
//     </section>
//   )
// }

// export default page

// app/profile/page.tsx
// app/profile/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Fingerprint,
  Camera,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Upload,
  Trash2,
  Key,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

// ============================================================================
// FIREBASE CONFIG
// ============================================================================

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

// ============================================================================
// TYPES
// ============================================================================

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

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

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
    transition: { delay: delay * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: delay * 0.04, duration: 0.3, ease: "easeOut" as const },
  }),
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Transaction PIN states
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        await loadUserProfile(authUser);
      } else {
        // Redirect to login if not authenticated
        window.location.href = "/log-in";
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: any) => {
    try {
      const userDoc = await getDoc(doc(db, "users", authUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || authUser.email || "",
          phone: data.phone || "",
        });
      } else {
        // Create new profile if doesn't exist
        const newProfile: UserProfile = {
          uid: authUser.uid,
          firstName: authUser.displayName?.split(" ")[0] || "",
          lastName: authUser.displayName?.split(" ")[1] || "",
          email: authUser.email || "",
          phone: "",
          photoURL: authUser.photoURL || null,
          transactionPin: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", authUser.uid), newProfile);
        setProfile(newProfile);
        setFormData({
          firstName: newProfile.firstName,
          lastName: newProfile.lastName,
          email: newProfile.email,
          phone: newProfile.phone,
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setErrorMessage("Failed to load profile data");
    }
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Update Firebase Auth
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              updatedAt: new Date().toISOString(),
            }
          : null
      );

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setErrorMessage(error.message || "Failed to save profile");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // ---- Avatar Upload ------------------------------------------------------

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Update Firebase Auth profile
      await updateProfile(user, { photoURL });

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        photoURL,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setProfile((prev) =>
        prev ? { ...prev, photoURL, updatedAt: new Date().toISOString() } : null
      );

      setSuccessMessage("Avatar updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setErrorMessage(error.message || "Failed to upload avatar");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !profile?.photoURL) return;

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Delete from storage
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await deleteObject(storageRef);

      // Update Firebase Auth profile
      await updateProfile(user, { photoURL: null });

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: null,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setProfile((prev) =>
        prev ? { ...prev, photoURL: null, updatedAt: new Date().toISOString() } : null
      );

      setSuccessMessage("Avatar removed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error removing avatar:", error);
      setErrorMessage(error.message || "Failed to remove avatar");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  // ---- Transaction PIN ----------------------------------------------------

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-advance to next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }

    // Auto-submit when all 4 digits are filled
    if (newPin.every((p) => p !== "")) {
      handleSetPin(newPin.join(""));
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  const handleSetPin = async (newPin: string) => {
    if (!user) return;

    setIsSettingPin(true);
    setPinError("");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        transactionPin: newPin,
        updatedAt: new Date().toISOString(),
      });

      setProfile((prev) =>
        prev ? { ...prev, transactionPin: newPin, updatedAt: new Date().toISOString() } : null
      );

      setSuccessMessage("Transaction PIN set successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowPinModal(false);
      setPin(["", "", "", ""]);
    } catch (error: any) {
      console.error("Error setting PIN:", error);
      setPinError(error.message || "Failed to set PIN");
    } finally {
      setIsSettingPin(false);
    }
  };

  // ---- Password Change ----------------------------------------------------

  const handlePasswordUpdate = async () => {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return;
    }

    setIsUpdatingPassword(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      setErrorMessage(error.message || "Failed to update password");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-800/30" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-4 lg:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl"
      >
        {/* Header */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mb-4 sm:mb-6"
        >
          <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            Profile Settings
          </h1>
          <p className="text-xs text-slate-400 sm:text-sm">
            Manage your account settings and security preferences
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3"
            >
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-400">{successMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3"
            >
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-sm text-red-400">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div
                  className="group relative cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                    {profile?.photoURL ? (
                      <Image
                        src={profile.photoURL}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover ring-2 ring-cyan-500/50"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white sm:text-3xl">
                        {formData.firstName?.[0] || "U"}
                        {formData.lastName?.[0] || "S"}
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 rounded-full bg-cyan-500 p-1.5 text-white shadow-lg transition-transform group-hover:scale-110 sm:p-2">
                      <Camera size={14} className="sm:size-16" />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAvatarClick}
                    className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/30"
                  >
                    <Upload size={14} className="mr-1 inline" />
                    Upload
                  </motion.button>
                  {profile?.photoURL && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRemoveAvatar}
                      className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/30"
                    >
                      <Trash2 size={14} className="mr-1 inline" />
                      Remove
                    </motion.button>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-white sm:text-base">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-xs text-slate-400 sm:text-sm">
                    {formData.email}
                  </p>
                </div>
              </div>

              {/* Security Status */}
              <div className="mt-4 space-y-2 border-t border-slate-800/50 pt-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2">
                  <span className="text-xs text-slate-400">2FA Status</span>
                  <span className="text-xs font-medium text-emerald-400">
                    {profile?.transactionPin ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/30 px-3 py-2">
                  <span className="text-xs text-slate-400">PIN Status</span>
                  <span className="text-xs font-medium text-emerald-400">
                    {profile?.transactionPin ? "Set" : "Not Set"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Settings */}
          <div className="space-y-4 lg:col-span-2">
            {/* Personal Information */}
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6"
            >
              <h2 className="text-sm font-semibold text-white sm:text-base">
                Personal Information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFormChange("firstName", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Alex"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Thompson"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="alex.thompson@fintechpro.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </motion.button>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6"
            >
              <h2 className="text-sm font-semibold text-white sm:text-base">
                Security Settings
              </h2>

              <div className="mt-4 space-y-3">
                {/* 2FA / PIN */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/20 p-2">
                      <Key size={18} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Transaction PIN
                      </p>
                      <p className="text-xs text-slate-400">
                        {profile?.transactionPin
                          ? "PIN is set for transaction verification"
                          : "Set a 4-digit PIN for secure transactions"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPinModal(true)}
                    className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-cyan-500/30"
                  >
                    {profile?.transactionPin ? "Update PIN" : "Set PIN"}
                  </motion.button>
                </motion.div>

                {/* Biometric */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/20 p-2">
                      <Fingerprint size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Biometric Login
                      </p>
                      <p className="text-xs text-slate-400">
                        Use FaceID or Fingerprint for faster access.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>
                </motion.div>

                {/* Change Password */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/20 p-2">
                      <Lock size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Change Password
                      </p>
                      <p className="text-xs text-slate-400">
                        Last updated 3 months ago.
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPasswordModal(true)}
                    className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-400 transition hover:bg-amber-500/30"
                  >
                    Update
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================
          PIN MODAL
          ======================================================================== */}

      <AnimatePresence>
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setShowPinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {profile?.transactionPin ? "Update PIN" : "Set Transaction PIN"}
                </h2>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mt-2 text-sm text-slate-400">
                Enter a 4-digit PIN for transaction verification.
              </p>

              <div className="mt-6 flex justify-center gap-3">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="h-14 w-14 rounded-lg border border-slate-700 bg-slate-800/50 text-center text-xl font-bold text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:h-16 sm:w-16 sm:text-2xl"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {pinError && (
                <p className="mt-3 text-center text-sm text-red-400">{pinError}</p>
              )}

              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSetPin(pin.join(""))}
                  disabled={pin.some((p) => p === "") || isSettingPin}
                  className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
                >
                  {isSettingPin ? (
                    <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Confirm PIN"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================
          PASSWORD MODAL
          ======================================================================== */}

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Change Password
                </h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-400">
                    Current Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-400">
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Enter new password (min 8 characters)"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-400">
                    Confirm New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Re-enter new password"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-sm text-red-400">{errorMessage}</p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-800"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePasswordUpdate}
                  disabled={
                    isUpdatingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-orange-500 disabled:opacity-50"
                >
                  {isUpdatingPassword ? (
                    <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Update Password"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}