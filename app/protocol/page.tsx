import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { CTA } from "@/components/CTA";

export const metadata = { title: "Protocol | ARVYN" };

const LAYERS = [
  {
    n: "01",
    title: "Agent Runtime",
    text: "A planned framework for verifiable execution processes to read state and settle actions on-chain.",
    bullets: ["Standard process interface & identity", "Tool registry for dApp actions", "Policy engine with spend limits & allowlists"],
    code: ["agent = Arvyn.register({", '  kind: "execution",', '  policy: "guarded",', "});"],
  },
  {
    n: "02",
    title: "Execution Layer",
    text: "A proposed transaction path between machine processes and smart contracts.",
    bullets: ["Pre-flight simulation & revert checks", "Deterministic signing & nonce management", "Receipts with full audit trail"],
    code: ["await arvyn.execute({", '  agent: agent.id,', '  action: "swap(usdc→eth)",', "});"],
  },
  {
    n: "03",
    title: "Data Layer",
    text: "A planned data layer for blockchain state and analytics.",
    bullets: ["Indexed blocks, events & liquidity state", "Streaming feeds over WebSocket", "Feature store for model inference"],
    code: ["arvyn.stream.subscribe(", '  "market.liquidity",', "  handler", ");"],
  },
];

export default function ProtocolPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-[128px] md:pt-[160px]">
        <div className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow"><span className="inline-block h-px w-6 bg-arvyn-orange" /> Protocol</p>
            <h1 className="mt-4 max-w-[760px] text-4xl font-bold tracking-tight md:text-6xl">
              A secure path from signal to settlement.
            </h1>
            <p className="mt-5 max-w-[580px] text-[16px] leading-relaxed text-arvyn-muted">
              Runtime, execution, and data services give agents the tools they need to move from
              a validated signal to an on-chain receipt.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-16">
        <div className="shell space-y-5">
          {LAYERS.map((l, i) => (
            <Reveal key={l.n} delay={i * 0.04}>
              <div className="card grid gap-8 p-8 md:grid-cols-2 md:p-10">
                <div>
                  <p className="font-mono text-[12px] text-arvyn-orange">{l.n}</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{l.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-arvyn-muted">{l.text}</p>
                  <ul className="mt-6 space-y-2.5">
                    {l.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-sm text-neutral-200">
                        <span className="h-1 w-1 rounded-full bg-arvyn-orange" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="code-block self-center p-6">
                  {l.code.map((line) => (
                    <p key={line} className="text-neutral-300">{line}</p>
                  ))}
                  <p className="mt-3 font-mono text-[12px] text-neutral-600"># interface preview · not live</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#0a0a0a] py-16">
        <div className="shell">
          <SectionHeading eyebrow="Security" title="Guarded by default." text="Every execution passes simulation, policy checks, and scoped signing. No raw keys in agent code." />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[["Simulate", "Dry-run every call against current state."], ["Constrain", "Allowances, allowlists, rate limits."], ["Verify", "Receipts, traces and replay."]].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="card p-6"><p className="text-[15px] font-semibold">{t}</p><p className="mt-1.5 text-sm text-arvyn-muted">{d}</p></div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <Link href="/docs#contracts" className="btn-primary">Contract model →</Link>
            <Link href="/docs#api" className="btn-secondary">API concept</Link>
          </div>
        </div>
      </section>

      <div className="pt-16"><CTA /></div>
    </>
  );
}
