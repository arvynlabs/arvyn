"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "architecture", label: "Architecture" },
  { id: "agents", label: "Agents" },
  { id: "api", label: "API Concept" },
  { id: "sdk", label: "SDK Preview" },
  { id: "contracts", label: "Contract Model" },
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
              Explore the planned developer interface for agents, chain data, policy checks, and transaction routing.
            </p>
            <div className="mt-6 rounded-xl border border-arvyn-orange/30 bg-arvyn-orange/[0.06] p-5 text-sm leading-relaxed text-neutral-300">
              <strong className="text-white">Development status:</strong> The SDK and API described below are planned. A narrow contract prototype is available in the GitHub repository for local testing, but no ARVYN contracts are deployed. Code samples are illustrative only.
            </div>
          </Reveal>

          <div className="mt-12 space-y-14">
            <section id="introduction" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Introduction</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">
                ARVYN provides a standard execution path for on-chain agents. Agents read blockchain
                state, prepare actions, pass policy checks, and submit transactions through smart contracts.
              </p>
              <Code>{`Status: interface and contract prototype\nSDK package: not published\nPublic API: not available\nContracts: source available, not deployed`}</Code>
            </section>

            <section id="architecture" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Architecture</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-300">
                The proposed architecture moves from chain data to planning, policy checks, and guarded execution.
              </p>
              <Code>{`Perception   → blocks · events · liquidity\nIntelligence → scoring · planning · policy\nExecution    → simulate · sign · settle`}</Code>
            </section>

            <section id="agents" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Agents</h2>
              <p className="mt-3 text-[15px] text-neutral-300">The planned interface registers a typed agent with an explicit policy scope.</p>
              <Code>{`// Planned interface. Package not yet published.\nimport { Arvyn } from "@arvyn/sdk";\n\nconst agent = await Arvyn.register({\n  kind: "execution",\n  policy: { maxSpend: "500 USDC", allowlist: ["0x..."] },\n});`}</Code>
            </section>

            <section id="api" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">API Concept</h2>
              <p className="mt-3 text-[15px] text-neutral-300">The planned API will expose data, planning, and execution status over REST and WebSocket interfaces.</p>
              <Code>{`# Proposed endpoints. Not live.\nGET  /v1/market/liquidity?chain=robinhood\nPOST /v1/execute  { agent, action, params }\nWS   /v1/stream  { topics: ["market.*", "tx.*"] }`}</Code>
            </section>

            <section id="sdk" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">SDK Preview</h2>
              <p className="mt-3 text-[15px] text-neutral-300">The planned TypeScript client will support retries, simulation, and typed actions.</p>
              <Code>{`// Illustrative API. Not available on npm.\nconst tx = await arvyn.execute({\n  agent: agent.id,\n  action: "rebalance",\n  params: { pool: "USDC/ETH", target: 0.5 },\n});\nconsole.log(tx.hash);`}</Code>
            </section>

            <section id="contracts" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Contract Model</h2>
              <p className="mt-3 text-[15px] text-neutral-300">The testnet prototype routes a native ETH transfer through an agent registry and fixed policy limits. It remains undeployed and unaudited.</p>
              <Code>{`Prototype source is available. No addresses are deployed.\nArvynRouter    non-custodial execution entrypoint\nPolicyGuard    receiver and spend limits\nAgentRegistry  operator and active status`}</Code>
            </section>

            <section id="examples" className="scroll-mt-28">
              <h2 className="text-2xl font-bold">Examples</h2>
              <p className="mt-3 text-[15px] text-neutral-300">Illustrative pseudocode for monitoring a pool and preparing a rebalance.</p>
              <Code>{`// Concept only. This interface is not live.\narvyn.stream.subscribe("market.liquidity", async (event) => {\n  if (event.spread > 0.8) {\n    await arvyn.execute({ agent: agent.id, action: "rebalance" });\n  }\n});`}</Code>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
