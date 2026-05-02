import { Field, TextInput, DateInput } from './Inputs'

export default function StepAgreement({ agreement, setAgreement, errors }) {
  const update = (key) => (val) => setAgreement({ ...agreement, [key]: val })

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Agreement details
        </h2>
        <p className="text-sm text-navy-500">
          When does service start, and on what schedule?
        </p>
      </header>

      <div className="space-y-4">
        <Field
          label="Agreement date"
          hint="Defaults to today; edit if needed"
          error={errors?.agreement_date}
        >
          <DateInput
            value={agreement.agreement_date}
            onChange={update('agreement_date')}
          />
        </Field>

        <Field label="Service start date" error={errors?.service_start_date}>
          <DateInput
            value={agreement.service_start_date}
            onChange={update('service_start_date')}
          />
        </Field>

        <Field
          label="Service days & hours"
          hint='e.g. "Monday–Friday after 6 PM"'
          error={errors?.service_days_hours}
        >
          <TextInput
            value={agreement.service_days_hours}
            onChange={update('service_days_hours')}
            placeholder="Monday–Friday after 6 PM"
          />
        </Field>
      </div>

      <div className="rounded-lg bg-navy-50 border border-navy-100 px-4 py-3">
        <p className="text-xs text-navy-500 leading-relaxed">
          <span className="font-medium text-ink">Heads up:</span> these values appear on the Service Agreement and inside the Terms &amp; Conditions section. Be specific.
        </p>
      </div>
    </div>
  )
}
