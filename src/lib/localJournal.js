/**
 * localJournal.js
 *
 * Reads journal entries from src/data/journal/*.md (frontmatter + markdown body).
 * Supports per-locale translations via sibling files:
 *   - why-i-left-the-bay-area.md       ← English primary
 *   - why-i-left-the-bay-area.zh.md    ← Chinese translation (optional)
 *   - why-i-left-the-bay-area.ja.md    ← Japanese translation (optional)
 *
 * Frontmatter shape (same for all locale files):
 *   title: "My entry"
 *   date: "2026-04-01"
 *   slug: "my-entry"
 *   categories: [Food, Learning]
 *   mood: "Excited"
 *   summary: "One-line teaser"
 *   location: "Singapore"
 *   featured: true
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const JOURNAL_DIR = path.join(process.cwd(), 'data', 'journal')

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Parse a single .md file, returning null if invalid. */
function parseFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    if (!data.title) return null
    return { data, content }
  } catch {
    return null
  }
}

/** Load translations for a primary file path. Returns { zh, ja } with { title, summary, content } or null. */
function loadTranslations(primaryFilePath, includeContent = false) {
  const base = primaryFilePath.replace(/\.md$/, '')
  const result = {}
  for (const locale of ['zh', 'ja']) {
    const t = parseFile(`${base}.${locale}.md`)
    if (t) {
      result[locale] = {
        title: t.data.title || '',
        summary: t.data.summary || '',
        ...(includeContent ? { content: t.content } : {}),
      }
    } else {
      result[locale] = null
    }
  }
  return result
}

function getLocalJournalEntries() {
  if (!fs.existsSync(JOURNAL_DIR)) return []
  try {
    // Only primary files — skip locale variants (.zh.md, .ja.md)
    const files = fs
      .readdirSync(JOURNAL_DIR)
      .filter((f) => f.endsWith('.md') && !f.match(/\.(zh|ja)\.md$/))

    return files
      .map((file) => {
        const filePath = path.join(JOURNAL_DIR, file)
        const parsed = parseFile(filePath)
        if (!parsed) return null
        const { data, content } = parsed
        const slug = data.slug || slugify(data.title)
        const wordCount = content.split(/\s+/).filter(Boolean).length
        const translations = loadTranslations(filePath, false)
        return {
          id: `local-${slug}`,
          title: data.title,
          date: data.date ? String(data.date) : '',
          slug,
          categories: Array.isArray(data.categories) ? data.categories : [],
          mood: data.mood || '',
          summary: data.summary || '',
          wordCount,
          featured: !!data.featured,
          location: data.location || '',
          source: 'local',
          translations, // { zh: { title, summary } | null, ja: { title, summary } | null }
        }
      })
      .filter(Boolean)
  } catch (e) {
    console.warn('[localJournal] Error reading directory:', e.message)
    return []
  }
}

function getLocalJournalEntry(slug) {
  if (!fs.existsSync(JOURNAL_DIR)) return null
  try {
    const files = fs
      .readdirSync(JOURNAL_DIR)
      .filter((f) => f.endsWith('.md') && !f.match(/\.(zh|ja)\.md$/))

    for (const file of files) {
      const filePath = path.join(JOURNAL_DIR, file)
      const parsed = parseFile(filePath)
      if (!parsed) continue
      const { data, content } = parsed
      if (!data.title) continue
      const entrySlug = data.slug || slugify(data.title)
      if (entrySlug !== slug) continue

      const wordCount = content.split(/\s+/).filter(Boolean).length
      const translations = loadTranslations(filePath, true)
      return {
        id: `local-${slug}`,
        title: data.title,
        date: data.date ? String(data.date) : '',
        slug,
        categories: Array.isArray(data.categories) ? data.categories : [],
        mood: data.mood || '',
        summary: data.summary || '',
        wordCount,
        location: data.location || '',
        featured: !!data.featured,
        source: 'local',
        content,        // English content
        translations,   // { zh: { title, summary, content } | null, ... }
      }
    }
  } catch (e) {
    console.warn('[localJournal] Error reading entry:', e.message)
  }
  return null
}

module.exports = { getLocalJournalEntries, getLocalJournalEntry }
