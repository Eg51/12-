"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuLayoutDashboard } from "react-icons/lu";
import { BiTransfer } from "react-icons/bi";
import { MdAccountBalance } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { FaChartLine } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";

const Iconpack = () => {
  const pathname = usePathname();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Function to detect if keyboard is visible
    const detectKeyboard = () => {
      // For mobile devices, keyboard visibility can be detected by checking if the active element is an input or textarea
      // and checking window.innerHeight changes
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                             activeElement?.tagName === 'TEXTAREA' || 
                             activeElement?.getAttribute('contenteditable') === 'true';
      
      // Check if viewport height has significantly reduced (keyboard usually takes up ~40-50% of screen)
      const windowHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      const heightDifference = screenHeight - windowHeight;
      
      // If there's a significant height difference and an input is focused, keyboard is likely visible
      if (isInputFocused && heightDifference > 150) {
        setIsKeyboardVisible(true);
      } else {
        setIsKeyboardVisible(false);
      }
    };

    // Initial detection
    detectKeyboard();

    // Listen for resize events (keyboard opening/closing triggers resize)
    const handleResize = () => {
      detectKeyboard();
    };

    // Listen for focus and blur events
    const handleFocus = () => {
      setTimeout(detectKeyboard, 100);
    };

    const handleBlur = () => {
      setTimeout(detectKeyboard, 100);
    };

    // Listen for visual viewport changes (more reliable for mobile)
    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const heightDifference = windowHeight - viewportHeight;
        
        // Check if active element is an input
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
    
    // Visual Viewport API for more accurate detection (supported in modern mobile browsers)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    // Handle scroll events (keyboard can cause scroll)
    const handleScroll = () => {
      detectKeyboard();
    };
    window.addEventListener('scroll', handleScroll);

    // Cleanup
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

  const tabs = [
    { name: "Dashboard", href: "/Dashboard", icon: LuLayoutDashboard },
    { name: "Investment", href: "/Investment", icon: FaChartLine },
    { name: "Transfer", href: "/Transfer", icon: BiTransfer, isPlus: true },
    { name: "Bills", href: "/Bills", icon: MdAccountBalance },
    { name: "Settings", href: "/Settings", icon: IoIosContact },
  ];

  // If keyboard is visible, don't render the component
  if (isKeyboardVisible) {
    return null;
  }

  return (
    <div className='fixed z-100 bottom-0 left-0 right-0 flex w-full items-center justify-around bg-white/10 px-2 py-2 shadow-xl backdrop-blur-sm md:hidden'>
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.isPlus) {
          return (
            <Link key={tab.name} href={tab.href}>
              <div className='flex h-9 w-9 cursor-pointer items-center justify-center m-auto rounded-full
            bg-none shadow-xl shadow-cyan-600 transition-transform hover:scale-105'>
                <HiPlus className='text-[20px] font-black text-cyan-900' />
              </div>
            </Link>
          );
        }

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