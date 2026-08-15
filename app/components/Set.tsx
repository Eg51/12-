// "use client";

// import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   User,
//   Mail,
//   Phone,
//   Camera,
//   Save,
//   CheckCircle,
//   AlertCircle,
//   Upload,
//   Trash2,
//   Loader2,
// } from "lucide-react";
// import Image from "next/image";
// import Iconpack from '@/app/components/Iconpack';
// import ChatWidgett from '@/app/components/ChatWidgett';
// import { auth, db, storage } from '@/lib/firebase';
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
//   serverTimestamp,
//   type Timestamp,
// } from "firebase/firestore";
// import {
//   updateProfile,
//   updateEmail,
//   reauthenticateWithCredential,
//   EmailAuthProvider,
//   type User as FirebaseUser,
// } from "firebase/auth";

// // ============================================================================
// // TYPES
// // ============================================================================

// interface UserProfile {
//   uid: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   photoURL: string | null;
//   createdAt: Timestamp | null;
//   updatedAt: Timestamp | null;
//   isActive: boolean;
// }

// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
// }

// // ============================================================================
// // ANIMATION VARIANTS
// // ============================================================================

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.04, delayChildren: 0.02 },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (delay: number = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: delay * 0.05, duration: 0.3, ease: "easeOut" as const },
//   }),
// };
// // ============================================================================
// // IMAGE COMPRESSION UTILITY
// // ============================================================================

// const compressImage = async (file: File, maxSizeKB: number = 100): Promise<File> => {
//   if (typeof window === 'undefined') return file;

//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (event: ProgressEvent<FileReader>) => {
//       try {
//         const img = new (window as any).Image();
//         img.src = event.target?.result as string;
//         img.onload = () => {
//           try {
//             const canvas = document.createElement('canvas');
//             let width = img.width;
//             let height = img.height;

//             const maxDimension = 400;
//             if (width > height) {
//               if (width > maxDimension) {
//                 height = Math.round((height * maxDimension) / width);
//                 width = maxDimension;
//               }
//             } else {
//               if (height > maxDimension) {
//                 width = Math.round((width * maxDimension) / height);
//                 height = maxDimension;
//               }
//             }

//             canvas.width = width;
//             canvas.height = height;
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//               ctx.drawImage(img, 0, 0, width, height);

//               let quality = 0.7;
//               let dataUrl = canvas.toDataURL('image/jpeg', quality);

//               while (dataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
//                 quality -= 0.05;
//                 dataUrl = canvas.toDataURL('image/jpeg', quality);
//               }

//               const compressedFile = dataURLToFile(dataUrl, file.name);
//               resolve(compressedFile);
//             } else {
//               reject(new Error('Could not get canvas context'));
//             }
//           } catch (err) {
//             reject(err);
//           }
//         };
//         img.onerror = () => {
//           reject(new Error('Failed to load image'));
//         };
//       } catch (err) {
//         reject(err);
//       }
//     };
//     reader.onerror = () => {
//       reject(new Error('Failed to read file'));
//     };
//   });
// };

// const dataURLToFile = (dataUrl: string, fileName: string): File => {
//   const arr = dataUrl.split(',');
//   const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], fileName, { type: mime });
// };

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// export default function ProfilePage() {
//   const [user, setUser] = useState<FirebaseUser | null>(null);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//   });
//   const [originalEmail, setOriginalEmail] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ============================================================================
//   // EFFECTS
//   // ============================================================================

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
//       if (authUser) {
//         setUser(authUser);
//         setOriginalEmail(authUser.email || "");
//         await loadUserProfile(authUser);
//       } else {
//         window.location.href = "/log-in";
//       }
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Add this state
//   const [showReauthModal, setShowReauthModal] = useState(false);
//   const [reauthPassword, setReauthPassword] = useState("");

//   // In handleSaveProfile, when auth/requires-recent-login occurs:
//   // if (authError.code === 'auth/requires-recent-login') {
//   //   setShowReauthModal(true);
//   //   setIsSaving(false);
//   //   return
//   // }, [user, formData, originalEmail];

