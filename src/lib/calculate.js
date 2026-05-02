// ============================================================================
// Bid calculation engine — pure functions, no React
// ============================================================================

import {
  PRICING,
  PRODUCTION_RATES,
  HARD_FLOOR_RATE,
  CONDITIONS,
  FREQUENCIES,
  FACILITY_TYPES,
  FACILITY_AREAS,
} from '../config/pricing.js'

/**
 * Compute the full bid from form inputs.
 * Returns the JSON object that will (in v2) be POSTed to GHL.
 *
 * Shape (v2):
 *   {
 *     contact:      { business_name, contact_name, contact_email, contact_phone, site_address }
 *     agreement:    { agreement_date, service_start_date, service_days_hours }
 *     facility:     { facility_type, sqft_carpet, sqft_hard_floor, restrooms, trash_bins, recycle_bins,
 *                     condition, frequency }
 *     areas:        { lobby: { selected, quantity }, ... }
 *     custom_notes: string
 *     calculation:  { ...pricing breakdown }
 *     scope_blocks: [{ id, label, quantity, tasks: [{ freq, text }] }]
 *     meta:         { generated_at, version }
 *   }
 */
export function computeBid({ contact, agreement, facility, areas, custom_notes }) {
  const productionRate = PRODUCTION_RATES[facility.facility_type] ?? PRODUCTION_RATES.mixed_office
  const conditionDef = CONDITIONS.find(c => c.id === facility.condition) ?? CONDITIONS[1]
  const frequencyDef = FREQUENCIES.find(f => f.id === facility.frequency) ?? FREQUENCIES[2]

  // Step 1 — Base time (in hours)
  const carpetHours = (facility.sqft_carpet || 0) / productionRate
  const hardFloorHours = (facility.sqft_hard_floor || 0) / HARD_FLOOR_RATE
  const restroomHours = ((facility.restrooms || 0) * PRICING.minutesPerRestroom) / 60
  const binHours =
    (((facility.trash_bins || 0) + (facility.recycle_bins || 0)) * PRICING.minutesPerBin) / 60

  const subtotalHours = carpetHours + hardFloorHours + restroomHours + binHours

  // Step 2 — Apply condition
  const totalHoursPerClean = subtotalHours * conditionDef.multiplier

  // Step 3 — Price
  const pricePerClean = totalHoursPerClean * PRICING.billableRate
  const cleaningsPerMonth = frequencyDef.perMonth
  const monthlyBid = pricePerClean * cleaningsPerMonth

  return {
    contact: { ...contact },
    agreement: { ...agreement },
    facility: { ...facility },
    areas: { ...areas },
    custom_notes: (custom_notes || '').trim(),
    calculation: {
      production_rate_used: productionRate,
      hard_floor_rate_used: HARD_FLOOR_RATE,
      condition_multiplier: conditionDef.multiplier,
      cleanings_per_week: frequencyDef.perWeek,
      cleanings_per_month: cleaningsPerMonth,
      hours_breakdown: {
        carpet: round(carpetHours, 3),
        hard_floor: round(hardFloorHours, 3),
        restrooms: round(restroomHours, 3),
        bins: round(binHours, 3),
        subtotal: round(subtotalHours, 3),
      },
      total_hours_per_clean: round(totalHoursPerClean, 3),
      price_per_clean: round(pricePerClean, 2),
      monthly_bid: round(monthlyBid, 2),
      billable_rate: PRICING.billableRate,
    },
    scope_blocks: buildScopeBlocks(areas),
    meta: {
      generated_at: new Date().toISOString(),
      version: '2.0.0',
    },
  }
}

/**
 * Build the conditional Scope of Work blocks. Only includes areas the user
 * has checked. Quantity-bearing areas (restrooms, conference rooms) attach
 * the count so the agreement can show "RESTROOMS (4)".
 */
function buildScopeBlocks(areas) {
  if (!areas) return []
  return FACILITY_AREAS
    .filter(area => areas[area.id]?.selected)
    .map(area => ({
      id: area.id,
      label: area.label,
      quantity: area.needsQuantity ? Number(areas[area.id]?.quantity) || null : null,
      tasks: area.tasks,
    }))
}

function round(n, places = 2) {
  const f = Math.pow(10, places)
  return Math.round(n * f) / f
}

// Useful helpers for the UI
export function getFacilityLabel(id) {
  return FACILITY_TYPES.find(t => t.id === id)?.label ?? id
}
export function getConditionLabel(id) {
  return CONDITIONS.find(c => c.id === id)?.label ?? id
}
export function getFrequencyLabel(id) {
  return FREQUENCIES.find(f => f.id === id)?.label ?? id
}

export function formatCurrency(n) {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatNumber(n, decimals = 2) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format an ISO date (YYYY-MM-DD) as "January 5, 2026". Returns a
 * placeholder string if input is empty/invalid.
 */
export function formatLongDate(iso) {
  if (!iso) return '__________________'
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** YYYY-MM-DD for today (local time). */
export function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** Build the recommended filename: PJS_ServiceAgreement_LastName_YYYYMMDD */
export function buildFilename({ contact, agreement }) {
  const lastName = (contact?.contact_name || 'Client').trim().split(/\s+/).pop() || 'Client'
  const cleanLast = lastName.replace(/[^A-Za-z0-9-]/g, '')
  const dateStr = (agreement?.agreement_date || todayISO()).replace(/-/g, '')
  return `PJS_ServiceAgreement_${cleanLast}_${dateStr}`
}
