#!/usr/bin/env node
/**
 * enrich-food.js
 *
 * Finds FoodLog Notion rows that have a MapsURL but are missing Cuisine,
 * calls the Google Places API to auto-fill Cuisine + Neighborhood + Photo,
 * then sets Published = true.
 *
 * Run by GitHub Actions before the Next.js build.
 * Requires: NOTION_TOKEN, NOTION_DB_FOOD_LOG, GOOGLE_PLACES_API_KEY
 */

const https = require('https')

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_DB = process.env.NOTION_DB_FOOD_LOG
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!NOTION_TOKEN || !NOTION_DB) {
  console.log('[enrich-food] NOTION_TOKEN or NOTION_DB_FOOD_LOG not set — skipping.')
  process.exit(0)
}
if (!PLACES_KEY) {
  console.log('[enrich-food] GOOGLE_PLACES_API_KEY not set — skipping enrichment.')
  process.exit(0)
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}

function notionRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const req = https.request(
      {
        hostname: 'api.notion.com',
        path,
        method,
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolve(JSON.parse(data)))
      }
    )
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

// Map Google place types to cuisine select values
const TYPE_TO_CUISINE = {
  japanese_restaurant: 'Japanese',
  chinese_restaurant: 'Chinese',
  korean_restaurant: 'Korean',
  thai_restaurant: 'Thai',
  indian_restaurant: 'Indian',
  italian_restaurant: 'Italian',
  french_restaurant: 'French',
  american_restaurant: 'American',
  mexican_restaurant: 'Mexican',
  seafood_restaurant: 'Seafood',
  vegetarian_restaurant: 'Vegetarian',
  bakery: 'Bakery',
  cafe: 'Cafe',
  bar: 'Bar',
  fast_food_restaurant: 'Fast Food',
  hawker_centre: 'Hawker',
  food_court: 'Hawker',
}

function guessCuisine(types) {
  for (const type of types) {
    if (TYPE_TO_CUISINE[type]) return TYPE_TO_CUISINE[type]
  }
  return 'Other'
}

// Extract place ID from various Google Maps URL formats
function extractPlaceId(url) {
  // Format: maps/place/...!1s0x...!2s<PLACE_ID>... or ?place_id=ChIJ...
  const placeIdMatch = url.match(/place_id=([^&]+)/)
  if (placeIdMatch) return placeIdMatch[1]

  // Format: /maps/place/Name/@lat,lng,zoom/data=...!4m..!3m..!1s<PLACE_ID>
  const dataMatch = url.match(/!1s(ChIJ[^!]+)/)
  if (dataMatch) return dataMatch[1]

  return null
}

// Get search query from Maps URL for text search fallback
function extractSearchQuery(url) {
  try {
    const u = new URL(url)
    // /maps/place/Restaurant+Name/@...
    const placeMatch = u.pathname.match(/\/place\/([^/@]+)/)
    if (placeMatch) return decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
  } catch (_) {}
  return null
}

async function getPlaceDetails(mapsUrl) {
  const placeId = extractPlaceId(mapsUrl)

  if (placeId) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,types,vicinity,photos&key=${PLACES_KEY}`
    const data = await httpsGet(url)
    if (data.status === 'OK') return data.result
    console.warn(`[enrich-food] Place details failed for ${placeId}: ${data.status}`)
  }

  // Fallback: text search
  const query = extractSearchQuery(mapsUrl)
  if (query) {
    const encoded = encodeURIComponent(`${query} Singapore`)
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encoded}&key=${PLACES_KEY}`
    const data = await httpsGet(url)
    if (data.status === 'OK' && data.results.length > 0) {
      // Fetch full details for the first result
      const pid = data.results[0].place_id
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${pid}&fields=name,types,vicinity,photos&key=${PLACES_KEY}`
      const detail = await httpsGet(detailUrl)
      if (detail.status === 'OK') return detail.result
    }
    console.warn(`[enrich-food] Text search failed for "${query}": ${data.status}`)
  }

  return null
}

function getPhotoUrl(place) {
  if (!place.photos || !place.photos.length) return null
  const ref = place.photos[0].photo_reference
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${PLACES_KEY}`
}

async function main() {
  console.log('[enrich-food] Querying Notion for unenriched food entries...')

  // Find rows: MapsURL is not empty AND Cuisine is empty
  const queryRes = await notionRequest('POST', `/v1/databases/${NOTION_DB}/query`, {
    filter: {
      and: [
        { property: 'MapsURL', url: { is_not_empty: true } },
        { property: 'Cuisine', select: { is_empty: true } },
      ],
    },
    page_size: 20,
  })

  const pages = queryRes.results || []
  if (!pages.length) {
    console.log('[enrich-food] No entries to enrich.')
    return
  }

  console.log(`[enrich-food] Found ${pages.length} entries to enrich.`)

  for (const page of pages) {
    const name = page.properties.Name?.title?.map((t) => t.plain_text).join('') || '(unknown)'
    const mapsUrl = page.properties.MapsURL?.url
    if (!mapsUrl) continue

    console.log(`[enrich-food] Enriching: ${name}`)

    let place = null
    try {
      place = await getPlaceDetails(mapsUrl)
    } catch (e) {
      console.warn(`[enrich-food] Places API error for ${name}: ${e.message}`)
      continue
    }

    const cuisine = place ? guessCuisine(place.types || []) : 'Other'
    const neighborhood = place?.vicinity?.split(',')[0] || ''
    const photoUrl = place ? getPhotoUrl(place) : null

    const updateProps = {
      Cuisine: { select: { name: cuisine } },
      Published: { checkbox: true },
    }
    if (neighborhood) {
      updateProps.Neighborhood = { select: { name: neighborhood } }
    }
    if (photoUrl) {
      updateProps.Photo = { url: photoUrl }
    }

    try {
      await notionRequest('PATCH', `/v1/pages/${page.id}`, { properties: updateProps })
      console.log(`[enrich-food] ✓ ${name} — ${cuisine}, ${neighborhood}`)
    } catch (e) {
      console.warn(`[enrich-food] Failed to update ${name}: ${e.message}`)
    }

    // Brief pause to respect API rate limits
    await new Promise((r) => setTimeout(r, 300))
  }

  console.log('[enrich-food] Done.')
}

main().catch((e) => {
  console.error('[enrich-food] Fatal error:', e.message)
  process.exit(1)
})
