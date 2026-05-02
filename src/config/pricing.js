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
  city: 'Tacoma, WA',
  phone: '(253) 245-1534',
  email: 'marcus@premierjanservices.com',
  website: 'www.premierjanservices.com',
  ownerName: 'Marcus Crockett',
  ownerTitle: 'Owner',
}

// ============================================================================
// v2 ADDITIONS — Facility areas (Scope of Work)
// ============================================================================
// Each area declares whether it needs a quantity input and lists the tasks
// that should appear in the Scope of Work when the area is selected.
//
// Frequency tags: EV = Each Visit, M = Monthly, Q = Quarterly.
// ============================================================================

export const FACILITY_AREAS = [
  {
    id: 'lobby',
    label: 'Lobby / Reception',
    needsQuantity: false,
    tasks: [
      { freq: 'EV', text: 'Remove trash from all bins and replace liners' },
      { freq: 'EV', text: 'Clean and disinfect all horizontal surfaces, light switches, and door handles' },
      { freq: 'EV', text: 'Vacuum or mop all floor surfaces' },
      { freq: 'EV', text: 'Dust all surfaces' },
      { freq: 'EV', text: 'Clean entrance glass — remove fingerprints and smudges without streaks' },
      { freq: 'M',  text: 'Wipe down all baseboards' },
      { freq: 'M',  text: 'Dust light fixtures and remove cobwebs throughout' },
      { freq: 'M',  text: 'Dust blinds and window frames throughout' },
      { freq: 'M',  text: 'Dust surfaces and underneath furniture and seating' },
    ],
  },
  {
    id: 'offices',
    label: 'Offices / Workstations',
    needsQuantity: false,
    tasks: [
      { freq: 'EV', text: 'Remove trash from all bins and replace liners' },
      { freq: 'EV', text: 'Clean and disinfect all horizontal surfaces, light switches, and door handles' },
      { freq: 'EV', text: 'Vacuum or mop all floor surfaces' },
      { freq: 'EV', text: 'Dust all surfaces' },
      { freq: 'EV', text: 'Vacuum stairs and sanitize handrails (if applicable)' },
      { freq: 'M',  text: 'Dust underside of chairs, desk counters, credenzas, and hutches' },
      { freq: 'M',  text: 'Dust behind monitors, printers, keyboards, mice, and phones' },
      { freq: 'M',  text: 'Wipe down all baseboards' },
      { freq: 'M',  text: 'Dust light fixtures and remove cobwebs throughout' },
      { freq: 'M',  text: 'Dust blinds and window frames throughout' },
    ],
  },
  {
    id: 'restrooms',
    label: 'Restrooms',
    needsQuantity: true,
    quantityLabel: 'Number of restrooms',
    tasks: [
      { freq: 'EV', text: 'Remove trash and replace liners' },
      { freq: 'EV', text: 'Clean and disinfect all light switches and door handles' },
      { freq: 'EV', text: 'Clean and disinfect toilets — seat, bowl interior/exterior, tank, base, and remove water rings' },
      { freq: 'EV', text: 'Clean and disinfect sinks including faucet handles' },
      { freq: 'EV', text: 'Clean mirrors without streaks or marks' },
      { freq: 'EV', text: 'Mop floors and clean baseboards' },
      { freq: 'EV', text: 'Remove recycling from recycling bins' },
      { freq: 'M',  text: 'Remove dirt or stains from inside trash bins' },
      { freq: 'M',  text: 'Vacuum fan vents' },
      { freq: 'M',  text: 'Dust light fixtures, underneath sinks, and remove cobwebs' },
      { freq: 'M',  text: 'Dust underneath cabinets and corners of walls' },
    ],
  },
  {
    id: 'breakroom',
    label: 'Break Room / Kitchen',
    needsQuantity: false,
    tasks: [
      { freq: 'EV', text: 'Remove trash from all bins and replace liners' },
      { freq: 'EV', text: 'Clean and disinfect all horizontal surfaces, light switches, and door handles' },
      { freq: 'EV', text: 'Clean sink and faucet handles' },
      { freq: 'EV', text: 'Wipe down exterior of appliances' },
      { freq: 'EV', text: 'Sweep and mop floor' },
      { freq: 'M',  text: 'Remove dirt or stains from inside trash and recycling bins' },
      { freq: 'M',  text: 'Dust surfaces and underneath furniture and seating' },
      { freq: 'M',  text: 'Wipe down all baseboards' },
      { freq: 'M',  text: 'Dust light fixtures and remove cobwebs throughout' },
    ],
  },
  {
    id: 'conference',
    label: 'Conference Rooms',
    needsQuantity: true,
    quantityLabel: 'Number of conference rooms',
    tasks: [
      { freq: 'EV', text: 'Remove trash from all bins and replace liners' },
      { freq: 'EV', text: 'Clean and disinfect tables, chairs, and surfaces' },
      { freq: 'EV', text: 'Vacuum or mop all floor surfaces' },
      { freq: 'EV', text: 'Wipe down whiteboards (if requested)' },
      { freq: 'M',  text: 'Dust light fixtures and remove cobwebs' },
      { freq: 'M',  text: 'Wipe down all baseboards' },
    ],
  },
  {
    id: 'stairs',
    label: 'Stairs / Multiple Floors',
    needsQuantity: false,
    tasks: [
      { freq: 'EV', text: 'Vacuum or mop all stair surfaces' },
      { freq: 'EV', text: 'Sanitize handrails along the full length of staircases' },
      { freq: 'EV', text: 'Spot-clean walls along stairwells' },
      { freq: 'M',  text: 'Dust baseboards, ledges, and corners of stairwells' },
      { freq: 'M',  text: 'Dust light fixtures and remove cobwebs' },
    ],
  },
  {
    id: 'hallways',
    label: 'Hallways / Common Areas',
    needsQuantity: false,
    tasks: [
      { freq: 'EV', text: 'Vacuum or mop all floor surfaces' },
      { freq: 'EV', text: 'Spot-clean walls and doors' },
      { freq: 'EV', text: 'Empty trash receptacles in common areas' },
      { freq: 'M',  text: 'Dust baseboards' },
      { freq: 'M',  text: 'Dust light fixtures and remove cobwebs' },
    ],
  },
]