//   const loadUserProfile = useCallback(async (authUser: FirebaseUser) => {
//     try {
//       const userDoc = await getDoc(doc(db, "users", authUser.uid));
//       if (userDoc.exists()) {
//         const data = userDoc.data() as UserProfile;
//         setProfile(data);
//         setFormData({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           email: data.email || authUser.email || "",
//           phone: data.phone || "",
//         });
//         setOriginalEmail(data.email || authUser.email || "");
//       } else {
//         const newProfile: UserProfile = {
//           uid: authUser.uid,
//           firstName: authUser.displayName?.split(" ")[0] || "",
//           lastName: authUser.displayName?.split(" ")[1] || "",
//           email: authUser.email || "",
//           phone: "",
//           photoURL: authUser.photoURL || null,
//           createdAt: serverTimestamp() as Timestamp,
//           updatedAt: serverTimestamp() as Timestamp,
//           isActive: true,
//         };
//         await setDoc(doc(db, "users", authUser.uid), newProfile);
//         setProfile(newProfile);
//         setFormData({
//           firstName: newProfile.firstName,
//           lastName: newProfile.lastName,
//           email: newProfile.email,
//           phone: newProfile.phone,
//         });
//         setOriginalEmail(newProfile.email);
//       }
//     } catch (error) {
//       console.error("Error loading profile:", error);
//       setErrorMessage("Failed to load profile data");
//     }
//   }, []);

//   // ============================================================================
//   // HANDLERS
//   // ============================================================================

//   const handleFormChange = useCallback((field: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     // Clear messages when user starts typing
//     setErrorMessage("");
//     setSuccessMessage("");
//   }, []);

//   const handleSaveProfile = useCallback(async () => {
//     if (!user) {
//       setErrorMessage("No user authenticated");
//       return;
//     }

//     setIsSaving(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       // Prepare update data
//       const updateData: Record<string, any> = {
//         firstName: formData.firstName.trim(),
//         lastName: formData.lastName.trim(),
//         phone: formData.phone.trim(),
//         updatedAt: serverTimestamp(),
//       };

