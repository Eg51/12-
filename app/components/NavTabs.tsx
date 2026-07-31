// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export interface NavTab {
//   label: string;
//   href?: string;
// }

// interface NavTabsProps {
//   tabs?: NavTab[];
//   defaultActive?: string;
//   onChange?: (label: string) => void;
//   className?: string;
// }

// const DEFAULT_TABS: NavTab[] = [
//   { label: "Personal", href: "#" },
//   { label: "Business", href: "#" },
//   { label: "Investment", href: "#" },
// ];

// export default function NavTabs({
//   tabs = DEFAULT_TABS,
//   defaultActive,
//   onChange,
//   className = "",
// }: NavTabsProps) {
//   const [active, setActive] = useState<string>(
//     defaultActive ?? tabs[0]?.label ?? ""
//   );

//   function handleSelect(label: string) {
//     setActive(label);
//     onChange?.(label);
//   }

//   return (
//     <div
//       role="tablist"
//       aria-label="Primary navigation"
//       className={`hidden items-center gap-7 text-black text-sm sm:flex ${className}`}
//     >
//       {tabs.map((tab) => {
//         const isActive = tab.label === active;
//         return (
//           <Link
//             key={tab.label}
//             href={tab.href ?? "#"}
//             role="tab"
//             aria-selected={isActive}
//             onClick={(e) => {
//               if (!tab.href || tab.href === "#") e.preventDefault();
//               handleSelect(tab.label);
//             }}
//             className={`relative py-1 transition-colors ${
//               isActive ? "text-white" : "text-slate-300 hover:text-white"
//             }`}
//           >
//             {tab.label}
//             <span
//               className={`absolute -bottom-[21px] left-0 h-[2px] w-full rounded-full bg-cyan-900 transition-opacity ${
//                 isActive ? "opacity-100" : "opacity-0"
//               }`}
//             />
//           </Link>
//         );
//       })}
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { AnimatePresence, motion } from "framer-motion";
// import { Menu, X } from "lucide-react";

// export interface NavTab {
//   label: string;
//   href?: string;
// }

// interface NavTabsProps {
//   tabs?: NavTab[];
//   defaultActive?: string;
//   onChange?: (label: string) => void;
//   className?: string;
// }

// // Default primary nav tabs
// const DEFAULT_TABS: NavTab[] = [
//   { label: "Personal", href: "/" },
//   { label: "Business", href: "/Business" },
//   { label: "Investment", href: "/Investment" },
// ];

// export default function NavTabs({
//   tabs = DEFAULT_TABS,
//   defaultActive,
//   onChange,
//   className = "",
// }: NavTabsProps) {
//   const [active, setActive] = useState<string>(
//     defaultActive ?? tabs[0]?.label ?? ""
//   );
//   const [mobileOpen, setMobileOpen] = useState(false);

//   function handleSelect(label: string) {
//     setActive(label);
//     onChange?.(label);
//     setMobileOpen(false);
//   }

//   return (
//     <div className={`relative ${className}`}>
//       {/* Desktop tabs */}
//       <div
//         role="tablist"
//         aria-label="Primary navigation"
//         className="hidden items-center gap-7 bg-transparent text-sm sm:flex"
//       >
//         {tabs.map((tab) => {
//           const isActive = tab.label === active;
//           return (
//             <Link
//               key={tab.label}
//               href={tab.href ?? "#"}
//               role="tab"
//               aria-selected={isActive}
//               onClick={(e) => {
//                 if (!tab.href || tab.href === "#") e.preventDefault();
//                 handleSelect(tab.label);
//               }}
//               className={`relative py-1 transition-colors ${
//                 isActive ? "text-white" : "text-slate-300 hover:text-white"
//               }`}
//             >
//               {tab.label}
//               <span
//                 className={`absolute -bottom-[21px] left-0 h-[2px] w-full rounded-full bg-cyan-900 transition-opacity ${
//                   isActive ? "opacity-100" : "opacity-0"
//                 }`}
//               />
//             </Link>
//           );
//         })}
//       </div>

