import { ChoiceCard } from './Inputs'
import { FACILITY_TYPES } from '../config/pricing'

export default function StepFacilityType({ facility, setFacility }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          What kind of facility?
        </h2>
        <p className="text-sm text-navy-500">
          This sets the cleaning production rate for the bid.
        </p>
      </header>

      <div className="space-y-2">
        {FACILITY_TYPES.map((type) => (
          <ChoiceCard
            key={type.id}
            selected={facility.facility_type === type.id}
            onClick={() => setFacility({ ...facility, facility_type: type.id })}
            label={type.label}
            blurb={type.blurb}
          />
        ))}
      </div>
    </div>
  )
}
