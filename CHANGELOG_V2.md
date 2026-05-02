# v1 → v2 Changelog

A surgical retrofit of the Premier Bid Calculator. v1's architecture, design
tokens, and component primitives are preserved; v2 extends them to produce a
full Service Agreement instead of a bid summary.

---

## Quick stats

| | v1 | v2 |
|--|--|--|
| Form steps | 6 | 9 |
| Output sections | 3 (header, scope, exclusions) | 11 (full Service Agreement) |
| Output type | Bid summary | Signed-ready legal contract |
| Scope of work | Always-included static list | Conditional, area-by-area |
| Pricing math | unchanged | unchanged |
| State shape | `{ contact, facility }` | `{ contact, agreement, facility, areas, custom_notes }` |

The pricing engine is **byte-for-byte identical** in math. Same billable rate,
same production rates, same condition multipliers, same frequency table. Every
v1 number flows through to v2 unchanged.

---

## Files added (4)

| File | Purpose |
|--|--|
| `src/components/StepAgreement.jsx` | New step 2: agreement date, service start date, service days/hours |
| `src/components/StepAreas.jsx` | New step 6: multi-select facility areas with conditional quantity inputs |
| `src/components/StepCustomNotes.jsx` | New step 9: optional walkthrough notes textarea |
| (No new top-level config) | Areas + agreement boilerplate added inline to existing `src/config/pricing.js` to preserve the "edit one file" promise |

## Files modified (8)

### `src/App.jsx`
- `TOTAL_STEPS` 6 → 9
- Added state slices: `agreement`, `areas`, `customNotes`
- Step routing extended to handle steps 2 (Agreement), 6 (Areas), 9 (Custom Notes)
- Validation extended for new steps (Agreement requires all 3 fields; Areas requires ≥1 checked)
- `computeBid()` now receives the full v2 state shape
- Final-step CTA: "Calculate Bid" → "Generate Agreement"
- `handleRestart` resets all five state slices

### `src/config/pricing.js`
- All v1 values **preserved verbatim** (PRICING, PRODUCTION_RATES, FACILITY_TYPES, CONDITIONS, FREQUENCIES, COMPANY)
- Added `city`, `ownerName`, `ownerTitle` to `COMPANY` (needed for signature block)
- **Added `FACILITY_AREAS`**: 7 areas with full task lists tagged EV/M/Q
- **Added `AGREEMENT`**: insurance text, QC text, 12 terms (with `{serviceDaysHours}` template), additional services text, contract term label

### `src/lib/calculate.js`
- `computeBid()` signature: `{ contact, facility }` → `{ contact, agreement, facility, areas, custom_notes }`
- Same math, exact same output for `calculation` block
- Removed `buildScope()` (always-included static items) and `buildExclusions()` (replaced by conditional area blocks + the AGREEMENT boilerplate)
- Added `buildScopeBlocks(areas)`: returns conditional area-driven scope blocks with quantity attached for restrooms/conference rooms
- Added `formatLongDate(iso)`: "2026-06-01" → "June 1, 2026"
- Added `todayISO()`: today as YYYY-MM-DD
- Added `buildFilename({ contact, agreement })`: → `PJS_ServiceAgreement_Smith_20260502`
- Output JSON `meta.version`: 1.0.0 → 2.0.0

### `src/components/Inputs.jsx`
- All v1 primitives **preserved unchanged** (`Field`, `TextInput`, `NumberInput`, `ChoiceCard`)
- Added `DateInput`: native date picker, same Tailwind styling as TextInput
- Added `TextArea`: vertically resizable, same styling tokens
- Added `CheckCard`: checkbox card with optional inline conditional content (used by StepAreas for the per-area quantity input)

### `src/components/StepContact.jsx`
- Added `site_address` field (positioned between contact name and email)
- Hint text refined to mention the site address

### `src/components/ResultsScreen.jsx` — full rewrite
- v1: 3 sections (bid card, scope, exclusions)
- v2: 11 sections matching the spec exactly
  - Header (PJS branding + agreement title)
  - Section 01: Proposal Prepared For
  - Section 02: Agreement Details (with Monthly Investment as the headline figure)
  - Section 03: Scope of Work (conditional area blocks)
  - Section 04: Additional Scope Notes
  - Section 05: Insurance & Bonding
  - Section 06: Quality Control
  - Section 07: Terms & Conditions (numbered, with `{serviceDaysHours}` template substitution)
  - Section 08 (conditional): Custom Scope Addendum — only renders when `custom_notes` is non-empty
  - Section 09 (or 08): Agreement & Signatures — two columns, prefills PJS side with owner name + title, has `page-break-before` for print
  - Footer: filename suggestion + "Keep signed original in client folder"
- Action toolbar moved to the top of the screen (above the agreement) so it's visible without scrolling
- `Send Proposal` button preserved as disabled with v2-soon tooltip

### `src/index.css`
- Print rules expanded:
  - `@page` declaration: letter size, 0.6"×0.7" margins
  - `.agreement-section` and `.scope-block`: `break-inside: avoid`
  - `.page-break-before`: forces a page break before the signature block
  - Print body font tightened to 11pt / 1.45 line-height
  - Headings get `break-after: avoid` so they don't orphan
- All v1 tooltip, animation, and number-input styles preserved

### `index.html`
- Title: "Premier Janitorial · Bid Calculator" → "Premier Janitorial · Service Agreement Builder"
- Meta description updated to match

### `package.json`
- `version`: 1.0.0 → 2.0.0

## Files unchanged from v1 (12)

These weren't touched at all:

```
src/main.jsx
src/components/Wordmark.jsx
src/components/ProgressBar.jsx
src/components/StepFacilityType.jsx
src/components/StepSquareFootage.jsx
src/components/StepRestroomsWaste.jsx
src/components/StepCondition.jsx
src/components/StepFrequency.jsx
public/favicon.svg
tailwind.config.js
postcss.config.js
vite.config.js
netlify.toml
```

---

## Design decisions worth flagging

### Single source of truth for restroom count
The spec puts restroom count in two places: StepRestroomsWaste (drives pricing
math) and StepAreas (drives the "RESTROOMS (4)" header in the agreement). v2
keeps both UIs but auto-syncs them: when you check Restrooms on the Areas step,
the quantity prefills from the earlier step, and editing it there updates
`facility.restrooms` so pricing stays in sync. No double entry possible.

### Step 6 (Areas) requires at least one checked area
Without this, the Service Agreement's Scope of Work section would render
empty. The validator catches this before the user reaches the results screen.

### Custom notes step is optional
Validation passes with empty notes. If empty, the Custom Scope Addendum
section is suppressed entirely from the agreement and the signature block
becomes Section 08 instead of 09.

### "Maven website takeover" is not affected
This calculator runs at `bid.premierjanservices.com`, separate from the main
`premierjanservices.com` site managed by the third-party developer. v2 does
not touch any other property.
