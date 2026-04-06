import Link from '@/components/Link'
import NotionRenderer from '@/components/NotionRenderer'
import { CATEGORY_CONFIG, MOOD_EMOJI, MOOD_LABEL } from '@/lib/categoryConfig'

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
      <header className="pt-6 pb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <time>{formattedDate}</time>
          {mood && (
            <>
              <span>·</span>
              <span>{MOOD_EMOJI[mood]} {MOOD_LABEL[mood] || mood}</span>
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
                  className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full ${cfg.pillColor}`}
                >
                  {cfg.emoji} {cat}
                </span>
              )
            })}
          </div>
        )}
      </header>

      <div className="py-8 prose dark:prose-dark max-w-none">
        <NotionRenderer blocks={blocks} />
      </div>

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
