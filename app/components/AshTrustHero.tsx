// import Link from "next/link";
// import Image from 'next/image'
// import BusinessGrowthHero from '@/app/components/TreasuryFeatureGrid'


// import {
//   ArrowRight,
//   User,
//   Lock,
//   Volume2,
//   ShieldCheck,
//   TrendingUp,
//   Globe,
// } from "lucide-react";
// import NavTabs from "./NavTabs";

// // ---- Data ---------------------------------------------------------------

// const securityFeatures = [
//   {
//     icon: ShieldCheck,
//     title: "Military-Grade Encryption",
//     description:
//       "End-to-end multi-layer security protocols protecting every transaction and asset.",
//   },
//   {
//     icon: TrendingUp,
//     title: "Predictive Analytics",
//     description:
//       "AI-driven insights to help you optimize your portfolio and capital allocation.",
//   },
//   {
//     icon: Globe,
//     title: "Global Connectivity",
//     description:
//       "Move capital across borders with zero-latency execution and real-time conversion.",
//   },
// ];

// const footerLinks = [
//   { label: "Privacy Policy", href: "#" },
//   { label: "Security Audit", href: "#" },
//   { label: "Legal", href: "#" },
// ];

// // ---- Component ------------------------------------------------------------

// export default function AshTrustHero() {
//   return (
//     <section className="w-full h-screen px-6 pt-13 bg-radial from-blue-200 to-gray-300 to-gray-300 text-[#0a0e17]">
//       <div className="bg-radial from-blue-200 to-gray-300 to-gray-300 mx-auto max-w-6xl">
//         {/* Nav */}
//         <nav className="flex items-center justify-between border-b border-white/5 pb-5">
//           <div className="flex w- items-center gap-10">
//             <Image
//             src={'/loadLogo_shield_smooth.png'}
//             alt={'Shieldlogo'}
//             width={20}
//             height={20}
//             className="w-7 h-7 m-auto p-auto"/>
//             <span className="text-lg font-bold">

//               Ash Trust <span className="text-cyan-400">Bank</span>
//             </span>
//             <NavTabs />
//           </div>
//           <div className="flex items-center gap-4">
//             <Link href="#" className="text-sm text-[#0a0e17] hover:text-gray-500">
//               Log In
//             </Link>
//             <button
//               type="button"
//               className="rounded-md border border-cyan-400 px-4 py-1.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-400/10"
//             >
//               Open Account
//             </button>
//           </div>
//         </nav>

//         {/* Hero content */}
//         <div className="grid grid-cols-1 gap-12 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
//           {/* Left column */}
//           <div>
//             <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 
//             text-[11px] font-medium tracking-wide text-[#0a0e17]">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//               NEXT GENERATION BANKING
//             </span>

//             <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
//               Institutional-Grade
//               <br />
//               <span className="text-cyan-400">Finance for the Modern World</span>
//             </h1>

//             <p className="mt-5 max-w-md text-sm leading-relaxed text-[#0a0e17]">
//               Experience the precision of elite institutional tools combined
//               with the agility of modern digital banking. Secure, seamless,
//               and engineered for the high-net-worth future.
//             </p>

//             <div className="mt-7 flex flex-wrap items-center gap-4">
//               <button
//                 type="button"
//                 className="flex items-center gap-2 rounded-md bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300"
//               >
//                 Get Started
//                 <ArrowRight size={16} strokeWidth={2.5} />
//               </button>
//               <button
//                 type="button"
//                 className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-[#0a0e17] transition hover:bg-white/5"
//               >
//                 View Rates
//               </button>
//             </div>

//             <div className="mt-12 flex gap-12">
//               <div>
//                 <p className="text-[11px] tracking-wide text-[#0a0e17]">
//                   ASSETS SECURED
//                 </p>
//                 <p className="mt-1 text-lg font-semibold text-[#0a0e17]">
//                   $24.8B+
//                 </p>
//               </div>
//               <div>
//                 <p className="text-[11px] tracking-wide text-[#0a0e17]">
//                   GLOBAL REACH
//                 </p>
//                 <p className="mt-1 text-lg font-semibold text-[#0a0e17]">
//                   140+ Countries
//                 </p>
//               </div>
//             </div>
//           </div>
//           {/* Right column: cards */}
//           <div className="flex flex-col gap-5">
//             {/* Lumina Elite card — gradient background */}
//             <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-6 shadow-lg">
//               <div className="flex items-center justify-between">
//                 <p className="text-base font-semibold text-slate-900">
//                   Ash Trust Bank <span className="text-cyan-700">Elite</span>
//                 </p>
//                 <span className="flex p-auto h-15 w-15 p-auto items-center justify-center rounded-full bg-white/40 text-[#0a0e17]">
//                   {/* <Volume2 size={16} /> */}
//                 </span>
//               </div>

//               <p className="mt-10 text-[11px] font-medium tracking-wide text-[#0a0e17]">
//                 @Username
//               </p>
//               <div className="mt-2 flex items-center gap-2">
//                 <span className="h-6 w-9 rounded-sm bg-white/50" />
//                 <span className="text-sm font-medium tracking-widest text-[#0a0e17]">
//                   •••• •••• •••• 8820
//                 </span>
//               </div>
//             </div>

//             {/* Manage your wealth card — gradient background */}
//             <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-6 shadow-lg">
//               <h2 className="text-base font-semibold text-[#0a0e17]">
//                 Manage your wealth
//               </h2>

