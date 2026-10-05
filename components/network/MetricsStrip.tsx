"use client";

import { useLiveNetwork } from "@/lib/network";

export default function MetricsStrip() {
  const { snapshot } = useLiveNetwork();
  const items = [
    [`${snapshot.activeProcesses.toLocaleString("en-US")}`, "active processes"],
    [snapshot.executions24h.toLocaleString("en-US"), "executions / 24h"],
    [`${snapshot.successRate.toFixed(2)}%`, "settle success"],
    [`${(snapshot.avgSettleMs / 1000).toFixed(2)}s`, "median settle"],
  ];
  return (
    <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-xl border border-white/[0.08] bg-black/40 font-mono backdrop-blur md:grid-cols-4">
      {items.map(([v, l], i) => (
        <div key={l} className={`px-5 py-4 ${i > 0 ? "border-l border-white/[0.07]" : ""} ${i >= 2 ? "max-md:border-t max-md:border-white/[0.07] max-md:[&:nth-child(3)]:border-l-0" : ""}`}>
          <p className="text-[17px] font-semibold text-white">
            {v} <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" />
          </p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-neutral-500">{l}</p>
        </div>
      ))}
    </div>
  );
}
