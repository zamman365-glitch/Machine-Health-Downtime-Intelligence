import React from "react";
import { AlertTriangle, DollarSign, Gauge, History, Activity, Database } from "lucide-react";
import { FEATURES } from "../../data/landingContent";

const iconMap = {
  AlertTriangle: AlertTriangle,
  DollarSign: DollarSign,
  Gauge: Gauge,
  History: History,
  Activity: Activity,
  Database: Database,
};

export function FeaturesGrid() {
  return (
    <section id="features" className="py-16 md:py-24 bg-slate-100/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Engineered for Production Reliability
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat) => {
            const IconComp = iconMap[feat.icon] || Activity;
            return (
              <div
                key={feat.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
