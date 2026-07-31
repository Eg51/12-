"use client";

import React from 'react';
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

  const tabs = [
    { name: "Dashboard", href: "/Dashboard", icon: LuLayoutDashboard },
    { name: "Investment", href: "/Investment", icon: FaChartLine },
    { name: "Transfer", href: "/Transfer", icon: BiTransfer, isPlus: true },
    { name: "Deposit", href: "/Deposit", icon: MdAccountBalance },
    { name: "Settings", href: "/Settings", icon: IoIosContact },
  ];

  return (
    <div className='fixed bottom-0 left-0 right-0 flex w-full items-center justify-around bg-white/10 px-2 py-2 shadow-xl backdrop-blur-sm md:hidden'>
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.isPlus) {
          return (
            <Link key={tab.name} href={tab.href}>
              <div className='flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-cyan-600 shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105'>
                <HiPlus className='text-2xl font-bold text-white' />
              </div>
            </Link>
          );
        }

        return (
          <Link key={tab.name} href={tab.href}>
            <div className='flex flex-col items-center gap-0.5'>
              <div className={`rounded-lg p-2 transition-colors ${
                active ? "bg-cyan-500/20 text-cyan-500" : "text-cyan-600 hover:text-cyan-400"
              }`}>
                <Icon className={`text-xl font-bold ${
                  active ? "text-cyan-500" : "text-cyan-600"
                }`} />
              </div>
              <span className={`text-[8px] font-medium ${
                active ? "text-cyan-500" : "text-slate-400"
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