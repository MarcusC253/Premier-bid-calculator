export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint && <span className="text-xs text-navy-400">{hint}</span>}
      </div>
      {children}
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </label>
  )
}

export function TextInput({ value, onChange, type = 'text', placeholder, inputMode, autoComplete }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      autoComplete={autoComplete}
      className="w-full px-4 py-3 bg-white border border-navy-200 rounded-lg
                 text-ink placeholder:text-navy-300
                 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10
                 transition-colors text-base"
    />
  )
}

export function NumberInput({ value, onChange, placeholder = '0', suffix }) {
  return (
    <div className="relative">
      <input
        type="number"
        min="0"
        value={value === 0 || value ? value : ''}
        onChange={(e) => {
          const v = e.target.value
          onChange(v === '' ? '' : Number(v))
        }}
        placeholder={placeholder}
        inputMode="numeric"
        className={`w-full px-4 py-3 bg-white border border-navy-200 rounded-lg
                    text-ink placeholder:text-navy-300
                    focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10
                    transition-colors text-base ${suffix ? 'pr-14' : ''}`}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono text-navy-400 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  )
}

export function DateInput({ value, onChange }) {
  return (
    <input
      type="date"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-navy-200 rounded-lg
                 text-ink placeholder:text-navy-300
                 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10
                 transition-colors text-base"
    />
  )
}

export function TextArea({ value, onChange, placeholder, rows = 5 }) {
  return (
    <textarea
      rows={rows}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-navy-200 rounded-lg
                 text-ink placeholder:text-navy-300 resize-y
                 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10
                 transition-colors text-base leading-relaxed"
    />
  )
}

export function CheckCard({ checked, onChange, label, children }) {
  return (
    <div
      className={`border rounded-lg transition-all ${
        checked ? 'border-ink bg-ink/[0.02] shadow-card' : 'border-navy-200 bg-white hover:border-navy-400'
      }`}
    >
      <label className="flex items-center gap-3 px-4 py-3.5 cursor-pointer">
        <span
          className={`flex-shrink-0 w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-colors ${
            checked ? 'bg-ink border-ink' : 'bg-white border-navy-300'
          }`}
          aria-hidden="true"
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          checked={!!checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className="text-[15px] font-medium text-ink">{label}</span>
      </label>
      {checked && children && (
        <div className="px-4 pb-4 pl-12 -mt-1">
          {children}
        </div>
      )}
    </div>
  )
}

export function ChoiceCard({ selected, onClick, label, blurb, suffix }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border rounded-lg transition-all
                  ${selected
                    ? 'border-ink bg-ink text-white shadow-card'
                    : 'border-navy-200 bg-white text-ink hover:border-navy-400 hover:shadow-card'
                  }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className={`text-[15px] font-medium ${selected ? 'text-white' : 'text-ink'}`}>
            {label}
          </div>
          {blurb && (
            <div className={`text-xs mt-0.5 ${selected ? 'text-navy-200' : 'text-navy-400'}`}>
              {blurb}
            </div>
          )}
        </div>
        {suffix && (
          <span className={`font-mono text-xs shrink-0 ${selected ? 'text-accent' : 'text-navy-400'}`}>
            {suffix}
          </span>
        )}
      </div>
    </button>
  )
}
