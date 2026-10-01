import React from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      {/* Final CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-center space-y-6 shadow-2xl shadow-blue-500/20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Ready to Prevent Unplanned Machine Failures?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Launch the interactive predictor dashboard to test sensor parameter inputs and receive instant failure risk probabilities.
          </p>
          <div>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-blue-600 hover:bg-slate-100 font-extrabold text-sm rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span>Launch Predictor Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200">Machine Health Intelligence</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Code2 className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
          <span>•</span>
          <span>Built with FastAPI, scikit-learn &amp; React</span>
        </div>
      </div>
    </footer>
  );
}
