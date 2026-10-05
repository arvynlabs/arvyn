"use client";

import { useEffect, useState } from "react";

export type AgentStatus = "active" | "settled" | "simulating" | "queued";

export type ActivityItem = {
  id: string;
  process: string;
  kind: "market" | "research" | "execution" | "strategy";
  action: string;
  status: AgentStatus;
  latency: string;
  hash: string;
  age: string;
};

const BASE_ACTIVITY: ActivityItem[] = [
  { id: "a1", process: "market-02", kind: "market", action: "liquidity scan USDC/ETH → signal 0.91", status: "settled", latency: "410ms", hash: "0x7a…f3", age: "12s" },
  { id: "a2", process: "research-07", kind: "research", action: "protocol risk score 0.12 · vault audit", status: "settled", latency: "1.2s", hash: "0x3d…9c", age: "38s" },
  { id: "a3", process: "strategy-04", kind: "strategy", action: "plan 3 steps · policy OK · rebalance", status: "active", latency: "n/a", hash: "0x91…44", age: "now" },
  { id: "a4", process: "execution-11", kind: "execution", action: "simulate swap → sign → route", status: "simulating", latency: "280ms", hash: "0xb2…71", age: "now" },
  { id: "a5", process: "market-05", kind: "market", action: "spread alert 0.84 · cross-market state", status: "settled", latency: "390ms", hash: "0x55…e0", age: "1m" },
  { id: "a6", process: "execution-03", kind: "execution", action: "settle rebalance(pool) · 2/3 steps", status: "queued", latency: "n/a", hash: "0xc8…2b", age: "1m" },
  { id: "a7", process: "research-02", kind: "research", action: "activity cluster · 1,284 events indexed", status: "settled", latency: "900ms", hash: "0x19…ad", age: "2m" },
  { id: "a8", process: "strategy-01", kind: "strategy", action: "scheduled run · DCA vault · guard OK", status: "active", latency: "n/a", hash: "0x77…6f", age: "2m" },
];

export type NetworkSnapshot = {
  activeProcesses: number;
  executions24h: number;
  successRate: number;
  avgSettleMs: number;
  blockHeight: number;
  status: "operational" | "degraded";
  throughput: number[];
};

export function useLiveNetwork(externallyPaused = false) {
  const [tick, setTick] = useState(0);
  const [locallyPaused, setPaused] = useState(false);
  const paused = locallyPaused || externallyPaused;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setTick((v) => v + 1), 2000);
    return () => clearInterval(t);
  }, [paused]);

  const wobble = (base: number, amp: number) =>
    Math.round(base + Math.sin(tick / 3) * amp + ((tick * 37) % 7) - 3);

  const snapshot: NetworkSnapshot = {
    activeProcesses: wobble(1284, 18),
    executions24h: 48210 + tick * 3,
    successRate: 99.2 + (Math.sin(tick / 5) * 0.15 + 0.15),
    avgSettleMs: wobble(840, 40),
    blockHeight: 84102 + Math.floor(tick / 2),
    status: "operational",
    throughput: Array.from({ length: 24 }, (_, i) =>
      Math.round(50 + Math.sin((i + tick) / 3) * 22 + ((i * 13 + tick * 7) % 17))
    ),
  };

  // rotate activity deterministically so it feels live without randomness
  const activity: ActivityItem[] = BASE_ACTIVITY.map((a, i) => ({
    ...a,
    age: i <= tick % 4 ? "now" : a.age,
  })).slice().sort((a, b) => (a.age === "now" ? -1 : b.age === "now" ? 1 : 0));

  return { snapshot, activity, tick, paused, setPaused };
}

export const STATUS_STYLE: Record<AgentStatus, string> = {
  active: "border-arvyn-orange/40 text-arvyn-orange",
  settled: "border-emerald-500/30 text-emerald-400",
  simulating: "border-sky-500/30 text-sky-400",
  queued: "border-white/15 text-neutral-400",
};
