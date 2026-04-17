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

async function getFeaturedArticles() {
  const pages = await queryDatabase(process.env.NOTION_DB_JOURNAL, {
    and: [
      { property: 'Published', checkbox: { equals: true } },
      { property: 'Featured', checkbox: { equals: true } },
    ],
  })
  return pages.map(mapJournalPage)
}

// Matches a bare Notion page UUID (fallback slug when Slug property is empty)
const NOTION_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getJournalEntry(slug) {
  if (!notion) return null
  try {
    let page = null
    if (NOTION_UUID_RE.test(slug)) {
      // Slug property was empty in Notion — fetch page directly by ID
      page = await notion.pages.retrieve({ page_id: slug })
    } else {
      const pages = await queryDatabase(process.env.NOTION_DB_JOURNAL, {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          { property: 'Slug', rich_text: { equals: slug } },
        ],
      })
      if (pages.length) page = pages[0]
    }
    if (!page) return null
    const blocks = await getPageBlocks(page.id)
    return { ...mapJournalPage(page), blocks, wordCount: countWordsInBlocks(blocks) }
  } catch (err) {
    console.warn('[notion] getJournalEntry failed:', err.message)
    return null
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countWordsInBlocks(blocks) {
  return blocks.reduce((total, block) => {
    const richText = block[block.type]?.rich_text || []
    const text = richText.map((t) => t.plain_text).join(' ')
    return total + text.split(/\s+/).filter(Boolean).length
  }, 0)
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
  const pages = await queryDatabase(process.env.NOTION_DB_TIMELINE, {
    property: 'Published',
    checkbox: { equals: true },
  })
  return pages
    .map((page) => {
      const props = page.properties
      return {
        id: page.id,
        title: getTitle(props.Name),
        date: getDate(props.Date),
        slug: getText(props.Slug) || page.id,
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
  const pages = await queryDatabase(process.env.NOTION_DB_FOOD_LOG, {
    property: 'Published',
    checkbox: { equals: true },
  })
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
        mapsUrl: getUrl(props.MapsURL),
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

// ─── Life Chapters ───────────────────────────────────────────────────────────

async function getLifeChapters() {
  const pages = await queryDatabase(process.env.NOTION_DB_LIFE, {
    property: 'Published',
    checkbox: { equals: true },
  })
  return pages
    .map((page) => {
      const props = page.properties
      return {
        id: page.id,
        city: getTitle(props.Name),
        flag: getText(props.Flag),
        years: getText(props.Years),
        accentColor: getSelect(props.AccentColor),
        tags: getMultiSelect(props.Tags),
        order: getNumber(props.Order) || 0,
        headline: {
          en: getText(props.Headline),
          zh: getText(props.HeadlineZh),
          ja: getText(props.HeadlineJa),
        },
        body: {
          en: getText(props.Body),
          zh: getText(props.BodyZh),
          ja: getText(props.BodyJa),
        },
      }
    })
    .sort((a, b) => a.order - b.order)
}

// ─── Daily Stats ─────────────────────────────────────────────────────────────

async function getDailyStats() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const pages = await queryDatabase(process.env.NOTION_DB_DAILY_STATS, {
    property: 'Date',
    date: { on_or_after: thirtyDaysAgo.toISOString().split('T')[0] },
  })
  return pages
    .map((page) => {
      const props = page.properties
      return {
        id: page.id,
        date: getDate(props.Date),
        steps: getNumber(props.Steps),
        sleep: getNumber(props.Sleep),
        weight: getNumber(props.Weight),
        notes: getText(props.Notes),
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// ─── Now Status ──────────────────────────────────────────────────────────────

async function getNowStatus() {
  const pages = await queryDatabase(process.env.NOTION_DB_NOW_STATUS, {
    property: 'Active',
    checkbox: { equals: true },
  })
  return pages.map((page) => {
    const props = page.properties
    return {
      id: page.id,
      name: getTitle(props.Name),
      category: getSelect(props.Category),
      url: getUrl(props.URL),
      notes: getText(props.Notes),
    }
  })
}

module.exports = {
  getJournalEntries,
  getFeaturedArticles,
  getJournalEntry,
  getPageBlocks,
  getTimelineEvents,
  getFoodLog,
  getAdventures,
  getDailyStats,
  getNowStatus,
  getLifeChapters,
}
