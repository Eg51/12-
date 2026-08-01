// app/payments/page.tsx

"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Iconpack from '@/app/components/Iconpack';
import {
  Shield,
  Lock,
  HelpCircle,
  Users,
  Globe,
  CheckCircle,
  LucideIcon,
} from "lucide-react";

// ============================================================================
// SUPPORT DATA (from https://www.me.com/support)
// ============================================================================

const supportData = {
  title: "iCloud Support",
  description:
    "The best place to store all your photos, files, notes, emails, and more.",
  features: [
    "Easily access your iPhone apps and data on the web",
    "More storage, privacy features, and ways to connect with friends",
  ],
  upgradeCta: "Upgrade to iCloud+",
  privacyFeatures: [
    "Apple Event Invitations",
    "iCloud Private Relay",
    "Hide My Email",
    "HomeKit Secure Video",
  ],
  learnMoreLink: "https://www.apple.com/icloud",
  adminLink: "https://www.me.com/support",
};

// ============================================================================
// SUPPORT CARD COMPONENT (ENLARGED & RESPONSIVE)
// ============================================================================

interface SupportCardProps {
  variant: "purple" | "green" | "gold" | "lime";
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

// Define the type for the style object
interface VariantStyle {
  bg: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentText: string;
  iconBg: string;
  iconColor: string;
  ring: string;
  shadow: string;
  hoverRing: string;
  hoverBg: string;
}

const variantStyles: Record<SupportCardProps["variant"], VariantStyle> = {
  purple: {
    bg: "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300",
    text: "text-purple-800",
    textSecondary: "text-purple-700/70",
    accent: "bg-purple-500/20",
    accentText: "text-purple-600",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-600",
    ring: "ring-purple-500/30",
    shadow: "shadow-purple-500/10",
    hoverRing: "hover:ring-purple-500/50",
    hoverBg: "hover:bg-purple-200/80",
  },
  green: {
    bg: "bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300",
    text: "text-emerald-800",
    textSecondary: "text-emerald-700/70",
    accent: "bg-emerald-500/20",
    accentText: "text-emerald-600",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
    ring: "ring-emerald-500/30",
    shadow: "shadow-emerald-500/10",
    hoverRing: "hover:ring-emerald-500/50",
    hoverBg: "hover:bg-emerald-200/80",
  },
  gold: {
    bg: "bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300",
    text: "text-amber-800",
    textSecondary: "text-amber-700/70",
    accent: "bg-amber-500/20",
    accentText: "text-amber-600",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-600",
    ring: "ring-amber-500/30",
    shadow: "shadow-amber-500/10",
    hoverRing: "hover:ring-amber-500/50",
    hoverBg: "hover:bg-amber-200/80",
  },
  lime: {
    bg: "bg-gradient-to-br from-lime-100 via-lime-200 to-lime-300",
    text: "text-lime-800",
    textSecondary: "text-lime-700/70",
    accent: "bg-lime-500/20",
    accentText: "text-lime-600",
    iconBg: "bg-lime-500/20",
    iconColor: "text-lime-600",
    ring: "ring-lime-500/30",
    shadow: "shadow-lime-500/10",
    hoverRing: "hover:ring-lime-500/50",
    hoverBg: "hover:bg-lime-200/80",
  },
};

function SupportCard({
  variant,
  title,
  description,
  features,
  icon: Icon,
  ctaText,
  ctaLink,
  className = "",
}: SupportCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl ${styles.bg} p-6 shadow-xl transition-all duration-300 ${styles.hoverRing} ${styles.hoverBg} ring-1 ${styles.ring} ${className} flex flex-col h-full`}
    >
      {/* Icon and Title */}
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ rotate: 12, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400 }}
          className={`rounded-xl ${styles.iconBg} p-3 shadow-md flex-shrink-0`}
        >
          <Icon className={`${styles.iconColor} w-6 h-6 sm:w-7 sm:h-7`} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg sm:text-xl font-bold ${styles.text}`}>
            {title}
          </h3>
          <p
            className={`mt-1 text-sm sm:text-base font-medium ${styles.textSecondary}`}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Features List - takes up remaining space */}
      <ul className="mt-4 space-y-2 flex-1">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-start gap-2 text-sm sm:text-base font-medium ${styles.textSecondary}`}
          >
            <span className={`mt-1 flex-shrink-0 ${styles.accentText}`}>•</span>
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button - at the bottom */}
      {ctaText && ctaLink && (
        <motion.a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className={`mt-6 inline-block w-full sm:w-auto text-center rounded-lg ${styles.accent} px-5 py-2.5 text-sm sm:text-base font-bold ${styles.accentText} shadow-md transition-colors hover:bg-opacity-30`}
        >
          {ctaText} →
        </motion.a>
      )}
    </motion.div>
  );
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// ============================================================================
// MAIN COMPONENT - Enlarged & Responsive Support Cards
// ============================================================================

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl"
      >
        {/* Header - Updated to "Upcoming Bills" */}
        <motion.div
          variants={headerVariants}
          className="mb-10 sm:mb-12 lg:mb-16 text-center"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-600">
            Upcoming Bills
          </h1>
          <p className="mt-3 text-sm sm:text-base lg:text-lg font-bold text-cyan-600/70 max-w-2xl mx-auto">
            View and manage your upcoming bills
          </p>
          <div className="mt-4 h-1 w-24 sm:w-32 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto" />
        </motion.div>

        {/* Support Cards Grid - Equal spacing */}
        <motion.div
          variants={cardContainerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Purple Card */}
          <motion.div variants={cardContainerVariants}>
            <SupportCard
              variant="purple"
              title={supportData.title}
              description={supportData.description}
              features={supportData.features}
              icon={HelpCircle}
              ctaText="Learn More"
              ctaLink={supportData.learnMoreLink}
            />
          </motion.div>

          {/* Green Card */}
          <motion.div variants={cardContainerVariants}>
            <SupportCard
              variant="green"
              title="iCloud+ Features"
              description="Upgrade to iCloud+ for more features"
              features={[
                "More storage",
                "Apple Event Invitations",
                "iCloud Private Relay",
                "Hide My Email",
              ]}
              icon={Shield}
              ctaText="Upgrade Now"
              ctaLink={supportData.learnMoreLink}
            />
          </motion.div>

          {/* Gold Card */}
          <motion.div variants={cardContainerVariants}>
            <SupportCard
              variant="gold"
              title="Privacy & Security"
              description="Peace of mind with privacy features that keep you safe"
              features={supportData.privacyFeatures}
              icon={Lock}
              ctaText="Learn More"
              ctaLink={supportData.learnMoreLink}
            />
          </motion.div>

          {/* Lime-Green Card */}
          <motion.div variants={cardContainerVariants}>
            <SupportCard
              variant="lime"
              title="Share with Family"
              description="Share your iCloud+ subscription with your family"
              features={[
                "Share with up to 5 family members",
                "Everyone gets their own private space",
                "Shared storage and features",
              ]}
              icon={Users}
              ctaText="Manage Family Sharing"
              ctaLink={supportData.adminLink}
            />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 sm:mt-16 lg:mt-20 text-center space-y-4"
        >
          {/* Admin Link Note */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 inline-block shadow-lg">
            <p className="text-xs sm:text-sm font-bold text-cyan-600/60">
              <span className="text-cyan-600/80">Admin Portal:</span>{" "}
              <a
                href={supportData.adminLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-700 hover:text-cyan-800 underline underline-offset-2 transition-colors"
              >
                {supportData.adminLink}
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
      <Iconpack />
    </div>
  );
}