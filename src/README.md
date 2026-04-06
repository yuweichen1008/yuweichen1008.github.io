# yuwei.life

Personal site for Yuwei Chen — built with Next.js 11 and Tailwind CSS, deployed to GitHub Pages.

## Pages

| Route | Description |
|---|---|
| `/life` | Three-city biography: Taiwan → Silicon Valley → Singapore |
| `/calendar` | 95-day sprint (Apr 1 → Jul 4, 2026) with daily log calendar |
| `/journal` | Day-to-day entries by category: food / exercise / friends / learning / work / entertainment / adventure |
| `/timeline` | Chronological life events, filterable by city and category |
| `/singapore` | Singapore hub → food log + nearby adventures |
| `/singapore/food` | Michelin & hawker food log |
| `/singapore/adventures` | Nearby trips (Batam, Bintan, JB, Bali, Bangkok, …) |
| `/fitness` | Activity log (run / cycle / swim / hike / gym) with weekly chart |

## Content management (Notion)

All content is managed via [Notion](https://notion.so) — no code edits needed for new entries.

### Databases required

| Database | Env secret | Purpose |
|---|---|---|
| Journal | `NOTION_DB_JOURNAL` | Daily log entries |
| Timeline | `NOTION_DB_TIMELINE` | Life events |
| FoodLog | `NOTION_DB_FOOD_LOG` | Restaurant / hawker visits |
| Adventures | `NOTION_DB_ADVENTURES` | Trip tracker |
| FitnessLog | `NOTION_DB_FITNESS` | Activity log |

### Setup

1. Create an **Internal Integration** at [notion.so/profile/integrations](https://www.notion.so/profile/integrations)
2. Create the five databases (schemas in [NOTION_SETUP.md](#notion-database-schemas) below)
3. Connect the integration to each database (`...` → Connect to → your integration)
4. Add secrets to GitHub repo: **Settings → Secrets and variables → Actions**

| Secret | Value |
|---|---|
| `NOTION_TOKEN` | Internal Integration Secret (`ntn_...`) |
| `NOTION_DB_JOURNAL` | Journal database ID (from URL) |
| `NOTION_DB_TIMELINE` | Timeline database ID |
| `NOTION_DB_FOOD_LOG` | FoodLog database ID |
| `NOTION_DB_ADVENTURES` | Adventures database ID |
| `NOTION_DB_FITNESS` | FitnessLog database ID |

### Local development

Create `src/.env.local` with the same six values, then:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site rebuilds automatically on every push and **daily at 2 AM UTC** (via GitHub Actions cron) to pick up new Notion content.

## Build

```bash
cd src
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

> **Note:** `NODE_OPTIONS=--openssl-legacy-provider` is required because Next.js 11 + Webpack 5 is incompatible with Node.js 17+ OpenSSL 3.

## Notion database schemas

### Journal

| Property | Type | Notes |
|---|---|---|
| Name | Title | Entry title |
| Date | Date | Entry date |
| Slug | Text | URL slug e.g. `2026-04-15-ramen-run` |
| Categories | Multi-select | food / exercise / friends / learning / work / entertainment / adventure |
| Mood | Select | great / good / okay / rough |
| Summary | Text | One-sentence preview |
| Published | Checkbox | Uncheck to draft |

### Timeline

| Property | Type |
|---|---|
| Name | Title |
| Date | Date |
| Location | Select: Silicon Valley / Taiwan / Singapore / Other |
| Category | Multi-select: work / travel / food / fitness / milestone / learning |
| Description | Text |
| Photo | URL |

### FoodLog

| Property | Type |
|---|---|
| Name | Title |
| Cuisine | Select |
| MichelinStatus | Select: Star / Bib Gourmand / Recommended / Hawker / None |
| Neighborhood | Select |
| Rating | Number (1–5) |
| VisitDate | Date |
| Notes | Text |
| Photo | URL |
| Address | Text |

### Adventures

| Property | Type |
|---|---|
| Name | Title |
| Country | Select |
| Status | Select: planned / completed / considering |
| Dates | Date |
| TransportNotes | Text |
| Notes | Text |
| LinkedEntry | URL |
| Photo | URL |

### FitnessLog

| Property | Type |
|---|---|
| Name | Title |
| Date | Date |
| Type | Select: Run / Cycle / Swim / Hike / Gym |
| Distance | Number (km) |
| Duration | Number (min) |
| Pace | Text (e.g. 5:30/km) |
| HeartRate | Number (avg bpm) |
| Notes | Text |
| Route | URL (Strava link) |

## Tech stack

- **Framework**: Next.js 11 (static export)
- **Styling**: Tailwind CSS v2
- **Content**: MDX (blog) + Notion API (journal/timeline/food/adventures/fitness)
- **Hosting**: GitHub Pages (`gh-pages` branch)
- **CI**: GitHub Actions — build on push + daily cron rebuild
