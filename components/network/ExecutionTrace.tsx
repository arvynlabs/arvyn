const STAGES = [
  { name: "perceive", detail: "1,284 events indexed", state: "done" },
  { name: "plan", detail: "strategy scored 0.94 · policy OK", state: "done" },
  { name: "simulate", detail: "revert check passed · 0.84s", state: "done" },
  { name: "settle", detail: "tx 0x7a…f3 → block 84,102", state: "live" },
] as const;

export default function ExecutionTrace() {
  return (
    <div className="code-block p-6">
      <div className="flex items-center gap-2 font-mono text-[12px] text-neutral-500">
        <span className="h-2 w-2 rounded-full bg-arvyn-orange" />
        arvyn · sample execution trace
        <span className="ml-auto">interface preview</span>
      </div>
      <div className="mt-5 space-y-0">
        {STAGES.map((s, i) => (
          <div key={s.name} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`mt-1 h-2.5 w-2.5 rounded-full ${s.state === "live" ? "bg-arvyn-orange" : "border border-emerald-500/60 bg-emerald-500/20"}`} />
              {i < STAGES.length - 1 && <div className="w-px flex-1 bg-white/10" />}
            </div>
            <div className="pb-5">
              <p className="font-mono text-[13px] text-white">
                {s.name} {s.state === "done" && <span className="text-emerald-400">✓</span>}
                {s.state === "live" && <span className="ml-2 animate-pulse text-arvyn-orange">●</span>}
              </p>
              <p className="mt-0.5 font-mono text-[12px] text-neutral-500">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-white/[0.08] pt-4 font-mono text-[11.5px] text-neutral-500">
        <span>simulate <strong className="text-neutral-300">0.84s</strong></span>
        <span>sign <strong className="text-neutral-300">scoped</strong></span>
        <span>settle <strong className="text-emerald-400">sample receipt</strong></span>
      </div>
    </div>
  );
}
