import Link from "next/link";

export function CTA({ title = "Start building with ARVYN", text = "Provision your first agent, connect the SDK, and execute on Robinhood Chain in minutes." }) {
  return (
    <section className="shell pb-24">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-arvyn-panel px-8 py-14 text-center md:py-16">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative">
          <p className="eyebrow justify-center">Get started</p>
          <h2 className="mx-auto mt-4 max-w-[560px] text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[15px] text-arvyn-muted">{text}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/token" className="btn-primary">Launch App →</Link>
            <Link href="/docs" className="btn-secondary">Read Docs</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