//       // Only update email if it changed
//       if (formData.email.trim() !== originalEmail) {
//         // Check if email is valid
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email.trim())) {
//           setErrorMessage("Please enter a valid email address");
//           setIsSaving(false);
//           return;
//         }

//         // Update Firebase Auth email (requires reauthentication for security)
//         try {
//           // Try to update email directly
//           await updateEmail(user, formData.email.trim());
//           updateData.email = formData.email.trim();
//           setOriginalEmail(formData.email.trim());
//         } catch (authError: any) {
//           // If error is due to needing reauthentication, prompt user
//           if (authError.code === 'auth/requires-recent-login') {
//             setErrorMessage("Please re-authenticate to change your email. Sign out and sign in again.");
//             setIsSaving(false);
//             return;
//           }
//           throw authError;
//         }
//       } else {
//         updateData.email = formData.email.trim();
//       }

//       // Update Firestore
//       await updateDoc(doc(db, "users", user.uid), updateData);

//       // Update local state
//       setProfile((prev) =>
//         prev
//           ? {
//             ...prev,
//             ...updateData,
//             updatedAt: serverTimestamp() as Timestamp,
//           }
//           : null
//       );

//       setSuccessMessage("Profile updated successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error: unknown) {
//       console.error("Error saving profile:", error);
//       const err = error as { code?: string; message?: string };

//       // Handle specific Firebase errors
//       if (err.code === 'auth/email-already-in-use') {
//         setErrorMessage("This email is already in use by another account");
//       } else if (err.code === 'auth/invalid-email') {
//         setErrorMessage("Invalid email address format");
//       } else {
//         setErrorMessage(err.message || "Failed to save profile");
//       }
//       setTimeout(() => setErrorMessage(""), 5000);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [user, formData, originalEmail]);

//   // ---- Avatar Upload ------------------------------------------------------

//   const handleAvatarClick = useCallback(() => {
//     fileInputRef.current?.click();
//   }, []);

//   const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !user) {
//       setErrorMessage("No file selected or user not authenticated");
//       return;
//     }

//     if (!file.type.startsWith("image/")) {
//       setErrorMessage("Please upload an image file");
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       setErrorMessage("Image must be less than 10MB");
//       return;
//     }

//     setIsUploading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const compressedFile = await compressImage(file, 100);

//       const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
//       const fileName = `avatar_${Date.now()}.${fileExtension}`;
//       const storageRef = ref(storage, `avatars/${user.uid}/${fileName}`);

//       await uploadBytes(storageRef, compressedFile);
//       const photoURL = await getDownloadURL(storageRef);

//       // Update Firebase Auth profile
//       await updateProfile(user, { photoURL });

//       // Update Firestore
//       await updateDoc(doc(db, "users", user.uid), {
//         photoURL,
//         updatedAt: serverTimestamp(),
//       });

//       setProfile((prev) =>
//         prev ? { ...prev, photoURL, updatedAt: serverTimestamp() as Timestamp } : null
//       );

//       setSuccessMessage("Avatar updated successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error: unknown) {
//       console.error("Error uploading avatar:", error);
//       const err = error as { message?: string };
//       setErrorMessage(err.message || "Failed to upload avatar");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setIsUploading(false);
//       e.target.value = "";
//     }
//   }, [user]);

//   const handleRemoveAvatar = useCallback(async () => {
//     if (!user || !profile?.photoURL) {
//       setErrorMessage("No avatar to remove");
//       return;
//     }

//     setIsUploading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       // Try to delete from storage
//       try {
//         const urlParts = profile.photoURL.split('/');
//         const filePath = urlParts[urlParts.length - 1];
//         if (filePath && filePath.includes('avatar_')) {
//           const storageRef = ref(storage, `avatars/${user.uid}/${filePath}`);
//           await deleteObject(storageRef);
//         }
//       } catch (storageError) {
//         // If file doesn't exist in storage, continue
//         console.warn("Storage delete failed, continuing:", storageError);
//       }

//       // Update Firebase Auth profile
//       await updateProfile(user, { photoURL: null });

//       // Update Firestore
//       await updateDoc(doc(db, "users", user.uid), {
//         photoURL: null,
//         updatedAt: serverTimestamp(),
//       });

//       setProfile((prev) =>
//         prev ? { ...prev, photoURL: null, updatedAt: serverTimestamp() as Timestamp } : null
//       );

//       setSuccessMessage("Avatar removed successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error: unknown) {
//       console.error("Error removing avatar:", error);
//       const err = error as { message?: string };
//       setErrorMessage(err.message || "Failed to remove avatar");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setIsUploading(false);
//     }
//   }, [user, profile]);

//   // ============================================================================
//   // MEMOIZED RENDER
//   // ============================================================================







//   const userInitials = useMemo(() => {
//     if (!formData.firstName && !formData.lastName) return "US";
//     return `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase();
//   }, [formData.firstName, formData.lastName]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 pt-4 sm:p-6 lg:p-8">
//         <div className="mx-auto max-w-4xl space-y-4">
//           <div className="h-20 animate-pulse rounded-xl bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200" />
//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//             <div className="h-64 animate-pulse rounded-xl bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 lg:col-span-1" />
//             <div className="h-96 animate-pulse rounded-xl bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 lg:col-span-2" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 pb-19 pt-3 px-3 sm:px-4 sm:pb-19 sm:pt-3 sm:px-3 lg:p-6">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="mx-auto max-w-4xl"
//       >
//         {/* Header */}
//         <motion.div
//           custom={0}
//           variants={cardVariants}
//           className="mb-4 sm:mb-6"
//         >
//           <h1 className="text-xl font-bold text-cyan-900 sm:text-2xl lg:text-3xl">
//             Profile Settings
//           </h1>
//           <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
//             Manage your account information
//           </p>
//         </motion.div>

//         {/* Success/Error Messages */}
//         <AnimatePresence mode="wait">
//           {successMessage && (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-4 py-3 backdrop-blur-sm"
//             >
//               <CheckCircle size={16} className="text-emerald-600" />
//               <span className="text-sm font-bold text-cyan-900">{successMessage}</span>
//             </motion.div>
//           )}
//           {errorMessage && (
//             <motion.div
//               key="error"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-3 backdrop-blur-sm"
//             >
//               <AlertCircle size={16} className="text-red-600" />
//               <span className="text-sm font-bold text-cyan-900">{errorMessage}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
//           {/* Left Column - Profile Card */}
//           <motion.div
//             custom={1}
//             variants={cardVariants}
//             className="lg:col-span-1"
//           >
//             <div className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6">
//               {/* Avatar */}
//               <div className="flex flex-col items-center">
//                 <div
//                   className="group relative cursor-pointer"
//                   onClick={handleAvatarClick}
//                 >
//                   <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
//                     {profile?.photoURL ? (
//                       <Image
//                         src={profile.photoURL}
//                         alt="Profile"
//                         fill
//                         className="rounded-full object-cover ring-2 ring-cyan-500/50"
//                         sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
//                       />
//                     ) : (
//                       <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg sm:text-3xl">
//                         {userInitials}
//                       </div>
//                     )}
//                     {isUploading && (
//                       <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
//                         <Loader2 className="h-6 w-6 animate-spin text-white" />
//                       </div>
//                     )}
//                     <div className="absolute bottom-0 right-0 rounded-full bg-cyan-500 p-1.5 text-white shadow-lg transition-transform group-hover:scale-110 sm:p-2">
//                       <Camera size={14} className="sm:size-16" />
//                     </div>
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleAvatarUpload}
//                     className="hidden"
//                   />
//                 </div>

//                 <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleAvatarClick}
//                     className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-900 transition hover:bg-cyan-500/30"
//                   >
//                     <Upload size={14} className="mr-1 inline" />
//                     Upload
//                   </motion.button>
//                   {profile?.photoURL && (
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={handleRemoveAvatar}
//                       className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-500/30"
//                     >
//                       <Trash2 size={14} className="mr-1 inline" />
//                       Remove
//                     </motion.button>
//                   )}
//                 </div>

