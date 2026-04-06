import Link from '@/components/Link'
import { useState } from 'react'

const CATEGORY_CONFIG = {
  food: { emoji: '🍜', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  exercise: { emoji: '🏃', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  friends: { emoji: '👥', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' },
  learning: { emoji: '📚', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  work: { emoji: '💼', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  entertainment: { emoji: '🎬', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  adventure: { emoji: '🗺️', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
}

const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', rough: '😔' }

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG)

export default function JournalListLayout({ entries }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? entries
    : entries.filter((e) => (e.categories || []).includes(activeFilter))

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pt-6 pb-6 space-y-4">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Journal
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Day-to-day life in Singapore. Food, runs, friends, study.
        </p>
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const cfg = CATEGORY_CONFIG[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === cat
                    ? `${cfg.color} font-semibold`
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cfg.emoji} {cat}
              </button>
            )
          })}
        </div>
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
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.color}`}
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
