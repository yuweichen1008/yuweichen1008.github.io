import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import lifeChapters from '@/data/lifeData'
import CityChapter from '@/components/CityChapter'
import Link from '@/components/Link'

export default function Life() {
  return (
    <>
      <PageSeo
        title={`Life - ${siteMetadata.author}`}
        description="Three cities, one life. Silicon Valley, Taiwan, Singapore."
        url={`${siteMetadata.siteUrl}/life`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Hero */}
        <div className="pt-6 pb-8 space-y-4">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Three Cities
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            Taiwan born. Silicon Valley shaped. Singapore living. This is how the story goes so far.
          </p>
          <div className="flex gap-4 text-sm">
            <Link
              href="/calendar"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
            >
              Apr 1 → Jul 4 Chronicle →
            </Link>
            <Link
              href="/timeline"
              className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Full Timeline →
            </Link>
          </div>
        </div>

        {/* City chapters */}
        <div className="py-8 space-y-2">
          {lifeChapters.map((chapter, i) => (
            <CityChapter key={chapter.city} {...chapter} flip={i % 2 === 1} />
          ))}
        </div>

        {/* Current focus */}
        <div className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Right now (2026)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                emoji: '🇯🇵',
                title: 'JLPT N2',
                desc: 'Studying Japanese daily, targeting N2 in July 2026.',
              },
              {
                emoji: '🍜',
                title: 'Eating Singapore',
                desc: 'Working through the Michelin guide, one hawker centre at a time.',
              },
              {
                emoji: '🏃',
                title: 'Running',
                desc: 'Building base mileage, logging every run.',
              },
              {
                emoji: '✈️',
                title: 'Exploring SE Asia',
                desc: 'Weekend trips to nearby countries — Indonesia, Malaysia, Thailand.',
              },
              {
                emoji: '📅',
                title: 'Apr 1 → Jul 4',
                desc: '95 days documented before flying back to Taiwan.',
              },
              {
                emoji: '💻',
                title: 'Building in public',
                desc: 'This site is the project — shipping as I go.',
              },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <span className="text-2xl flex-shrink-0">{emoji}</span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
