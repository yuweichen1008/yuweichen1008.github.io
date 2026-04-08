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

> **Time to set up:** ~15 minutes  
> **Runs:** Once per evening (or auto at 10 PM)  
> **Result:** One new row in your Notion DailyStats DB every day

### Before you start — have these ready

- Your **Notion Token**: `ntn_XXXXXXXX...` (from Section 1)
- Your **DailyStats DB ID**: 32-character string from the Notion URL (from Section 2)

---

### Step 1 — Create the Shortcut

1. Open the **Shortcuts** app on your iPhone
2. Tap the **"+"** button in the top-right corner
3. Tap **"Add Action"** (the search bar at the bottom)
4. Tap the title bar at the top (says "New Shortcut") → rename it **"Log Daily Stats"**

---

### Step 2 — Get Step Count

1. In the search bar type **"Health"** → tap **"Get Health Samples"**
2. The action appears. Tap the blue **"Type"** word → search for **"Step Count"** → select it
3. Tap **"Period"** → select **"Today"**
4. Tap **"Include"** → select **"Sum"** (you want total steps, not individual samples)
5. Tap **"Results"** (the output token) → tap **"Add to Variable"** → name it **`Steps`**

```
┌─────────────────────────────────────┐
│  Get Health Samples                 │
│  Type:    Step Count          ▼     │
│  Period:  Today               ▼     │
│  Include: Sum                 ▼     │
│                                     │
│  → Add to Variable: Steps           │
└─────────────────────────────────────┘
```

---

### Step 3 — Get Sleep Hours

Sleep is stored in seconds, so you need to divide by 3600.