//               <div className="mt-4 flex flex-col gap-3">
//                 <div className="flex items-center gap-2 rounded-md border border-slate-900/10 bg-white/40 px-3 py-2.5">
//                   <User size={15} className="text-[#0a0e17]" />
//                   <input
//                     type="text"
//                     placeholder="Username or Account ID"
//                     className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
//                   />
//                 </div>
//                 <div className="flex items-center gap-2 rounded-md border border-slate-900/10 bg-white/40 px-3 py-2.5">
//                   <Lock size={15} className="text-[#0a0e17]" />
//                   <input
//                     type="password"
//                     placeholder="Passcode"
//                     className="w-full bg-transparent text-sm text-[#0a0e17] placeholder:text-slate-500 focus:outline-none"
//                   />
//                 </div>

//                <Link href={''}>
//                 <button
//                     type="button"
//                     className="mt-1 rounded-md border border-cyan-700/40 bg-cyan-700/10 py-2.5 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-700/20"
//                   >
//                     Secure Sign In
//                   </button>
//                </Link>
//               </div>

//               <div className="mt-4 flex items-center justify-between text-[11px] text-[#0a0e17]">
//                 <Link href="#" className="underline hover:text-slate-800">
//                   Forgot password?
//                 </Link>
//                 <span>
//                   New here?{" "}
//                   <Link
//                     href="#"
//                     className="font-medium text-cyan-800 hover:underline"
//                   >
//                     Create Account
//                   </Link>
//                 </span>
//               </div>
//             </div>

//             {/* Market status bar */}
//             <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] text-[#0a0e17]">
//               <span className="flex items-center gap-1.5">
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                 MARKET STATUS: OPEN
//               </span>
//               <span className="flex gap-3">
//                 <span>
//                   LUM <span className="text-emerald-400">+1.24%</span>
//                 </span>
//                 <span>
//                   BTC <span className="text-emerald-400">+0.82%</span>
//                 </span>
//               </span>
//             </div>
//           </div>
//         </div>
//         <p className="pb-10 text-center text-[11px] tracking-wide text-[#0a0e17]">
//           EXPLORE SECURITY FEATURES
//         </p>

//         {/* Security features */}
//         <div className="grid grid-cols-1 gap-5 pb-16 sm:grid-cols-3">
//           {securityFeatures.map((feature) => {
//             const Icon = feature.icon;
//             return (
//               <div
//                 key={feature.title}
//                 className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
//               >
//                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
//                   <Icon size={18} strokeWidth={2} />
//                 </span>
//                 <h3 className="mt-4 text-[15px] font-semibold text-[#0a0e17]">
//                   {feature.title}
//                 </h3>
//                 <p className="mt-2 text-sm leading-relaxed text-[#0a0e17]">
//                   {feature.description}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="border-t border-white/5 bg-radial from-blue-200 to-gray-300 to-gray-300">
//         <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-5 text-[11px] text-[#0a0e17] sm:flex-row">
//           <p>© 2024 Ash Trust Bank plc. All rights reserved. Member FDIC.</p>
//           <div className="flex gap-6">
//             {footerLinks.map((link) => (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 className="font-medium uppercase tracking-wide text-cyan-400 hover:text-cyan-300"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import AnimatedCounter from './AnimatedCounter'
// import { motion, type Variants } from "framer-motion";
// import {
//   ArrowRight,
//   User,
//   Lock,
//   ShieldCheck,
//   TrendingUp,
//   Globe,
// } from "lucide-react";
// import NavTabs from "./NavTabs";
// import GrowthToolsCTA from "./GrowthToolsCTA";

// // ---- Data ---------------------------------------------------------------

// const securityFeatures = [
//   {
//     icon: ShieldCheck,
//     title: "Military-Grade Encryption",
//     description:
//       "End-to-end multi-layer security protocols protecting every transaction and asset.",
//   },
//   {
//     icon: TrendingUp,
//     title: "Predictive Analytics",
//     description:
//       "AI-driven insights to help you optimize your portfolio and capital allocation.",
//   },
//   {
//     icon: Globe,
//     title: "Global Connectivity",
//     description:
//       "Move capital across borders with zero-latency execution and real-time conversion.",
//   },
// ];

// const footerLinks = [
//   { label: "Privacy Policy", href: "#" },
//   { label: "Security Audit", href: "#" },
//   { label: "Legal", href: "#" },
// ];

// // ---- Animation variants ---------------------------------------------------

// const navVariants: Variants = {
//   hidden: { opacity: 0, y: -16 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

// const heroContainer: Variants = {
//   hidden: {},
//   visible: {
//     transition: { staggerChildren: 0.12, delayChildren: 0.1 },
//   },
// };

// const fadeUp: Variants = {
//   hidden: { opacity: 0, y: 24 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
// };

// const cardsContainer: Variants = {
//   hidden: {},
//   visible: {
//     transition: { staggerChildren: 0.15, delayChildren: 0.3 },
//   },
// };

// const cardFade: Variants = {
//   hidden: { opacity: 0, y: 30, scale: 0.97 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.5, ease: "easeOut" },
//   },
// };

// const gridContainer: Variants = {
//   hidden: {},
//   visible: {
//     transition: { staggerChildren: 0.12 },
//   },
// };

// const gridItem: Variants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
// };

// // ---- Component ------------------------------------------------------------

