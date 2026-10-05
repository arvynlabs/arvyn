"use client";

import { STATUS_STYLE, useLiveNetwork } from "@/lib/network";

export default function ActivityFeed({ compact = false, paused = false }: { compact?: boolean; paused?: boolean }) {
  const { activity, snapshot } = useLiveNetwork(paused);
  const rows = compact ? activity.slice(0, 5) : activity;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/50">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
          Recent process activity
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          TESTNET LIVE · block {snapshot.blockHeight.toLocaleString("en-US")}
        </span>
      </div>
      {rows.map((a, i) => (
        <div
          key={a.id}
          className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3.5 font-mono text-[12.5px] ${i % 2 ? "bg-white/[0.015]" : ""} border-b border-white/[0.06] last:border-0`}
        >
          <span className="text-white">{a.process}</span>
          <span className="rounded border border-white/10 px-1.5 py-px text-[10.5px] text-neutral-400">{a.kind}</span>
          <span className="w-full truncate text-neutral-500 sm:w-auto sm:max-w-[320px]">· {a.action}</span>
          <span className="ml-auto flex items-center gap-2.5">
            <span className="hidden text-neutral-600 md:inline">{a.hash} · {a.latency}</span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${STATUS_STYLE[a.status]}`}>{a.status}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
