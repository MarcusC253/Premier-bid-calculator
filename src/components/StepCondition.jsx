import { ChoiceCard } from './Inputs'
import { CONDITIONS } from '../config/pricing'

export default function StepCondition({ facility, setFacility }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          What's the condition?
        </h2>
        <p className="text-sm text-navy-500">
          This is your honest assessment of how much labor the space will demand.
        </p>
      </header>

      <div className="space-y-2">
        {CONDITIONS.map((c) => (
          <ChoiceCard
            key={c.id}
            selected={facility.condition === c.id}
            onClick={() => setFacility({ ...facility, condition: c.id })}
            label={c.label}
            blurb={c.blurb}
            suffix={`×${c.multiplier.toFixed(2)}`}
          />
        ))}
      </div>
    </div>
  )
}
