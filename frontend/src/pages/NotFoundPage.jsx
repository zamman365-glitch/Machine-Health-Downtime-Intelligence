import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-8 shadow-xl space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          404 - Page Not Found
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          The requested page URL does not exist or has been moved.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
