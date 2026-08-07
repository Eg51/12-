// app/components/DesktopNav.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CiMenuKebab } from "react-icons/ci";
import { motion, AnimatePresence } from 'framer-motion';
import { LuLayoutDashboard } from "react-icons/lu";
import { BiTransfer } from "react-icons/bi";
import { MdAccountBalance } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { CiCreditCard2 } from "react-icons/ci";
import { HiPlus } from "react-icons/hi";
import { Menu, X } from 'lucide-react';

const DesktopNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Don't render on mobile
  if (!isDesktop) {
    return null;
  }

  const tabs = [
    { name: "Dashboard", href: "/Dashboard", icon: LuLayoutDashboard },
    { name: "Cards", href: "/Cards", icon: CiCreditCard2 },
    { name: "Investment", href: "/Investment", icon: BiTransfer },
    { name: "Bills", href: "/Bills", icon: MdAccountBalance },
    { name: "Settings", href: "/Settings", icon: IoIosContact },
  ];

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <>
      {/* Hamburger Button - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-xl bg-none font-bold text-md
           text-cyan-600 shadow-cyan-500/30 hover:text-slate-600 transition-all"
        >
          {isOpen ? (
            <>
              <X size={20} />
              <span className="text-lg text-cyan-900 font-bold">Close</span>
            </>
          ) : (
            <>
              <CiMenuKebab className='ml-9em cursor-pointer text-[30px] text-cyan-900 font-black'/>
              {/* <span className="text-xl font-bold ">Menu</span> */}
            </>
          )}
        </motion.button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            ref={menuRef}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 z-50 h-full w-64 bg-[#C4F8FD] shadow-XL backdrop-blur-sm"
          >
            <div className="flex h-full flex-col">
              {/* Brand / Header */}
              <div className="border-b border-cyan-200/30 px-6 py-6">
                <h2 className="text-xl font-bold text-cyan-900">
                  Navigation
                </h2>
                <p className="text-xs text-cyan-700/70">
                  Quick access to all sections
                </p>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <motion.div className="space-y-1">
                  {tabs.map((tab) => {
                    const active = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                      <motion.div
                        key={tab.name}
                        variants={itemVariants}
                        whileHover={{ x: 4 }}
                      >
                        <Link
                          href={tab.href}
                          className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                            active
                              ? "bg-cyan-500/30 text-cyan-900 shadow-lg ring-1 ring-cyan-500/50"
                              : "text-cyan-800 hover:bg-white/30 hover:text-cyan-900"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className={`text-xl ${
                            active ? "text-cyan-600" : "text-cyan-700"
                          }`} />
                          <span className="text-sm font-medium">
                            {tab.name}
                          </span>
                          {active && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="ml-auto h-2 w-2 rounded-full bg-cyan-500"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Plus Button (Investment) - Special styling */}
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                    className="mt-4"
                  >
                    <Link
                      href="/Investment"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-lg bg-[#C4F8FD] px-4 py-3 text-cyan-900 shadow-xl
                       shadow-cyan-500/30 hover:shadow-xl transition-all"
                    >
                      <HiPlus className="text-xl font-black" />
                      <span className="text-sm font-medium">Invest</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default DesktopNav;