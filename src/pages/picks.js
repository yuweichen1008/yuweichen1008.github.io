import { useState } from 'react'
import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import picks from '@/data/picksData'

const TABS = [
  { key: 'food',        label: 'Food',        emoji: '🍜' },
  { key: 'books',       label: 'Books',       emoji: '📚' },
  { key: 'movies',      label: 'Movies',      emoji: '🎬' },
  { key: 'outdoor',     label: 'Outdoor',     emoji: '🌿' },
  { key: 'places',      label: 'Places',      emoji: '🌍' },
  { key: 'experiences', label: 'Experiences', emoji: '✨' },
]

function Stars({ rating }) {
  if (!rating) return null
  return (
    <span className="text-yellow-400 text-xs tracking-tight">
      {'★'.repeat(rating)}
      <span className="text-gray-200 dark:text-gray-600">{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

function PickCard({ item }) {
  const name = item.name || item.title
  const subtitle = [item.author, item.location, item.year].filter(Boolean).join(' · ')

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-md transition-shadow gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug">{name}</h3>
            {subtitle && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <Stars rating={item.rating} />
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.desc && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
      )}

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline self-start"
        >
          Learn more →
        </a>
      )}
    </div>
  )
}

export default function Picks() {
  const [activeTab, setActiveTab] = useState('food')
  const items = picks[activeTab] || []

  return (
    <>
      <PageSeo
        title={`Picks – ${siteMetadata.author}`}
        description="Food, books, movies, outdoor, places, and experiences — things I'd genuinely recommend. Not ads."
        url={`${siteMetadata.siteUrl}/picks`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Recommended by Yomi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Across food, books, movies, outdoor, places, and experiences — things I&apos;d actually
            tell a friend. No affiliate links.
          </p>
        </div>

        <div className="py-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                ].join(' ')}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            {items.length} pick{items.length !== 1 ? 's' : ''}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <PickCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
