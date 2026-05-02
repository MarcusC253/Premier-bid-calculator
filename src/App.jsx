import { useState, useMemo } from 'react'
import Wordmark from './components/Wordmark'
import ProgressBar from './components/ProgressBar'
import StepContact from './components/StepContact'
import StepAgreement from './components/StepAgreement'
import StepFacilityType from './components/StepFacilityType'
import StepSquareFootage from './components/StepSquareFootage'
import StepRestroomsWaste from './components/StepRestroomsWaste'
import StepAreas from './components/StepAreas'
import StepCondition from './components/StepCondition'
import StepFrequency from './components/StepFrequency'
import StepCustomNotes from './components/StepCustomNotes'
import ResultsScreen from './components/ResultsScreen'
import { computeBid, todayISO } from './lib/calculate'
import { COMPANY, FACILITY_AREAS } from './config/pricing'

const TOTAL_STEPS = 9

// =============================================================================
// Initial state — single source of truth and the JSON shape we'll send to GHL.
// =============================================================================

const initialContact = {
  business_name: '',
  contact_name: '',
  site_address: '',
  contact_email: '',
  contact_phone: '',
}

const initialAgreement = {
  agreement_date: todayISO(),
  service_start_date: '',
  service_days_hours: '',
}

const initialFacility = {
  facility_type: '',
  sqft_carpet: 0,
  sqft_hard_floor: 0,
  restrooms: 0,
  trash_bins: 0,
  recycle_bins: 0,
  condition: '',
  frequency: '',
}

// One entry per area defined in pricing.js, all unchecked by default.
const initialAreas = FACILITY_AREAS.reduce((acc, area) => {
  acc[area.id] = { selected: false, quantity: 0 }
  return acc
}, {})

