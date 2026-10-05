import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { CTA } from "@/components/CTA";
import { AGENT_TYPES } from "@/lib/site";

export const metadata = { title: "Agents — ARVYN" };

export default function AgentsPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-[128px] md:pt-[160px]">
        <div className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow"><span className="inline-block h-px w-6 bg-arvyn-orange" /> Agents</p>
            <h1 className="mt-4 max-w-[720px] text-4xl font-bold tracking-tight md:text-6xl">
              Verifiable processes, production-grade.
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] leading-relaxed text-arvyn-muted">
              Four process classes cover the full settlement lifecycle: sense markets, research protocols,
              route execution, and compose strategies — all coordinated through ARVYN.
            </p>
            <div className="mt-7 flex gap-3">
              <Link href="/docs#agents" className="btn-primary">Build an agent →</Link>
              <Link href="/protocol" className="btn-secondary">How runtime works</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-16 md:py-20">
        <div className="shell grid gap-5 md:grid-cols-2">
          {AGENT_TYPES.map((a, i) => (
            <Reveal key={a.id} delay={(i % 2) * 0.07}>
              <div className="card h-full p-8 transition hover:border-white/20">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-arvyn-orange">{a.tag}</p>
                  <p className="font-mono text-[11px] text-neutral-600">arvyn/{a.id}</p>
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight">{a.name}</h2>
                <p className="mt-2 text-[15px] text-arvyn-muted">{a.description}</p>
                <ul className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-6">
                  {a.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-neutral-200">
                      <span className="h-1 w-1 rounded-full bg-arvyn-orange" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#0a0a0a] py-16 md:py-20">
        <div className="shell">
          <SectionHeading eyebrow="Coordination" title="Processes that compose." text="Strategy processes compose market, research and execution processes into multi-step workflows with shared state and policy guards." />
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            {[
              ["Market Agent", "liquidity scan → signal", "done"],
              ["Research Agent", "protocol risk score 0.12", "done"],
              ["Strategy Agent", "plan: 3 steps · policy OK", "active"],
              ["Execution Agent", "tx queued → simulate", "pending"],
            ].map(([a, b, s], i) => (
              <Reveal key={a} delay={i * 0.05}>
                <div className={`flex flex-wrap items-center gap-3 px-6 py-4 font-mono text-[12.5px] ${i % 2 ? "bg-white/[0.015]" : ""} border-b border-white/[0.06] last:border-0`}>
                  <span className="text-white">{a}</span>
                  <span className="text-neutral-500">· {b}</span>
                  <span className={`ml-auto rounded-full border px-2.5 py-0.5 text-[11px] ${s === "active" ? "border-arvyn-orange/40 text-arvyn-orange" : s === "done" ? "border-emerald-500/30 text-emerald-400" : "border-white/15 text-neutral-500"}`}>{s}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-16"><CTA title="Deploy your first process" text="Use the SDK to register, configure policy, and route your first on-chain action." /></div>
    </>
  );
}
