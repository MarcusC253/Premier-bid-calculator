export default function Wordmark({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="#0A1628" />
        <path
          d="M9 22V10h5.5a3.5 3.5 0 010 7H12v5H9zm3-8h2.3a1.3 1.3 0 000-2.6H12V14zM23 22h-3l-3.5-12h3l1.2 4.6L22 10h3l-2 12z"
          fill="#C8A671"
        />
      </svg>
      <div className="leading-tight">
        <div className="font-display text-[15px] font-semibold tracking-tight text-ink">
          Premier Janitorial
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-navy-400 -mt-0.5">
          Bid Calculator
        </div>
      </div>
    </div>
  )
}
