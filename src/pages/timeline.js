import { useState } from 'react'
import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import FilterPills from '@/components/FilterPills'
import { getTimelineEvents } from '@/lib/notion'
import fallbackEvents from '@/data/timelineData'

export async function getStaticProps() {
  let events = await getTimelineEvents()
  if (!events.length) events = fallbackEvents
  return { props: { events } }
}

const LOCATION_COLORS = {
  'Silicon Valley': 'border-blue-400 bg-blue-50 dark:bg-blue-900',
  Taiwan: 'border-red-400 bg-red-50 dark:bg-red-900',
  Singapore: 'border-green-400 bg-green-50 dark:bg-green-900',
  Other: 'border-gray-400 bg-gray-50 dark:bg-gray-800',
}

const LOCATION_DOT = {
  'Silicon Valley': 'bg-blue-400',
  Taiwan: 'bg-red-400',
  Singapore: 'bg-green-400',
  Other: 'bg-gray-400',
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
  { value: 'fitness', label: 'Fitness', emoji: '🏃' },
  { value: 'milestone', label: 'Milestone', emoji: '⭐' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
]

export default function Timeline({ events }) {
  const [locationFilter, setLocationFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = events.filter((e) => {
    const matchLoc = locationFilter === 'all' || e.location === locationFilter
    const matchCat = categoryFilter === 'all' || (e.categories || []).includes(categoryFilter)
    return matchLoc && matchCat
  })

  return (
    <>
      <PageSeo
        title={`Timeline - ${siteMetadata.author}`}
        description="Life events across Taiwan, Silicon Valley, and Singapore."
        url={`${siteMetadata.siteUrl}/timeline`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-4">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Timeline
          </h1>
          <p className="text-gray-600 dark:text-gray-400">The story so far.</p>

          <div className="space-y-3">
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Location
              </div>
              <FilterPills
                options={LOCATION_OPTIONS}
                active={locationFilter}
                onChange={setLocationFilter}
              />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
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
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-8">
              {filtered.map((event) => {
                const dotColor = LOCATION_DOT[event.location] || LOCATION_DOT.Other
                const cardColor = LOCATION_COLORS[event.location] || LOCATION_COLORS.Other
                const date = event.date
                  ? new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })
                  : ''
                return (
                  <div key={event.id} className="flex gap-6 relative">
                    {/* Dot */}
                    <div
                      className={`w-6 h-6 rounded-full flex-shrink-0 mt-1 z-10 border-2 border-white dark:border-gray-900 ${dotColor}`}
                    />
                    {/* Card */}
                    <div
                      className={`flex-1 p-4 rounded-lg border-l-4 ${cardColor}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                          {event.title}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {date}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
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
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {event.description}
                        </p>
                      )}
                      {event.slug && (
                        <a
                          href={`/timeline/${event.slug}`}
                          className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                        >
                          View + comment →
                        </a>
                      )}
                    </div>
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