1. Add another **"Get Health Samples"** action
2. Tap **"Type"** → search **"Asleep"** → select **"Time Asleep"**  
   *(If you don't see it, try "Sleep Analysis" and pick "Asleep")*
3. Tap **"Period"** → **"Last Night"**
4. Tap **"Include"** → **"Sum"**
5. Tap the result token → **"Add to Variable"** → name it **`SleepSeconds`**

Now divide by 3600:

6. Add a **"Calculate"** action (search "Calculate")
7. Set it to: **`SleepSeconds`** ÷ **3600**
8. Tap the result → **"Add to Variable"** → name it **`SleepHours`**

```
┌─────────────────────────────────────┐
│  Get Health Samples                 │
│  Type:    Time Asleep         ▼     │
│  Period:  Last Night          ▼     │
│  Include: Sum                 ▼     │
│  → Add to Variable: SleepSeconds    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Calculate                          │
│  [SleepSeconds]  ÷  3600            │
│  → Add to Variable: SleepHours      │
└─────────────────────────────────────┘
```

> **Tip:** If the Shortcuts app doesn't show "Time Asleep" as an option, use "Time in Bed" instead. It's slightly different (includes awake time in bed) but good enough.

---

### Step 4 — Get Weight (optional)

Skip this if you don't log weight in Apple Health.

1. Add **"Get Health Samples"**
2. Type → **"Body Mass"**
3. Period → **"This Week"**
4. Include → **"Latest Sample"**
5. Result → **"Add to Variable"** → name it **`Weight`**

---

### Step 5 — Format Today's Date

The Notion API needs dates in `YYYY-MM-DD` format (e.g. `2026-04-07`).

1. Add **"Format Date"** action (search "Format Date")
2. Tap **"Date"** → select **"Current Date"**
3. Tap **"Format"** → select **"Custom"**
4. In the custom field type exactly: **`yyyy-MM-dd`**
5. Result → **"Add to Variable"** → name it **`Today`**

```
┌─────────────────────────────────────┐
│  Format Date                        │
│  Date:    Current Date        ▼     │
│  Format:  Custom              ▼     │
│           yyyy-MM-dd                │
│  → Add to Variable: Today           │
└─────────────────────────────────────┘
```

---

### Step 6 — Build the JSON body (Text action)

This is the trickiest part. You'll write JSON as a Text block and insert your variables inline.

1. Add a **"Text"** action (search "Text")
2. Tap inside the text field and type the JSON below
3. When you reach a spot marked `[VARIABLE]`, **don't type it** — instead:
   - Tap in the text field at that position
   - Tap the **variable token button** (looks like `{x}` in the keyboard bar above the keyboard)
   - Select the variable from the list

Type this, inserting variables where shown:

```
{"parent":{"database_id":"YOUR_DB_ID_HERE"},"properties":{"Name":{"title":[{"text":{"content":"[Today]"}}]},"Date":{"date":{"start":"[Today]"}},"Steps":{"number":[Steps]},"Sleep":{"number":[SleepHours]},"Weight":{"number":[Weight]}}}
```

Replace:
- `YOUR_DB_ID_HERE` → paste your actual DailyStats DB ID (the 32-char string)
- `[Today]` → tap the `{x}` button → select **Today** variable (do this twice — once for Name, once for Date)
- `[Steps]` → tap `{x}` → select **Steps**
- `[SleepHours]` → tap `{x}` → select **SleepHours**
- `[Weight]` → tap `{x}` → select **Weight** (or delete `,"Weight":{"number":[Weight]}` if skipping)

4. Result → **"Add to Variable"** → name it **`Body`**

> **What it looks like in Shortcuts:** The variables appear as colored pill-shaped tokens inside the text, not as plain text. That's correct — Shortcuts substitutes the real values at runtime.

---

### Step 7 — Send to Notion

1. Add **"Get Contents of URL"** (search "Get Contents of URL")
2. Tap the URL field → type: `https://api.notion.com/v1/pages`
3. Tap **"Method"** → select **"POST"**
4. Tap **"Headers"** → tap **"Add new field"** three times:

   | Key | Value |
   |-----|-------|
   | `Authorization` | `Bearer ntn_YOUR_TOKEN_HERE` ← paste your real token |
   | `Notion-Version` | `2022-06-28` |
   | `Content-Type` | `application/json` |

5. Tap **"Request Body"** → select **"File"**  
   *(This lets you pass the raw JSON text variable)*
6. Tap the content field → tap `{x}` → select **Body**

```
┌─────────────────────────────────────────────────┐
│  Get Contents of URL                            │
│  URL: https://api.notion.com/v1/pages           │
│  Method: POST                             ▼     │
│                                                 │
│  Headers:                                       │
│    Authorization:   Bearer ntn_xxxx...          │
│    Notion-Version:  2022-06-28                  │
│    Content-Type:    application/json            │
│                                                 │
│  Request Body: File                       ▼     │
│    [Body]                                       │
└─────────────────────────────────────────────────┘
```

---

### Step 8 — Success Notification

1. Add **"Show Notification"** action
2. Title: `✅ Stats logged`
3. Body: tap `{x}` and insert **Steps**, then type ` steps · `, insert **SleepHours**, then type ` hrs sleep`

Result looks like: *"8,432 steps · 7.2 hrs sleep"*

---

### Step 9 — Test it

1. Tap the **▶ Play** button at the bottom of the Shortcut editor
2. It will ask for Health permissions the first time — tap **Allow All**
3. Check your Notion DailyStats DB — a new row should appear within a few seconds

**If it fails:** Tap the result of the "Get Contents of URL" step after running — it shows the Notion API response. Common errors:
- `401 Unauthorized` → your token is wrong or has a typo
- `400 Bad Request` → the DB ID is wrong, or the JSON has a formatting error
- `404 Not Found` → the integration isn't connected to the DailyStats DB (do Section 1 → "Connect each database")

---

### Step 10 — Automate it (run every night at 10 PM)

1. Open **Shortcuts** app → tap **"Automation"** tab (bottom)
2. Tap **"+"** → **"Personal Automation"**
3. Tap **"Time of Day"**
4. Set time: **10:00 PM**, repeat: **Daily**
5. Tap **"Next"** → tap **"Add Action"** → search **"Run Shortcut"**
6. Select **"Log Daily Stats"**
7. Tap **"Next"** → turn **OFF** "Ask Before Running" → **"Done"**

It now runs silently every night and you wake up to a new row in Notion.

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
