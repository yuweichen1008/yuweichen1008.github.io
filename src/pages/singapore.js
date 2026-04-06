import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'

const sections = [
  {
    href: '/singapore/food',
    emoji: '🍜',
    title: 'Food',
    desc: 'Michelin stars, bib gourmands, hawker heroes. Every place worth returning to.',
    color: 'border-orange-400',
  },
  {
    href: '/singapore/adventures',
    emoji: '🗺️',
    title: 'Adventures',
    desc: 'Nearby escapes — Batam, Bintan, JB, Bali, Bangkok, and beyond.',
    color: 'border-green-400',
  },
]

const discoveries = [
  { emoji: '🦁', text: 'Gardens by the Bay at midnight — worth it every time' },
  { emoji: '🍚', text: 'Maxwell Food Centre — the hawker centre benchmark' },
  { emoji: '🏃', text: 'East Coast Park — best long run route in the city' },
  { emoji: '🚇', text: 'MRT is genuinely world-class. Never use Grab if MRT works.' },
  { emoji: '☕', text: 'Kopi at the kopitiam beats $8 third wave every morning' },
  { emoji: '🌧️', text: 'It rains at 3pm. Always.' },
]

export default function Singapore() {
  return (
    <>
      <PageSeo
        title={`Singapore - ${siteMetadata.author}`}
        description="Life in Singapore. Food, adventures, and local discoveries."
        url={`${siteMetadata.siteUrl}/singapore`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-3">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            🇸🇬 Singapore
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            The little red dot. Incredible food, easy travel, year-round heat. Currently home.
          </p>
        </div>

        {/* Section cards */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={`block p-6 rounded-xl border-l-4 ${s.color} bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow`}
              >
                <div className="text-4xl mb-3">{s.emoji}</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {s.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{s.desc}</p>
                <span className="inline-block mt-3 text-sm text-blue-500 hover:text-blue-600 font-medium">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Local discoveries */}
        <div className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            Local Discoveries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {discoveries.map((d, i) => (
              <div
                key={i}
                className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <span className="text-2xl flex-shrink-0">{d.emoji}</span>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