export default function App() {
  const [step, setStep] = useState(1)
  const [contact, setContact] = useState(initialContact)
  const [agreement, setAgreement] = useState(initialAgreement)
  const [facility, setFacility] = useState(initialFacility)
  const [areas, setAreas] = useState(initialAreas)
  const [customNotes, setCustomNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [showResults, setShowResults] = useState(false)

  const bid = useMemo(() => {
    if (!showResults) return null
    return computeBid({
      contact,
      agreement,
      facility,
      areas,
      custom_notes: customNotes,
    })
  }, [showResults, contact, agreement, facility, areas, customNotes])

  // ---------------------------------------------------------------------------
  // Validation — by step number. Mirrors v1's pattern; only required fields
  // block progression. Custom notes step is optional.
  // ---------------------------------------------------------------------------
  function validateStep(s) {
    const e = {}

    if (s === 1) {
      if (!contact.business_name?.trim()) e.business_name = 'Required'
      if (!contact.contact_name?.trim()) e.contact_name = 'Required'
      if (!contact.site_address?.trim()) e.site_address = 'Required'
      if (!contact.contact_email?.trim()) {
        e.contact_email = 'Required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.contact_email)) {
        e.contact_email = 'Enter a valid email'
      }
      if (!contact.contact_phone?.trim()) e.contact_phone = 'Required'
    }

    if (s === 2) {
      if (!agreement.agreement_date) e.agreement_date = 'Required'
      if (!agreement.service_start_date) e.service_start_date = 'Required'
      if (!agreement.service_days_hours?.trim()) e.service_days_hours = 'Required'
    }

    if (s === 3) {
      if (!facility.facility_type) e.facility_type = 'Pick a facility type'
    }

    if (s === 4) {
      const c = Number(facility.sqft_carpet) || 0
      const h = Number(facility.sqft_hard_floor) || 0
      if (c <= 0 && h <= 0) {
        e.sqft_carpet = 'Enter at least one floor area'
      }
    }

    // Step 5 (Restrooms & Waste) — no required fields; zeros are valid.
    // Step 6 (Areas) — no required fields, but warn if nothing checked.
    if (s === 6) {
      const anyChecked = Object.values(areas).some((a) => a.selected)
      if (!anyChecked) {
        e.areas = 'Check at least one area for the Scope of Work'
      }
    }

    if (s === 7) {
      if (!facility.condition) e.condition = 'Pick a condition'
    }

    if (s === 8) {
      if (!facility.frequency) e.frequency = 'Pick a frequency'
    }

    // Step 9 (Custom Notes) — optional, no validation.

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (!validateStep(step)) return
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setShowResults(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function handleBack() {
    if (showResults) {
      setShowResults(false)
      setStep(TOTAL_STEPS)
      return
    }
    if (step > 1) setStep(step - 1)
    setErrors({})
  }

  function handleRestart() {
    setContact(initialContact)
    setAgreement(initialAgreement)
    setFacility(initialFacility)
    setAreas(initialAreas)
    setCustomNotes('')
    setStep(1)
    setShowResults(false)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePrint() {
    window.print()
  }

  function renderStep() {
    switch (step) {
      case 1:
        return <StepContact contact={contact} setContact={setContact} errors={errors} />
      case 2:
        return <StepAgreement agreement={agreement} setAgreement={setAgreement} errors={errors} />
      case 3:
        return <StepFacilityType facility={facility} setFacility={setFacility} />
      case 4:
        return <StepSquareFootage facility={facility} setFacility={setFacility} errors={errors} />
      case 5:
        return <StepRestroomsWaste facility={facility} setFacility={setFacility} />
      case 6:
        return <StepAreas areas={areas} setAreas={setAreas} facility={facility} setFacility={setFacility} />
      case 7:
        return <StepCondition facility={facility} setFacility={setFacility} />
      case 8:
        return <StepFrequency facility={facility} setFacility={setFacility} />
      case 9:
        return <StepCustomNotes customNotes={customNotes} setCustomNotes={setCustomNotes} />
      default:
        return null
    }
  }

  // The first error message worth surfacing under the form (in addition to
  // per-field inline errors). Order roughly matches step display.
  const stepErrorMessage =
    errors.facility_type ||
    errors.condition ||
    errors.frequency ||
    errors.sqft_carpet ||
    errors.areas

  return (
    <div className="relative min-h-screen z-10">
      {/* Header */}
      <header className="px-5 sm:px-8 pt-6 pb-4 no-print">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Wordmark />
          <a
            href={`tel:${COMPANY.phone.replace(/[^\d]/g, '')}`}
            className="hidden sm:block text-xs font-mono text-navy-400 hover:text-ink transition-colors"
          >
            {COMPANY.phone}
          </a>
        </div>
      </header>

      {/* Main content card */}
      <main className="px-4 sm:px-8 pb-20">
        <div className="max-w-2xl mx-auto">
          {!showResults && (
            <div className="mb-5 no-print">
              <ProgressBar current={step} total={TOTAL_STEPS} />
            </div>
          )}

          {!showResults ? (
            <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8">
              {renderStep()}

              {stepErrorMessage && (
                <div className="mt-4 text-xs text-red-600">
                  {stepErrorMessage}
                </div>
              )}

              {/* Nav */}
              <div className="mt-8 pt-6 border-t border-navy-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-5 py-2.5 text-sm font-medium text-navy-500 hover:text-ink
                             disabled:text-navy-200 disabled:cursor-not-allowed transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-ink text-white rounded-lg font-medium text-sm
                             hover:bg-navy-700 transition-colors shadow-card
                             flex items-center gap-2"
                >
                  {step === TOTAL_STEPS ? 'Generate Agreement' : 'Next'}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <ResultsScreen bid={bid} onRestart={handleRestart} onPrint={handlePrint} />
              <div className="mt-4 no-print">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-navy-400 hover:text-ink transition-colors"
                >
                  ← Edit inputs
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 sm:px-8 pb-8 no-print">
        <div className="max-w-2xl mx-auto pt-6 border-t border-navy-100 text-center">
          <div className="text-xs text-navy-400">
            {COMPANY.name} · {COMPANY.phone} · {COMPANY.email}
          </div>
        </div>
      </footer>
    </div>
  )
}
