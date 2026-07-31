import { ArrowRight, User, Lock, Volume2 } from "lucide-react";
import NavTabs from "@/app/components/NavTabs"

export default function LuminaBankHero1() {
  return (
    <section className="w-full bg-slate-100 px-6 py-6 text-[#0a0e17]">
      <div className="mx-auto max-w-6xl">
        {/* Nav */}
        <nav className="flex items-center justify-between border-b border-white/5 pb-5">
          <div className="flex items-center gap-10">
            <span className="text-lg font-bold">
              Lumina <span className="text-cyan-400">Bank</span>
            </span>
            <NavTabs className="w-full p-9 h-auto"/>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-slate-300 hover:text-white">
              Log In
            </a>
            <button
              type="button"
              className="rounded-md border border-cyan-400 px-4 py-1.5 text-sm font-medium text-cyan-400 transition hover:bg-cyan-400/10"
            >
              Open Account
            </button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="grid grid-cols-1 gap-12 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              NEXT GENERATION BANKING
            </span>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Institutional-Grade
              <br />
              <span className="text-cyan-400">Finance for the Modern World</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
              Experience the precision of elite institutional tools combined
              with the agility of modern digital banking. Secure, seamless,
              and engineered for the high-net-worth future.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 rounded-md bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300"
              >
                Get Started
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                View Rates
              </button>
            </div>

            <div className="mt-12 flex gap-12">
              <div>
                <p className="text-[11px] tracking-wide text-slate-500">
                  ASSETS SECURED
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  $24.8B+
                </p>
              </div>
              <div>
                <p className="text-[11px] tracking-wide text-slate-500">
                  GLOBAL REACH
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  140+ Countries
                </p>
              </div>
            </div>
          </div>

          {/* Right column: cards */}
          <div className="flex flex-col gap-5">
            {/* Lumina Elite card — gradient background */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-slate-900">
                  Lumina <span className="text-cyan-700">Elite</span>
                </p>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/40 text-slate-800">
                  <Volume2 size={16} />
                </span>
              </div>

              <p className="mt-10 text-[11px] font-medium tracking-wide text-slate-700">
                ALEX THOMPSON
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-6 w-9 rounded-sm bg-white/50" />
                <span className="text-sm font-medium tracking-widest text-slate-800">
                  •••• •••• •••• 8820
                </span>
              </div>
            </div>

            {/* Manage your wealth card — gradient background */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-200 via-cyan-200 to-purple-200 p-6 shadow-lg">
              <h2 className="text-base font-semibold text-slate-900">
                Manage your wealth
              </h2>

              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 rounded-md border border-slate-900/10 bg-white/40 px-3 py-2.5">
                  <User size={15} className="text-slate-600" />
                  <input
                    type="text"
                    placeholder="Username or Account ID"
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-md border border-slate-900/10 bg-white/40 px-3 py-2.5">
                  <Lock size={15} className="text-slate-600" />
                  <input
                    type="password"
                    placeholder="Passcode"
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  className="mt-1 rounded-md border border-cyan-700/40 bg-cyan-700/10 py-2.5 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-700/20"
                >
                  Secure Sign In
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-600">
                <a href="#" className="underline hover:text-slate-800">
                  Forgot password?
                </a>
                <span>
                  New here?{" "}
                  <a href="#" className="font-medium text-cyan-800 hover:underline">
                    Create Account
                  </a>
                </span>
              </div>
            </div>

            {/* Market status bar */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                MARKET STATUS: OPEN
              </span>
              <span className="flex gap-3">
                <span>
                  LUM <span className="text-emerald-400">+1.24%</span>
                </span>
                <span>
                  BTC <span className="text-emerald-400">+0.82%</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        <p className="pb-4 text-center text-[11px] tracking-wide text-slate-500">
          EXPLORE SECURITY FEATURES
        </p>
      </div>
    </section>
  );
}