// export default function AshTrustHero() {
//   return (
//     <>
//       <section className="w-full pt-9 min-h-screen flex bg-linear-to-br from-blue-200
//      via-cyan-100 to-gray-300 px-6 md:px-4 text-[#0a0e17] sm:px-6">
//         <div className="mx-auto  max-w-screen">
//           {/* Nav */}
//           <motion.nav
//             initial="hidden"
//             animate="visible"
//             variants={navVariants}
//             className="flex md:flex-wrap items-center justify-between gap-3 md:gap-4 border-none"
//           >
//             <div className="flex flex-wrap items-center gap-[1em] sm:gap-10">
//               <Image
//                 src="/loadLogo_shield_smooth.png"
//                 alt="Shield logo"
//                 width={28}
//                 height={28}
//                 className="md:h-7 md:w-7 h-5 w-5"
//               />
//               <span className="font-bold m-auto p-auto text-[11.4px] md:text-lg">
//                 Ash Trust <span className="text-cyan-500">Bank</span>
//               </span>
//               <div className="hidden md:block">
//                 <NavTabs />
//               </div>
//             </div>
//             <div className="flex items-center gap-8 md:gap-3 sm:gap-4">
//               <Link
//                 href="/log-in"
//                 className="hidden text-sm text-[#0a0e17] cursor-pointer transition hover:text-gray-500 xs:inline sm:inline"
//               >
//                 Log In
//               </Link>

//               <Link href={'/sign-up'}>
//                 <motion.button
//                   whileHover={{ scale: 1.04 }}
//                   whileTap={{ scale: 0.97 }}
//                   type="button"
//                   className="rounded-md border shadow-xl md:px-3.5 font-medium px-3 py-1.5 text-xs 
//                 text-cyan-600 transition hover:bg-cyan-900/10 sm:px-4 sm:text-sm"
//                 >
//                   <motion.div
//                     className="w-auto h-auto m-0"
//                     animate={{ scale: [1, 1.2, 1] }}
//                     transition={{
//                       duration: 1.4,
//                       repeat: Infinity,
//                       ease: "easeInOut",
//                     }}
//                   >  Create account</motion.div>
//                 </motion.button>

//               </Link>

//             </div>
//           </motion.nav>

//           {/* Hero content */}
//           <div className="grid grid-cols-1 md:pl-10 gap-10 py-10 sm:gap-12 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
//             {/* Left column */}
//             <motion.div initial="hidden" animate="visible" variants={heroContainer}>
//               <motion.span
//                 variants={fadeUp}
//                 className="inline-flex items-center md:ml-0 ml-14 gap-2 rounded-full border-none
//                bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-[#0a0e17]"
//               >
//                 <span className=" h-1.5 w-1.5 flex md:-ml-5 ml-0 items-center justify-center text-center rounded-full bg-emerald-500" />
//                 NEXT GENERATION BANKING
//               </motion.span>

//               <motion.h1
//                 variants={fadeUp}
//                 className="items-center justify-center text-center
//               md:items-left md:justify-left md:text-left
//                mt-5 text-[1.87rem] font-bold leading-tight"
//               >
//                 <span className='md:text[2.2em] text-2xl whitespace-nowrap'>Modern Banking.</span>
//                 <br /><br />
//                 <span className="flex tracking-widest items-center justify-center text-centermd:text[2.2em] text-2xl 
//               md:items-left md:justify-start md:text-left
//                text-cyan-600">Timeless<br /><br />Trust</span>
//               </motion.h1>

//               <motion.p
//                 variants={fadeUp}
//                 className="mt-5 max-w-md md:pl-0 md:pr-0 pl-5 pr-5 whitespace-pre-wrap
//               flex items-center justify-center text-center md:items-left md:justify-left md:text-left
//                text-[0.9em] md:text-[0.8em] leading-relaxed text-[#0a0e17]/80"
//               >
//                 Secure Intelligent Banking for Individuals and Businesses around the World.
//               </motion.p>

//               <motion.div
//                 variants={fadeUp}
//                 className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.04 }}
//                   whileTap={{ scale: 0.97 }}
//                   type="button"
//                   className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-500 px-5 py-2.5 text-sm
//                 cursor-pointer font-semibold text-slate-900 transition hover:bg-cyan-400 sm:w-auto"
//                 ><motion.div
//                   className="w-auto h-auto m-0"
//                   animate={{ scale: [1, 1.2, 1] }}
//                   transition={{
//                     duration: 1.4,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                   }}
//                 >
//                     Get Started
//                   </motion.div>

//                   <ArrowRight size={16} strokeWidth={2.5} />
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.04 }}
//                   whileTap={{ scale: 0.97 }}
//                   type="button"
//                   className="w-full rounded-md border border-[#0a0e17]/20 px-5 py-2.5 text-sm
//                 cursor-pointer font-semibold text-[#0a0e17] transition hover:bg-white/20 sm:w-auto"
//                 >
//                   View Rates
//                 </motion.button>
//               </motion.div>

