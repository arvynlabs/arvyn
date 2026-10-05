"use client";

import Reveal from "../Reveal";

/**
 * Minimal ecosystem visualization: intent → processes → protocol → chain → apps.
 * Pure SVG + CSS dash animation. No glow, no gradients.
 */
const NODES = [
  { t: "Operator intent", d: "goals · constraints · budget", tag: "INPUT" },
  { t: "Execution processes", d: "market · research · strategy", tag: "MACHINE" },
  { t: "ARVYN Protocol", d: "runtime · routing · data", tag: "COORDINATION", hot: true },
  { t: "Robinhood Chain", d: "settlement · receipts", tag: "SETTLEMENT" },
  { t: "On-chain Applications", d: "dex · lending · vaults", tag: "DESTINATION" },
];

export default function EcosystemVisual() {
  return (
    <div className="card overflow-hidden p-6 md:p-10">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">Ecosystem flow · planned topology</p>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 5 planned stages
        </span>
      </div>

      {/* desktop: horizontal chain */}
      <div className="mt-8 hidden items-stretch gap-0 md:flex">
        {NODES.map((n, i) => (
          <div key={n.t} className="flex flex-1 items-center last:flex-none">
            <Reveal delay={i * 0.06} className="w-full">
              <div className={`rounded-xl border px-4 py-5 text-center transition ${n.hot ? "border-arvyn-orange/40 bg-arvyn-orange/[0.06]" : "border-white/10 bg-black/40"}`}>
                <p className={`font-mono text-[10px] tracking-[0.18em] ${n.hot ? "text-arvyn-orange" : "text-neutral-500"}`}>{n.tag}</p>
                <p className="mt-1.5 text-[13.5px] font-bold leading-tight text-white">{n.t}</p>
                <p className="mt-1 font-mono text-[10.5px] text-neutral-500">{n.d}</p>
              </div>
            </Reveal>
            {i < NODES.length - 1 && (
              <svg width="48" height="12" viewBox="0 0 48 12" className="mx-1 shrink-0" aria-hidden>
                <line x1="0" y1="6" x2="40" y2="6" stroke="#FF5A00" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="5 4">
                  <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite" />
                </line>
                <path d="M40 2l7 4-7 4" fill="none" stroke="#FF5A00" strokeOpacity="0.6" strokeWidth="1.5" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* mobile: vertical chain */}
      <div className="mt-8 md:hidden">
        {NODES.map((n, i) => (
          <div key={n.t}>
            <div className={`rounded-xl border px-4 py-4 text-center ${n.hot ? "border-arvyn-orange/40 bg-arvyn-orange/[0.06]" : "border-white/10 bg-black/40"}`}>
              <p className={`font-mono text-[10px] tracking-[0.18em] ${n.hot ? "text-arvyn-orange" : "text-neutral-500"}`}>{n.tag}</p>
              <p className="mt-1 text-[14px] font-bold text-white">{n.t}</p>
              <p className="mt-0.5 font-mono text-[10.5px] text-neutral-500">{n.d}</p>
            </div>
            {i < NODES.length - 1 && (
              <div className="flex justify-center py-1" aria-hidden>
                <div className="h-5 w-px bg-arvyn-orange/60" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 border-t border-white/[0.07] pt-6 font-mono text-[11.5px] text-neutral-500 sm:grid-cols-3">
        <span>◷ sample route <strong className="text-white">0.84s</strong></span>
        <span>✓ sample success <strong className="text-emerald-400">99.2%</strong></span>
        <span>⏺ demo processes <strong className="text-white">1,284</strong></span>
      </div>
    </div>
  );
}
