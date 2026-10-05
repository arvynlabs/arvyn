"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "architecture", label: "Architecture" },
  { id: "agents", label: "Agents" },
  { id: "api", label: "API" },
  { id: "sdk", label: "SDK" },
  { id: "contracts", label: "Smart Contracts" },
  { id: "examples", label: "Examples" },
];

function Code({ children }: { children: string }) {
  return (
    <pre className="code-block overflow-x-auto p-5">
      <code>{children}</code>
    </pre>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState("introduction");

  return (
    <section className="pb-20 pt-[104px] md:pt-[120px]">
      <div className="shell grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="card hidden p-3 lg:block">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActive(s.id)}
                className={`block rounded-lg px-3.5 py-2.5 text-sm transition ${
                  active === s.id ? "bg-white/[0.07] text-white" : "text-neutral-400 hover:text-white"
                }`}
              >
                {s.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto lg:hidden">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setActive(s.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[13px] ${active === s.id ? "border-arvyn-orange/50 text-white" : "border-white/10 text-neutral-400"}`}>
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        <div className="max-w-[760px]">
          <Reveal>
            <p className="eyebrow">Documentation</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Build on ARVYN.</h1>
            <p className="mt-4 text-[15.5px] leading-relaxed text-arvyn-muted">
              Everything you need to register agents, stream chain data, and route execution on Robinhood Chain.
            </p>
          </Reveal>

          <div className="mt-12 space-y-14">
            <section id="introduction" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Introduction</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">
                ARVYN is an intelligence layer for AI agents on-chain. It standardizes how agents
                perceive blockchain state, reason over it, and execute through smart contracts —
                with policy guards at every step.
              </p>
              <Code>{`npm install @arvyn/sdk\n# → connect in 3 lines`}</Code>
            </section>

            <section id="architecture" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Architecture</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">
                Perception ingests chain data → Intelligence plans → Execution settles via guarded routers.
              </p>
              <Code>{`Perception   → blocks · events · liquidity\nIntelligence → scoring · planning · policy\nExecution    → simulate · sign · settle`}</Code>
            </section>

            <section id="agents" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Agents</h2>
              <p className="mt-3 text-[15px] text-neutral-300">Register a typed agent with an explicit policy scope.</p>
              <Code>{`import { Arvyn } from "@arvyn/sdk";\n\nconst agent = await Arvyn.register({\n  kind: "execution",\n  policy: { maxSpend: "500 USDC", allowlist: ["0x..."] },\n});`}</Code>
            </section>

            <section id="api" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">API</h2>
              <p className="mt-3 text-[15px] text-neutral-300">REST + WebSocket for data, planning, and execution status.</p>
              <Code>{`GET  /v1/market/liquidity?chain=robinhood\nPOST /v1/execute  { agent, action, params }\nWS   /v1/stream  { topics: ["market.*", "tx.*"] }`}</Code>
            </section>

            <section id="sdk" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">SDK</h2>
              <p className="mt-3 text-[15px] text-neutral-300">TypeScript-first client with retries, simulation, and typed actions.</p>
              <Code>{`const tx = await arvyn.execute({\n  agent: agent.id,\n  action: "rebalance",\n  params: { pool: "USDC/ETH", target: 0.5 },\n});\nconsole.log(tx.hash); // 0x7a…f3`}</Code>
            </section>

            <section id="contracts" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Smart Contracts</h2>
              <p className="mt-3 text-[15px] text-neutral-300">Audited routers mediate every agent call. Agents never hold raw authority beyond their allowance.</p>
              <Code>{`ArvynRouter   0x… (execution entrypoint)\nPolicyGuard  0x… (allowances + limits)\nAgentRegistry 0x… (identity + metadata)`}</Code>
            </section>

            <section id="examples" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Examples</h2>
              <p className="mt-3 text-[15px] text-neutral-300">Monitor a pool and rebalance when liquidity shifts.</p>
              <Code>{`arvyn.stream.subscribe("market.liquidity", async (e) => {\n  if (e.spread > 0.8) {\n    await arvyn.execute({ agent: agent.id, action: "rebalance" });\n  }\n});`}</Code>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
