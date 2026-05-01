import { Field, NumberInput } from './Inputs'

export default function StepSquareFootage({ facility, setFacility, errors }) {
  const update = (key) => (val) => setFacility({ ...facility, [key]: val })

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          How big is the space?
        </h2>
        <p className="text-sm text-navy-500">
          Estimate the cleanable square footage. Skip a field if it doesn't apply.
        </p>
      </header>

      <div className="space-y-4">
        <Field
          label="Carpeted area"
          hint="Vacuumed surfaces"
          error={errors?.sqft_carpet}
        >
          <NumberInput
            value={facility.sqft_carpet}
            onChange={update('sqft_carpet')}
            suffix="sq ft"
          />
        </Field>

        <Field
          label="Hard floor area"
          hint="Tile, vinyl, concrete, wood"
          error={errors?.sqft_hard_floor}
        >
          <NumberInput
            value={facility.sqft_hard_floor}
            onChange={update('sqft_hard_floor')}
            suffix="sq ft"
          />
        </Field>
      </div>

      <div className="rounded-lg bg-navy-50 border border-navy-100 px-4 py-3">
        <p className="text-xs text-navy-500 leading-relaxed">
          <span className="font-medium text-ink">Tip:</span> Walk the property and pace it out, or pull it from the lease. Round to the nearest hundred — precision below that doesn't move the bid.
        </p>
      </div>
    </div>
  )
}
