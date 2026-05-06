# scripts/

Utility scripts for maintaining the site. Run from the **repo root** (not from `src/`).

---

## Fog of World map — update visited countries

The landing page shows an interactive world map with countries you've visited highlighted in teal. The data lives in [`src/data/fowData.js`](../src/data/fowData.js) and is updated by running a one-command parser.

### Step 1 — Create your input file

Copy the example template to the repo root:

```bash
cp scripts/fow-input.example.json fow-input.json
```

Open `fow-input.json` and edit two arrays:

| Field | What to put |
|---|---|
| `countries` | ISO 3166-1 **alpha-2** codes (two-letter) for every country you've visited, e.g. `"JP"`, `"SG"` |
| `cities` | City highlights — `name`, decimal `lat`, decimal `lng` — shown as amber dots on the map |

**Finding country codes:**  
Google the country name + "ISO 3166-1 alpha-2". Example: Taiwan = `TW`, South Korea = `KR`.

**Finding coordinates:**  
Google Maps → right-click a city → the first item in the menu is the decimal lat/lng.  
Or use [latlong.net](https://www.latlong.net/).

### Step 2 — Run the parser

```bash
node scripts/parseFow.js
```

This overwrites `src/data/fowData.js` with the converted data (numeric codes the map component needs) and prints a summary:

```
✅ fowData.js updated
   23 countries · 18 cities
   → src/data/fowData.js
```

### Step 3 — Preview locally

```bash
cd src && NODE_OPTIONS=--openssl-legacy-provider npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and scroll to the Fog of World section to confirm the new countries are highlighted and city dots appear correctly.

### Step 4 — Commit and push

```bash
git add fow-input.json src/data/fowData.js
git commit -m "feat: update FoW travel data"
git push
```

The CI workflow builds and deploys automatically. The live site updates within ~3 minutes.

### Keeping `fow-input.json` up to date

`fow-input.json` is the source of truth for your travel data — keep it in the repo so future updates are incremental edits. When you visit a new country, add its code to `countries`, optionally add a city to `highlights`, then repeat steps 2–4.

---

## enrich-food.js

Runs automatically in CI (before the Next.js build). Reads Notion food log entries that have a Google Maps URL but are missing cuisine/neighbourhood metadata, calls the Google Places API to fill them in, and marks entries as published.

Requires env vars: `NOTION_TOKEN`, `NOTION_DB_FOOD_LOG`, `GOOGLE_PLACES_API_KEY`.

Local run (for testing):

```bash
NOTION_TOKEN=xxx NOTION_DB_FOOD_LOG=yyy GOOGLE_PLACES_API_KEY=zzz node scripts/enrich-food.js
```

---

## pre-push (git hook)

Runs a full `next build && next export` before every `git push` to catch build errors locally. Install once per clone:

```bash
npm run setup-hooks   # from src/
```
