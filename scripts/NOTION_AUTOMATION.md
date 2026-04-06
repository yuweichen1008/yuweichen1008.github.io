# Automation Setup Guide

Full instructions for connecting Apple Health, Google Calendar, Google Maps, and Notion.

---

## 1. Notion Internal Integration

**Do this once before anything else.**

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Name it `yomi-site`, leave capabilities as default (Read/Write/No user info)
4. Copy the **Internal Integration Token** (starts with `ntn_...`)
5. Add it as GitHub Secret `NOTION_TOKEN`

**Connect each database:** Open each Notion DB → `⋯` menu → **"+ Add connections"** → select `yomi-site`

---

## 2. Notion Database IDs

Each DB ID is in the URL when you open a database in full-page view:
```
https://www.notion.so/<workspace>/<DATABASE_ID>?v=...
```
The 32-character string before the `?` is the ID.

Add each as a GitHub Secret:

| Secret name | Notion DB |
|---|---|
| `NOTION_DB_JOURNAL` | Journal |
| `NOTION_DB_TIMELINE` | Timeline |
| `NOTION_DB_FOOD_LOG` | FoodLog |
| `NOTION_DB_ADVENTURES` | Adventures |
| `NOTION_DB_FITNESS` | FitnessLog |
| `NOTION_DB_DAILY_STATS` | DailyStats |
| `NOTION_DB_NOW_STATUS` | NowStatus |
| `NOTION_DB_PROJECTS` | Projects |
| `NOTION_DB_GOALS` | Goals |
| `NOTION_DB_LIFE` | LifeChapters |

---

## 3. Journal Slug — Notion Formula (no code needed)

Instead of typing a slug manually, add a **Formula property** to the Journal DB that auto-generates it from the title.

1. Open your **Journal** Notion DB in full-page view
2. Click **"+ Add a property"** → choose **Formula**
3. Name it `Slug`
4. Paste this formula:

```
replaceAll(lower(replaceAll(replaceAll(prop("Name"), " ", "-"), "[^a-z0-9\\-]", "")), "--", "-")
```

5. Click **Confirm**

Now every journal entry gets a URL-safe slug automatically (e.g. "My Ramen Run" → `my-ramen-run`). The site reads this field — no manual slug entry needed.

---

## 4. Apple Shortcut — Daily Stats (Steps, Sleep, Weight)

This Shortcut runs each evening to log health data directly to Notion.

**Setup:**
1. Open the **Shortcuts** app on iPhone
2. Tap **"+"** to create a new shortcut
3. Add these actions in order:

### Actions:

**a) Get today's steps**
- Action: `Get Health Samples`
- Type: `Step Count`
- Period: `Today`
- Aggregate: `Sum`
- Save to variable: `steps`

**b) Get last night's sleep**
- Action: `Get Health Samples`
- Type: `Sleep Analysis` → select `Time in Bed`
- Period: `Last Night`
- Aggregate: `Sum`  
- Action: `Calculate` → divide by 3600 (converts seconds to hours)
- Save to variable: `sleepHours`

**c) Get current weight (optional)**
- Action: `Get Health Samples`
- Type: `Body Mass`
- Period: `Today` or `Latest Sample`
- Aggregate: `Latest`
- Save to variable: `weight`

**d) Get today's date**
- Action: `Format Date`
- Date: `Current Date`
- Format: `Custom` → `yyyy-MM-dd`
- Save to variable: `today`

**e) Create Notion entry**
- Action: `Get Contents of URL`
- URL: `https://api.notion.com/v1/pages`
- Method: `POST`
- Headers:
  - `Authorization`: `Bearer ntn_YOUR_TOKEN_HERE`
  - `Notion-Version`: `2022-06-28`
  - `Content-Type`: `application/json`
- Request Body (JSON):
```json
{
  "parent": { "database_id": "YOUR_NOTION_DB_DAILY_STATS_ID" },
  "properties": {
    "Name": { "title": [{ "text": { "content": "REPLACE_WITH_today_variable" } }] },
    "Date": { "date": { "start": "REPLACE_WITH_today_variable" } },
    "Steps": { "number": "REPLACE_WITH_steps_variable" },
    "Sleep": { "number": "REPLACE_WITH_sleepHours_variable" },
    "Weight": { "number": "REPLACE_WITH_weight_variable" }
  }
}
```
*(In the Shortcuts app, tap on each `REPLACE_WITH_xxx` and select the corresponding variable)*

**f) Show notification**
- Action: `Show Notification`
- Title: `✅ Logged`
- Body: `steps steps · sleepHours hrs sleep`

**Run it:** Manually each evening, or add an **Automation** (Shortcuts → Automation → Time of Day → 10 PM) to run it automatically.

---

## 5. Apple Shortcut — Quick Food Log

Log a restaurant visit on the spot, straight to Notion as a draft.

**Setup:** Create a new shortcut with these actions:

**a)** `Ask for Input` → Prompt: `Restaurant name?` → Save to `restaurantName`

**b)** `Choose from List` → Items: `1★  2★  3★  4★  5★` → Save to `ratingStr`

