import {
  formatCurrency,
  formatLongDate,
  buildFilename,
  getFacilityLabel,
  getFrequencyLabel,
} from '../lib/calculate'
import { COMPANY, AGREEMENT } from '../config/pricing'

/**
 * The Service Agreement — replaces v1's bid summary screen.
 *
 * Structure follows the v2 spec: 11 sections, all rendered inline so a
 * single browser print captures the full document. Conditional sections
 * (Scope blocks, Custom Scope Addendum) only render when applicable.
 */
export default function ResultsScreen({ bid, onRestart, onPrint }) {
  const {
    contact,
    agreement,
    facility,
    calculation,
    scope_blocks,
    custom_notes,
  } = bid

  const businessName = contact.business_name || '[Client Company Name]'
  const filename = buildFilename({ contact, agreement })

  return (
    <div className="space-y-4 animate-fade-up">
      {/* ====================== Action toolbar ============================ */}
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
              soon
            </span>
          </button>
          <span className="tooltip-content">Coming soon — GHL integration</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onPrint}
            className="px-6 py-3.5 bg-ink text-white rounded-xl font-medium
                       hover:bg-navy-700 transition-all shadow-card"
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

      {/* ====================== The Agreement Document ==================== */}
      <article className="agreement bg-white border border-navy-100 rounded-2xl shadow-card
                          px-6 sm:px-10 py-8 sm:py-10 print-area">
        {/* 1. Header */}
        <header className="agreement-section pb-6 mb-6 border-b border-navy-100">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-dark mb-2">
            Client Service Agreement
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink leading-tight">
            Commercial Cleaning Service Agreement
          </h1>
          <div className="mt-4 text-sm text-navy-500 leading-relaxed">
            <div className="font-medium text-ink">{COMPANY.name}</div>
            <div>
              {COMPANY.city} · {COMPANY.phone} · {COMPANY.email}
            </div>
            <div>{COMPANY.website}</div>
          </div>
        </header>

        {/* 2. Proposal Prepared For */}
        <Section number="01" title="Proposal Prepared For">
          <Dl>
            <Dt>Client Name</Dt>
            <Dd>{contact.business_name || '—'}</Dd>
            <Dt>Contact</Dt>
            <Dd>{contact.contact_name || '—'}</Dd>
            <Dt>Address</Dt>
            <Dd>{contact.site_address || '—'}</Dd>
            <Dt>Phone / Email</Dt>
            <Dd>
              {contact.contact_phone || '—'} &nbsp;/&nbsp;{' '}
              {contact.contact_email || '—'}
            </Dd>
          </Dl>
        </Section>

        {/* 3. Agreement Details */}
        <Section number="02" title="Agreement Details">
          <Dl>
            <Dt>Agreement Date</Dt>
            <Dd>{formatLongDate(agreement.agreement_date)}</Dd>
            <Dt>Service Start Date</Dt>
            <Dd>{formatLongDate(agreement.service_start_date)}</Dd>
            <Dt>Contract Term</Dt>
            <Dd>{AGREEMENT.contractTermLabel}</Dd>
            <Dt>Service Type</Dt>
            <Dd>
              {getFacilityLabel(facility.facility_type)} ·{' '}
              {getFrequencyLabel(facility.frequency)}
            </Dd>
            <Dt>Monthly Investment</Dt>
            <Dd>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink">
                {formatCurrency(calculation.monthly_bid)}
              </span>
              <span className="ml-2 text-xs font-mono text-navy-400">/ month</span>
            </Dd>
          </Dl>
        </Section>

        {/* 4. Scope of Work — conditional area blocks */}
        <Section number="03" title="Scope of Work">
          <p className="text-sm text-navy-500 leading-relaxed">
            The following services will be performed at the frequency noted.
          </p>
          <p className="mt-2 text-xs text-navy-400 font-mono">
            <strong className="text-ink">(EV)</strong> = Each Visit &nbsp;·&nbsp;{' '}
            <strong className="text-ink">(M)</strong> = Monthly &nbsp;·&nbsp;{' '}
            <strong className="text-ink">(Q)</strong> = Quarterly
          </p>

          {scope_blocks.length === 0 ? (
            <div className="mt-5 rounded-lg bg-navy-50 border border-navy-100 px-4 py-3 text-sm text-navy-500">
              No facility areas were selected. Return to "Areas" and check at least one area to populate this section.
            </div>
          ) : (
            <div className="mt-5 space-y-6">
              {scope_blocks.map((block) => (
                <div key={block.id} className="scope-block">
                  <h3 className="font-display text-base font-semibold text-ink uppercase tracking-wide">
                    {block.label}
                    {block.quantity ? (
                      <span className="ml-2 font-sans text-xs font-mono text-navy-400">
                        ({block.quantity})
                      </span>
                    ) : null}
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {block.tasks.map((task, i) => (
                      <li key={i} className="flex gap-3 text-[14px] text-ink leading-relaxed">
                        <span className="font-mono text-[11px] text-accent-dark mt-1 shrink-0 w-7 tabular-nums">
                          ({task.freq})
                        </span>
                        <span>{task.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* 5. Additional Scope Notes */}
        <Section number="04" title="Additional Scope Notes">
          <p className="text-[14px] text-ink leading-relaxed">
            <strong>Supply responsibility:</strong> {COMPANY.name} will provide
            all chemicals, equipment, and labor.{' '}
            <strong>{businessName}</strong> will provide all paper products,
            trash can liners, and hand soap unless otherwise agreed in writing.
          </p>
          <p className="mt-3 text-[14px] text-ink leading-relaxed">
            <strong>Additional services available upon request:</strong>{' '}
            {AGREEMENT.additionalServicesText}
          </p>
        </Section>

        {/* 6. Insurance & Bonding */}
        <Section number="05" title="Insurance & Bonding Coverage">
          <p className="text-[14px] text-ink leading-relaxed">
            {AGREEMENT.insuranceText}
          </p>
        </Section>

        {/* 7. Quality Control */}
        <Section number="06" title="Quality Control">
          <p className="text-[14px] text-ink leading-relaxed">
            {AGREEMENT.qualityControlText}
          </p>
        </Section>

        {/* 8. Terms & Conditions — full numbered list */}
        <Section number="07" title="Terms & Conditions">
          <ol className="space-y-2.5 list-decimal list-outside ml-5 text-[14px] text-ink leading-relaxed marker:text-accent-dark marker:font-mono marker:text-xs">
            {AGREEMENT.terms.map((term, i) => (
              <li key={i} className="pl-1">
                {fillTemplate(term, agreement)}
              </li>
            ))}
          </ol>
        </Section>

        {/* 9. Custom Scope Addendum — conditional */}
        {custom_notes && (
          <Section number="08" title="Custom Scope Addendum">
            <p className="text-sm text-navy-500 leading-relaxed">
              The following site-specific requirements were agreed upon during the walkthrough and form part of this binding agreement.
            </p>
            <div className="mt-4 space-y-2 text-[14px] text-ink leading-relaxed">
              {custom_notes.split(/\n+/).filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </Section>
        )}

        {/* 10. Signatures */}
        <Section
          number={custom_notes ? '09' : '08'}
          title="Agreement & Signatures"
          breakBefore
        >
          <p className="text-[14px] text-ink leading-relaxed">
            By signing below, both parties acknowledge and agree to the terms
            and conditions of this Commercial Cleaning Service Agreement. This
            agreement is binding upon execution.
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <SignatureBlock heading="CLIENT" />
            <SignatureBlock
              heading={COMPANY.name.toUpperCase()}
              prefilledName={COMPANY.ownerName}
              prefilledTitle={COMPANY.ownerTitle}
            />
          </div>
        </Section>

        {/* 11. Footer */}
        <footer className="mt-10 pt-5 border-t border-navy-100 flex flex-col sm:flex-row justify-between gap-2 text-[11px] font-mono text-navy-400">
          <div>
            File as: <span className="text-ink">{filename}</span>
          </div>
          <div>Keep signed original in client folder</div>
        </footer>
      </article>

      {/* Edit-inputs link below the agreement (screen-only) */}
      <div className="no-print pb-4">
        {/* Back link is rendered by App.jsx; this just adds spacing */}
      </div>
    </div>
  )
}

// =========================================================================
// Internal building blocks
// =========================================================================

function Section({ number, title, children, breakBefore }) {
  return (
    <section
      className={`agreement-section mt-8 first:mt-0 ${breakBefore ? 'page-break-before' : ''}`}
    >
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-xs text-accent-dark tabular-nums">
          {number}
        </span>
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function Dl({ children }) {
  return (
    <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 text-[14px]">
      {children}
    </dl>
  )
}

function Dt({ children }) {
  return (
    <dt className="text-navy-400 font-medium uppercase tracking-wide text-[11px] pt-1">
      {children}
    </dt>
  )
}

function Dd({ children }) {
  return <dd className="text-ink leading-relaxed">{children}</dd>
}

function SignatureBlock({ heading, prefilledName, prefilledTitle }) {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-accent-dark mb-5">
        {heading}
      </div>
      <SigLine label="Authorized Signature" />
      <SigLine label="Printed Name" prefill={prefilledName} />
      <SigLine label="Title" prefill={prefilledTitle} />
      <SigLine label="Date" />
    </div>
  )
}

function SigLine({ label, prefill }) {
  return (
    <div className="mb-5">
      <div className="h-7 border-b border-navy-300 px-1 pb-1 text-sm text-ink">
        {prefill || '\u00A0'}
      </div>
      <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.14em] text-navy-400">
        {label}
      </div>
    </div>
  )
}

/** Substitute {serviceDaysHours} (and any future template vars) in a term. */
function fillTemplate(text, agreement) {
  const serviceDaysHours =
    agreement?.service_days_hours?.trim() || '[to be specified]'
  return text.replace(/\{serviceDaysHours\}/g, serviceDaysHours)
}
