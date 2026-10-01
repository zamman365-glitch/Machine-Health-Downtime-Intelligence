import React from "react";
import { HOW_IT_WORKS_STEPS } from "../../data/landingContent";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            System Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            How The Machine Health Platform Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((stepItem, idx) => (
            <div
              key={stepItem.step}
              className="relative p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3"
            >
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {stepItem.step}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {stepItem.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {stepItem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
