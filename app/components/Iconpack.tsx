"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuLayoutDashboard } from "react-icons/lu";
import { BiTransfer } from "react-icons/bi";
import { MdAccountBalance } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { CiCreditCard2 } from "react-icons/ci";
import { HiPlus } from "react-icons/hi";
import { 
  FaShieldAlt, 
  FaUsers, 
  FaChartBar, 
  FaCog
} from "react-icons/fa";

// ---- Types ----------------------------------------------------------------

interface Tab {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isPlus?: boolean;
}

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  displayName: string;
  email: string;
  role: string;
  isAdmin: boolean;
  isActive: boolean;
}

// ---- Constants ------------------------------------------------------------

// Regular user tabs
const USER_TABS: Tab[] = [
  { name: "Dashboard", href: "/Dashboard", icon: LuLayoutDashboard },
  { name: "Cards", href: "/Cards", icon: CiCreditCard2 },
  { name: "Buy", href: "/Buy", icon: BiTransfer, isPlus: true },
  { name: "Bills", href: "/Bills", icon: MdAccountBalance },
  { name: "Settings", href: "/Settings", icon: IoIosContact },
];

// Admin-only tabs
const ADMIN_TABS: Tab[] = [
  { name: "Admin", href: "#", icon: FaShieldAlt },
  { name: "Users", href: "#", icon: FaUsers },
  { name: "Analytics", href: "#", icon: FaChartBar },
  { name: "Settings", href: "#", icon: FaCog },
];

// ---- Component ------------------------------------------------------------

const Iconpack = () => {
  const pathname = usePathname();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle mounting and user detection
  useEffect(() => {
    setMounted(true);
    
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Keyboard detection effect
  useEffect(() => {
    // Function to detect if keyboard is visible
    const detectKeyboard = () => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                             activeElement?.tagName === 'TEXTAREA' || 
                             activeElement?.getAttribute('contenteditable') === 'true';
      
      const windowHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      const heightDifference = screenHeight - windowHeight;
      
      if (isInputFocused && heightDifference > 150) {
        setIsKeyboardVisible(true);
      } else {
        setIsKeyboardVisible(false);
      }
    };

    detectKeyboard();

    const handleResize = () => {
      detectKeyboard();
    };

    const handleFocus = () => {
      setTimeout(detectKeyboard, 100);
    };

    const handleBlur = () => {
      setTimeout(detectKeyboard, 100);
    };

    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const heightDifference = windowHeight - viewportHeight;
        
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' || 
                               activeElement?.tagName === 'TEXTAREA' || 
                               activeElement?.getAttribute('contenteditable') === 'true';
        
        if (isInputFocused && heightDifference > 150) {
          setIsKeyboardVisible(true);
        } else {
          setIsKeyboardVisible(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('focus', handleFocus, true);
    window.addEventListener('blur', handleBlur, true);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    const handleScroll = () => {
      detectKeyboard();
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focus', handleFocus, true);
      window.removeEventListener('blur', handleBlur, true);
      window.removeEventListener('scroll', handleScroll);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }
    };
  }, []);

  // Check if user is admin
  const isAdmin = user?.isAdmin === true || user?.role === 'admin';

  // ---- RENDER BUILD LOGIC (Ensures 100% invisibility for unintended roles) --

  // If ADMIN: Only Admin Tabs. NO Buy Button.
  // If USER: Only User Tabs (Buy button is included inside USER_TABS)
  let tabsToRender: Tab[] = [];

  if (isAdmin) {
    tabsToRender = ADMIN_TABS; // Admin gets NO "Buy" button at all.
  } else {
    tabsToRender = USER_TABS;  // User gets the "Buy" button in its exact original position.
  }

  // ---- Render ----------------------------------------------------------------

  // During SSR and before mount, render a consistent version
  if (!mounted || isLoading) {
    return (
      <div className='fixed z-10 bottom-0 left-0 right-0 flex w-full items-center justify-around bg-white/10 px-2 py-2 shadow-xl backdrop-blur-sm md:hidden'>
        {USER_TABS.map((tab) => {
          const Icon = tab.icon;

          if (tab.isPlus) {
            return (
              <div key={tab.name} className='flex h-9 w-9 cursor-pointer items-center justify-center m-auto rounded-full bg-none shadow-xl shadow-cyan-600 transition-transform hover:scale-105'>
                <HiPlus className='text-[20px] font-black text-cyan-900' />
              </div>
            );
          }

          return (
            <div key={tab.name} className='flex flex-col items-center gap-0.5'>
              <div className='rounded-lg p-2 transition-colors text-cyan-600 hover:text-cyan-400'>
                <Icon className='text-xl font-bold text-cyan-900' />
              </div>
              <span className='text-[8px] font-medium text-cyan-900'>
                {tab.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // If keyboard is visible, don't render the component
  if (isKeyboardVisible) {
    return null;
  }

  return (
    <div className='fixed z-10 bottom-0 left-0 right-0 flex w-full items-center justify-around bg-white/10 px-2 py-2 shadow-xl backdrop-blur-sm md:hidden'>
      {tabsToRender.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + '/');
        const Icon = tab.icon;

        // Handle Plus button (Buy) - ONLY Renders if the tab is actually in the array
        if (tab.isPlus) {
          return (
            <Link key={tab.name} href={tab.href}>
              <div className='flex h-9 w-9 cursor-pointer items-center justify-center m-auto rounded-full bg-none shadow-xl shadow-cyan-600 transition-transform hover:scale-105'>
                <HiPlus className='text-[20px] font-black text-cyan-900' />
              </div>
            </Link>
          );
        }

        // Admin tabs styling (Only rendered if admin)
        if (isAdmin) {
          return (
            <Link key={tab.name} href={tab.href}>
              <div className='flex flex-col items-center gap-0.5 relative'>
                {/* Admin badge */}
                {active && (
                  <div className='absolute -top-1 right-0 rounded-full bg-amber-500 px-1.5 py-0.5 text-[6px] font-bold text-white'>
                    ADMIN
                  </div>
                )}
                <div className={`rounded-lg p-2 transition-colors ${
                  active 
                    ? "bg-amber-500/20 text-amber-600" 
                    : "text-cyan-600 hover:text-amber-500"
                }`}>
                  <Icon className={`text-xl font-bold ${
                    active ? "text-amber-600" : "text-cyan-900"
                  }`} />
                </div>
                <span className={`text-[8px] font-medium ${
                  active ? "text-amber-600" : "text-cyan-900"
                }`}>
                  {tab.name}
                </span>
              </div>
            </Link>
          );
        }

        // Regular user tabs (Only rendered if user)
        return (
          <Link key={tab.name} href={tab.href}>
            <div className='flex flex-col items-center gap-0.5'>
              <div className={`rounded-lg p-2 transition-colors ${
                active ? "bg-cyan-500/20 text-cyan-600" : "text-cyan-600 hover:text-cyan-400"
              }`}>
                <Icon className={`text-xl font-bold ${
                  active ? "text-cyan-600" : "text-cyan-900"
                }`} />
              </div>
              <span className={`text-[8px] font-medium ${
                active ? "text-cyan-600" : "text-cyan-900"
              }`}>
                {tab.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Iconpack;