//               <motion.div
//                 variants={fadeUp}
//                 className="mt-10 flex flex-wrap gap-8 sm:mt-12 sm:gap-12"
//               >
//                 <div>
//                   <AnimatedCounter
//                     value={140}
//                     suffix="+ Countries"
//                     className="mt-1 text-lg font-semibold text-[#0a0e17]" />
//                   <AnimatedCounter
//                     value={24.8}
//                     prefix="$"
//                     suffix="B+"
//                     className="mt-1 text-lg font-semibold text-[#0a0e17]" />
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Right column: cards */}
//             <motion.div
//               initial="hidden"
//               animate="visible"
//               variants={cardsContainer}
//               className="flex flex-col gap-5 cursor-pointer"
//             >
//               {/* Ash Trust Elite card */}
//               <motion.div
//                 variants={cardFade}
//                 whileHover={{ y: -4 }}
//                 className="rounded-2xl border absolutecursor-pointer border-none bg-linear-to-br from-blue-200 via-cyan-200
//                to-purple-200 p-6 shadow-lg transition-shadow hover:shadow-xl"
//               >
//                 <div className="flex items-center justify-between cursor-pointer">
//                   <p className="text-base font-semibold text-slate-900">
//                     Ash Trust Bank <span className="text-cyan-700">Elite</span>
//                   </p>
//                   <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-[#0a0e17]" />
//                 </div>

//                 <p className="mt-10 text-[11px] font-medium tracking-wide text-[#0a0e17]">
//                   @Username
//                 </p>
//                 <div className="mt-2 flex items-center gap-2">
//                   <span className="h-6 w-9 rounded-sm bg-white/50" />
//                   <span className="text-sm font-medium tracking-widest text-[#0a0e17]">
//                     •••• •••• •••• 8820
//                   </span>
//                 </div>
//               </motion.div>

//               {/* Manage your wealth card */}
//               <motion.div
//                 variants={cardFade}
//                 whileHover={{ y: -4 }}
//                 className="rounded-2xl cursor-pointer border border-white/10 bg-linear-to-br from-blue-200 via-cyan-200
//                to-purple-200 p-6 shadow-lg transition-shadow hover:shadow-xl"
//               >
//                 <h2 className="text-base font-semibold text-[#0a0e17]">
//                   Manage your wealth
//                 </h2>

//                 <div className="mt-4 flex flex-col gap-3">
//                   <div className="flex items-center gap-2 rounded-md border border-slate-900/10 bg-white/40 px-3 py-2.5">
//                     <User size={15} className="text-[#0a0e17]" />
//                     <input
//                       type="text"
//                       placeholder="Username or Account ID"
//                       className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2 rounded-md cursor-pointer border border-slate-900/10 bg-white/40 px-3 py-2.5">
//                     <Lock size={15} className="text-[#0a0e17]" />
//                     <input
//                       type="password"
//                       placeholder="Passcode"
//                       className="w-full bg-transparent text-sm text-[#0a0e17] placeholder:text-slate-500 focus:outline-none"
//                     />
//                   </div>
//                   <Link href="/Dashboard">
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       type="button"
//                       className="mt-1 w-full rounded-md border border-cyan-700/40 bg-cyan-700/10 py-2.5
//                     cursor-pointer text-sm font-semibold text-cyan-800 transition hover:bg-cyan-700/20"
//                     >
//                       {/* <motion.div
//               className="w-auto h-auto m-0"
//               animate={{ scale: [1, 1.2, 1] }}
//               transition={{
//                 duration: 1.4,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}></motion.div> */}Secure Sign In
//                     </motion.button>
//                   </Link>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between text-[11px] text-[#0a0e17]">
//                   <Link title="This service is not available for now. contact your Admin"
//                     href='#' className="cursor-pointer hover:text-slate-800">
//                     Forgot password?
//                   </Link>
//                   <span>
//                     <span className="pr-1"> New here?</span>
//                     <Link
//                       href={"/sign-up"}
//                       className="font-medium cursor-pointer text-cyan-800 hover:underline"
//                     >
//                       Create Account
//                     </Link>
//                   </span>
//                 </div>
//               </motion.div>

//               {/* Market status bar */}
//               <motion.div
//                 variants={cardFade}
//                 className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-[11px] text-[#0a0e17]"
//               >
//                 <span className="flex items-center gap-1.5">
//                   <motion.span
//                     animate={{ opacity: [1, 0.4, 1] }}
//                     transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//                     className="h-1.5 w-1.5 rounded-full bg-emerald-500"
//                   />
//                   MARKET STATUS: OPEN
//                 </span>
//                 <span className="flex whitespace-nowrap flex-row
//                   mr-8 items-center justify-between gap-4">
//                   <span className="flex whitespace-nowrap flex-row gap-1">
//                     LUM
//                     <AnimatedCounter
//                       value={40.24}
//                       prefix="+"
//                       suffix="%"
//                       className="text-[12px] text-emerald-600" />
//                   </span>
//                   <span className="flex whitespace-nowrap flex-row gap-1">
//                     BTC
//                     <AnimatedCounter
//                       value={82}
//                       prefix="+"
//                       suffix="%"
//                       className="text-[12px]
//                    text-emerald-600"/>
//                   </span>
//                 </span>
//               </motion.div>
//             </motion.div>
//           </div>

//           <motion.p
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="pb-8 text-center text-[11px] tracking-wide text-[#0a0e17]/70 sm:pb-10"
//           >

//             EXPLORE SECURITY FEATURES
//           </motion.p>

