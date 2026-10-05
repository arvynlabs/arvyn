import Link from "next/link";
import Logo from "./Logo";

type FooterLink = {
  label: string;
  href: string;
  /** external URLs open in a new tab */
  external?: boolean;
  /** renders as non-clickable placeholder — no fake URL */
  comingSoon?: boolean;
};

const cols: { h: string; links: FooterLink[] }[] = [
  {
    h: "Protocol",
    links: [
      { label: "Agents", href: "/agents" },
      { label: "Protocol", href: "/protocol" },
      { label: "Token", href: "/token" },
      { label: "Ecosystem", href: "/ecosystem" },
      { label: "App", href: "/app" },
    ],
  },
  {
    h: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs#api" },
      { label: "SDK", href: "/docs#sdk" },
      { label: "Smart Contracts", href: "/docs#contracts" },
    ],
  },
  {
    h: "Community",
    links: [
      { label: "Twitter / X", href: "https://x.com/arvynxyz", external: true },
      { label: "GitHub", href: "", comingSoon: true },
      { label: "Docs", href: "/docs" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0a0a0a]">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="text-[15px] font-bold tracking-[0.08em]">ARVYN</span>
          </div>
          <p className="mt-4 text-[15px] font-medium text-white">Agents. Intelligence. Execution.</p>
          <p className="mt-2 text-sm text-arvyn-muted">Built on Robinhood Chain.</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            All systems operational
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.h}>
              <p className="eyebrow">{c.h}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.comingSoon ? (
                      <span className="text-sm text-neutral-500">
                        {l.label} <span className="font-mono text-[11px]">· soon</span>
                      </span>
                    ) : l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-400 transition hover:text-white"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-sm text-neutral-400 transition hover:text-white">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="shell flex flex-col gap-2 py-6 text-[12.5px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 ARVYN Labs. All rights reserved.</span>
          <span className="font-mono">Robinhood Chain · $ARVN · Execution Layer</span>
        </div>
      </div>
    </footer>
  );
}
