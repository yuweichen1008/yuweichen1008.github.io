import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'
import CountdownBanner from '@/components/CountdownBanner'
import { StepsWidget } from '@/components/StepsWidget'
import { getRecentJournalEntries, getDailyStats } from '@/lib/notion'
import { CATEGORY_CONFIG } from '@/lib/categoryConfig'

export async function getStaticProps() {
  const [entries, stats] = await Promise.all([
    getRecentJournalEntries(30),
    getDailyStats(),
  ])
  return { props: { entries, stats } }
}

function groupByMonth(entries) {
  const groups = []
  let current = null
  for (const entry of entries) {
    const month = entry.date
      ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : 'Unknown'
    if (!current || current.month !== month) {
      current = { month, entries: [] }
      groups.push(current)
    }
    current.entries.push(entry)
  }
  return groups
}

function ActivityRow({ entry }) {
  const cats = entry.categories || []
  const primaryCat = cats[0]
  const cfg = primaryCat ? CATEGORY_CONFIG[primaryCat.toLowerCase()] : null
  const dateLabel = entry.date
    ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <Link
      href={`/journal/${entry.slug}`}
      className="group flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 -mx-3 px-3 rounded-lg transition-colors"
    >
      <span className="flex-shrink-0 text-lg leading-none mt-0.5">
        {cfg ? cfg.emoji : '📝'}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {entry.title}
          </span>
          <span className="flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors">
            →
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">{dateLabel}</span>
          {cats.slice(0, 2).map((cat) => {
            const c = CATEGORY_CONFIG[cat.toLowerCase()]
            return (
              <span
                key={cat}
                className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                {c ? `${c.emoji} ${cat}` : cat}
              </span>
            )
          })}
        </div>
        {entry.summary && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 leading-relaxed">
            {entry.summary}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function Calendar({ entries, stats }) {
  const groups = groupByMonth(entries)

  return (
    <>
      <PageSeo
        title={`Life Log – ${siteMetadata.title}`}
        description="Day by day. Every entry."
        url={`${siteMetadata.siteUrl}/calendar`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Life Log
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">Day by day. Every entry.</p>
        </div>

        <div className="py-8 space-y-8">
          <CountdownBanner />

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-800">
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              Today
            </div>
            <StepsWidget stats={stats} noDataMsg="No step data yet — add to Notion DailyStats" />
          </div>

          {entries.length === 0 && (
            <p className="text-gray-400 dark:text-gray-500 text-center py-12">
              No entries yet — connect Notion to see your activity log.
            </p>
          )}

          {groups.map((group) => (
            <div key={group.month}>
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                {group.month}
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1">
                {group.entries.map((entry) => (
                  <ActivityRow key={entry.id || entry.slug} entry={entry} />
                ))}
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <Link
              href="/journal"
              className="text-sm text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              View all journal entries →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