//           {/* Security features */}
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.3 }}
//             variants={gridContainer}
//             className="grid grid-cols-1 gap-5 pb-14 sm:grid-cols-2 sm:pb-16 md:grid-cols-3"
//           >
//             {securityFeatures.map((feature) => {
//               const Icon = feature.icon;
//               return (
//                 <motion.div
//                   key={feature.title}
//                   variants={gridItem}
//                   whileHover={{ y: -4 }}
//                   className="rounded-2xl border border-white/10 bg-white/10 p-6 transition-shadow hover:shadow-lg"
//                 >
//                   <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-600">
//                     <Icon size={18} strokeWidth={2} />
//                   </span>
//                   <h3 className="mt-4 text-[15px] font-semibold text-[#0a0e17]">
//                     {feature.title}
//                   </h3>
//                   <p className="mt-2 text-sm leading-relaxed text-[#0a0e17]/80">
//                     {feature.description}
//                   </p>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//           <GrowthToolsCTA />
//         </div>
//       </section>
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//         className="border-t border-white/10 bg-cyan-400/40"
//       >
//         <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 text-center text-[11px]
//      text-[#0a0e17] sm:flex-row sm:px-6 sm:text-left">
//           <p>© 2024 Ash Trust Bank plc. All rights reserved. Member FDIC.</p>
//           <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
//             {footerLinks.map((link) => (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 className="font-medium uppercase cursor-progress tracking-wide text-cyan-600 hover:text-cyan-500"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     </>
//   );
// }







// export default function AshTrustHero() {
//   return (
//     <section className="w-full p-3 min-h-screen bg-gradient-to-br from-blue-200
//      via-cyan-100 to-gray-300 px-6 md:px-4 pt-8 text-[#0a0e17] sm:px-6 pt-9">
//       <div className="mx-auto max-w-screen">
//         {/* Nav */}
//         <motion.nav
//           initial="hidden"
//           animate="visible"
//           variants={navVariants}
//           className="flex flex-wrap items-center justify-between gap- md:gap-4 border-none"
//         >
//           <div className="flex flex-wrap items-center gap-[1em] sm:gap-10">
//             <Image
//               src="/loadLogo_shield_smooth.png"
//               alt="Shield logo"
//               width={28}
//               height={28}
//               className="h-7 w-7"
//             />
//             <span className="text-base font-bold sm:text-lg">
//               Ash Trust <span className="text-cyan-500">Bank</span>
//             </span>
//             <div className="hidden md:block">
//               <NavTabs />
//             </div>
//           </div>
//           <div className="flex items-center gap-0 md:gap-3 sm:gap-4">
//             <Link
//               href="/log-in"
//               className="hidden text-sm text-[#0a0e17] cursor-pointer transition hover:text-gray-500 xs:inline sm:inline"
//             >
//               Log In
//             </Link>

//             <Link href={'/sign-up'}>
//               <motion.button
//                 whileHover={{ scale: 1.04 }}
//                 whileTap={{ scale: 0.97 }}
//                 type="button"
//                 className="rounded-md border shadow-xl px-3.5 py-1.5 text-xs 
//                  font-medium text-cyan-600 transition hover:bg-cyan-400/10 sm:px-4 sm:text-sm"
//               >
//                 Open Account
//               </motion.button>

//             </Link>

//           </div>
//         </motion.nav>

//         {/* Hero content */}
//         <div className="grid grid-cols-1 md:pl-10 gap-10 py-10 sm:gap-12 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
//           {/* Left column */}
//           <motion.div initial="hidden" animate="visible" variants={heroContainer}>
//             <motion.span
//               variants={fadeUp}
//               className="inline-flex items-center md:ml-0 ml-14 gap-2 rounded-full border-none
//                bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-[#0a0e17]"
//             >
//               <span className=" h-1.5 w-1.5 rounded-full bg-emerald-500" />
//               NEXT GENERATION BANKING
//             </motion.span>




//             {/* <motion.h1
//               variants={fadeUp}
//               className="mt-5 text-[2.1em] font-bold leading-tight"
//             >
//               Institutional-Grade
//               <br />
//               <span className="flex pr-4 mt-1 tracking-wider text-left text-cyan-600">Finance for the<br /> Modern World</span>
//             </motion.h1>

//             <motion.p
//               variants={fadeUp}
//               className="mt-5 lg:items-left lg:justify-left text-center flex tracking-wide max-w-md
//                text-sm leading-relaxed pr-9 text-[#0a0e17]/80"
//             >
//              Secure Intelligent Banking for Individuals and Businesses around the World 
//             </motion.p>

//             <motion.div
//               variants={fadeUp}
//               className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4"
//             >
//               <motion.button
//                 whileHover={{ scale: 1.04 }}
//                 whileTap={{ scale: 0.97 }}
//                 type="button"
//                 className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-500 px-5 py-2.5 text-sm
//                 cursor-pointer font-semibold text-slate-900 transition hover:bg-cyan-400 sm:w-auto"
//             */}










//             <motion.h1
//               variants={fadeUp}
//               className="items-center justify-center text-center
//               md:items-left md:justify-left md:text-left
//                mt-5 text-[1.87rem] font-bold leading-tight"
//             >
//               <span className='text[2.2em] whitespace-nowrap'>Institutional-Grade</span>
//               <br />
//               <span className="flex tracking-widest
//               items-center justify-center text-center md:-ml-11 -ml-5
//               md:items-left md:justify-start md:text-left w-[12.2em] md:w-0
//                text-cyan-600">Finance for the<br /> Modern World</span>
//             </motion.h1>

