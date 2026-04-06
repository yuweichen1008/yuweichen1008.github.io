import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Link from '@/components/Link'
import CountdownBanner from '@/components/CountdownBanner'
import { StepsWidget, NowSection } from '@/components/StepsWidget'
import { getDailyStats, getNowStatus } from '@/lib/notion'
import fallbackNow from '@/data/nowData'
import { useTranslation } from '@/lib/i18n'

export async function getStaticProps() {
  const [stats, nowItems] = await Promise.all([getDailyStats(), getNowStatus()])
  return {
    props: {
      stats,
      nowItems: nowItems.length ? nowItems : fallbackNow,
    },
  }
}

const quickLinks = [
  { href: '/calendar', emoji: '📅', titleKey: 'calendar', desc: '95-day sprint before flying home', accent: 'border-blue-400', emojiBg: 'bg-blue-50 dark:bg-blue-900' },
  { href: '/journal', emoji: '📓', titleKey: 'journal', desc: 'Daily life in Singapore', accent: 'border-purple-400', emojiBg: 'bg-purple-50 dark:bg-purple-900' },
  { href: '/singapore/food', emoji: '🍜', titleKey: 'food', desc: 'Michelin & hawker picks', accent: 'border-orange-400', emojiBg: 'bg-orange-50 dark:bg-orange-900' },
  { href: '/projects', emoji: '🚀', titleKey: 'projects', desc: 'What I\'m building', accent: 'border-indigo-400', emojiBg: 'bg-indigo-50 dark:bg-indigo-900' },
  { href: '/singapore/adventures', emoji: '🗺️', titleKey: 'adventures', desc: 'SE Asia nearby trips', accent: 'border-teal-400', emojiBg: 'bg-teal-50 dark:bg-teal-900' },
  { href: '/timeline', emoji: '⏱️', titleKey: 'timeline', desc: 'TW → SV → SG story', accent: 'border-red-400', emojiBg: 'bg-red-50 dark:bg-red-900' },
]

const QUICK_LINK_LABELS = {
  calendar: { en: 'Calendar', zh: '行事曆', ja: 'カレンダー' },
  journal: { en: 'Journal', zh: '日誌', ja: '日記' },
  food: { en: 'Food Log', zh: '美食日誌', ja: 'フードログ' },
  projects: { en: 'Projects', zh: '專案', ja: 'プロジェクト' },
  adventures: { en: 'Adventures', zh: '旅程', ja: '冒険' },
  timeline: { en: 'Timeline', zh: '時間軸', ja: '年表' },
}

export default function Home({ stats, nowItems }) {
  const { t, locale } = useTranslation()

  const statusItems = [
    { emoji: '🇸🇬', text: t('home.status_sg') },
    { emoji: '🇯🇵', text: t('home.status_jlpt') },
    { emoji: '🚀', text: t('home.status_skyreal') },
    { emoji: '✈️', text: t('home.status_taiwan') },
  ]

  return (
    <>
      <PageSeo
        title={siteMetadata.title}
        description={siteMetadata.description}
        url={siteMetadata.siteUrl}
      />

      <div className="pt-10 pb-12 space-y-8">
        {/* Profile row */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white tracking-tight">YW</span>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                Yomi
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">
                {t('home.tagline')}
              </p>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              {t('home.bio')}
            </p>

            {/* Social row */}
            <div className="flex items-center gap-2 flex-wrap">
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
              <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
              <SocialIcon kind="instagram" href={siteMetadata.instagram} size={5} />
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
              <a
                href={siteMetadata.skyreal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-80 transition-opacity"
              >
                🚀 SkyReal
              </a>
              <a
                href={`mailto:${siteMetadata.email}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap gap-2">
          {statusItems.map((item) => (
            <span
              key={item.text}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              <span>{item.emoji}</span>
              <span>{item.text}</span>
            </span>
          ))}
        </div>

        {/* Countdown */}
        <CountdownBanner />

        {/* Daily stats */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-800">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            {t('home.today')}
          </div>
          <StepsWidget stats={stats} noDataMsg={t('home.noSteps')} />
        </div>

        {/* Quick nav */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            {t('home.explore')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex flex-col gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-sm transition-all duration-200 border-l-2 ${item.accent}`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${item.emojiBg}`}>
                  {item.emoji}
                </span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                    {QUICK_LINK_LABELS[item.titleKey]?.[locale] || QUICK_LINK_LABELS[item.titleKey]?.en}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Now section */}
        <NowSection items={nowItems} label={t('home.rightNow')} />
      </div>
    </>
  )
}