//                 <div className="mt-3 text-center">
//                   <p className="text-sm font-bold text-cyan-900 sm:text-base">
//                     {formData.firstName} {formData.lastName}
//                   </p>
//                   <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
//                     {formData.email}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right Column - Settings */}
//           <div className="space-y-4 lg:col-span-2">
//             {/* Personal Information */}
//             <motion.div
//               custom={2}
//               variants={cardVariants}
//               className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6"
//             >
//               <h2 className="text-sm font-bold text-cyan-900 sm:text-base">
//                 Personal Information
//               </h2>

//               <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
//                 <div>
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.firstName}
//                     onChange={(e) => handleFormChange("firstName", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="Alex"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.lastName}
//                     onChange={(e) => handleFormChange("lastName", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="Thompson"
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleFormChange("email", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="alex.thompson@fintechpro.com"
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => handleFormChange("phone", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="+1 (555) 000-0000"
//                   />
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleSaveProfile}
//                 disabled={isSaving}
//                 className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
//               >
//                 {isSaving ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Save size={18} />
//                 )}
//                 Save Changes
//               </motion.button>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>

//       <ChatWidgett />
//       <Iconpack />
//     </div>
//   );
// }

// app/settings/page.tsx

// app/settings/page.tsx































// "use client";

// import React, { useState, useCallback, useMemo, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   User,
//   Mail,
//   Phone,
//   Camera,
//   Save,
//   CheckCircle,
//   AlertCircle,
//   Upload,
//   Trash2,
//   Loader2,
// } from "lucide-react";
// import Image from "next/image";

// // ============================================================================
// // TYPES
// // ============================================================================

// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
// }

// // ============================================================================
// // ANIMATION VARIANTS
// // ============================================================================

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.04, delayChildren: 0.02 },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (delay: number = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: delay * 0.05, duration: 0.3, ease: "easeOut" as const },
//   }),
// };

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// export default function SettingsPage() {
//   const [formData, setFormData] = useState<FormData>({
//     firstName: "Alex",
//     lastName: "Thompson",
//     email: "alex.thompson@fintechpro.com",
//     phone: "+1 (555) 000-0000",
//   });
//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [photoURL, setPhotoURL] = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ============================================================================
//   // HANDLERS
//   // ============================================================================

//   const handleFormChange = useCallback((field: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setErrorMessage("");
//     setSuccessMessage("");
//   }, []);

//   const handleSaveProfile = useCallback(async () => {
//     setIsSaving(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       setSuccessMessage("Profile updated successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error) {
//       setErrorMessage("Failed to save profile");
//       setTimeout(() => setErrorMessage(""), 5000);
//     } finally {
//       setIsSaving(false);
//     }
//   }, []);

//   const handleAvatarClick = useCallback(() => {
//     fileInputRef.current?.click();
//   }, []);

//   const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) {
//       setErrorMessage("No file selected");
//       return;
//     }

//     if (!file.type.startsWith("image/")) {
//       setErrorMessage("Please upload an image file");
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       setErrorMessage("Image must be less than 10MB");
//       return;
//     }

//     setIsUploading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       // Simulate upload
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Create object URL for preview
//       const objectUrl = URL.createObjectURL(file);
//       setPhotoURL(objectUrl);
      
//       setSuccessMessage("Avatar updated successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error) {
//       setErrorMessage("Failed to upload avatar");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setIsUploading(false);
//       e.target.value = "";
//     }
//   }, []);

//   const handleRemoveAvatar = useCallback(async () => {
//     if (!photoURL) {
//       setErrorMessage("No avatar to remove");
//       return;
//     }

//     setIsUploading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       // Simulate removal
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       setPhotoURL(null);
//       setSuccessMessage("Avatar removed successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error) {
//       setErrorMessage("Failed to remove avatar");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setIsUploading(false);
//     }
//   }, [photoURL]);

//   // ============================================================================
//   // MEMOIZED RENDER
//   // ============================================================================

//   const userInitials = useMemo(() => {
//     if (!formData.firstName && !formData.lastName) return "US";
//     return `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase();
//   }, [formData.firstName, formData.lastName]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 pb-19 pt-3 px-3 sm:px-4 sm:pb-19 sm:pt-3 sm:px-3 lg:p-6">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="mx-auto max-w-4xl"
//       >
//         {/* Header */}
//         <motion.div
//           custom={0}
//           variants={cardVariants}
//           className="mb-4 sm:mb-6"
//         >
//           <h1 className="text-xl font-bold text-cyan-900 sm:text-2xl lg:text-3xl">
//             Profile Settings
//           </h1>
//           <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
//             Manage your account information
//           </p>
//         </motion.div>

