# Deploying v2 to bid.premierjanservices.com

Your existing Netlify site (`premier-bid-calculator`) deploys from the GitHub
repo `MarcusC253/Premier-bid-calculator`. v2 ships through the same pipeline:
push to `main`, Netlify builds and deploys automatically.

You have three reasonable paths. Pick whichever matches your comfort level.

---

## Path A — Direct push to main (fastest, ~5 minutes)

If you want v2 live immediately and you're comfortable with v1 going away:

```bash
# 1. From your local clone of the repo:
cd /path/to/Premier-bid-calculator
git checkout main
git pull

# 2. Replace the working tree with v2 contents.
#    Unzip pjs-bid-calculator-v2.zip somewhere, then:
rsync -av --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  /path/to/unzipped-v2/ ./

# 3. Verify it builds locally:
npm install
npm run build      # should finish with "✓ built in ~3s"
npm run dev        # spot-check at http://localhost:5173

# 4. Commit and push:
git add -A
git commit -m "v2: full Service Agreement output

- Bumped TOTAL_STEPS 6 → 9 (added Agreement Details, Areas, Custom Notes)
- ResultsScreen rewritten as 11-section Service Agreement
- Conditional Scope of Work driven by checked facility areas
- Pricing math byte-for-byte identical to v1
- See CHANGELOG_V2.md for full diff"

git push origin main
```

Netlify will detect the push and rebuild. Watch the deploy at
`https://app.netlify.com/projects/<your-project>/deploys`. Build should finish
in ~30–60 seconds. Once live, hit `bid.premierjanservices.com` and verify the
9-step flow.

---

## Path B — Branch + preview deploy (safer, ~10 minutes)

If you want to see v2 live on a Netlify preview URL before pointing the main
domain at it:

```bash
# 1. Create a v2 branch from main
cd /path/to/Premier-bid-calculator
git checkout -b v2-service-agreement
git pull origin main

# 2. Replace files (same rsync as Path A)
rsync -av --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  /path/to/unzipped-v2/ ./

# 3. Build locally to confirm
npm install && npm run build

# 4. Push the branch
git add -A
git commit -m "v2: full Service Agreement output (see CHANGELOG_V2.md)"
git push -u origin v2-service-agreement
```

Netlify automatically generates a deploy preview at a URL like
`https://v2-service-agreement--premier-bid-calculator.netlify.app`.

Test the full flow there with a real prospect's data (or the test scenario
from the spec). When you're satisfied:

```bash
git checkout main
git merge v2-service-agreement
git push origin main
```

That triggers the production deploy to `bid.premierjanservices.com`.

---

## Path C — Manual drag-and-drop deploy (if Git is being painful)

If you'd rather skip Git for this update:

```bash
# 1. From the unzipped v2 folder:
cd /path/to/unzipped-v2
npm install
npm run build
```

This creates a `dist/` folder. In the Netlify dashboard:

1. Go to your `premier-bid-calculator` project
2. Click **Deploys** in the left nav
3. Drag the entire `dist/` folder onto the "Need to update your site? Drag and drop your site folder here" zone at the bottom

Netlify will deploy that as a one-off. **Caveat:** this disconnects this
particular deploy from your GitHub repo until your next git push. Any future
`git push` to `main` will replace this manual deploy with whatever's in the
repo. So if you go this route, also commit the v2 files to the repo afterward
(or manual deploys will keep getting overwritten).

---

## Post-deploy checklist

After the deploy goes live, walk through this once on the production URL:

- [ ] Page title in the browser tab reads "Premier Janitorial · Service Agreement Builder"
- [ ] Step counter shows "Step 1 of 9" (not "1 of 6")
- [ ] Step 1 (Contact) has the new Site Address field
- [ ] Step 2 (Agreement) shows three fields: Agreement date (prefilled to today), Service start date, Service days/hours
- [ ] Step 6 (Areas) shows 7 checkbox cards; checking Restrooms reveals a quantity input
- [ ] Step 9 (Custom Notes) accepts blank and you can still proceed
- [ ] On the results screen: scroll the agreement and confirm 11 sections render
- [ ] Click "Print / Save PDF" → in the print dialog, signature block appears on its own page
- [ ] Click the disabled "Send Proposal" button → tooltip says "Coming soon — GHL integration"

---

## Rolling back

If something looks wrong on production:

**From Netlify dashboard:**
Deploys → find the last v1 deploy → click **Publish deploy**. Reverts in seconds.

**From Git:**
```bash
git revert HEAD
git push origin main
```

This creates a revert commit and Netlify rebuilds with v1.

---

## What's NOT changing

- Domain: still `bid.premierjanservices.com`
- Netlify project name: `premier-bid-calculator`
- GitHub repo: `MarcusC253/Premier-bid-calculator`
- `netlify.toml` build config
- Tailwind config / design tokens (ink, navy, accent palette)
- Build command (`npm run build`) and output directory (`dist`)

Nothing about the deployment pipeline needs reconfiguring. v2 just builds
into the same `dist/` Netlify is already configured to serve.
