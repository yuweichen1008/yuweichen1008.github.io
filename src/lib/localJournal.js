/**
 * localJournal.js
 *
 * Reads journal entries from src/data/journal/*.md (frontmatter + markdown body).
 * Used alongside Notion as a second content source — good for writing offline or
 * entries you want to keep in git history.
 *
 * Frontmatter shape:
 *   title: "My entry"
 *   date: "2026-04-01"          # YYYY-MM-DD
 *   slug: "my-entry"            # optional, auto-generated from title if omitted
 *   categories: [Food, Learning] # optional
 *   mood: "Excited"              # optional
 *   summary: "One-line teaser"   # optional
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

function getLocalJournalEntries() {
  if (!fs.existsSync(JOURNAL_DIR)) return []
  try {
    const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith('.md'))
    return files
      .map((file) => {
        try {
          const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), 'utf8')
          const { data, content } = matter(raw)
          if (!data.title) return null
          const slug = data.slug || slugify(data.title)
          const wordCount = content.split(/\s+/).filter(Boolean).length
          return {
            id: `local-${slug}`,
            title: data.title,
            date: data.date ? String(data.date) : '',
            slug,
            categories: Array.isArray(data.categories) ? data.categories : [],
            mood: data.mood || '',
            summary: data.summary || '',
            wordCount,
            source: 'local',
          }
        } catch (e) {
          console.warn(`[localJournal] Could not parse ${file}:`, e.message)
          return null
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
    const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith('.md'))
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(JOURNAL_DIR, file), 'utf8')
        const { data, content } = matter(raw)
        if (!data.title) continue
        const entrySlug = data.slug || slugify(data.title)
        if (entrySlug === slug) {
          const wordCount = content.split(/\s+/).filter(Boolean).length
          return {
            id: `local-${slug}`,
            title: data.title,
            date: data.date ? String(data.date) : '',
            slug,
            categories: Array.isArray(data.categories) ? data.categories : [],
            mood: data.mood || '',
            summary: data.summary || '',
            wordCount,
            source: 'local',
            content,
          }
        }
      } catch (e) {
        console.warn(`[localJournal] Could not parse ${file}:`, e.message)
      }
    }
  } catch (e) {
    console.warn('[localJournal] Error reading entry:', e.message)
  }
  return null
}

module.exports = { getLocalJournalEntries, getLocalJournalEntry }
