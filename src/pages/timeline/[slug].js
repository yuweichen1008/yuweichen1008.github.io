import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'
import GiscusComments from '@/components/GiscusComments'
import { getTimelineEvents } from '@/lib/notion'
import fallbackEvents from '@/data/timelineData'

const LOCATION_COLORS = {
  'Silicon Valley': 'border-blue-400 bg-blue-50 dark:bg-blue-900',
  Taiwan: 'border-red-400 bg-red-50 dark:bg-red-900',
  Singapore: 'border-green-400 bg-green-50 dark:bg-green-900',
  Other: 'border-gray-400 bg-gray-50 dark:bg-gray-800',
}

async function getAllEvents() {
  const notionEvents = await getTimelineEvents()
  const seenSlugs = new Set(notionEvents.map((e) => e.slug))
  return [...notionEvents, ...fallbackEvents.filter((e) => !seenSlugs.has(e.slug))]
}

export async function getStaticPaths() {
  const events = await getAllEvents()
  return {
    paths: events.map((e) => ({ params: { slug: e.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const events = await getAllEvents()
  const event = events.find((e) => e.slug === params.slug)
  if (!event) return { notFound: true }
  return { props: { event } }
}

export default function TimelinePost({ event }) {
  const date = event.date
    ? new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const cardColor = LOCATION_COLORS[event.location] || LOCATION_COLORS.Other

  return (
    <>
      <PageSeo
        title={`${event.title} – ${siteMetadata.author}`}
        description={event.description || event.title}
        url={`${siteMetadata.siteUrl}/timeline/${event.slug}`}
      />

      <article className="divide-y divide-gray-200 dark:divide-gray-700">
        <header className="pt-6 pb-8 space-y-4">
          <Link
            href="/timeline"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            ← Timeline
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <time>{date}</time>
            {event.location && (
              <>
                <span>·</span>
                <span>{event.location}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10">
            {event.title}
          </h1>

          {(event.categories || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Photo + description */}
        <div className={`py-8`}>
          {event.photo && (
            <img
              src={event.photo}
              alt={event.title}
              className={`w-full max-h-80 object-cover rounded-xl mb-6 border-l-4 ${cardColor}`}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}
          {event.description && (
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* Back link */}
        <div className="py-6">
          <Link
            href="/timeline"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* Comments */}
        <div className="py-6">
          <GiscusComments />
        </div>
      </article>
    </>
  )
}
