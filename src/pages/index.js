import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Link from '@/components/Link'
import CountdownBanner from '@/components/CountdownBanner'

const quickLinks = [
  { href: '/calendar', emoji: '📅', title: 'Apr→Jul Calendar', desc: '95-day sprint before flying home' },
  { href: '/journal', emoji: '📓', title: 'Journal', desc: 'Daily life in Singapore' },
  { href: '/singapore/food', emoji: '🍜', title: 'Food Log', desc: 'Michelin & hawker picks' },
  { href: '/fitness', emoji: '🏃', title: 'Fitness', desc: 'Running, cycling, hiking' },
  { href: '/singapore/adventures', emoji: '🗺️', title: 'Adventures', desc: 'SE Asia nearby trips' },
  { href: '/timeline', emoji: '⏱️', title: 'Timeline', desc: 'TW → SV → SG story' },
]

export default function Home() {
  return (
    <>
      <PageSeo
        title={siteMetadata.title}
        description={siteMetadata.description}
        url={siteMetadata.siteUrl}
      />

      {/* Hero */}
      <div className="pt-10 pb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
              Hey, I&apos;m Yuwei 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              32. Engineer, explorer, eater. Currently in{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">Singapore</span>{' '}
              — previously{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">Silicon Valley</span>{' '}
              &{' '}
              <span className="font-semibold text-red-600 dark:text-red-400">Taiwan</span>.
              Grinding JLPT N2, logging every run, eating my way through the Michelin guide.
            </p>
            {/* Social row */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <SocialIcon kind="github" href={siteMetadata.github} size="5" />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="5" />
              <SocialIcon kind="youtube" href={siteMetadata.youtube} size="5" />
              <SocialIcon kind="instagram" href={siteMetadata.instagram} size="5" />
              <a
                href={siteMetadata.skyreal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                🚀 SkyReal
              </a>
              <a
                href={`mailto:${siteMetadata.email}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <CountdownBanner />

        {/* Quick nav grid */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Explore
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-1 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* About strip */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          {[
            { emoji: '🇯🇵', text: 'Studying for JLPT N2 · Jul 2026' },
            { emoji: '🍜', text: 'Eating through Singapore\'s Michelin guide' },
            { emoji: '🚀', text: 'Co-founder @ SkyReal' },
            { emoji: '✈️', text: 'Flying back to Taiwan · Jul 4' },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <span>{item.emoji}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
