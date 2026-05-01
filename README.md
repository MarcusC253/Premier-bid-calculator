# Premier Janitorial Bid Calculator

A mobile-first React app for generating commercial cleaning bids on the spot. Built for `bid.premierjanservices.com`.

---

## Quick reference

- **Edit pricing:** `src/config/pricing.js` (only file you ever need to touch)
- **Local dev:** `npm install && npm run dev`
- **Deploy:** push to GitHub — Netlify auto-builds and ships
- **Live URL (after setup):** `https://bid.premierjanservices.com`

---

## What's in here

```
bid-calculator/
├── src/
│   ├── App.jsx                  ← Main app, multi-step state machine
│   ├── main.jsx                 ← React entry point
│   ├── index.css                ← Global styles + Tailwind
│   ├── config/
│   │   └── pricing.js           ← ⭐ ALL pricing constants live here
│   ├── lib/
│   │   └── calculate.js         ← Bid math (pure functions)
│   └── components/
│       ├── Wordmark.jsx         ← Logo
│       ├── ProgressBar.jsx
│       ├── Inputs.jsx           ← Reusable form primitives
│       ├── StepContact.jsx      ← Step 1
│       ├── StepFacilityType.jsx ← Step 2
│       ├── StepSquareFootage.jsx← Step 3
│       ├── StepRestroomsWaste.jsx← Step 4
│       ├── StepCondition.jsx    ← Step 5
│       ├── StepFrequency.jsx    ← Step 6
│       └── ResultsScreen.jsx    ← Step 7 — the bid output
├── public/
│   └── favicon.svg
├── netlify.toml                 ← Netlify build + redirect config
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── index.html
```

---

## Run it locally

```bash
# 1. Install dependencies (one time)
npm install

# 2. Start the dev server
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Edits hot-reload automatically.

To preview a production build locally:

```bash
npm run build
npm run preview
```

---

## Edit the pricing — no code knowledge needed

**Open `src/config/pricing.js` in any text editor.** Every number that affects a bid is in this one file, clearly labeled.

### Change the billable rate

```js
export const PRICING = {
  // ...
  billableRate: 95.00,   // ← change this number, save, redeploy
}
```

### Change a production rate

```js
export const PRODUCTION_RATES = {
  open_office:    3500,    // ← sqft per hour
  mixed_office:   3000,
  medical_dental: 2250,
  warehouse:      9000,
  retail:         4500,
  school:         3500,
  church:         4000,
}
```

### Change condition multipliers

```js
export const CONDITIONS = [
  { id: 'light',    label: 'Light / Clean',  multiplier: 1.00, blurb: '...' },
  { id: 'normal',   label: 'Normal',         multiplier: 1.10, blurb: '...' },
  // ...
]
```

### Change time per task

```js
export const PRICING = {
  // ...
  minutesPerRestroom: 6,
  minutesPerBin: 0.5,
}
```

### Change frequencies offered

```js
export const FREQUENCIES = [
  { id: '1x_week', label: '1× per week', perWeek: 1, perMonth: 4.33 },
  // add or remove rows here
]
```

### Change company contact info shown in the app

```js
export const COMPANY = {
  name: 'Premier Janitorial Services LLC',
  phone: '(253) 245-1534',
  email: 'marcus@premierjanservices.com',
  website: 'www.premierjanservices.com',
}
```

After saving any change, push to GitHub (or just save in the Netlify file editor) and Netlify rebuilds automatically. Live in ~60 seconds.

---

## Deploy to Netlify (one-time setup)

### Step 1 — Push the project to GitHub

```bash
cd bid-calculator
git init
git add .
git commit -m "Initial commit: bid calculator v1"

# Create a new private repo on github.com (e.g. "premier-bid-calculator"), then:
git remote add origin https://github.com/YOUR_USERNAME/premier-bid-calculator.git
git branch -M main
git push -u origin main
```

### Step 2 — Connect Netlify to the repo

1. Go to [app.netlify.com](https://app.netlify.com) and log in (or sign up, free tier is fine).
2. Click **Add new site** → **Import an existing project** → **Deploy with GitHub**.
3. Authorize Netlify if prompted, then pick the `premier-bid-calculator` repo.
4. Netlify auto-detects the build settings from `netlify.toml`. Confirm:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**.

After ~60 seconds, the site is live at a random Netlify URL like `https://random-name-12345.netlify.app`. Open it and confirm everything works.

### Step 3 — Rename the site (optional but cleaner)

In Netlify: **Site configuration** → **Site details** → **Change site name** → enter `premier-bid-calculator`. Now your default URL is `https://premier-bid-calculator.netlify.app`.

### Step 4 — Connect `bid.premierjanservices.com` via HostGator DNS

