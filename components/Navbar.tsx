"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, OFFICIAL_LINKS } from "@/lib/site";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled ? "border-b border-white/[0.08] bg-[#070707]/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="shell flex h-[64px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="ARVYN home">
          <Logo />
          <span className="text-[15px] font-bold tracking-[0.08em]">ARVYN</span>
          <span className="hidden rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-arvyn-muted sm:inline">
            $ARVN
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13.5px] transition ${
                pathname === l.href ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={OFFICIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13.5px] text-neutral-400 transition hover:text-white"
          >
            GitHub
          </a>
          <a
            href={OFFICIAL_LINKS.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13.5px] text-neutral-400 transition hover:text-white"
          >
            X
          </a>
          <Link href="/app" className="btn-primary !px-4 !py-2 text-[13px]">
            Launch App
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <div className="space-y-1.5">
            <div className={`h-px w-5 bg-white transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <div className={`h-px w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <div className={`h-px w-5 bg-white transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" className="border-t border-white/[0.08] bg-[#070707]/95 backdrop-blur-xl lg:hidden">
          <div className="shell flex flex-col gap-1 py-4">
            {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-[15px] ${
                  pathname === l.href ? "bg-white/[0.06] text-white" : "text-neutral-400"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-white/[0.08]" />
            <div className="flex gap-2">
              <a
                href={OFFICIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 !py-2.5"
              >
                GitHub ↗
              </a>
              <a
                href={OFFICIAL_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 !py-2.5"
              >
                X ↗
              </a>
            </div>
            <Link href="/app" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
