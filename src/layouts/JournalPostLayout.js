import Link from '@/components/Link'
import NotionRenderer from '@/components/NotionRenderer'

const CATEGORY_CONFIG = {
  food: { emoji: '🍜', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  exercise: { emoji: '🏃', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  friends: { emoji: '👥', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' },
  learning: { emoji: '📚', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  work: { emoji: '💼', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  entertainment: { emoji: '🎬', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  adventure: { emoji: '🗺️', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
}

const MOOD_EMOJI = { great: '😄 Great', good: '🙂 Good', okay: '😐 Okay', rough: '😔 Rough' }

export default function JournalPostLayout({ entry }) {
  const { title, date, categories = [], mood, blocks = [] } = entry

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <article className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* Header */}
      <header className="pt-6 pb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <time>{formattedDate}</time>
          {mood && (
            <>
              <span>·</span>
              <span>{MOOD_EMOJI[mood] || mood}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10">
          {title}
        </h1>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat]
              if (!cfg) return null
              return (
                <span
                  key={cat}
                  className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full ${cfg.color}`}
                >
                  {cfg.emoji} {cat}
                </span>
              )
            })}
          </div>
        )}
      </header>

      {/* Content */}
      <div className="py-8 prose dark:prose-dark max-w-none">
        <NotionRenderer blocks={blocks} />
      </div>

      {/* Footer nav */}
      <footer className="pt-6 pb-6">
        <Link
          href="/journal"
          className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
        >
          ← Back to Journal
        </Link>
      </footer>
    </article>
  )
}