//       {/* Mobile trigger */}
//       {/* <button
//         type="button"
//         aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
//         aria-expanded={mobileOpen}
//         onClick={() => setMobileOpen((prev) => !prev)}
//         className="flex items-center justify-center rounded-md p-1.5 text-slate-200 transition hover:bg-white/10 sm:hidden"
//       >
//         <AnimatePresence mode="wait" initial={false}>
//           {mobileOpen ? (
//             <motion.span
//               key="close"
//               initial={{ rotate: -90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: 90, opacity: 0 }}
//               transition={{ duration: 0.15 }}
//             >
//               <X size={20} />
//             </motion.span>
//           ) : (
//             <motion.span
//               key="menu"
//               initial={{ rotate: 90, opacity: 0 }}
//               animate={{ rotate: 0, opacity: 1 }}
//               exit={{ rotate: -90, opacity: 0 }}
//               transition={{ duration: 0.15 }}
//             >
//               <Menu size={20} />
//             </motion.span>
//           )}
//         </AnimatePresence>
//       </button> */}

//       {/* Mobile dropdown panel */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             role="tablist"
//             aria-label="Primary navigation"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.2, ease: "easeOut" }}
//             className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg 
//             border border-white/10 bg-slate-900/95 shadow-lg backdrop-blur sm:hidden"
//           >
//             <div className="flex flex-col py-2">
//               {tabs.map((tab) => {
//                 const isActive = tab.label === active;
//                 return (
//                   <Link
//                     key={tab.label}
//                     href={tab.href ?? "#"}
//                     role="tab"
//                     aria-selected={isActive}
//                     onClick={(e) => {
//                       if (!tab.href || tab.href === "#") e.preventDefault();
//                       handleSelect(tab.label);
//                     }}
//                     className={`px-4 py-2.5 text-sm transition-colors ${
//                       isActive
//                         ? "bg-cyan-400/10 text-white"
//                         : "text-slate-300 hover:bg-white/5 hover:text-white"
//                     }`}
//                   >
//                     {tab.label}
//                   </Link>
//                 );
//               })}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
"use client";


import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export interface NavTab {
  label: string;
  href?: string;
}

interface NavTabsProps {
  tabs?: NavTab[];
  defaultActive?: string;
  onChange?: (label: string) => void;
  className?: string;
}

// Default primary nav tabs
const DEFAULT_TABS: NavTab[] = [
  { label: "Personal", href: "#" },
  { label: "Business", href: "#" },
  { label: "Investment", href: "#" },
];

export default function NavTabs({
  tabs = DEFAULT_TABS,
  defaultActive,
  onChange,
  className = "",
}: NavTabsProps) {
  const [active, setActive] = useState<string>(
    defaultActive ?? tabs[0]?.label ?? ""
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSelect(label: string) {
    setActive(label);
    onChange?.(label);
    setMobileOpen(false);
  }

  return (
    <div className={`relative ${className}`}>
      {/* Desktop tabs */}
      <div
        role="tablist"
        aria-label="Primary navigation"
        className="hidden bg-transparent items-center gap-7 text-sm sm:flex"
      >
        {tabs.map((tab) => {
          const isActive = tab.label === active;
          return (
            <Link
              key={tab.label}
              href={tab.href ?? "#"}
              role="tab"
              aria-selected={isActive}
              onClick={(e) => {
                if (!tab.href || tab.href === "#") e.preventDefault();
                handleSelect(tab.label);
              }}
              className={`relative py-1 transition-colors ${
                isActive ? "text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              {tab.label}
              <span
                className={`absolute -bottom-[21px] left-0 h-[2px] w-full rounded-full bg-cyan-900 transition-opacity ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </Link>
          );
        })}
      </div>

      {/* Mobile trigger */}
      <button
        type="button"
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-md p-1.5 text-slate-200 transition hover:bg-white/10 sm:hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {mobileOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile dropdown panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="tablist"
            aria-label="Primary navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-none shadow-xl backdrop-blur sm:hidden"
          >
            <div className="flex flex-col py-2">
              {tabs.map((tab) => {
                const isActive = tab.label === active;
                return (
                  <Link
                    key={tab.label}
                    href={tab.href ?? "#"}
                    role="tab"
                    aria-selected={isActive}
                    onClick={(e) => {
                      if (!tab.href || tab.href === "#") e.preventDefault();
                      handleSelect(tab.label);
                    }}
                    className={`px-4 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-cyan-400/10 text-white"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
