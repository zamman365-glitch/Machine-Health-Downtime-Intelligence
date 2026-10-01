import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, X, ArrowRight } from "lucide-react";
import { ApiStatusPill } from "./ApiStatusPill";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Navbar component for main navigation header
 */
export function Navbar({ isOnline, isChecking, theme, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isPredictPage = location.pathname === "/predict";

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-50/80 dark:bg-[#0b0f19]/80 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
              Machine Health
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
              AI Dashboard
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              location.pathname === "/"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            How it works
          </a>
          <a
            href="/#features"
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Features
          </a>
          <Link
            to="/predict"
            className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              isPredictPage
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Predictor
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-3">
          <ApiStatusPill isOnline={isOnline} isChecking={isChecking} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {!isPredictPage && (
            <Link
              to="/predict"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>Try the Predictor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <ApiStatusPill isOnline={isOnline} isChecking={isChecking} />
          </div>

          <nav className="flex flex-col gap-2 font-medium text-sm">
            <Link
              to="/"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <a
              href="/#how-it-works"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              How it works
            </a>
            <a
              href="/#features"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Features
            </a>
            <Link
              to="/predict"
              onClick={closeMenu}
              className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Predictor Dashboard
            </Link>
          </nav>

          <Link
            to="/predict"
            onClick={closeMenu}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-md"
          >
            <span>Try the Predictor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
