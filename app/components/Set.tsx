"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
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
} from "lucide-react";
import Image from "next/image";
import Iconpack from '@/app/components/Iconpack';
import ChatWidgett from '@/app/components/ChatWidgett';
import { auth, db, storage } from '../lib/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth";

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
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  isActive: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.05, duration: 0.3, ease: "easeOut" as const },
  }),
};

// ============================================================================
// IMAGE COMPRESSION UTILITY
// ============================================================================

/**
 * Compresses an image file to under the specified size limit
 * Uses Canvas API which only works in browser environment
 */
const compressImage = async (file: File, maxSizeKB: number = 100): Promise<File> => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const img = new (window as any).Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions while maintaining aspect ratio
            const maxDimension = 400;
            if (width > height) {
              if (width > maxDimension) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              }
            } else {
              if (height > maxDimension) {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              
              // Compress to JPEG with quality adjustment
              let quality = 0.7;
              let dataUrl = canvas.toDataURL('image/jpeg', quality);
              
              // Reduce quality until size is under maxSizeKB
              while (dataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
                quality -= 0.05;
                dataUrl = canvas.toDataURL('image/jpeg', quality);
              }
              
              // Convert to File
              const compressedFile = dataURLToFile(dataUrl, file.name);
              resolve(compressedFile);
            } else {
              reject(new Error('Could not get canvas context'));
            }
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

const dataURLToFile = (dataUrl: string, fileName: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Transaction PIN states
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [pinError, setPinError] = useState<string>("");
  const [isSettingPin, setIsSettingPin] = useState<boolean>(false);

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

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
        window.location.href = "/log-in";
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserProfile = useCallback(async (authUser: FirebaseUser) => {
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
        const newProfile: UserProfile = {
          uid: authUser.uid,
          firstName: authUser.displayName?.split(" ")[0] || "",
          lastName: authUser.displayName?.split(" ")[1] || "",
          email: authUser.email || "",
          phone: "",
          photoURL: authUser.photoURL || null,
          transactionPin: "",
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
          isActive: true,
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
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleFormChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (!user) return;

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
      }

      await updateDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        updatedAt: serverTimestamp(),
      });

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              updatedAt: serverTimestamp() as Timestamp,
            }
          : null
      );

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: unknown) {
      console.error("Error saving profile:", error);
      const err = error as { message?: string };
      setErrorMessage(err.message || "Failed to save profile");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [user, formData]);

  // ---- Avatar Upload ------------------------------------------------------

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image must be less than 10MB");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Compress image to under 100KB
      const compressedFile = await compressImage(file, 100);
      
      const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
      const fileName = `avatar_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `avatars/${user.uid}/${fileName}`);
      
      await uploadBytes(storageRef, compressedFile);
      const photoURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL });
      await updateDoc(doc(db, "users", user.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      setProfile((prev) =>
        prev ? { ...prev, photoURL, updatedAt: serverTimestamp() as Timestamp } : null
      );

      setSuccessMessage("Avatar updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: unknown) {
      console.error("Error uploading avatar:", error);
      const err = error as { message?: string };
      setErrorMessage(err.message || "Failed to upload avatar");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }, [user]);

  const handleRemoveAvatar = useCallback(async () => {
    if (!user || !profile?.photoURL) return;

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Get the file path from the URL
      const filePath = profile.photoURL.split('/').pop();
      if (filePath) {
        const storageRef = ref(storage, `avatars/${user.uid}/${filePath}`);
        await deleteObject(storageRef).catch(() => {});
      }

      await updateProfile(user, { photoURL: null });
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: null,
        updatedAt: serverTimestamp(),
      });

      setProfile((prev) =>
        prev ? { ...prev, photoURL: null, updatedAt: serverTimestamp() as Timestamp } : null
      );

      setSuccessMessage("Avatar removed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: unknown) {
      console.error("Error removing avatar:", error);
      const err = error as { message?: string };
      setErrorMessage(err.message || "Failed to remove avatar");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsUploading(false);
    }
  }, [user, profile]);

  // ---- Transaction PIN ----------------------------------------------------

  const handlePinChange = useCallback((index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }

    if (newPin.every((p) => p !== "")) {
      handleSetPin(newPin.join(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  const handlePinKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  }, [pin]);

  const handleSetPin = useCallback(async (newPin: string) => {
    if (!user) return;

    setIsSettingPin(true);
    setPinError("");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        transactionPin: newPin,
        updatedAt: serverTimestamp(),
      });

      setProfile((prev) =>
        prev ? { ...prev, transactionPin: newPin, updatedAt: serverTimestamp() as Timestamp } : null
      );

      setSuccessMessage("Transaction PIN set successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowPinModal(false);
      setPin(["", "", "", ""]);
    } catch (error: unknown) {
      console.error("Error setting PIN:", error);
      const err = error as { message?: string };
      setPinError(err.message || "Failed to set PIN");
    } finally {
      setIsSettingPin(false);
    }
  }, [user]);

  // ---- Password Change ----------------------------------------------------

  const handlePasswordUpdate = useCallback(async () => {
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
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      console.error("Error updating password:", error);
      const err = error as { message?: string };
      setErrorMessage(err.message || "Failed to update password");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsUpdatingPassword(false);
    }
  }, [user, currentPassword, newPassword, confirmPassword]);

  // ============================================================================
  // MEMOIZED RENDER
  // ============================================================================

  const userInitials = useMemo(() => {
    if (!formData.firstName && !formData.lastName) return "US";
    return `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase();
  }, [formData.firstName, formData.lastName]);

  const hasPin = useMemo(() => !!profile?.transactionPin, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-20 animate-pulse rounded-xl bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="h-64 animate-pulse rounded-xl bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 lg:col-span-1" />
            <div className="h-96 animate-pulse rounded-xl bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-3 sm:p-4 lg:p-6">
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
          className="mb-4 sm:mb-6"
        >
          <h1 className="text-xl font-bold text-cyan-900 sm:text-2xl lg:text-3xl">
            Profile Settings
          </h1>
          <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
            Manage your account settings and security preferences
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence mode="wait">
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-4 py-3 backdrop-blur-sm"
            >
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-sm font-bold text-cyan-900">{successMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-3 backdrop-blur-sm"
            >
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-sm font-bold text-cyan-900">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            custom={1}
            variants={cardVariants}
            className="lg:col-span-1"
          >
            <div className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6">
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
                        sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg sm:text-3xl">
                        {userInitials}
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
                    className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-900 transition hover:bg-cyan-500/30"
                  >
                    <Upload size={14} className="mr-1 inline" />
                    Upload
                  </motion.button>
                  {profile?.photoURL && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRemoveAvatar}
                      className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-500/30"
                    >
                      <Trash2 size={14} className="mr-1 inline" />
                      Remove
                    </motion.button>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <p className="text-sm font-bold text-cyan-900 sm:text-base">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
                    {formData.email}
                  </p>
                </div>
              </div>

              {/* Security Status */}
              <div className="mt-4 space-y-2 border-t border-cyan-200/30 pt-4">
                <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 shadow-md">
                  <span className="text-xs font-bold text-cyan-900/70">2FA Status</span>
                  <span className="text-xs font-bold text-emerald-600">
                    {hasPin ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 shadow-md">
                  <span className="text-xs font-bold text-cyan-900/70">PIN Status</span>
                  <span className="text-xs font-bold text-emerald-600">
                    {hasPin ? "Set" : "Not Set"}
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
              className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6"
            >
              <h2 className="text-sm font-bold text-cyan-900 sm:text-base">
                Personal Information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-cyan-900/70">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFormChange("firstName", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Alex"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Thompson"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="alex.thompson@fintechpro.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
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
              className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6"
            >
              <h2 className="text-sm font-bold text-cyan-900 sm:text-base">
                Security Settings
              </h2>

              <div className="mt-4 space-y-3">
                {/* 2FA / PIN */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-lg bg-white/50 p-3 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-cyan-500/20 p-2">
                      <Key size={18} className="text-cyan-900" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cyan-900">
                        Transaction PIN
                      </p>
                      <p className="text-xs font-bold text-cyan-900/70">
                        {hasPin
                          ? "PIN is set for transaction verification"
                          : "Set a 4-digit PIN for secure transactions"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPinModal(true)}
                    className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-900 transition hover:bg-cyan-500/30"
                  >
                    {hasPin ? "Update PIN" : "Set PIN"}
                  </motion.button>
                </motion.div>

                {/* Biometric */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-lg bg-white/50 p-3 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-500/20 p-2">
                      <Fingerprint size={18} className="text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cyan-900">
                        Biometric Login
                      </p>
                      <p className="text-xs font-bold text-cyan-900/70">
                        Use FaceID or Fingerprint for faster access.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>
                </motion.div>

                {/* Change Password */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between rounded-lg bg-white/50 p-3 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-500/20 p-2">
                      <Lock size={18} className="text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cyan-900">
                        Change Password
                      </p>
                      <p className="text-xs font-bold text-cyan-900/70">
                        Update your password regularly for security.
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPasswordModal(true)}
                    className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-500/30"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={() => setShowPinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-md w-full rounded-2xl border border-cyan-200/50 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-6 shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-cyan-900">
                  {hasPin ? "Update PIN" : "Set Transaction PIN"}
                </h2>
                <button
                  onClick={() => setShowPinModal(false)}
                  className="rounded-lg p-1 text-cyan-900 hover:bg-white/50"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mt-2 text-sm font-bold text-cyan-900/70">
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
                    className="h-14 w-14 rounded-lg border border-cyan-200/50 bg-white/50 text-center text-xl font-bold text-cyan-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:h-16 sm:w-16 sm:text-2xl"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {pinError && (
                <p className="mt-3 text-center text-sm font-bold text-red-600">{pinError}</p>
              )}

              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-4 py-2.5 text-sm font-bold text-cyan-900 transition hover:bg-white/70"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSetPin(pin.join(""))}
                  disabled={pin.some((p) => p === "") || isSettingPin}
                  className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-md w-full rounded-2xl border border-cyan-200/50 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-6 shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-cyan-900">
                  Change Password
                </h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-lg p-1 text-cyan-900 hover:bg-white/50"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Current Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 pr-10 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-900/50 hover:text-cyan-900"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-cyan-900/70">
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 pr-10 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Enter new password (min 8 characters)"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-900/50 hover:text-cyan-900"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Confirm New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 pr-10 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      placeholder="Re-enter new password"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-900/50 hover:text-cyan-900"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-sm font-bold text-red-600">{errorMessage}</p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 rounded-lg border border-cyan-200/50 bg-white/50 px-4 py-2.5 text-sm font-bold text-cyan-900 transition hover:bg-white/70"
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
                  className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/30 transition hover:from-amber-400 hover:to-orange-500 disabled:opacity-50"
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
      
      <ChatWidgett />
      <Iconpack />
    </div>
  );
}