//         {/* Success/Error Messages */}
//         <AnimatePresence mode="wait">
//           {successMessage && (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-4 py-3 backdrop-blur-sm"
//             >
//               <CheckCircle size={16} className="text-emerald-600" />
//               <span className="text-sm font-bold text-cyan-900">{successMessage}</span>
//             </motion.div>
//           )}
//           {errorMessage && (
//             <motion.div
//               key="error"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-3 backdrop-blur-sm"
//             >
//               <AlertCircle size={16} className="text-red-600" />
//               <span className="text-sm font-bold text-cyan-900">{errorMessage}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
//           {/* Left Column - Profile Card */}
//           <motion.div
//             custom={1}
//             variants={cardVariants}
//             className="lg:col-span-1"
//           >
//             <div className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6">
//               {/* Avatar */}
//               <div className="flex flex-col items-center">
//                 <div
//                   className="group relative cursor-pointer"
//                   onClick={handleAvatarClick}
//                 >
//                   <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
//                     {photoURL ? (
//                       <Image
//                         src={photoURL}
//                         alt="Profile"
//                         fill
//                         className="rounded-full object-cover ring-2 ring-cyan-500/50"
//                         sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
//                       />
//                     ) : (
//                       <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg sm:text-3xl">
//                         {userInitials}
//                       </div>
//                     )}
//                     {isUploading && (
//                       <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
//                         <Loader2 className="h-6 w-6 animate-spin text-white" />
//                       </div>
//                     )}
//                     <div className="absolute bottom-0 right-0 rounded-full bg-cyan-500 p-1.5 text-white shadow-lg transition-transform group-hover:scale-110 sm:p-2">
//                       <Camera size={14} className="sm:size-16" />
//                     </div>
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleAvatarUpload}
//                     className="hidden"
//                   />
//                 </div>

//                 <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleAvatarClick}
//                     className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-900 transition hover:bg-cyan-500/30"
//                   >
//                     <Upload size={14} className="mr-1 inline" />
//                     Upload
//                   </motion.button>
//                   {photoURL && (
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={handleRemoveAvatar}
//                       className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-500/30"
//                     >
//                       <Trash2 size={14} className="mr-1 inline" />
//                       Remove
//                     </motion.button>
//                   )}
//                 </div>

//                 <div className="mt-3 text-center">
//                   <p className="text-sm font-bold text-cyan-900 sm:text-base">
//                     {formData.firstName} {formData.lastName}
//                   </p>
//                   <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
//                     {formData.email}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right Column - Settings */}
//           <div className="space-y-4 lg:col-span-2">
//             {/* Personal Information */}
//             <motion.div
//               custom={2}
//               variants={cardVariants}
//               className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6"
//             >
//               <h2 className="text-sm font-bold text-cyan-900 sm:text-base">
//                 Personal Information
//               </h2>

//               <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
//                 <div>
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.firstName}
//                     onChange={(e) => handleFormChange("firstName", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="Alex"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.lastName}
//                     onChange={(e) => handleFormChange("lastName", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="Thompson"
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleFormChange("email", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="alex.thompson@fintechpro.com"
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => handleFormChange("phone", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="+1 (555) 000-0000"
//                   />
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleSaveProfile}
//                 disabled={isSaving}
//                 className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
//               >
//                 {isSaving ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Save size={18} />
//                 )}
//                 Save Changes
//               </motion.button>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }



















// "use client";

// import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Camera,
//   Save,
//   CheckCircle,
//   AlertCircle,
//   Upload,
//   Trash2,
//   Loader2,
// } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { compressImage } from '@/lib/compressImage';

// // ============================================================================
// // TYPES
// // ============================================================================

// interface FormData {
//   username: string;
//   email: string;
//   phone: string;
//   address: string;
//   firstName: string;
//   lastName: string;
// }

// // ============================================================================
// // ANIMATION VARIANTS
// // ============================================================================

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.04, delayChildren: 0.02 },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (delay: number = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: delay * 0.05, duration: 0.3, ease: "easeOut" as const },
//   }),
// };

// // ============================================================================
// // API CALLS (using session cookies, no Authorization header)
// // ============================================================================

// const fetchUserProfile = async () => {
//   const response = await fetch('/api/user/profile', {
//     credentials: 'include',
//   });
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || 'Failed to fetch profile');
//   }
//   const result = await response.json();
//   return result.data;
// };

// const fetchUserAvatar = async (userId: string) => {
//   const response = await fetch(`/api/user/avatar?userId=${userId}`, {
//     credentials: 'include',
//   });
//   if (!response.ok) return null;
//   const result = await response.json();
//   return result.data?.avatar || null;
// };

