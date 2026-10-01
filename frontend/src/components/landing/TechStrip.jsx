import React from "react";
import { TECH_STACK } from "../../data/landingContent";

export function TechStrip() {
  return (
    <section className="py-8 border-y border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Powered By Verified Industrial Architecture
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
          {TECH_STACK.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center justify-center p-2">
              <span className="font-extrabold text-base text-slate-800 dark:text-slate-200">
                {tech.name}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {tech.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
