import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CTA } from "@/components/CTA";
import { TOKEN_USES } from "@/lib/site";

export const metadata = { title: "Token — ARVYN" };

export default function TokenPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-[128px] md:pt-[160px]">
        <div className="grid-bg absolute inset-0" />
        <div className="shell relative grid items-start gap-10 lg:grid-cols-[1fr_420px]">
          <Reveal>
            <p className="eyebrow"><span className="inline-block h-px w-6 bg-arvyn-orange" /> Token</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              $ARVN powers the agent economy.
            </h1>
            <p className="mt-5 max-w-[540px] text-[16px] leading-relaxed text-arvyn-muted">
              The ARVN token powers the ARVYN ecosystem — access, services, incentives, and governance.
            </p>
            <div className="mt-7 flex gap-3">
              <span className="btn-primary cursor-default">Get $ARVN — Soon</span>
              <Link href="/docs" className="btn-secondary">Token docs</Link>
            </div>
          </Reveal>

          {/* Token dashboard */}
          <Reveal delay={0.1}>
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
                <p className="font-mono text-[11px] tracking-[0.18em] text-neutral-400">TOKEN DASHBOARD</p>
                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 px-2.5 py-1 font-mono text-[11px] text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> COMING SOON
                </span>
              </div>
              {[
                ["Ticker", "$ARVN"],
                ["Network", "Robinhood Chain"],
                ["Contract", "Coming Soon"],
                ["Supply", "TBA"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4 text-sm last:border-0">
                  <span className="text-neutral-500">{k}</span>
                  <span className={`font-mono ${k === "Contract" ? "text-amber-400/90" : "text-white"}`}>{v}</span>
                </div>
              ))}
              <div className="bg-white/[0.02] px-6 py-4 font-mono text-[11.5px] text-neutral-500">
                TGE & listings will be announced via official channels only.
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-16 md:py-20">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Utility</p>
            <h2 className="mt-3 max-w-[600px] text-3xl font-bold tracking-tight md:text-4xl">One token, four functions.</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOKEN_USES.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.06}>
                <div className="card h-full p-6 transition hover:border-white/20">
                  <p className="font-mono text-[12px] text-arvyn-orange">0{i + 1}</p>
                  <p className="mt-2 text-[16px] font-bold">{u.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-arvyn-muted">{u.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="card mt-6 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-7">
              <div>
                <p className="text-[16px] font-bold">Beware of impersonators.</p>
                <p className="mt-1 text-sm text-arvyn-muted">There is no live ARVN contract yet. Verify every announcement against official links below.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/ecosystem" className="btn-secondary !py-2.5 text-[13px]">Ecosystem →</Link>
                <Link href="/docs" className="btn-secondary !py-2.5 text-[13px]">Docs →</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="pt-4"><CTA title="Get notified at TGE" text="Follow official channels. Token access will open through the ARVYN app first." /></div>
    </>
  );
}
