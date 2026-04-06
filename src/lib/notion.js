const { Client } = require('@notionhq/client')

const notion = process.env.NOTION_TOKEN
  ? new Client({ auth: process.env.NOTION_TOKEN })
  : null

async function queryDatabase(databaseId, filter) {
  if (!notion || !databaseId) return []
  try {
    const pages = []
    let cursor = undefined
    do {
      const { results, next_cursor } = await notion.databases.query({
        database_id: databaseId,
        filter,
        start_cursor: cursor,
      })
      pages.push(...results)
      cursor = next_cursor
    } while (cursor)
    return pages
  } catch (err) {
    console.warn(`[notion] Failed to query ${databaseId}:`, err.message)
    return []
  }
}

function getText(prop) {
  if (!prop || !prop.rich_text) return ''
  return prop.rich_text.map((t) => t.plain_text).join('')
}

function getTitle(prop) {
  if (!prop || !prop.title) return ''
  return prop.title.map((t) => t.plain_text).join('')
}

function getSelect(prop) {
  return prop?.select?.name || ''
}

function getMultiSelect(prop) {
  return prop?.multi_select?.map((s) => s.name) || []
}

function getDate(prop) {
  return prop?.date?.start || ''
}

function getNumber(prop) {
  return prop?.number ?? null
}

function getUrl(prop) {
  return prop?.url || ''
}

// ─── Journal ─────────────────────────────────────────────────────────────────

function mapJournalPage(page) {
  const props = page.properties
  return {
    id: page.id,
    title: getTitle(props.Name),
    date: getDate(props.Date),
    slug: getText(props.Slug) || page.id,
    categories: getMultiSelect(props.Categories),
    mood: getSelect(props.Mood),
    summary: getText(props.Summary),
  }
}

async function getJournalEntries() {
  const pages = await queryDatabase(process.env.NOTION_DB_JOURNAL, {
    property: 'Published',
    checkbox: { equals: true },
  })
  return pages.map(mapJournalPage)
}

async function getJournalEntry(slug) {
  if (!notion) return null
  try {
    const pages = await queryDatabase(process.env.NOTION_DB_JOURNAL, {
      and: [
        { property: 'Published', checkbox: { equals: true } },
        { property: 'Slug', rich_text: { equals: slug } },
      ],
    })
    if (!pages.length) return null
    const page = pages[0]
    const blocks = await getPageBlocks(page.id)
    return { ...mapJournalPage(page), blocks }
  } catch (err) {
    console.warn('[notion] getJournalEntry failed:', err.message)
    return null
  }
}

// ─── Page Blocks ──────────────────────────────────────────────────────────────

async function getPageBlocks(pageId) {
  if (!notion) return []
  try {
    const blocks = []
    let cursor = undefined
    do {
      const { results, next_cursor } = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
      })
      blocks.push(...results)
      cursor = next_cursor
    } while (cursor)
    return blocks
  } catch (err) {
    console.warn('[notion] getPageBlocks failed:', err.message)
    return []
  }
}

// ─── Timeline ────────────────────────────────────────────────────────────────

async function getTimelineEvents() {
  const pages = await queryDatabase(process.env.NOTION_DB_TIMELINE)
  return pages
    .map((page) => {
      const props = page.properties
      return {
        id: page.id,
        title: getTitle(props.Name),
        date: getDate(props.Date),
        location: getSelect(props.Location),
        categories: getMultiSelect(props.Category),
        description: getText(props.Description),
        photo: getUrl(props.Photo),
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// ─── Food Log ────────────────────────────────────────────────────────────────

async function getFoodLog() {
  const pages = await queryDatabase(process.env.NOTION_DB_FOOD_LOG)
  return pages
    .map((page) => {
      const props = page.properties
      return {
        id: page.id,
        name: getTitle(props.Name),
        cuisine: getSelect(props.Cuisine),
        michelinStatus: getSelect(props.MichelinStatus),
        neighborhood: getSelect(props.Neighborhood),
        rating: getNumber(props.Rating),
        visitDate: getDate(props.VisitDate),
        notes: getText(props.Notes),
        photo: getUrl(props.Photo),
        address: getText(props.Address),
      }
    })
    .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
}

// ─── Adventures ──────────────────────────────────────────────────────────────

async function getAdventures() {
  const pages = await queryDatabase(process.env.NOTION_DB_ADVENTURES)
  return pages.map((page) => {
    const props = page.properties
    return {
      id: page.id,
      name: getTitle(props.Name),
      country: getSelect(props.Country),
      status: getSelect(props.Status),
      dates: getDate(props.Dates),
      transportNotes: getText(props.TransportNotes),
      notes: getText(props.Notes),
      linkedEntry: getUrl(props.LinkedEntry),
      photo: getUrl(props.Photo),
    }
  })
}

// ─── Fitness Log ─────────────────────────────────────────────────────────────

async function getFitnessLog() {
  const pages = await queryDatabase(process.env.NOTION_DB_FITNESS)
  return pages
    .map((page) => {
      const props = page.properties
      return {
        id: page.id,
        name: getTitle(props.Name),
        date: getDate(props.Date),
        type: getSelect(props.Type),
        distance: getNumber(props.Distance),
        duration: getNumber(props.Duration),
        pace: getText(props.Pace),
        heartRate: getNumber(props.HeartRate),
        notes: getText(props.Notes),
        route: getUrl(props.Route),
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

module.exports = {
  getJournalEntries,
  getJournalEntry,
  getPageBlocks,
  getTimelineEvents,
  getFoodLog,
  getAdventures,
  getFitnessLog,
}
