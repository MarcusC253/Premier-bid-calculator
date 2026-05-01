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
} from '../config/pricing.js'

/**
 * Compute the full bid from form inputs.
 * Returns the JSON object that will (in v2) be POSTed to GHL.
 */
export function computeBid({ contact, facility }) {
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
    facility: { ...facility },
    calculation: {
      // Detailed breakdown so v2 can render it in proposals if desired
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
    scope_of_work: buildScope(facility, frequencyDef),
    exclusions: buildExclusions(),
    meta: {
      generated_at: new Date().toISOString(),
      version: '1.0.0',
    },
  }
}

function buildScope(facility, frequencyDef) {
  const scope = []
  if ((facility.sqft_carpet || 0) > 0) {
    scope.push('Vacuum all carpeted areas')
  }
  if ((facility.sqft_hard_floor || 0) > 0) {
    scope.push('Sweep and mop all hard floor surfaces')
  }
  if ((facility.trash_bins || 0) > 0) {
    scope.push('Empty all waste receptacles and replace liners')
  }
  if ((facility.recycle_bins || 0) > 0) {
    scope.push('Empty and consolidate recycling per facility protocol')
  }
  if ((facility.restrooms || 0) > 0) {
    scope.push(
      'Clean and sanitize restrooms: toilets, sinks, mirrors, partitions; restock paper goods and soap; mop floors',
    )
  }
  // Always-included items
  scope.push('Dust horizontal surfaces below 6 feet')
  scope.push('Spot-clean glass doors and entry surfaces')
  scope.push('Empty and wipe down all desks left clear at end of day')
  // Schedule footer
  const freqLabel = frequencyDef.id === '7x_week' ? 'daily' : `${frequencyDef.perWeek} times per week`
  scope.push(`All services performed ${freqLabel} as per agreed schedule`)
  return scope
}

function buildExclusions() {
  return [
    'Window cleaning (interior or exterior)',
    'Carpet shampooing or extraction',
    'Hard floor strip and wax',
    'Specialty disinfection or fogging service',
    'Pressure washing (exterior)',
    'High dusting (above 6 feet)',
  ]
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
