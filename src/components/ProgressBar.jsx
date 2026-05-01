export default function ProgressBar({ current, total }) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100))
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-navy-400">
          Step {current} of {total}
        </span>
        <span className="text-[11px] font-mono text-navy-400">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-[3px] w-full bg-navy-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-ink transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
