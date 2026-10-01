import React from "react";
import { Sliders, Cpu, ArrowRight } from "lucide-react";
import { MODEL_DATA_SPECS } from "../../data/landingContent";

export function ModelDataSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {MODEL_DATA_SPECS.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            {MODEL_DATA_SPECS.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {MODEL_DATA_SPECS.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Model Features &amp; Sensor Inputs
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {MODEL_DATA_SPECS.inputs.map((inp) => (
                <div
                  key={inp.name}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 space-y-1"
                >
                  <div className="flex justify-between items-center font-bold text-slate-800 dark:text-slate-200">
                    <span>{inp.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{inp.unit}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{inp.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Derived Physical Features (Engineered Client/Server Side)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {MODEL_DATA_SPECS.derived.map((d) => (
                  <div
                    key={d.name}
                    className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40"
                  >
                    <span className="font-bold text-blue-600 dark:text-blue-400 block text-[11px]">
                      {d.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {d.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Outputs & Architecture Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Model Pipeline &amp; Targets
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {MODEL_DATA_SPECS.outputs.map((out) => (
                <div
                  key={out.name}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 space-y-1"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">
                    {out.name}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">{out.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <span className="font-bold text-blue-400 block uppercase tracking-wider text-[10px]">
                scikit-learn Artifact Pipelines
              </span>
              <p className="text-slate-300 leading-relaxed">
                Loaded once at FastAPI startup: <code>failure_model.pkl</code>, <code>cost_model.pkl</code>, <code>classification_scaler.pkl</code>, <code>regression_scaler.pkl</code>, and <code>type_encoder.pkl</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
