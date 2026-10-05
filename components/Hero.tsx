"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ArvynSymbol from "./ArvynSymbol";
import MetricsStrip from "./network/MetricsStrip";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-[128px] md:pb-24 md:pt-[168px]">
      <div className="grid-bg absolute inset-0" />
      <div className="shell relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11.5px] text-neutral-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-arvyn-orange" />
            AI execution infrastructure for Robinhood Chain
            <span className="hidden text-neutral-600 sm:inline">·</span>
            <span className="hidden text-neutral-400 sm:inline">Product Preview</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mt-6 text-[44px] font-bold leading-[1.02] tracking-tight md:text-[72px]"
          >
            The AI execution
            <br />
            layer for <span className="text-arvyn-orange">Robinhood Chain.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mt-6 max-w-[520px] text-[16.5px] leading-relaxed text-arvyn-muted"
          >
            ARVYN gives AI agents a controlled path from blockchain data to verifiable
            on-chain settlement on Robinhood Chain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/app" className="btn-primary">
              Open Demo →
            </Link>
            <Link href="/docs" className="btn-secondary">
              Read Docs
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <MetricsStrip />
            <p className="mt-3 text-[12px] leading-relaxed text-neutral-500">
              Interface preview. Metrics are generated in the browser and are not live chain telemetry.
            </p>
            <p className="mt-4 font-mono text-[12px] text-neutral-500">
              <strong className="text-white">4</strong> process classes · <strong className="text-white">3</strong>-stage pipeline · <strong className="text-white">$ARVN</strong> settlement credit
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="h-[420px] md:h-[520px]"
        >
          <ArvynSymbol />
        </motion.div>
      </div>
    </section>
  );
}