// ============================================================================
// v2 ADDITIONS — Service Agreement boilerplate
// ============================================================================
// Centralized so the legal language can be edited in one place. Term 4 has a
// {serviceDaysHours} template variable — see ResultsScreen for substitution.
// ============================================================================

export const AGREEMENT = {
  contractTermLabel: '12 Months (auto-renewing)',

  insuranceText:
    'Premier Janitorial Services LLC maintains $2,000,000 general liability ' +
    'coverage and a $50,000 janitorial bond. Higher insurance limits may be ' +
    'accommodated upon written client request. Certificates of insurance are ' +
    'available upon request.',

  qualityControlText:
    "We conduct regular on-site evaluations to ensure our clients' " +
    'satisfaction. Our supervisors complete a quality control checklist after ' +
    'each clean on new accounts and on a scheduled basis for all existing ' +
    'accounts. Any issues identified are resolved within 24 hours of discovery.',

  // Term 4 inserts {serviceDaysHours}; everything else is static.
  terms: [
    'This is a rolling 12-month contract. The contract will automatically renew for additional 12-month periods unless terminated by either party in accordance with the terms of this agreement.',
    'The client may only terminate this contract due to poor service by Premier Janitorial Services LLC. The client must provide written notice of their dissatisfaction and give Premier Janitorial Services LLC a reasonable opportunity to remedy the issue before termination is initiated.',
    'Every 12 months, the contract will have a 3% cost of living increase. The new rate will be effective on the anniversary of the contract start date. Client will be notified in writing 30 days in advance.',
    'Days and hours of service: {serviceDaysHours}.',
    'All payments are due on the 3rd of each month. Premier Janitorial Services LLC will provide an invoice no later than the 25th of the prior month.',
    'If payment is not received by the 5th of the month, a late fee of $20.00 will be added for each additional day the payment is overdue.',
    'If the client cancels service for any reason other than documented poor performance by Premier Janitorial Services LLC, the client will pay a cancellation fee equal to 2.5 times the monthly service charge.',
    'The client will have a 60-day grace period at the beginning of the contract to ensure satisfaction with the cleaning service.',
    'If the client is not satisfied with the cleaning service within the first 60 days, they must provide at least 30 days written notice to exit the contract without cancellation penalty.',
    'If the client cancels service with an outstanding balance, Premier Janitorial Services LLC reserves the right to pursue collections for the balance owed, including any additional fees incurred during the collection process.',
    "Premier Janitorial Services LLC will notify the client within 2 hours of any key loss, property damage, or security incident at the client's facility.",
    'This agreement shall be governed by the laws of the State of Washington.',
  ],

  additionalServicesText:
    'Floor stripping & waxing, carpet cleaning, electrostatic disinfection ' +
    'spray, window washing, and post-construction cleanup.',
}