You're going to point a subdomain at the Netlify site. The custom domain itself stays on HostGator; only `bid.` is delegated to Netlify.

#### In Netlify:

1. Open the site → **Domain management** → **Add a domain**.
2. Enter `bid.premierjanservices.com` and click **Verify**.
3. When asked "Do you already own this domain?" — **Yes**.
4. Netlify will display DNS instructions. You'll see a CNAME target that looks like `apex-loadbalancer.netlify.com` or your site's Netlify URL. **Copy that target.**

#### In HostGator (cPanel for premierjanservices.com):

> Note: `premierjanservices.com` is on the Hatchling plan — IP `108.167.172.202`. DNS is managed in HostGator's cPanel under "Zone Editor" or directly through the Customer Portal's DNS manager.

1. Log into the HostGator Customer Portal.
2. Navigate to your hosting account for `premierjanservices.com`.
3. Open **cPanel** → **Zone Editor** (or **Domains** → **DNS Zone Editor**).
4. Find the row for `premierjanservices.com` and click **Manage**.
5. Click **+ Add Record** and select **CNAME**.
   - **Name / Host:** `bid` (HostGator may auto-append `.premierjanservices.com` — that's correct)
   - **TTL:** `14400` (default)
   - **Type:** `CNAME`
   - **Record / Target:** the Netlify CNAME target you copied (e.g. `premier-bid-calculator.netlify.app` — no `https://`, no trailing slash)
6. Save.

#### Back in Netlify:

7. Wait 5–15 minutes for DNS to propagate. (Sometimes faster, occasionally up to an hour.)
8. Refresh the Netlify domain settings page. When the green check appears next to `bid.premierjanservices.com`, click **Provision SSL certificate**. Netlify uses Let's Encrypt, free, automatic.
9. Done. Visit `https://bid.premierjanservices.com` — the calculator is live.

#### Verify DNS from the command line (optional):

```bash
dig bid.premierjanservices.com CNAME +short
# Should return: premier-bid-calculator.netlify.app  (or whatever you set)
```

---

## Deploying updates

Once the GitHub → Netlify pipeline is connected, every push to `main` auto-deploys.

```bash
# Edit a file (e.g. src/config/pricing.js)
git add .
git commit -m "Bump billable rate to $100/hr"
git push
```

Watch the deploy at `app.netlify.com` → your site → **Deploys**. Live in ~60 seconds.

For a quick edit without going through Git, you can also use Netlify's web file editor under **Site configuration** → **General** — but Git is cleaner long-term.

---

## v2 plan — GHL integration

The architecture is already set up for this. When ready:

1. **The bid object is already in GHL-ready JSON shape.** Look at `src/lib/calculate.js` — `computeBid()` returns the full payload.
2. **The "Send Proposal" button is already in the layout** on `ResultsScreen.jsx`, just disabled. Wire it up in v2.
3. **Add a webhook URL** to `src/config/pricing.js`:
   ```js
   export const GHL_WEBHOOK_URL = import.meta.env.VITE_GHL_WEBHOOK_URL
   ```
4. **In Netlify**, set an environment variable: `VITE_GHL_WEBHOOK_URL` = your inbound GHL webhook URL.
5. **Wire the button:**
   ```js
   async function sendProposal() {
     await fetch(GHL_WEBHOOK_URL, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(bid),
     })
   }
   ```
6. **In GHL,** build a workflow triggered by inbound webhook → create contact + opportunity → fire your existing proposal email template, populating fields from the JSON payload.

No re-architecture needed. The only file that has to change in any meaningful way is `ResultsScreen.jsx` (enable the button, add the handler).

---

## Troubleshooting

- **DNS not resolving after 1 hour.** Re-check the CNAME record in HostGator — typo in `bid`, missing target, or accidentally typed `A` record instead of `CNAME`.
- **SSL certificate stuck.** In Netlify, click **Renew certificate** under domain settings. If still failing, remove the domain, wait 5 min, re-add it.
- **Build fails on Netlify.** Check the deploy log for the failing command. Most often a missing dependency — fix in `package.json`, push, retry.
- **Form values reset between steps.** Shouldn't happen — state is held in `App.jsx`. If it does, check that you didn't accidentally remount the App component.

---

## Maintenance notes for Marcus

- **Backup the repo.** GitHub is your backup. Don't store the only copy on your laptop.
- **Don't edit the live `dist/` folder.** That's the build output. Always edit `src/` and let Netlify rebuild.
- **Test changes locally first** with `npm run dev` before pushing to main.
- **The pricing config is the only file Jessa or anyone non-technical should touch.** Lock down branch protection if you want, or have her submit changes via PR.

Built with React 18, Vite 5, and Tailwind 3.