// const updateUserProfile = async (data: any) => {
//   const response = await fetch('/api/user/profile', {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || 'Failed to update profile');
//   }
//   return response.json();
// };

// const removeAvatar = async (userId: string) => {
//   const response = await fetch(`/api/user/avatar?userId=${userId}`, {
//     method: 'DELETE',
//     credentials: 'include',
//   });
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || 'Failed to remove avatar');
//   }
//   return response.json();
// };

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// export default function SettingsPage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState<FormData>({
//     username: "",
//     email: "",
//     phone: "",
//     address: "",
//     firstName: "",
//     lastName: "",
//   });
//   const [userId, setUserId] = useState<string>("");
//   const [isSaving, setIsSaving] = useState<boolean>(false);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [photoURL, setPhotoURL] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [hasAvatar, setHasAvatar] = useState<boolean>(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ============================================================================
//   // LOAD USER DATA (no localStorage)
//   // ============================================================================

//   useEffect(() => {
//     const loadUserData = async () => {
//       setIsLoading(true);
//       try {
//         const profile = await fetchUserProfile();
//         setFormData({
//           username: profile.username || "",
//           email: profile.email || "",
//           phone: profile.phone || "",
//           address: profile.address || "",
//           firstName: profile.firstName || "",
//           lastName: profile.lastName || "",
//         });
//         setHasAvatar(profile.hasAvatar || false);
//         setUserId(profile.id);

//         if (profile.hasAvatar) {
//           const avatarData = await fetchUserAvatar(profile.id);
//           if (avatarData) setPhotoURL(avatarData);
//         }
//       } catch (error: any) {
//         console.error("Error loading user data:", error);
//         setErrorMessage(error.message || "Failed to load user data");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadUserData();
//   }, []);

//   // ============================================================================
//   // HANDLERS
//   // ============================================================================

//   const handleFormChange = useCallback((field: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setErrorMessage("");
//     setSuccessMessage("");
//   }, []);

//   const handleSaveProfile = useCallback(async () => {
//     if (!formData.username.trim()) {
//       setErrorMessage("Username is required");
//       return;
//     }
//     if (!formData.email.trim()) {
//       setErrorMessage("Email is required");
//       return;
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email.trim())) {
//       setErrorMessage("Please enter a valid email address");
//       return;
//     }

//     setIsSaving(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       await updateUserProfile({
//         username: formData.username.trim(),
//         email: formData.email.trim(),
//         phone: formData.phone.trim(),
//         address: formData.address.trim(),
//         hasAvatar: hasAvatar,
//       });
//       setSuccessMessage("Profile updated successfully!");

//       // Redirect to Dashboard after successful update
//       setTimeout(() => {
//         router.push('/Dashboard');
//       }, 1000); // Short delay to show the success message

//     } catch (error: any) {
//       console.error("Error saving profile:", error);
//       setErrorMessage(error.message || "Failed to save profile");
//       setTimeout(() => setErrorMessage(""), 5000);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [formData, hasAvatar, router]);

//   const handleAvatarClick = useCallback(() => {
//     fileInputRef.current?.click();
//   }, []);

//   const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) {
//       setErrorMessage("No file selected");
//       return;
//     }
//     if (!file.type.startsWith("image/")) {
//       setErrorMessage("Please upload an image file");
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       setErrorMessage("Image must be less than 10MB");
//       return;
//     }

//     setIsUploading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const compressedImage = await compressImage(file, 100, 400);
//       setPhotoURL(compressedImage);
//       setHasAvatar(true);

//       await updateUserProfile({
//         username: formData.username,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address,
//         hasAvatar: true,
//         avatar: compressedImage,
//       });

//       setSuccessMessage("Avatar updated successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error: any) {
//       console.error("Error uploading avatar:", error);
//       setErrorMessage(error.message || "Failed to upload avatar");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setIsUploading(false);
//       e.target.value = "";
//     }
//   }, [formData]);

//   const handleRemoveAvatar = useCallback(async () => {
//     if (!photoURL) {
//       setErrorMessage("No avatar to remove");
//       return;
//     }

//     setIsUploading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       await removeAvatar(userId);
//       setPhotoURL(null);
//       setHasAvatar(false);
//       setSuccessMessage("Avatar removed successfully!");
//       setTimeout(() => setSuccessMessage(""), 3000);
//     } catch (error: any) {
//       console.error("Error removing avatar:", error);
//       setErrorMessage(error.message || "Failed to remove avatar");
//       setTimeout(() => setErrorMessage(""), 3000);
//     } finally {
//       setIsUploading(false);
//     }
//   }, [photoURL, userId]);

//   // ============================================================================
//   // MEMOIZED RENDER
//   // ============================================================================

//   const userInitials = useMemo(() => {
//     if (!formData.firstName && !formData.lastName) return "U";
//     return `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase();
//   }, [formData.firstName, formData.lastName]);

//   const displayName = useMemo(() => {
//     if (formData.firstName && formData.lastName) {
//       return `${formData.firstName} ${formData.lastName}`;
//     }
//     return formData.username || "User";
//   }, [formData.firstName, formData.lastName, formData.username]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 pb-19 pt-3 px-3 sm:px-4 sm:pb-19 sm:pt-3 sm:px-3 lg:p-6">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="mx-auto max-w-4xl"
//       >
//         {/* Header */}
//         <motion.div
//           custom={0}
//           variants={cardVariants}
//           className="mb-4 sm:mb-6"
//         >
//           <h1 className="text-xl font-bold text-cyan-900 sm:text-2xl lg:text-3xl">
//             Profile Settings
//           </h1>
//           <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
//             Manage your account information
//           </p>
//         </motion.div>

//         {/* Success/Error Messages */}
//         <AnimatePresence mode="wait">
//           {successMessage && (
//             <motion.div
//               key="success"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-4 py-3 backdrop-blur-sm"
//             >
//               <CheckCircle size={16} className="text-emerald-600" />
//               <span className="text-sm font-bold text-cyan-900">{successMessage}</span>
//             </motion.div>
//           )}
//           {errorMessage && (
//             <motion.div
//               key="error"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-3 backdrop-blur-sm"
//             >
//               <AlertCircle size={16} className="text-red-600" />
//               <span className="text-sm font-bold text-cyan-900">{errorMessage}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
//           {/* Left Column - Profile Card */}
//           <motion.div
//             custom={1}
//             variants={cardVariants}
//             className="lg:col-span-1"
//           >
//             <div className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6">
//               <div className="flex flex-col items-center">
//                 <div
//                   className="group relative cursor-pointer"
//                   onClick={handleAvatarClick}
//                 >
//                   <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
//                     {photoURL ? (
//                       <Image
//                         src={photoURL}
//                         alt="Profile"
//                         fill
//                         className="rounded-full object-cover ring-2 ring-cyan-500/50"
//                         sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
//                       />
//                     ) : (
//                       <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg sm:text-3xl">
//                         {userInitials}
//                       </div>
//                     )}
//                     {isUploading && (
//                       <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
//                         <Loader2 className="h-6 w-6 animate-spin text-white" />
//                       </div>
//                     )}
//                     {/* Camera icon removed for clear avatar visibility */}
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleAvatarUpload}
//                     className="hidden"
//                   />
//                 </div>

