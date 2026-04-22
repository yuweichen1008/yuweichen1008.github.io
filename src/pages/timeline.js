import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import FilterPills from '@/components/FilterPills'
import { getTimelineEvents } from '@/lib/notion'
import { getLocalJournalEntries } from '@/lib/localJournal'
import fallbackEvents from '@/data/timelineData'
import { useTranslation } from '@/lib/i18n'

const JOURNAL_CAT_MAP = {
  work: 'work',
  food: 'food',
  learning: 'learning',
  adventure: 'travel',
  life: 'milestone',
}

export async function getStaticProps() {
  let notionEvents = await getTimelineEvents()
  if (!notionEvents.length) notionEvents = fallbackEvents

  const localEntries = getLocalJournalEntries()
  const notionSlugs = new Set(notionEvents.map((e) => e.slug))

  const journalEvents = localEntries
    .filter((e) => e.date && !notionSlugs.has(e.slug))
    .map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location || 'Singapore',
      categories: (e.categories || [])
        .map((c) => JOURNAL_CAT_MAP[c.toLowerCase()])
        .filter(Boolean),
      description: e.summary || '',
      slug: e.slug,
      journalLink: true,
      translations: e.translations
        ? {
            zh: e.translations.zh
              ? { title: e.translations.zh.title, description: e.translations.zh.summary }
              : null,
            ja: e.translations.ja
              ? { title: e.translations.ja.title, description: e.translations.ja.summary }
              : null,
          }
        : undefined,
    }))

  const allEvents = [...notionEvents, ...journalEvents].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  return { props: { events: allEvents } }
}

// ─── Color maps ───────────────────────────────────────────────────────────────

const LOCATION_COLORS = {
  'Silicon Valley': 'border-blue-400 bg-blue-50 dark:bg-blue-900/30',
  Taiwan: 'border-red-400 bg-red-50 dark:bg-red-900/30',
  Singapore: 'border-green-400 bg-green-50 dark:bg-green-900/30',
  Other: 'border-gray-400 bg-gray-50 dark:bg-gray-800',
}

const LOCATION_DOT = {
  'Silicon Valley': 'bg-blue-400 ring-blue-200 dark:ring-blue-900',
  Taiwan: 'bg-red-400 ring-red-200 dark:ring-red-900',
  Singapore: 'bg-green-400 ring-green-200 dark:ring-green-900',
  Other: 'bg-gray-400 ring-gray-200 dark:ring-gray-700',
}

const LOCATION_ERA = {
  'Silicon Valley': { flag: '🇺🇸', color: 'text-blue-500 dark:text-blue-400' },
  Taiwan: { flag: '🇹🇼', color: 'text-red-500 dark:text-red-400' },
  Singapore: { flag: '🇸🇬', color: 'text-green-500 dark:text-green-400' },
  Other: { flag: '🌍', color: 'text-gray-500 dark:text-gray-400' },
}

const LOCATION_OPTIONS = [
  { value: 'Silicon Valley', label: 'Silicon Valley', emoji: '🇺🇸' },
  { value: 'Taiwan', label: 'Taiwan', emoji: '🇹🇼' },
  { value: 'Singapore', label: 'Singapore', emoji: '🇸🇬' },
]

const CATEGORY_OPTIONS = [
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'travel', label: 'Travel', emoji: '✈️' },
  { value: 'food', label: 'Food', emoji: '🍜' },
  { value: 'milestone', label: 'Milestone', emoji: '⭐' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
]

// ─── Photo viewer ─────────────────────────────────────────────────────────────

function TimelinePhoto({ src, alt }) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed || !src) return null

  return (
    <>
      <div
        className="relative w-full cursor-zoom-in overflow-hidden rounded-t-xl"
        style={{ paddingTop: '52%' }}
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => setFailed(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
          <span className="text-white text-xs bg-black/40 px-2 py-0.5 rounded-full">expand</span>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded-xl shadow-2xl"
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

// ─── Era divider ──────────────────────────────────────────────────────────────

function EraHeader({ location }) {
  const meta = LOCATION_ERA[location] || LOCATION_ERA.Other
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 pl-12 py-2"
    >
      <span className="text-lg">{meta.flag}</span>
      <span className={`text-xs font-bold uppercase tracking-widest ${meta.color}`}>
        {location}
      </span>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Timeline({ events }) {
  const [locationFilter, setLocationFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const { locale } = useTranslation()

  const filtered = events.filter((e) => {
    const matchLoc = locationFilter === 'all' || e.location === locationFilter
    const matchCat = categoryFilter === 'all' || (e.categories || []).includes(categoryFilter)
    return matchLoc && matchCat
  })

  const eventsWithEra = filtered.map((event, idx) => ({
    ...event,
    showEra: idx === 0 || event.location !== filtered[idx - 1].location,
  }))

  return (
    <>
      <PageSeo
        title={`Timeline – ${siteMetadata.author}`}
        description="Life events across Taiwan, Silicon Valley, and Singapore."
        url={`${siteMetadata.siteUrl}/timeline`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-4">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Timeline
          </h1>
          <p className="text-gray-500 dark:text-gray-400">The story so far.</p>

          <div className="space-y-3">
            <div>
              <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Location
              </div>
              <FilterPills
                options={LOCATION_OPTIONS}
                active={locationFilter}
                onChange={setLocationFilter}
              />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Category
              </div>
              <FilterPills
                options={CATEGORY_OPTIONS}
                active={categoryFilter}
                onChange={setCategoryFilter}
              />
            </div>
          </div>
        </div>

        <div className="py-8">
          {filtered.length === 0 && (
            <p className="text-gray-400 text-center py-12">No events match this filter.</p>
          )}

          <div className="relative">
            {/* Gradient timeline spine */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 to-red-400 opacity-60" />

            <div className="space-y-0">
              {eventsWithEra.map((event, idx) => {
                const dotColor = LOCATION_DOT[event.location] || LOCATION_DOT.Other
                const cardColor = LOCATION_COLORS[event.location] || LOCATION_COLORS.Other

                const displayTitle =
                  (locale !== 'en' && event.translations?.[locale]?.title) || event.title
                const displayDesc =
                  (locale !== 'en' && event.translations?.[locale]?.description) ||
                  event.description

                const date = event.date
                  ? new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })
                  : ''

                const linkHref = event.journalLink
                  ? `/journal/${event.slug}`
                  : `/timeline/${event.slug}`

                return (
                  <div key={event.id}>
                    {event.showEra && <EraHeader location={event.location} />}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.35, ease: 'easeOut', delay: (idx % 5) * 0.05 }}
                      className="flex gap-6 relative pb-6"
                    >
                      {/* Dot */}
                      <div
                        className={`w-7 h-7 rounded-full flex-shrink-0 mt-1 z-10 ring-4 ${dotColor}`}
                      />

                      {/* Card */}
                      <motion.div
                        className={`group flex-1 rounded-xl border-l-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${cardColor}`}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.15 }}
                      >
                        {event.photo && (
                          <TimelinePhoto src={event.photo} alt={displayTitle} />
                        )}
                        <div className="p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xl leading-snug">
                              {displayTitle}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {event.journalLink && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                  essay
                                </span>
                              )}
                              <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                                {date}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {event.location && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                {event.location}
                              </span>
                            )}
                            {(event.categories || []).map((cat) => (
                              <span
                                key={cat}
                                className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>

                          {displayDesc && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                              {displayDesc}
                            </p>
                          )}

                          {event.slug && (
                            <a
                              href={linkHref}
                              className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                            >
                              {event.journalLink ? 'Read essay →' : 'View + comment →'}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
