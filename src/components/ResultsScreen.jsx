import { formatCurrency, formatNumber, getFacilityLabel, getFrequencyLabel } from '../lib/calculate'
import { COMPANY } from '../config/pricing'

export default function ResultsScreen({ bid, onRestart, onPrint }) {
  const { calculation, facility, contact, scope_of_work, exclusions } = bid

  return (
    <div className="space-y-6 animate-fade-up print-area">
      {/* Print-only header */}
      <div className="hidden print:block mb-6 pb-4 border-b border-navy-200">
        <div className="font-display text-2xl font-semibold text-ink">{COMPANY.name}</div>
        <div className="text-sm text-navy-500 mt-1">
          {COMPANY.phone} · {COMPANY.email} · {COMPANY.website}
        </div>
        <div className="text-xs text-navy-400 mt-2">
          Bid prepared for {contact.business_name || '—'} on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <header className="space-y-1.5 no-print">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent-dark">
          Bid Summary
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {contact.business_name || 'Your bid'}
        </h2>
        <p className="text-sm text-navy-500">
          {getFacilityLabel(facility.facility_type)} · {getFrequencyLabel(facility.frequency)}
        </p>
      </header>

      {/* Section 1 — The Bid */}
      <section className="bg-ink text-white rounded-2xl p-6 sm:p-7 shadow-card-lg">
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
            Monthly Recurring
          </div>
        </div>
        <div className="font-display text-5xl sm:text-6xl font-semibold tracking-tighter leading-none my-3">
          {formatCurrency(calculation.monthly_bid)}
          <span className="font-sans text-base font-normal text-navy-300 ml-2">/ month</span>
        </div>
        <div className="text-xs text-navy-300 font-mono">
          {formatNumber(calculation.total_hours_per_clean, 2)} hrs × {formatCurrency(calculation.billable_rate)}/hr × {formatNumber(calculation.cleanings_per_month, 2)} cleanings
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
          <Stat label="Hours / visit" value={formatNumber(calculation.total_hours_per_clean, 2)} />
          <Stat label="Price / visit" value={formatCurrency(calculation.price_per_clean)} />
          <Stat label="Cleanings / mo" value={formatNumber(calculation.cleanings_per_month, 2)} />
        </div>
      </section>

      {/* Section 2 — Scope of Work */}
      <section className="bg-white border border-navy-100 rounded-2xl p-6 sm:p-7 shadow-card">
        <SectionHeader number="01" title="Scope of Work" />
        <ul className="mt-5 space-y-3">
          {scope_of_work.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] text-ink leading-relaxed">
              <span className="font-mono text-xs text-accent-dark mt-1.5 shrink-0 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 3 — Not Included */}
      <section className="bg-white border border-navy-100 rounded-2xl p-6 sm:p-7 shadow-card">
        <SectionHeader number="02" title="Not Included" subtitle="Available as add-ons" />
        <ul className="mt-5 space-y-2.5">
          {exclusions.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-[15px] text-navy-500">
              <span className="w-1 h-1 rounded-full bg-navy-300 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Actions */}
      <div className="space-y-3 no-print">
        <div className="tooltip-wrap w-full block">
          <button
            disabled
            aria-disabled="true"
            className="w-full px-6 py-4 bg-navy-100 text-navy-300 rounded-xl font-medium
                       cursor-not-allowed flex items-center justify-center gap-2"
          >
            Send Proposal
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-navy-200 text-navy-400">
              v2
            </span>
          </button>
          <span className="tooltip-content">Coming soon — GHL integration in v2</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onPrint}
            className="px-6 py-3.5 bg-white border border-navy-200 text-ink rounded-xl font-medium
                       hover:border-ink hover:shadow-card transition-all"
          >
            Print / Save PDF
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-3.5 bg-white border border-navy-200 text-ink rounded-xl font-medium
                       hover:border-ink hover:shadow-card transition-all"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-navy-300 mb-1">
        {label}
      </div>
      <div className="font-display text-lg font-semibold text-white tabular-nums">
        {value}
      </div>
    </div>
  )
}

function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-xs text-accent-dark tabular-nums">{number}</span>
      <div>
        <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
          {title}
        </h3>
        {subtitle && (
          <div className="text-xs text-navy-400 mt-0.5">{subtitle}</div>
        )}
      </div>
    </div>
  )
}
