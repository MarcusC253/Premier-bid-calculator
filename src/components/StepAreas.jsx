import { useEffect } from 'react'
import { CheckCard, Field, NumberInput } from './Inputs'
import { FACILITY_AREAS } from '../config/pricing'

/**
 * Multi-select facility areas. The user checks every area that exists at the
 * client site; only checked areas appear in the Service Agreement's Scope of Work.
 *
 * Quantity-bearing areas (Restrooms, Conference Rooms) get an inline number
 * input. The Restrooms quantity is kept in sync with `facility.restrooms`
 * (which drives pricing) so there's a single source of truth.
 */
export default function StepAreas({ areas, setAreas, facility, setFacility }) {
  // Keep restroom quantity (areas) in sync with facility.restrooms (pricing).
  // When the user enabled Restrooms via the checkbox but hasn't entered a count,
  // auto-fill from the value collected on the earlier Waste step.
  useEffect(() => {
    if (areas.restrooms?.selected && !areas.restrooms.quantity && facility.restrooms) {
      setAreas({
        ...areas,
        restrooms: { selected: true, quantity: facility.restrooms },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas.restrooms?.selected])

  function toggle(id, checked) {
    const prev = areas[id] || { selected: false, quantity: 0 }
    setAreas({
      ...areas,
      [id]: {
        ...prev,
        selected: checked,
        // Pre-fill restroom count from earlier step when first checked
        quantity: checked && id === 'restrooms' && !prev.quantity
          ? (facility.restrooms || 0)
          : prev.quantity,
      },
    })
  }

  function setQuantity(id, qty) {
    setAreas({
      ...areas,
      [id]: { ...(areas[id] || { selected: true }), quantity: qty },
    })
    // Keep facility.restrooms (pricing math) in sync
    if (id === 'restrooms') {
      setFacility({ ...facility, restrooms: qty === '' ? 0 : Number(qty) })
    }
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Which areas exist at this site?
        </h2>
        <p className="text-sm text-navy-500">
          Check every area that applies. Only checked areas will appear in the Scope of Work.
        </p>
      </header>

      <div className="space-y-2">
        {FACILITY_AREAS.map((area) => {
          const value = areas[area.id] || { selected: false, quantity: 0 }
          return (
            <CheckCard
              key={area.id}
              checked={value.selected}
              onChange={(c) => toggle(area.id, c)}
              label={area.label}
            >
              {area.needsQuantity && (
                <Field label={area.quantityLabel}>
                  <NumberInput
                    value={value.quantity}
                    onChange={(v) => setQuantity(area.id, v)}
                  />
                </Field>
              )}
            </CheckCard>
          )
        })}
      </div>
    </div>
  )
}
