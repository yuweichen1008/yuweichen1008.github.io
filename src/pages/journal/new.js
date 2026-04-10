/**
 * /journal/new — local markdown editor (dev only)
 *
 * Only accessible in development. Lets you draft entries with a live
 * markdown preview and saves them as .md files in src/data/journal/.
 *
 * How to use:
 *   1. Run `npm run dev` in the src/ directory
 *   2. Visit http://localhost:3000/yuweichen1008/journal/new
 *   3. Write, preview, and hit Save — the file appears in src/data/journal/
 *   4. Commit the .md file to git — it will be included in the next CI build
 *
 * This page is excluded from production builds (getStaticProps returns notFound).
 */

import { useState, useCallback } from 'react'
import Link from '@/components/Link'

const CATEGORY_OPTIONS = ['Food', 'Exercise', 'Friends', 'Learning', 'Work', 'Entertainment', 'Adventure']
const MOOD_OPTIONS = ['Excited', 'Happy', 'Neutral', 'Tired', 'Stressed', 'Reflective']

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatDate(d) {
  return d.toISOString().split('T')[0]
}

// Very simple markdown → HTML preview (no deps needed for this)
function renderMarkdown(md) {
  return md
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-2">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mt-4 mb-1">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
    .replace(/^---$/gm, '<hr class="border-gray-200 dark:border-gray-700 my-4">')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^(?!<[hlipco])(.+)$/gm, '<p class="mb-3">$1</p>')
}

export default function NewJournalEntry() {
  const today = formatDate(new Date())

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(today)
  const [categories, setCategories] = useState([])
  const [mood, setMood] = useState('')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState('')
  const [tab, setTab] = useState('write') // 'write' | 'preview'
  const [status, setStatus] = useState(null) // null | 'saving' | 'saved' | 'error'
  const [savedFile, setSavedFile] = useState('')

  const slug = slugify(title) || 'untitled'

  const toggleCategory = useCallback((cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }, [])

  const frontmatter = [
    '---',
    `title: "${title}"`,
    `date: "${date}"`,
    `slug: "${slug}"`,
    categories.length ? `categories: [${categories.join(', ')}]` : null,
    mood ? `mood: "${mood}"` : null,
    summary ? `summary: "${summary}"` : null,
    '---',
    '',
    body,
  ]
    .filter((l) => l !== null)
    .join('\n')

  async function handleSave() {
    if (!title.trim()) {
      setStatus('error')
      return
    }
    setStatus('saving')
    try {
      const res = await fetch('/api/save-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content: frontmatter }),
      })
      if (res.ok) {
        const { file } = await res.json()
        setSavedFile(file)
        setStatus('saved')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/journal" className="text-sm text-gray-500 hover:text-blue-500">
            ← Journal
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">New Entry</h1>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">
            ⚠ Dev only — saves to <code className="font-mono">src/data/journal/{slug}.md</code>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={status === 'saving'}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {status === 'saving' ? 'Saving…' : 'Save'}
        </button>
      </div>

      {status === 'saved' && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-sm text-green-800 dark:text-green-200">
          Saved to <code className="font-mono">{savedFile}</code>. Commit it to include in the next build.{' '}
          <Link href={`/journal/${slug}`} className="underline">Preview →</Link>
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-sm text-red-800 dark:text-red-200">
          {!title.trim() ? 'Title is required.' : 'Save failed — is the dev server running?'}
        </div>
      )}

      {/* Metadata */}
      <div className="grid gap-4 mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What happened today?"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {title && (
              <p className="text-xs text-gray-400 mt-1 font-mono">slug: {slug}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  categories.includes(cat)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">— select —</option>
              {MOOD_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Summary (one-liner)</label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Quick teaser shown on list and calendar"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Editor / Preview tabs */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {['write', 'preview', 'raw'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px bg-white dark:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'write' && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={'# Start writing...\n\nMarkdown supported: **bold**, *italic*, `code`, ## headings, - lists'}
            className="w-full h-96 p-5 font-mono text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 resize-none focus:outline-none leading-relaxed"
          />
        )}

        {tab === 'preview' && (
          <div
            className="p-5 min-h-96 prose dark:prose-dark max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(body) || '<p class="text-gray-400">Nothing to preview yet.</p>' }}
          />
        )}

        {tab === 'raw' && (
          <pre className="p-5 min-h-96 text-xs font-mono text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 overflow-auto whitespace-pre-wrap">
            {frontmatter}
          </pre>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-400 text-center">
        Tip: write in <strong>Write</strong> tab, check <strong>Preview</strong>, then <strong>Save</strong>. Commit the .md to publish.
      </p>
    </div>
  )
}
