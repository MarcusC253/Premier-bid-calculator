import { Field, NumberInput } from './Inputs'

export default function StepRestroomsWaste({ facility, setFacility, errors }) {
  const update = (key) => (val) => setFacility({ ...facility, [key]: val })

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Restrooms and waste
        </h2>
        <p className="text-sm text-navy-500">
          Count what's actually serviced — not every bin in every cube.
        </p>
      </header>

      <div className="space-y-4">
        <Field
          label="How many restrooms?"
          hint="Each restroom, not each fixture"
          error={errors?.restrooms}
        >
          <NumberInput
            value={facility.restrooms}
            onChange={update('restrooms')}
          />
        </Field>

        <Field
          label="How many trash cans?"
          hint="Total bins emptied per visit"
          error={errors?.trash_bins}
        >
          <NumberInput
            value={facility.trash_bins}
            onChange={update('trash_bins')}
          />
        </Field>

        <Field
          label="How many recycle bins?"
          hint="Total bins emptied per visit"
          error={errors?.recycle_bins}
        >
          <NumberInput
            value={facility.recycle_bins}
            onChange={update('recycle_bins')}
          />
        </Field>
      </div>
    </div>
  )
}