//             <motion.p
//               variants={fadeUp}
//               className="mt-5 max-w-md md:max-w-[17em] md:pl-0 md:pr-0 pl-5 pr-5 whitespace-pre-wrap md:text-[1.3em]
//               flex items-center justify-center text-center md:items-left md:justify-left md:text-left
//                text-[0.9em] leading-relaxed text-[#0a0e17]/80 "
//             >
//               Secure Intelligent Banking for Individuals and Businesses around the World.
//             </motion.p>

//             <motion.div
//               variants={fadeUp}
//               className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4"
//             >
//               <motion.button
//                 whileHover={{ scale: 1.04 }}
//                 whileTap={{ scale: 0.97 }}
//                 type="button"
//                 className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-500 px-5 py-2.5 text-sm
//                 cursor-pointer font-semibold text-slate-900 transition hover:bg-cyan-400 sm:w-auto"
//               >
//                 Get Started
//                 <ArrowRight size={16} strokeWidth={2.5} />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.04 }}
//                 whileTap={{ scale: 0.97 }}
//                 type="button"
//                 className="w-full rounded-md border border-[#0a0e17]/20 px-5 py-2.5 text-sm
//                 cursor-pointer font-semibold text-[#0a0e17] transition hover:bg-white/20 sm:w-auto"
//               >
//                 View Rates
//               </motion.button>
//             </motion.div>

//             <motion.div
//               variants={fadeUp}
//               className="mt-10 flex flex-wrap gap-8 sm:mt-12 sm:gap-12"
//             >
//               <div>
//                 <p className="text-[11px] tracking-wide text-[#0a0e17]/70">
//                   ASSETS SECURED
//                 </p>
//                 <p className="mt-1 text-lg font-semibold text-[#0a0e17]">
//                   $24.8B+
//                 </p>
//               </div>
//               <div>
//                 <p className="text-[11px] tracking-wide text-[#0a0e17]/70">
//                   GLOBAL REACH
//                 </p>
//                 <p className="mt-1 text-lg font-semibold text-[#0a0e17]">
//                   140+ Countries
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>

//           {/* Right column: cards */}
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={cardsContainer}
//             className="flex flex-col gap-5 cursor-pointer"
//           >
//             {/* Ash Trust Elite card */}
//             <motion.div
//               variants={cardFade}
//               whileHover={{ y: -4 }}
//               className="rounded-2xl border absolutecursor-pointer border-none bg-gradient-to-br from-blue-200 via-cyan-200
//                to-purple-200 p-6 shadow-lg transition-shadow hover:shadow-xl"
//             >
//               <div className="flex items-center justify-between cursor-pointer">
//                 <p className="text-base font-semibold text-slate-900">
//                   Ash Trust Bank <span className="text-cyan-700">Elite</span>
//                 </p>
//                 <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-[#0a0e17]" />
//               </div>

//               <p className="mt-10 text-[11px] font-medium tracking-wide text-[#0a0e17]">
//                 @Username
//               </p>
//               <div className="mt-2 flex items-center gap-2">
//                 <span className="h-6 w-9 rounded-sm bg-white/50" />
//                 <span className="text-sm font-medium tracking-widest text-[#0a0e17]">
//                   •••• •••• •••• 8820
//                 </span>
//               </div>
//             </motion.div>

//             {/* Manage your wealth card */}
//             <motion.div
//               variants={cardFade}
//               whileHover={{ y: -4 }}
//               className="rounded-2xl cursor-pointer border border-white/10 bg-gradient-to-br from-blue-200 via-cyan-200
//                to-purple-200 p-6 shadow-lg transition-shadow hover:shadow-xl"
//             >
//               <h2 className="text-base font-semibold text-[#0a0e17]">
//                 Manage your wealth
//               </h2>

//               <div className="mt-4 flex flex-col gap-3">
//                 <div className="flex items-center gap-2 rounded-md border border-slate-900/10 bg-white/40 px-3 py-2.5">
//                   <User size={15} className="text-[#0a0e17]" />
//                   <input
//                     type="text"
//                     placeholder="Username or Account ID"
//                     className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
//                   />
//                 </div>
//                 <div className="flex items-center gap-2 rounded-md cursor-pointer border border-slate-900/10 bg-white/40 px-3 py-2.5">
//                   <Lock size={15} className="text-[#0a0e17]" />
//                   <input
//                     type="password"
//                     placeholder="Passcode"
//                     className="w-full bg-transparent text-sm text-[#0a0e17] placeholder:text-slate-500 focus:outline-none"
//                   />
//                 </div>

//                 <Link href="/log-in">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="button"
//                     className="mt-1 w-full rounded-md border border-cyan-700/40 bg-cyan-700/10 py-2.5
//                     cursor-pointer text-sm font-semibold text-cyan-800 transition hover:bg-cyan-700/20"
//                   >
//                     Secure Sign In
//                   </motion.button>
//                 </Link>
//               </div>

//               <div className="mt-4 flex items-center justify-between text-[11px] text-[#0a0e17]">
//                 <Link href="/forgotPassword" className="cursor-pointer hover:text-slate-800">
//                   Forgot password?
//                 </Link>
//                 <span>
//                   <span  className="pr-1"> New here?</span>
//                 <Link
//                     href={"/sign-up"}
//                     className="font-medium cursor-pointer text-cyan-800 hover:underline"
//                   >
//                     Create Account
//                   </Link>
//                 </span>
//               </div>
//             </motion.div>

