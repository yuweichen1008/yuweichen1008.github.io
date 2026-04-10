import Link from '@/components/Link'
import FilterPills from '@/components/FilterPills'
import { useState } from 'react'
import { CATEGORY_CONFIG, MOOD_EMOJI } from '@/lib/categoryConfig'

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG)

const FILTER_OPTIONS = ALL_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat,
  emoji: CATEGORY_CONFIG[cat].emoji,
}))

export default function JournalListLayout({ entries }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered =
    activeFilter === 'all'
      ? entries
      : entries.filter((e) => (e.categories || []).includes(activeFilter))

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pt-6 pb-6 space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Journal
          </h1>
          {process.env.NODE_ENV === 'development' && (
            <Link
              href="/journal/new"
              className="mt-1 inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              ✏️ Write
            </Link>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Day-to-day life in Singapore. Food, runs, friends, study.
        </p>
        <FilterPills options={FILTER_OPTIONS} active={activeFilter} onChange={setActiveFilter} />
      </div>

      <ul>
        {filtered.length === 0 && (
          <li className="py-8 text-center text-gray-400">No entries yet.</li>
        )}
        {filtered.map((entry) => {
          const date = entry.date
            ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : ''
          return (
            <li key={entry.id} className="py-5">
              <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                <div className="space-y-1">
                  <time className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    {date}
                  </time>
                  {entry.mood && (
                    <span className="text-lg">{MOOD_EMOJI[entry.mood] || ''}</span>
                  )}
                </div>
                <div className="xl:col-span-3 space-y-2">
                  <h3 className="text-xl font-bold leading-8 tracking-tight">
                    <Link
                      href={`/journal/${entry.slug}`}
                      className="text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
                    >
                      {entry.title}
                    </Link>
                  </h3>
                  {(entry.categories || []).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.categories.map((cat) => {
                        const cfg = CATEGORY_CONFIG[cat]
                        if (!cfg) return null
                        return (
                          <span
                            key={cat}
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.pillColor}`}
                          >
                            {cfg.emoji} {cat}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  {entry.summary && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{entry.summary}</p>
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
