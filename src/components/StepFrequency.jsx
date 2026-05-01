import { ChoiceCard } from './Inputs'
import { FREQUENCIES } from '../config/pricing'

export default function StepFrequency({ facility, setFacility }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          How often?
        </h2>
        <p className="text-sm text-navy-500">
          The service schedule the prospect is asking for.
        </p>
      </header>

      <div className="space-y-2">
        {FREQUENCIES.map((f) => (
          <ChoiceCard
            key={f.id}
            selected={facility.frequency === f.id}
            onClick={() => setFacility({ ...facility, frequency: f.id })}
            label={f.label}
            suffix={`${f.perMonth.toFixed(2)} / mo`}
          />
        ))}
      </div>
    </div>
  )
}
