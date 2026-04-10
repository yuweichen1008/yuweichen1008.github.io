import Link from '@/components/Link'
import NotionRenderer from '@/components/NotionRenderer'
import GiscusComments from '@/components/GiscusComments'
import { CATEGORY_CONFIG, MOOD_EMOJI, MOOD_LABEL } from '@/lib/categoryConfig'
import { MDXRemote } from 'next-mdx-remote'

export default function JournalPostLayout({ entry }) {
  const { title, date, categories = [], mood, blocks = [], wordCount = 0, mdxSource } = entry

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  // Share URL (works on static sites — uses window.location)
  const shareTitle = encodeURIComponent(`${title} — yuwei.life`)

  return (
    <article className="divide-y divide-gray-200 dark:divide-gray-700">
      <header className="pt-6 pb-8 space-y-4">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          ← Journal
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <time>{formattedDate}</time>
          {mood && (
            <>
              <span>·</span>
              <span>{MOOD_EMOJI[mood]} {MOOD_LABEL[mood] || mood}</span>
            </>
          )}
          {wordCount > 0 && (
            <>
              <span>·</span>
              <span>{wordCount.toLocaleString()} words · {Math.max(1, Math.round(wordCount / 200))} min read</span>
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
        {mdxSource ? <MDXRemote {...mdxSource} /> : <NotionRenderer blocks={blocks} />}
      </div>

      {/* Share + nav */}
      <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/journal"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          ← Back to Journal
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.currentTarget.href = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(window.location.href)}`
            }}
          >
            𝕏 Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.currentTarget.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
            }}
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* Comments */}
      <div className="py-6">
        <GiscusComments />
      </div>
    </article>
  )
}
