import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'
import GiscusComments from '@/components/GiscusComments'
import { getTimelineEvents } from '@/lib/notion'
import fallbackEvents from '@/data/timelineData'
import { useTranslation } from '@/lib/i18n'
import { useState } from 'react'

const LOCATION_COLORS = {
  'Silicon Valley': 'border-blue-400 bg-blue-50 dark:bg-blue-900/30',
  Taiwan: 'border-red-400 bg-red-50 dark:bg-red-900/30',
  Singapore: 'border-green-400 bg-green-50 dark:bg-green-900/30',
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

function PhotoViewer({ src, alt }) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed || !src) return null

  return (
    <>
      <div
        className="relative w-full cursor-zoom-in overflow-hidden rounded-xl mb-6"
        style={{ paddingTop: '52%' }}
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={() => setFailed(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-end p-3">
          <span className="text-white text-xs bg-black/40 px-2 py-0.5 rounded-full">expand</span>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}

export default function TimelinePost({ event }) {
  const { locale } = useTranslation()

  // Locale-aware display fields
  const displayTitle =
    (locale !== 'en' && event.translations?.[locale]?.title) || event.title
  const displayDesc =
    (locale !== 'en' && event.translations?.[locale]?.description) || event.description

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
            {displayTitle}
          </h1>

          {/* Language indicator when a translation is shown */}
          {locale !== 'en' && event.translations?.[locale]?.title && (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              Showing {locale === 'zh' ? '中文' : '日本語'} · original in English
            </p>
          )}

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
        <div className={`py-8 border-l-4 pl-6 ${cardColor}`}>
          <PhotoViewer src={event.photo} alt={displayTitle} />
          {displayDesc && (
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {displayDesc}
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
