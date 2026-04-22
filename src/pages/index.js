import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Link from '@/components/Link'
import { NowSection } from '@/components/StepsWidget'
import { getNowStatus, getRecentJournalEntries } from '@/lib/notion'
import fallbackNow from '@/data/nowData'
import { useTranslation } from '@/lib/i18n'
import { CATEGORY_CONFIG } from '@/lib/categoryConfig'

// ─── Static data ─────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  'Executing a Six-Month Career Transformation Plan.',
  'Grinding JLPT N2 vocabulary... again.',
  'Fueling C++ and GCP deployments entirely with Maxwell Food Centre and Chick-fil-A.',
  'Staring at red candles so OpenClaw doesn\'t have to.',
  'Running half-marathons to offset the damage done by hawker food.',
]

const SPICY_TAKES = [
  {
    type: 'trivia',
    emoji: '🧠',
    text: 'A 10x engineer is usually just someone who deleted 90% of their meetings.',
  },
  {
    type: 'trivia',
    emoji: '🧠',
    text: 'The best architecture is the one you can delete in an afternoon.',
  },
  {
    type: 'trivia',
    emoji: '🧠',
    text: 'If your system needs 12 microservices to render a button, you may have over-engineered it.',
  },
  {
    type: 'quote',
    emoji: '📖',
    text: '人往往有很多理由不去做一件事，卻常常只有一個理由去做對的事情。',
  },
  {
    type: 'quote',
    emoji: '📖',
    text: '長大的意義是學習與無法改變的關係共處。',
  },
  {
    type: 'quote',
    emoji: '📖',
    text: 'Emotional maturity is not about having answers. It\'s about living comfortably with the questions.',
  },
  {
    type: 'joke',
    emoji: '😅',
    text: 'I run half-marathons to earn the right to eat Maxwell hawker food. The math checks out.',
  },
  {
    type: 'joke',
    emoji: '😅',
    text: 'OpenClaw watches the red candles so I can watch the hawker queue. This is called delegation.',
  },
  {
    type: 'joke',
    emoji: '😅',
    text: 'JLPT N2: 3,000 vocab words, 0 Japanese speakers nearby. Maximum efficiency.',
  },
]

const TAKE_STYLE = {
  trivia: { color: 'text-blue-400', label: '// ARCH TRIVIA' },
  quote: { color: 'text-yellow-400', label: '// MEMOIR FRAGMENT' },
  joke: { color: 'text-green-400', label: '// HOT TAKE' },
}

// ─── Hero ticker ─────────────────────────────────────────────────────────────