//                 <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleAvatarClick}
//                     className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-900 transition hover:bg-cyan-500/30"
//                   >
//                     <Upload size={14} className="mr-1 inline" />
//                     Upload
//                   </motion.button>
//                   {photoURL && (
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={handleRemoveAvatar}
//                       className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-700 transition hover:bg-red-500/30"
//                     >
//                       <Trash2 size={14} className="mr-1 inline" />
//                       Remove
//                     </motion.button>
//                   )}
//                 </div>

//                 <div className="mt-3 text-center">
//                   <p className="text-sm font-bold text-cyan-900 sm:text-base">
//                     {displayName}
//                   </p>
//                   <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
//                     @{formData.username}
//                   </p>
//                   {photoURL && (
//                     <p className="mt-1 text-xs text-emerald-600">
//                       ✓ Avatar saved to database
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right Column - Settings */}
//           <div className="space-y-4 lg:col-span-2">
//             <motion.div
//               custom={2}
//               variants={cardVariants}
//               className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6"
//             >
//               <h2 className="text-sm font-bold text-cyan-900 sm:text-base">
//                 Personal Information
//               </h2>

//               <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Username <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.username}
//                     onChange={(e) => handleFormChange("username", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="Username"
//                     required
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Email Address <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleFormChange("email", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="email@example.com"
//                     required
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => handleFormChange("phone", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="+1 (555) 000-0000"
//                   />
//                 </div>
//                 <div className="sm:col-span-2">
//                   <label className="block text-xs font-bold text-cyan-900/70">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.address}
//                     onChange={(e) => handleFormChange("address", e.target.value)}
//                     className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
//                     placeholder="123 Main St, City, Country"
//                   />
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleSaveProfile}
//                 disabled={isSaving}
//                 className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
//               >
//                 {isSaving ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Save size={18} />
//                 )}
//                 Save Changes
//               </motion.button>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }







































"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { compressImage } from '@/lib/compressImage';

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  username: string;
  email: string;
  phone: string;
  address: string;
  firstName: string;
  lastName: string;
  displayName: string; // ✅ New field
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
// API CALLS
// ============================================================================

const fetchUserProfile = async () => {
  const response = await fetch('/api/user/profile', {
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch profile');
  }
  const result = await response.json();
  return result.data;
};

const fetchUserAvatar = async (userId: string) => {
  const response = await fetch(`/api/user/avatar?userId=${userId}`, {
    credentials: 'include',
  });
  if (!response.ok) return null;
  const result = await response.json();
  return result.data?.avatar || null;
};

const updateUserProfile = async (data: any) => {
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update profile');
  }
  return response.json();
};

const removeAvatar = async (userId: string) => {
  const response = await fetch(`/api/user/avatar?userId=${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to remove avatar');
  }
  return response.json();
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SettingsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    phone: "",
    address: "",
    firstName: "",
    lastName: "",
    displayName: "", // ✅ Initialize
  });
  const [userId, setUserId] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasAvatar, setHasAvatar] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // LOAD USER DATA
  // ============================================================================

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const profile = await fetchUserProfile();
        setFormData({
          username: profile.username || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          displayName: profile.displayName || "", // ✅ Load displayName
        });
        setHasAvatar(profile.hasAvatar || false);
        setUserId(profile.id);

        if (profile.hasAvatar) {
          const avatarData = await fetchUserAvatar(profile.id);
          if (avatarData) setPhotoURL(avatarData);
        }
      } catch (error: any) {
        console.error("Error loading user data:", error);
        setErrorMessage(error.message || "Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleFormChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (!formData.username.trim()) {
      setErrorMessage("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateUserProfile({
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        displayName: formData.displayName.trim(), // ✅ Include displayName
        hasAvatar: hasAvatar,
      });
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        router.push('/Dashboard');
      }, 1000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setErrorMessage(error.message || "Failed to save profile");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsSaving(false);
    }
  }, [formData, hasAvatar, router]);

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setErrorMessage("No file selected");
      return;
    }
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
      const compressedImage = await compressImage(file, 100, 400);
      setPhotoURL(compressedImage);
      setHasAvatar(true);

      await updateUserProfile({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        displayName: formData.displayName, // ✅ Preserve displayName
        hasAvatar: true,
        avatar: compressedImage,
      });

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
  }, [formData]);

  const handleRemoveAvatar = useCallback(async () => {
    if (!photoURL) {
      setErrorMessage("No avatar to remove");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await removeAvatar(userId);
      setPhotoURL(null);
      setHasAvatar(false);
      setSuccessMessage("Avatar removed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error removing avatar:", error);
      setErrorMessage(error.message || "Failed to remove avatar");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsUploading(false);
    }
  }, [photoURL, userId]);

  // ============================================================================
  // MEMOIZED RENDER
  // ============================================================================

  const userInitials = useMemo(() => {
    if (!formData.firstName && !formData.lastName) return "U";
    return `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase();
  }, [formData.firstName, formData.lastName]);

  // ✅ Display name uses displayName, falls back to first+last, then username
  const displayName = useMemo(() => {
    if (formData.displayName) return formData.displayName;
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`;
    }
    return formData.username || "User";
  }, [formData.displayName, formData.firstName, formData.lastName, formData.username]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 pb-19 pt-3 px-3 sm:px-4 sm:pb-19 sm:pt-3 sm:px-3 lg:p-6">
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
          <h2 className="text-md font-bold text-cyan-900 sm:text-2xl lg:text-3xl">
            Manage your account information
          </h2>
          {/* <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
            
          </p> */}
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
              <div className="flex flex-col items-center">
                <div
                  className="group relative cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                    {photoURL ? (
                      <Image
                        src={photoURL}
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
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                    {/* Camera icon removed */}
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
                  {photoURL && (
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
                    {displayName}
                  </p>
                  <p className="text-xs font-bold text-cyan-900/70 sm:text-sm">
                    @{formData.username}
                  </p>
                  {photoURL && (
                    <p className="mt-1 text-xs text-emerald-600">
                      ✓ Avatar saved to database
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Settings */}
          <div className="space-y-4 lg:col-span-2">
            <motion.div
              custom={2}
              variants={cardVariants}
              className="rounded-xl border border-cyan-200/30 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-4 shadow-xl backdrop-blur-sm sm:p-6"
            >
              <h2 className="text-sm font-bold text-cyan-900 sm:text-base">
                Personal Information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {/* ✅ Display Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleFormChange("displayName", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Your public display name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleFormChange("username", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="email@example.com"
                    required
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
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-cyan-900/70">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleFormChange("address", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-cyan-200/50 bg-white/50 px-3 py-2 text-sm font-bold text-cyan-900 placeholder:text-cyan-900/40 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    placeholder="123 Main St, City, Country"
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}