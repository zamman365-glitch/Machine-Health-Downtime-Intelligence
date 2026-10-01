import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PROBLEM_SOLUTION } from "../../data/landingContent";

export function ProblemSolution() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {PROBLEM_SOLUTION.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            {PROBLEM_SOLUTION.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Card */}
          <div className="p-8 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {PROBLEM_SOLUTION.problem.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {PROBLEM_SOLUTION.problem.description}
            </p>
          </div>

          {/* Solution Card */}
          <div className="p-8 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {PROBLEM_SOLUTION.solution.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {PROBLEM_SOLUTION.solution.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
