import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { CTA } from "@/components/CTA";

export const metadata = { title: "Ecosystem — ARVYN" };

const FLOW = [
  { t: "Users", d: "Set goals, constraints and budgets. Stay in control.", tag: "CONTROL" },
  { t: "AI Agents", d: "Market, research, execution and strategy agents do the work.", tag: "INTELLIGENCE" },
  { t: "ARVYN Protocol", d: "Runtime, execution routing and real-time data.", tag: "COORDINATION" },
  { t: "Robinhood Chain", d: "Fast, accessible settlement layer.", tag: "SETTLEMENT" },
  { t: "On-chain Applications", d: "DEXs, lending, vaults — any composable action.", tag: "DESTINATION" },
];

export default function EcosystemPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-[128px] md:pt-[160px]">
        <div className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow"><span className="inline-block h-px w-6 bg-arvyn-orange" /> Ecosystem</p>
            <h1 className="mt-4 max-w-[720px] text-4xl font-bold tracking-tight md:text-6xl">One flow, from intent to settlement.</h1>
            <p className="mt-5 max-w-[560px] text-[16px] text-arvyn-muted">Users express intent. Agents coordinate. ARVYN routes. Robinhood Chain settles.</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-16">
        <div className="shell mx-auto max-w-[760px]">
          <SectionHeading align="center" eyebrow="Ecosystem map" title="How value flows." />
          <div className="mt-12">
            {FLOW.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.04}>
                <div>
                  <div className="card p-6 text-center transition hover:border-white/20 md:p-7">
                    <p className="font-mono text-[10.5px] tracking-[0.2em] text-arvyn-orange">{f.tag}</p>
                    <p className={`mt-1.5 text-xl font-bold ${f.t === "ARVYN Protocol" ? "text-arvyn-orange" : ""}`}>{f.t}</p>
                    <p className="mx-auto mt-1.5 max-w-[440px] text-sm text-arvyn-muted">{f.d}</p>
                  </div>
                  {i < FLOW.length - 1 && (
                    <div className="flex justify-center py-1.5" aria-hidden>
                      <div className="flex flex-col items-center">
                        <div className="h-5 w-px bg-white/15" />
                        <div className="border-x-[5px] border-t-[6px] border-x-transparent border-t-arvyn-orange" />
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[#0a0a0a] py-16">
        <div className="shell">
          <SectionHeading eyebrow="Participants" title="Built for three sides of the market." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[["Builders", "Ship agent-powered apps with the SDK and open action registry."], ["Operators", "Run agent infrastructure and earn ARVN for reliable execution."], ["Applications", "Expose actions to the agent network and tap autonomous flow."]].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="card h-full p-7"><p className="text-lg font-bold">{t}</p><p className="mt-2 text-sm leading-relaxed text-arvyn-muted">{d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-16"><CTA title="Plug into the ecosystem" text="Expose an action, run an operator node, or launch an agent-powered app." /></div>
    </>
  );
}
