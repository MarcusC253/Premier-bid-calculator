// ============================================================================
// PRICING CONFIG — Premier Janitorial Bid Calculator
// ============================================================================
// EDIT THIS FILE to change billable rate, production rates, multipliers, etc.
// No other file needs to change. Save, redeploy, done.
// ============================================================================

export const PRICING = {
  // -------- Labor & overhead (informational; only billableRate is used) ------
  cleanerLoadedRate: 30.00,        // $/hr
  supervisorLoadedRate: 38.00,     // $/hr
  supervisionFactor: 0.15,         // 15% of cleaning hours
  blendedLaborRate: 35.70,         // $/hr (cleaner + supervision blended)
  overheadAllocation: 25.00,       // $/hr
  trueCostPerHour: 60.70,          // $/hr
  targetMargin: 0.35,              // 35%+

  // -------- The number that actually drives bids ---------------------------
  billableRate: 95.00,             // $/hr

  // -------- Time-per-task (minutes) ----------------------------------------
  minutesPerRestroom: 6,
  minutesPerBin: 0.5,              // applies to trash + recycle bins
}

// Production rates (sqft per hour) for cleanable floor area
export const PRODUCTION_RATES = {
  open_office:    3500,
  mixed_office:   3000,
  medical_dental: 2250,
  warehouse:      9000,
  retail:         4500,
  school:         3500,
  church:         4000,
}

// Production rate for hard floor surfaces (regardless of facility type)
export const HARD_FLOOR_RATE = 2000

// Facility type display labels (used in the UI)
export const FACILITY_TYPES = [
  { id: 'open_office',    label: 'Office (open carpet)', blurb: 'Cubicles or open-plan, mostly carpet' },
  { id: 'mixed_office',   label: 'Office (mixed)',       blurb: 'Mix of carpet, hard floor, private offices' },
  { id: 'medical_dental', label: 'Medical or Dental',    blurb: 'Exam rooms, lobbies, sanitization-heavy' },
  { id: 'warehouse',      label: 'Warehouse',            blurb: 'Open production or storage areas' },
  { id: 'retail',         label: 'Retail',               blurb: 'Showroom or storefront' },
  { id: 'school',         label: 'School',               blurb: 'Classrooms, hallways, common areas' },
  { id: 'church',         label: 'Church',               blurb: 'Sanctuary, classrooms, common areas' },
]

// Condition multipliers
export const CONDITIONS = [
  { id: 'light',    label: 'Light / Clean',  multiplier: 1.00, blurb: 'Well-maintained, low foot traffic' },
  { id: 'normal',   label: 'Normal',         multiplier: 1.10, blurb: 'Typical commercial wear' },
  { id: 'heavy',    label: 'Heavy',          multiplier: 1.25, blurb: 'High traffic, visible buildup' },
  { id: 'disaster', label: 'Disaster',       multiplier: 1.50, blurb: 'Neglected, deep cleaning required' },
]

// Frequency multipliers (cleanings per month)
export const FREQUENCIES = [
  { id: '1x_week', label: '1× per week',         perWeek: 1, perMonth: 4.33 },
  { id: '2x_week', label: '2× per week',         perWeek: 2, perMonth: 8.67 },
  { id: '3x_week', label: '3× per week',         perWeek: 3, perMonth: 13.00 },
  { id: '4x_week', label: '4× per week',         perWeek: 4, perMonth: 17.33 },
  { id: '5x_week', label: '5× per week (M–F)',   perWeek: 5, perMonth: 21.67 },
  { id: '7x_week', label: '7× per week (daily)', perWeek: 7, perMonth: 30.33 },
]

// Branding
export const COMPANY = {
  name: 'Premier Janitorial Services LLC',
  shortName: 'Premier Janitorial',
  phone: '(253) 245-1534',
  email: 'marcus@premierjanservices.com',
  website: 'www.premierjanservices.com',
}