**c)** `Get Numbers from` `ratingStr` → Save to `rating`

**d)** `Ask for Input` → Prompt: `Quick note?` → Save to `notes`

**e)** `Format Date` → `yyyy-MM-dd` → Save to `today`

**f)** `Get Contents of URL`
- URL: `https://api.notion.com/v1/pages`
- Method: `POST`
- Headers: same as above
- Body:
```json
{
  "parent": { "database_id": "YOUR_NOTION_DB_FOOD_LOG_ID" },
  "properties": {
    "Name": { "title": [{ "text": { "content": "REPLACE_WITH_restaurantName" } }] },
    "VisitDate": { "date": { "start": "REPLACE_WITH_today" } },
    "Rating": { "number": "REPLACE_WITH_rating" },
    "Notes": { "rich_text": [{ "text": { "content": "REPLACE_WITH_notes" } }] },
    "Published": { "checkbox": false }
  }
}
```

**g)** `Show Notification` → `🍜 Logged restaurantName`

**After visiting:** Open Notion, find the draft entry, paste the Google Maps URL into the `MapsURL` field. The next CI build will auto-fill cuisine/neighborhood/photo and publish it.

---

## 6. Google Calendar Integration

### Step 1: Create a public calendar

1. Open [calendar.google.com](https://calendar.google.com)
2. On the left sidebar, click **"+"** next to "Other calendars" → **"Create new calendar"**
3. Name it **"Yomi Events"** (or anything you like)
4. Go to **Settings** (⚙️) → click your new calendar under "Settings for my calendars"
5. Scroll to **"Access permissions for events"**
6. Check **"Make available to public"** → confirm

### Step 2: Get the iCal URL

1. On the same settings page, scroll to **"Integrate calendar"**
2. Copy the **"Public address in iCal format"** — it looks like:
   ```
   https://calendar.google.com/calendar/ical/abc123%40group.calendar.google.com/public/basic.ics
   ```

### Step 3: Add as GitHub Secret

Add `GOOGLE_CALENDAR_ICAL_URL` = the iCal URL you copied.

### Privacy per event

- Each event has its own visibility in GCal (Edit event → More options → Visibility)
- **Public** → appears on the site calendar
- **Private** → hidden from the iCal feed → not shown on site
- Default for new events follows calendar-level setting (make it Public)

---

## 7. Google Places API (Food Auto-enrichment)

### Step 1: Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project: **"yomi-site"**
3. Go to **"APIs & Services"** → **"Enable APIs and Services"**
4. Search for and enable:
   - **"Places API"**
   - **"Maps JavaScript API"** (optional, for future use)

### Step 2: Create an API key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"API Key"**
3. Copy the key
4. Click **"Restrict Key"**:
   - Under "API restrictions", select "Restrict key" → choose "Places API"
   - Save

### Step 3: Add billing (required but effectively free)

Google requires a billing account but provides **$200 USD free credit per month**.
- Places Details: $17 per 1,000 calls → your ~5 new entries/week = ~$0.09/month
- You will not be charged at this usage level.

### Step 4: Add as GitHub Secret

`GOOGLE_PLACES_API_KEY` = your API key

### How it works

When you paste a Google Maps URL into the `MapsURL` field in Notion and the `Cuisine` field is empty:
1. The daily CI build runs `scripts/enrich-food.js`
2. It calls the Places API to look up the restaurant
3. It auto-fills: **Cuisine** (from place types), **Neighborhood** (from vicinity), **Photo** (first place photo)
4. Sets **Published = true** → the entry appears on the site after the build

---

## 8. GitHub Secrets Summary

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Where to get it |
|---|---|
| `NOTION_TOKEN` | notion.so/my-integrations |
| `NOTION_DB_JOURNAL` | Notion DB URL |
| `NOTION_DB_TIMELINE` | Notion DB URL |
| `NOTION_DB_FOOD_LOG` | Notion DB URL |
| `NOTION_DB_ADVENTURES` | Notion DB URL |
| `NOTION_DB_FITNESS` | Notion DB URL |
| `NOTION_DB_DAILY_STATS` | Notion DB URL |
| `NOTION_DB_NOW_STATUS` | Notion DB URL |
| `NOTION_DB_PROJECTS` | Notion DB URL |
| `NOTION_DB_GOALS` | Notion DB URL |
| `NOTION_DB_LIFE` | Notion DB URL |
| `GOOGLE_CALENDAR_ICAL_URL` | Google Calendar settings → Integrate calendar |
| `GOOGLE_PLACES_API_KEY` | Google Cloud Console → Credentials |
| `NEXT_PUBLIC_GISCUS_REPO` | giscus.app (optional — enables comments) |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | giscus.app |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | giscus.app |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | giscus.app |

---

## 9. Verify Everything

After adding secrets, go to **Actions** tab on GitHub → **"Run workflow"** manually.

Then check: `https://yuweichen1008.github.io/yuweichen1008/debug`

Each database should show **✓ OK**. Any **✗ error** means either the secret is wrong or the integration wasn't connected to that database in Notion.