//             {/* Market status bar */}
//             <motion.div
//               variants={cardFade}
//               className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-[11px] text-[#0a0e17]"
//             >
//               <span className="flex items-center gap-1.5">
//                 <motion.span
//                   animate={{ opacity: [1, 0.4, 1] }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//                   className="h-1.5 w-1.5 rounded-full bg-emerald-500"
//                 />
//                 MARKET STATUS: OPEN
//               </span>
//               <span className="flex gap-3">
//                 <span>
//                   LUM <span className="text-emerald-600">+1.24%</span>
//                 </span>
//                 <span>
//                   BTC <span className="text-emerald-600">+0.82%</span>
//                 </span>
//               </span>
//             </motion.div>
//           </motion.div>
//         </div>

//         <motion.p
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5 }}
//           className="pb-8 text-center text-[11px] tracking-wide text-[#0a0e17]/70 sm:pb-10"
//         >
//           EXPLORE SECURITY FEATURES
//         </motion.p>

//         {/* Security features */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={gridContainer}
//           className="grid grid-cols-1 gap-5 pb-14 sm:grid-cols-2 sm:pb-16 md:grid-cols-3"
//         >
//           {securityFeatures.map((feature) => {
//             const Icon = feature.icon;
//             return (
//               <motion.div
//                 key={feature.title}
//                 variants={gridItem}
//                 whileHover={{ y: -4 }}
//                 className="rounded-2xl border border-white/10 bg-white/10 p-6 transition-shadow hover:shadow-lg"
//               >
//                 <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-600">
//                   <Icon size={18} strokeWidth={2} />
//                 </span>
//                 <h3 className="mt-4 text-[15px] font-semibold text-[#0a0e17]">
//                   {feature.title}
//                 </h3>
//                 <p className="mt-2 text-sm leading-relaxed text-[#0a0e17]/80">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             );
//           })}
//         </motion.div>
//       </div>
//         <GrowthToolsCTA/>
//       {/* Footer */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.6 }}
//         className="border-t border-white/10 bg-transprent"
//       >
//         <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 text-center text-[11px]
//          text-[#0a0e17] sm:flex-row sm:px-6 sm:text-left">
//           <p>© 2024 Ash Trust Bank plc. All rights reserved. Member FDIC.</p>
//           <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
//             {footerLinks.map((link) => (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 className="font-medium uppercase cursor-progress tracking-wide text-cyan-600 hover:text-cyan-500"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }
// app/page.tsx or app/components/AshTrustHero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import AnimatedCounter from './AnimatedCounter';
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  User,
  Lock,
  ShieldCheck,
  TrendingUp,
  Globe,
} from "lucide-react";
import NavTabs from "./NavTabs";
import GrowthToolsCTA from "./GrowthToolsCTA";
import Reroutee from "@/app/components/Reroutee";

// ---- Data ---------------------------------------------------------------

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "Military-Grade Encryption",
    description:
      "End-to-end multi-layer security protocols protecting every transaction and asset.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description:
      "AI-driven insights to help you optimize your portfolio and capital allocation.",
  },
  {
    icon: Globe,
    title: "Global Connectivity",
    description:
      "Move capital across borders with zero-latency execution and real-time conversion.",
  },
];

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Security Audit", href: "#" },
  { label: "Legal", href: "#" },
];

// ---- Animation variants ---------------------------------------------------

const navVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const cardsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const cardFade: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const gridContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const gridItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ---- Component ------------------------------------------------------------

