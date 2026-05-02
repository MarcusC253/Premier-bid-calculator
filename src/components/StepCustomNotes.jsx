import { Field, TextArea } from './Inputs'

export default function StepCustomNotes({ customNotes, setCustomNotes }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Custom scope notes
        </h2>
        <p className="text-sm text-navy-500">
          Site-specific instructions captured during the walkthrough. Optional — leave blank if none.
        </p>
      </header>

      <Field
        label="Walkthrough notes"
        hint={`e.g. "Lock the back door at 9 PM" or "Don't enter office #3"`}
      >
        <TextArea
          value={customNotes}
          onChange={setCustomNotes}
          rows={6}
          placeholder="Any additional tasks, special instructions, or site-specific requirements you agreed to during the walkthrough."
        />
      </Field>

      <div className="rounded-lg bg-navy-50 border border-navy-100 px-4 py-3">
        <p className="text-xs text-navy-500 leading-relaxed">
          <span className="font-medium text-ink">Note:</span> these notes appear in a "Custom Scope Addendum" section on the agreement and are part of the binding contract. Each line becomes its own paragraph.
        </p>
      </div>
    </div>
  )
}