function HeroTicker() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % TICKER_ITEMS.length), 3500)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="h-5 relative overflow-hidden">
      <AnimatePresence exitBeforeEnter>
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="absolute text-sm text-gray-400 dark:text-gray-500 italic"
        >
          {TICKER_ITEMS[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// ─── Spicy take terminal card ─────────────────────────────────────────────────

function SpicyTakeCard() {
  const [take, setTake] = useState(null)
  const [spinning, setSpinning] = useState(false)

  function fire() {
    if (spinning) return
    setSpinning(true)
    setTake(null)
    setTimeout(() => {
      setTake(SPICY_TAKES[Math.floor(Math.random() * SPICY_TAKES.length)])
      setSpinning(false)
    }, 250)
  }

  return (
    <div className="rounded-2xl bg-gray-950 dark:bg-black border border-gray-800 p-5 flex flex-col gap-3 h-full min-h-[200px]">
      {/* macOS traffic lights */}
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-gray-600 font-mono">yomi@terminal ~ %</span>
      </div>

      {/* Output area */}
      <div className="flex-1 min-h-[80px]">
        <AnimatePresence exitBeforeEnter>
          {spinning && (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-gray-600 font-mono"
            >
              <span className="text-green-400">$</span> loading
              <span className="animate-pulse">...</span>
            </motion.p>
          )}
          {!spinning && !take && (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-600 font-mono"
            >
              <span className="text-green-400">$</span> awaiting input
              <span className="animate-pulse">_</span>
            </motion.p>
          )}
          {!spinning && take && (
            <motion.div
              key={take.text}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div
                className={`text-xs font-mono font-bold tracking-wider ${TAKE_STYLE[take.type].color}`}
              >
                {TAKE_STYLE[take.type].label}
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-mono">
                {take.emoji} {take.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={fire}
        disabled={spinning}
        className="text-xs font-mono font-semibold px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:scale-95 text-gray-300 transition-all disabled:opacity-40 self-start border border-gray-700"
      >
        {take ? '$ next --random' : '$ get-spicy-take'}
      </button>
    </div>
  )
}

// ─── Recent activity row ──────────────────────────────────────────────────────

function RecentRow({ entry }) {
  const cfg = entry.categories?.[0]
    ? CATEGORY_CONFIG[entry.categories[0].toLowerCase()]
    : null
  const dateLabel = entry.date
    ? new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : ''
  return (
    <Link
      href={`/journal/${entry.slug}`}
      className="group flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 -mx-3 px-3 rounded-lg transition-colors"
    >
      <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 w-14 tabular-nums">
        {dateLabel}
      </span>
      {cfg && <span className="flex-shrink-0 text-base leading-none">{cfg.emoji}</span>}
      <span className="flex-1 min-w-0 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
        {entry.title}
      </span>
      <span className="flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors text-sm">
        →
      </span>
    </Link>
  )
}

// ─── Data fetching ────────────────────────────────────────────────────────────

export async function getStaticProps() {
  const [nowItems, recentUpdates] = await Promise.all([
    getNowStatus(),
    getRecentJournalEntries(5),
  ])
  return {
    props: {
      nowItems: nowItems.length ? nowItems : fallbackNow,
      recentUpdates,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home({ nowItems, recentUpdates }) {
  const { t, locale } = useTranslation()

  const NAV_LINKS = [
    { href: '/calendar', label: { en: 'Activity Log', zh: '活動日誌', ja: 'ログ' }[locale] || 'Activity Log' },
    { href: '/journal', label: { en: 'Journal', zh: '日誌', ja: '日記' }[locale] || 'Journal' },
    { href: '/timeline', label: { en: 'Timeline', zh: '時間軸', ja: '年表' }[locale] || 'Timeline' },
    { href: '/singapore/food', label: { en: 'Food', zh: '美食', ja: '食記' }[locale] || 'Food' },
    { href: '/singapore/adventures', label: { en: 'Adventures', zh: '旅程', ja: '冒険' }[locale] || 'Adventures' },
  ]

  return (
    <>
      <PageSeo
        title={siteMetadata.title}
        description={siteMetadata.description}
        url={siteMetadata.siteUrl}
      />

      <div className="pt-10 pb-16 space-y-12">

        {/* ── Hero ── */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white tracking-tight">YW</span>
            </div>
          </div>
          <div className="space-y-2.5 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Yomi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
              {t('home.bio')}
            </p>
            <HeroTicker />
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
              <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
              <SocialIcon kind="instagram" href={siteMetadata.instagram} size={5} />
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
              <a
                href={`mailto:${siteMetadata.email}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>

        {/* ── Quote strip ── */}
        <div className="py-4 border-y border-gray-100 dark:border-gray-800 space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
            「人往往有很多理由不去做一件事，卻常常只有一個理由去做對的事情。」
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600">
            People often have many reasons not to do something, but usually only one reason to do the right thing.
          </p>
        </div>

        {/* ── Bento grid ── */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            {t('home.building')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* OpenClaw — spans 2 cols on lg */}
            <motion.div
              className="sm:col-span-2 lg:col-span-2 group relative rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden p-6 flex flex-col gap-4 min-h-[220px]"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Decorative stock lines */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none select-none">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 400 200"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points="0,140 50,120 100,155 150,90 200,115 250,65 300,95 350,45 400,75"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                  />
                  <polyline
                    points="0,160 50,175 100,150 150,180 200,168 250,185 300,160 350,178 400,155"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="relative z-10 flex items-start gap-3">
                <span className="text-2xl mt-0.5">📈</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-lg leading-tight">OpenClaw</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/60 text-green-400 border border-green-800 font-mono">
                      active
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">C++ · GCP · Algo Trading</div>
                </div>
                <span className="text-xs text-gray-600 font-mono mt-1 flex-shrink-0">private</span>
              </div>

              <p className="relative z-10 text-sm text-gray-300 leading-relaxed max-w-md">
                Building an AI to automate my algorithmic trading so I don&#39;t have to stare at the
                red candles myself. It stares at them for me. Progress.
              </p>

              <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
                {['Self-hosted', 'Real-time signals', 'Risk management', 'No more candle-watching'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700 font-mono"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            {/* SkyReal */}
            <motion.a
              href={siteMetadata.skyreal}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3 min-h-[200px]"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">🚀</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-mono flex-shrink-0">
                  co-founder
                </span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 dark:text-gray-100 text-base">SkyReal</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                  Transitioning from shipping code to leading teams. Content that actually works —
                  video, brand, social for founders. Turns out steering a company and writing C++
                  are different sports.
                </p>
              </div>
              <div className="text-xs text-indigo-500 dark:text-indigo-400 group-hover:underline font-medium">
                skyreal.org ↗
              </div>
            </motion.a>

            {/* Content Creation */}
            <motion.div
              className="group rounded-2xl overflow-hidden relative min-h-[200px] flex flex-col"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600" />
              <div className="relative z-10 p-5 flex flex-col gap-3 h-full">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">🎙️</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 font-mono flex-shrink-0">
                    new season
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-base">Content Creation</div>
                  <p className="text-sm text-white/80 mt-1.5 leading-relaxed">
                    YouTube Shorts + Podcast. Spicy, straightforward, humorously engaging talk show
                    on self-love and identity. Subscribe if you want to laugh, then stare at the ceiling.
                  </p>
                </div>
                <a
                  href={siteMetadata.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-colors font-medium self-start"
                >
                  YouTube →
                </a>
              </div>
            </motion.div>

            {/* Memoir */}
            <motion.div
              className="group rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-5 flex flex-col gap-3 min-h-[200px] relative overflow-hidden"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="absolute bottom-2 right-3 text-7xl opacity-[0.07] select-none pointer-events-none">
                📖
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">📖</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 font-mono flex-shrink-0">
                  in progress
                </span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 dark:text-gray-100 text-base">The Memoir</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  31 years of life transitions. A structured exploration of emotional maturity —
                  the TW → SV → SG arc, written with more honesty than LinkedIn allows.
                </p>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-500 italic leading-relaxed">
                「長大的意義是學習與無法改變的關係共處。」
              </p>
            </motion.div>

            {/* Spicy Take terminal */}
            <SpicyTakeCard />

          </div>
        </div>

        {/* ── Latest activity ── */}
        {recentUpdates.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {t('home.latest')}
              </h2>
              <Link
                href="/calendar"
                className="text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Activity log →
              </Link>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1">
              {recentUpdates.map((entry) => (
                <RecentRow key={entry.id || entry.slug} entry={entry} />
              ))}
            </div>
          </div>
        )}

        {/* ── Explore nav ── */}
        <div className="flex items-center gap-1 flex-wrap py-3 border-t border-gray-100 dark:border-gray-800">
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-gray-200 dark:text-gray-700 select-none">·</span>
              )}
              <Link
                href={link.href}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors px-1"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>

        {/* ── Now section ── */}
        <NowSection items={nowItems} label={t('home.rightNow')} />

      </div>
    </>
  )
}