export default function AshTrustHero() {
  return (
    <>
      <section className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-cyan-100 to-gray-300 px-4 pt-9 text-[#0a0e17] sm:px-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Nav */}
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={navVariants}
            className="flex flex-wrap items-center justify-between gap-3 border-none md:flex-nowrap"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
              <Image
                src="/loadLogo_shield_smooth.png"
                alt="Shield logo"
                width={32}
                height={32}
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                priority
              />
              <span className="text-sm font-bold sm:text-base md:text-lg">
                Ash Trust <span className="text-cyan-600">Bank</span>
              </span>
              <div className="hidden md:block">
                <NavTabs />
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              <Link
                href="/Log-in"
                className="hidden text-sm text-[#0a0e17] transition hover:text-gray-600 sm:inline"
              >
                Log In
              </Link>

              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="rounded-md border border-cyan-600/30 px-3 py-1.5 text-xs font-medium text-cyan-600 shadow-sm transition hover:bg-cyan-900/10 sm:px-4 sm:py-2 sm:text-sm"
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block"
                  >
                   <Link href={'/sign-up'}>Create account</Link>
                  </motion.span>
                </motion.button>
              </Link>
            </div>
          </motion.nav>

          {/* Hero content */}
          <div className="grid grid-cols-1 gap-8 py-8 sm:gap-10 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-14">
            {/* Left column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={heroContainer}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border-none bg-white/20 px-3 py-1 text-[10px] font-medium tracking-wide text-[#0a0e17] sm:text-[11px]"
              >
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                NEXT GENERATION BANKING
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="mt-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl"
              >
                <span className="block">Modern Banking.</span>
                <span className="mt-1 block text-cyan-600">Timeless Trust</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-md text-sm leading-relaxed text-[#0a0e17]/80 sm:text-base md:max-w-lg"
              >
                Secure Intelligent Banking for Individuals and Businesses around
                the World.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 sm:w-auto"
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-block"
                  >
                    <Link href={'/sign-up'}>Get Started</Link>
                  </motion.span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full rounded-md border border-[#0a0e17]/20 px-5 py-2.5 text-sm font-semibold text-[#0a0e17] transition hover:bg-white/20 sm:w-auto"
                >
                  <Link href={'/Rates'}>View rates</Link>
                </motion.button>
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:mt-10 sm:gap-8 lg:justify-start"
              >
                <div className="flex items-center gap-4">
                  <AnimatedCounter
                    value={140}
                    suffix="+ Countries"
                    className="text-sm font-semibold text-[#0a0e17] sm:text-base"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <AnimatedCounter
                    value={24.8}
                    prefix="$"
                    suffix="B+"
                    className="text-sm font-semibold text-[#0a0e17] sm:text-base"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Right column: cards */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardsContainer}
              className="flex flex-col gap-4 sm:gap-5"
            >
              {/* Ash Trust Elite card */}
              <motion.div
                variants={cardFade}
                whileHover={{ y: -4 }}
                className="cursor-pointer rounded-2xl border-none bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-5 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 sm:text-base">
                    Ash Trust Bank <span className="text-cyan-700">Elite</span>
                  </p>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/40 text-[#0a0e17] sm:h-10 sm:w-10" />
                </div>

                <p className="mt-8 text-[10px] font-medium tracking-wide text-[#0a0e17] sm:mt-10 sm:text-[11px]">
                  @Username
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-5 w-8 rounded-sm bg-white/50 sm:h-6 sm:w-9" />
                  <span className="text-xs font-medium tracking-widest text-[#0a0e17] sm:text-sm">
                    •••• •••• •••• 8820
                  </span>
                </div>
              </motion.div>

              {/* Manage your wealth card */}
              <motion.div
                variants={cardFade}
                whileHover={{ y: -4 }}
                className="cursor-pointer rounded-2xl border border-white/10 
                bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-5 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
              >
                <h2 className="text-sm font-semibold text-[#0a0e17] sm:text-base">
                  Manage your wealth
                </h2>

                <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:gap-3">
                  <div className="flex items-center gap-2 rounded-md border border-slate-900/10 bg-white/40 px-3 py-2">
                    <User size={15} className="text-[#0a0e17]" />
                    <input
                      type="text"
                      placeholder="Username or Account ID"
                      className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-500 focus:outline-none sm:text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-slate-900/10 bg-white/40 px-3 py-2">
                    <Lock size={15} className="text-[#0a0e17]" />
                    <input
                      type="password"
                      placeholder="Passcode"
                      className="w-full bg-transparent text-xs text-[#0a0e17] placeholder:text-slate-500 focus:outline-none sm:text-sm"
                    />
                  </div>
                  <Link href="/Dashboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="mt-1 w-full rounded-md border border-cyan-700/40 bg-cyan-700/10 py-2 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-700/20 sm:py-2.5 sm:text-sm"
                    >
                     <Link href={'/Log-in'}>Secure Sign In</Link>
                    </motion.button>
                  </Link>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#0a0e17] sm:mt-4 sm:text-[11px]">
                  <Link
                    href="#"
                    className="cursor-pointer hover:text-slate-800"
                  >
                    Forgot password?
                  </Link>
                  <span>
                    <span className="pr-1">New here?</span>
                    <Link
                      href="/sign-up"
                      className="cursor-pointer font-medium text-cyan-800 hover:underline"
                    >
                      Create Account
                    </Link>
                  </span>
                </div>
              </motion.div>

              {/* Market status bar */}
              <motion.div
                variants={cardFade}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[10px] text-[#0a0e17] sm:px-4 sm:py-2.5 sm:text-[11px]"
              >
                <span className="flex items-center gap-1.5">
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  />
                  MARKET STATUS: OPEN
                </span>
                <span className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="flex items-center gap-1">
                    LUM
                    <AnimatedCounter
                      value={40.24}
                      prefix="+"
                      suffix="%"
                      className="text-[10px] text-emerald-600 sm:text-[12px]"
                    />
                  </span>
                  <span className="flex items-center gap-1">
                    BTC
                    <AnimatedCounter
                      value={82}
                      prefix="+"
                      suffix="%"
                      className="text-[10px] text-emerald-600 sm:text-[12px]"
                    />
                  </span>
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Explore Security Features */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="pb-6 text-center text-[10px] tracking-wide text-[#0a0e17]/70 sm:pb-8 sm:text-[11px]"
          >
            EXPLORE SECURITY FEATURES
          </motion.p>

          {/* Security features grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={gridContainer}
            className="grid grid-cols-1 gap-4 pb-10 sm:grid-cols-2 sm:gap-5 sm:pb-12 md:grid-cols-3 lg:pb-14"
          >
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={gridItem}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 transition-shadow hover:shadow-lg sm:p-5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/20 text-cyan-600 sm:h-9 sm:w-9">
                    <Icon size={17} strokeWidth={2} />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-[#0a0e17] sm:mt-4 sm:text-[15px]">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#0a0e17]/80 sm:text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <Reroutee/>
          <GrowthToolsCTA />
        </div>
      </section>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-none backdrop-blur-sm bg-cyan-100"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-center text-[10px]
        text-[#0a0e17] sm:flex-row sm:gap-4 sm:px-6 sm:py-5 sm:text-[11px] sm:text-left">
          <p>© 2024 Ash Trust Bank plc. All rights reserved. Member FDIC.</p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="cursor-pointer font-medium uppercase tracking-wide text-cyan-700 transition hover:text-cyan-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}