import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ShieldCheck, Zap } from "lucide-react";
import { HERO_CONTENT } from "../../data/landingContent";
import { RiskGauge } from "../RiskGauge";
import { formatCurrency } from "../../utils/format";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle CSS Grid Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 dark:opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{HERO_CONTENT.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
              Predict Machine Failures{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Before They Cause Downtime
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {HERO_CONTENT.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/predict"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{HERO_CONTENT.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
              >
                <span>{HERO_CONTENT.secondaryCta}</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Proof Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero Installation Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Parallel Model Execution</span>
              </div>
            </div>
          </div>

          {/* Right Product Preview Mock */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md p-6 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl shadow-blue-500/10 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live Preview Mock
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Healthy Operation
                </span>
              </div>

              {/* Gauge & Verdict */}
              <div className="flex flex-col items-center">
                <RiskGauge percentage={12.4} color="#10b981" />
                <span className="mt-2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Low Risk (12.4%)
                </span>
                <span className="text-xs font-semibold text-emerald-500 mt-2">
                  No failure predicted
                </span>
              </div>

              {/* Cost Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Est. Maintenance Cost
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                    {formatCurrency(1037.95)}
                  </span>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400">
                  INR (en-IN)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
