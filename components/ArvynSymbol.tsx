"use client";

import { useEffect, useRef } from "react";

/**
 * Abstract ARVYN symbol animation.
 * Geometric nodes + connecting lines, subtle drift. No 3D, no glow spam.
 */
export default function ArvynSymbol() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    type Node = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean };
    let nodes: Node[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.floor((w * h) / 16000);
      nodes = Array.from({ length: Math.min(64, Math.max(24, n)) }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.8 + 1,
        accent: i % 9 === 0,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.22;
            ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + (n.accent ? 1 : 0), 0, Math.PI * 2);
        ctx.fillStyle = n.accent ? "#FF5A00" : "rgba(245,245,245,0.75)";
        ctx.fill();

        if (n.accent) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,90,0,0.35)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    seed();
    tick();
    window.addEventListener("resize", seed);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", seed);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b0b]">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* overlay terminal card */}
      <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-black/70 p-4 font-mono text-[12px] backdrop-blur">
        <div className="flex items-center gap-2 text-neutral-500">
          <span className="h-2 w-2 rounded-full bg-arvyn-orange" />
          arvyn · sample execution trace
          <span className="ml-auto">demo data</span>
        </div>
        <div className="mt-3 space-y-1.5 text-neutral-300">
          <p><span className="text-neutral-500">perception</span> · 1,284 events indexed</p>
          <p><span className="text-neutral-500">intelligence</span> · strategy scored 0.94</p>
          <p><span className="text-arvyn-orange">execution</span> · tx routed → 0x7a…f3 ✓</p>
        </div>
      </div>
      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[11px] text-neutral-300 backdrop-blur">
        ARVYN / INTERFACE PREVIEW
      </div>
    </div>
  );
}
