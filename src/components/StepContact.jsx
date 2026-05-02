import { Field, TextInput } from './Inputs'

export default function StepContact({ contact, setContact, errors }) {
  const update = (key) => (val) => setContact({ ...contact, [key]: val })

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Who are we bidding?
        </h2>
        <p className="text-sm text-navy-500">
          Start with the prospect's contact details and site address.
        </p>
      </header>

      <div className="space-y-4">
        <Field label="Business name" error={errors?.business_name}>
          <TextInput
            value={contact.business_name}
            onChange={update('business_name')}
            placeholder="Acme Property Management"
            autoComplete="organization"
          />
        </Field>

        <Field label="Contact name" error={errors?.contact_name}>
          <TextInput
            value={contact.contact_name}
            onChange={update('contact_name')}
            placeholder="Jane Smith"
            autoComplete="name"
          />
        </Field>

        <Field
          label="Site address"
          hint="Where the cleaning happens"
          error={errors?.site_address}
        >
          <TextInput
            value={contact.site_address}
            onChange={update('site_address')}
            placeholder="1234 Main St, Tacoma WA 98404"
            autoComplete="street-address"
          />
        </Field>

        <Field label="Contact email" error={errors?.contact_email}>
          <TextInput
            value={contact.contact_email}
            onChange={update('contact_email')}
            placeholder="jane@acme.com"
            type="email"
            inputMode="email"
            autoComplete="email"
          />
        </Field>

        <Field label="Contact phone" error={errors?.contact_phone}>
          <TextInput
            value={contact.contact_phone}
            onChange={update('contact_phone')}
            placeholder="(253) 555-0100"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
      </div>
    </div>
  )
}
