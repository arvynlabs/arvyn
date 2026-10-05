import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { CTA } from "@/components/CTA";
import { AGENT_TYPES } from "@/lib/site";
import EcosystemVisual from "@/components/network/EcosystemVisual";
import ExecutionTrace from "@/components/network/ExecutionTrace";
import ActivityFeed from "@/components/network/ActivityFeed";

const STEPS = [
  {
    n: "01",
    name: "PERCEPTION",
    text: "Processes collect and resolve on-chain data.",
    detail: "Mempool, state, liquidity and event streams normalized into a single agent-readable context.",
  },
  {
    n: "02",
    name: "INTELLIGENCE",
    text: "Models analyze information and create strategies.",
    detail: "Scoring, forecasting and policy checks turn raw data into executable plans.",
  },
  {
    n: "03",
    name: "EXECUTION",
    text: "Processes perform actions through smart contracts.",
    detail: "Guarded routers submit, simulate and settle transactions with full audit trails.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* What is ARVYN */}
      <section className="border-t border-white/[0.06] py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="What is ARVYN"
            title="Execution infrastructure for machine processes."
            text="ARVYN provides the infrastructure for verifiable execution processes to read blockchain state, reason over it, and settle actions on-chain."
          />
          <div>
            <Reveal>
              <p className="rounded-xl border border-white/10 bg-black/40 p-5 font-mono text-[13.5px] leading-relaxed text-neutral-300">
                ARVYN is not a chatbot. It is deterministic infrastructure that converts
                machine intelligence into policy-guarded blockchain settlement.
              </p>
            </Reveal>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "analyze market data",
                "monitor blockchain activity",
                "interact with applications",
                "automate complex workflows",
                "coordinate with other processes",
              ].map((t, i) => (
                <Reveal key={t} delay={i * 0.05}>
                  <div className="card flex items-center gap-3 p-4 text-[14px] text-neutral-200 transition hover:border-white/20">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-arvyn-orange/15 font-mono text-[12px] text-arvyn-orange">✓</span>
                    {t}
                  </div>
                </Reveal>
              ))}
              <Reveal delay={0.25}>
                <Link href="/agents" className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/15 p-4 text-sm font-semibold text-neutral-300 transition hover:border-arvyn-orange/60 hover:text-white">
                  Explore agents →
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="shell">
          <SectionHeading
            eyebrow="How it works"
            title="Perceive. Reason. Execute."
            text="A three-stage pipeline from raw chain data to settled transactions."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="card group h-full p-7 transition hover:border-white/20">
                  <p className="font-mono text-[12px] text-arvyn-orange">{s.n}</p>
                  <h3 className="mt-3 text-xl font-bold tracking-tight">{s.name}</h3>
                  <p className="mt-2 text-[15px] font-medium text-white">{s.text}</p>
                  <p className="mt-2 text-sm leading-relaxed text-arvyn-muted">{s.detail}</p>
                  <div className="mt-6 h-px w-full bg-white/[0.07]">
                    <div className="h-px w-1/3 bg-arvyn-orange transition-all group-hover:w-2/3" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Network */}
      <section className="border-t border-white/[0.06] py-20 md:py-28">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Agent Network"
              title="Four specialized process classes."
              text="Each class is a narrow, auditable execution process — composed into strategies, never a black box."
            />
            <Reveal>
              <Link href="/agents" className="btn-secondary !py-2.5 text-[13px]">View all agents →</Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AGENT_TYPES.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <div className="card h-full p-6 transition hover:-translate-y-1 hover:border-white/20">
                  <p className="font-mono text-[10.5px] tracking-[0.18em] text-arvyn-orange">{a.tag}</p>
                  <h3 className="mt-2 text-[17px] font-bold">{a.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-arvyn-muted">{a.description}</p>
                  <div className="mt-5 border-t border-white/[0.07] pt-4">
                    <p className="font-mono text-[11px] text-neutral-500">arvyn/{a.id} · active</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Robinhood Chain */}
      <section className="border-t border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="shell grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Execution layer"
              title="Built on Robinhood Chain."
              text="ARVYN uses Robinhood Chain as the execution layer for fast, accessible and scalable AI-powered financial applications."
            />
            <div className="mt-8 space-y-3">
              {[
                { t: "Low friction transactions", d: "Process operations settle quickly with minimal overhead." },
                { t: "Transparent execution", d: "Every action is simulatable, signed, and verifiable on-chain." },
                { t: "Open ecosystem", d: "Any application can expose actions for processes to compose." },
              ].map((r, i) => (
                <Reveal key={r.t} delay={i * 0.06}>
                  <div className="flex gap-4 rounded-xl border border-white/[0.08] bg-arvyn-panel/60 p-5">
                    <span className="font-mono text-[13px] text-arvyn-orange">0{i + 1}</span>
                    <div>
                      <p className="text-[15px] font-semibold text-white">{r.t}</p>
                      <p className="mt-1 text-sm text-arvyn-muted">{r.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1}>
            <ExecutionTrace />
            <div className="mt-5 flex gap-3">
              <Link href="/app" className="btn-primary !px-4 !py-2 text-[13px]">Open live dashboard →</Link>
              <Link href="/docs" className="btn-secondary !px-4 !py-2 text-[13px]">SDK →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ecosystem visualization */}
      <section className="border-t border-white/[0.06] py-20 md:py-28">
        <div className="shell">
          <SectionHeading
            eyebrow="Ecosystem"
            title="From operator intent to on-chain settlement."
            text="Every run follows the same verifiable path — intent, machine processes, protocol routing, settlement."
          />
          <Reveal className="mt-12">
            <EcosystemVisual />
          </Reveal>
          <Reveal delay={0.1} className="mt-4">
            <div className="flex flex-wrap gap-3">
              <Link href="/ecosystem" className="btn-secondary !py-2.5 text-[13px]">Ecosystem map →</Link>
              <Link href="/app" className="btn-secondary !py-2.5 text-[13px]">Watch it live →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Live network activity */}
      <section className="border-t border-white/[0.06] bg-[#0a0a0a] py-20 md:py-28">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Network status · live"
              title="The network, right now."
              text="Process statuses, execution traces and settlement activity — as the dashboard sees it."
            />
            <Reveal>
              <Link href="/app" className="btn-primary !py-2.5 text-[13px]">Open dashboard →</Link>
            </Reveal>
          </div>
          <Reveal className="mt-12">
            <ActivityFeed compact />
          </Reveal>
        </div>
      </section>

      <div className="pt-20">
        <CTA />
      </div>
    </>
  );
}
