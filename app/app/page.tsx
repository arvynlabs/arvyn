"use client";

import Link from "next/link";
import { STATUS_STYLE, useDemoNetwork } from "@/lib/network";
import ExecutionTrace from "@/components/network/ExecutionTrace";
import ActivityFeed from "@/components/network/ActivityFeed";

const FLEET = [
  { name: "market-02", kind: "market", last: "liquidity scan → signal", status: "settled", uptime: "99.9%" },
  { name: "research-07", kind: "research", last: "risk score 0.12", status: "settled", uptime: "99.7%" },
  { name: "strategy-04", kind: "strategy", last: "rebalance plan · 3 steps", status: "active", uptime: "99.8%" },
  { name: "execution-11", kind: "execution", last: "simulate → sign", status: "simulating", uptime: "99.5%" },
  { name: "execution-03", kind: "execution", last: "queued · guard OK", status: "queued", uptime: "99.6%" },
] as const;

export default function AppDashboard() {
  const { snapshot, paused, setPaused } = useDemoNetwork();
  const max = Math.max(...snapshot.throughput);
  const points = snapshot.throughput
    .map((v, i) => `${(i / (snapshot.throughput.length - 1)) * 100},${34 - (v / max) * 30}`)
    .join(" ");

  const cards = [
    ["Demo processes", snapshot.activeProcesses.toLocaleString("en-US"), "generated locally"],
    ["Sample executions", snapshot.executions24h.toLocaleString("en-US"), "interface preview"],
    ["Sample success", `${snapshot.successRate.toFixed(2)}%`, "illustrative metric"],
    ["Sample settle", `${(snapshot.avgSettleMs / 1000).toFixed(2)}s`, "illustrative metric"],
  ];

  return (
    <section className="pb-20 pt-[104px] md:pt-[120px]">
      <div className="shell">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="eyebrow">ARVYN App · interface preview</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Execution dashboard demo.</h1>
            <p className="mt-3 max-w-[620px] text-sm leading-relaxed text-arvyn-muted">
              This page uses generated sample data to demonstrate the planned ARVYN interface. It is not live network telemetry.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 px-3 py-1.5 font-mono text-[11.5px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> demo telemetry · #{snapshot.blockHeight.toLocaleString("en-US")}
            </span>
            <button onClick={() => setPaused(!paused)} className="btn-secondary !px-4 !py-2 text-[12.5px]">
              {paused ? "Resume demo" : "Pause demo"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([l, v, s]) => (
            <div key={l} className="card p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">{l}</p>
              <p className="mt-1.5 text-[26px] font-bold tracking-tight">{v}</p>
              <p className="mt-1 font-mono text-[11.5px] text-neutral-500">{s}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">Execution throughput · simulated</p>
              <p className="font-mono text-[11px] text-neutral-600">tx / min</p>
            </div>
            <svg viewBox="0 0 100 36" className="mt-4 h-[140px] w-full" preserveAspectRatio="none" aria-hidden>
              <polyline points={points} fill="none" stroke="#FF5A00" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {snapshot.throughput.map((v, i) => (
                <circle key={i} cx={(i / (snapshot.throughput.length - 1)) * 100} cy={34 - (v / max) * 30} r="1.1" fill={i === snapshot.throughput.length - 1 ? "#FF5A00" : "#3a3a3a"} />
              ))}
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[10.5px] text-neutral-600">
              <span>-24m</span><span>-12m</span><span>now</span>
            </div>
          </div>
          <ExecutionTrace />
        </div>

        <div className="mt-4 card overflow-hidden">
          <p className="border-b border-white/[0.08] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
            Process fleet · status
          </p>
          <div className="hidden grid-cols-[1fr_110px_1fr_130px_90px] gap-3 border-b border-white/[0.06] px-6 py-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-neutral-600 md:grid">
            <span>Process</span><span>Class</span><span>Last action</span><span>Status</span><span className="text-right">Uptime</span>
          </div>
          {FLEET.map((f, i) => (
            <div key={f.name} className={`grid gap-1.5 px-6 py-4 font-mono text-[12.5px] md:grid-cols-[1fr_110px_1fr_130px_90px] md:items-center md:gap-3 ${i % 2 ? "bg-white/[0.015]" : ""} border-b border-white/[0.06] last:border-0`}>
              <span className="text-white">{f.name}</span>
              <span className="text-neutral-500">{f.kind}</span>
              <span className="truncate text-neutral-400">{f.last}</span>
              <span><span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${STATUS_STYLE[f.status as keyof typeof STATUS_STYLE]}`}>{f.status}</span></span>
              <span className="text-neutral-500 md:text-right">{f.uptime}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <ActivityFeed paused={paused} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/testnet" className="btn-primary">Open live testnet →</Link>
          <Link href="/docs#sdk" className="btn-secondary">View planned SDK</Link>
          <Link href="/protocol" className="btn-secondary">Protocol spec</Link>
        </div>
      </div>
    </section>
  );
}
