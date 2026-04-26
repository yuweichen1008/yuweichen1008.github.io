import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Link from '@/components/Link'
import { NowSection } from '@/components/StepsWidget'
import { getNowStatus, getRecentJournalEntries, getTeamLunch } from '@/lib/notion'
import fallbackNow from '@/data/nowData'
import { useTranslation } from '@/lib/i18n'
import { CATEGORY_CONFIG } from '@/lib/categoryConfig'
import SG_HOLIDAYS from '@/data/sgHolidays'

// ─── Static data ──────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    num: '01',
    flag: '🇹🇼',
    location: 'Taiwan',
    period: '1993 – 2023',
    tagline: 'Roots & Night Markets',
    body: 'Where it began. Family, tradition, beef noodle soup at midnight, and learning what it means to work hard for something you love.',
    from: 'from-rose-400',
    to: 'to-orange-300',
    ringColor: 'ring-rose-300 dark:ring-rose-700',
    dark: true,
  },
  {
    num: '02',
    flag: '🇺🇸',
    location: 'Silicon Valley',
    period: '2023 – 2025',
    tagline: 'Growth, Tech & Leadership',
    body: 'Joined the startup world. Learned to ship, to lead, and to fail fast with dignity. Found out what I am made of.',
    from: 'from-amber-400',
    to: 'to-yellow-300',
    ringColor: 'ring-amber-300 dark:ring-amber-700',
    dark: false,
  },
  {
    num: '03',
    flag: '🇸🇬',
    location: 'Singapore',
    period: '2026 – Present',
    tagline: 'Perspective & Expansion',
    body: 'Building deliberately. Running along East Coast Park at sunrise. Eating everything. Growing into the leader I want to become.',
    from: 'from-teal-400',
    to: 'to-emerald-300',
    ringColor: 'ring-teal-300 dark:ring-teal-700',
    dark: false,
  },
]

const LIFE_CARDS = [
  {
    id: 'learner',
    emoji: '🇯🇵',
    title: 'The Constant Learner',
    subtitle: 'JLPT N2 · Japanese',
    body: 'Grinding kanji at midnight, writing flashcards on the MRT. Not chasing fluency — chasing the joy of almost-understanding.',
    accent: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    border: 'border-purple-200 dark:border-purple-800',
    tag: '3,000+ words in',
    tagBg: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    wide: false,
  },
  {
    id: 'explorer',
    emoji: '🍜',
    title: 'The Explorer',
    subtitle: 'Michelin stars → Maxwell Food Centre → Chick-fil-A',
    body: 'Every city has a food soul. Singapore\'s is a hawker stall at 7 AM, ceiling fans spinning, kopi-o in hand. Every meal is a small celebration.',
    accent: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800',
    tag: 'Michelin Bib × 12+',
    tagBg: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    wide: true,
  },
  {
    id: 'limits',
    emoji: '🏃',
    title: 'Pushing Limits',
    subtitle: 'Running · Badminton · East Coast Park',
    body: 'Half-marathon training between code deploys. Badminton at 6 AM. Every run is a reset. The body knows what the mind needs before the mind does.',
    accent: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    tag: 'Half-marathon in training',
    tagBg: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
    wide: true,
  },
  {
    id: 'builder',
    emoji: '🔨',
    title: 'The Builder',
    subtitle: 'OpenClaw · SkyReal · Systems',
    body: 'Technology as a lever for freedom. Building tools that think so I can focus on what matters — people, problems, and the occasional red candle.',
    accent: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
    tag: 'C++ · GCP · Co-founder',
    tagBg: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    wide: false,
  },
]

const DAILY_JOYS = [
  'A morning run through East Coast Park is always worth getting up for.',
  'You don\'t need to have it all figured out to take the next step.',
  'Learning Japanese taught me that getting it wrong is just the first draft of getting it right.',
  'Every hawker stall has a story. So does every person eating there.',
  'Three countries later — not rootless, just polyglot.',
  'Strategic management is just empathy with a spreadsheet.',
  'The best runs are the ones you almost didn\'t take.',
  'Emotional maturity is learning to be a fair witness to yourself.',
  'Beef noodle soup at midnight fixes most things.',
  'The gap between where you are and where you want to be is just time, effort, and a good meal.',
]

// ─── Flip avatar ──────────────────────────────────────────────────────────────

function FlipAvatar() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      style={{ perspective: '500px', width: 72, height: 72, flexShrink: 0 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      className="cursor-pointer"
      title="hover me"
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
          className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-900"
        >
          <span className="text-xl font-bold text-white tracking-tight select-none">YW</span>
        </div>
        {/* Back */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
            transform: 'rotateY(180deg)',
          }}
          className="rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-900"
        >
          <span className="text-3xl select-none">🍜</span>
        </div>
      </div>
    </div>
  )
}

// ─── Three chapters ───────────────────────────────────────────────────────────

function ChapterCard({ chapter, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl bg-gradient-to-br ${chapter.from} ${chapter.to} p-6 flex flex-col gap-3 overflow-hidden min-h-[200px]`}
    >
      {/* Chapter number watermark */}
      <span
        className="absolute -bottom-2 -right-1 text-8xl font-black select-none pointer-events-none"
        style={{ opacity: 0.12, lineHeight: 1 }}
      >
        {chapter.num}
      </span>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-widest ${chapter.dark ? 'text-white/70' : 'text-gray-700/70'}`}>
          Chapter {chapter.num}
        </span>
        <span className="text-2xl">{chapter.flag}</span>
      </div>

      <div>
        <h3 className={`text-xl font-extrabold leading-tight ${chapter.dark ? 'text-white' : 'text-gray-900'}`}>
          {chapter.location}
        </h3>
        <p className={`text-xs mt-0.5 tabular-nums ${chapter.dark ? 'text-white/60' : 'text-gray-600/70'}`}>
          {chapter.period}
        </p>
      </div>

      <p className={`text-sm font-semibold italic leading-snug ${chapter.dark ? 'text-white/90' : 'text-gray-800'}`}>
        {chapter.tagline}
      </p>

      <p className={`text-sm leading-relaxed ${chapter.dark ? 'text-white/80' : 'text-gray-700'}`}>
        {chapter.body}
      </p>
    </motion.div>
  )
}

// ─── Life in motion card ──────────────────────────────────────────────────────

function LifeCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: (index % 2) * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className={`group rounded-2xl border p-5 flex flex-col gap-3 ${card.bg} ${card.border} ${
        card.wide ? 'sm:col-span-2 lg:col-span-1' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none">{card.emoji}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium flex-shrink-0 ${card.tagBg}`}>
          {card.tag}
        </span>
      </div>
      <div>
        <h3 className={`font-bold text-base leading-tight ${card.accent}`}>{card.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.subtitle}</p>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">{card.body}</p>
    </motion.div>
  )
}

// ─── Daily Joy widget ─────────────────────────────────────────────────────────

function DailyJoyWidget() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * DAILY_JOYS.length))
  const [animKey, setAnimKey] = useState(0)

  function nextJoy() {
    setIdx((i) => {
      let next
      do { next = Math.floor(Math.random() * DAILY_JOYS.length) } while (next === i)
      return next
    })
    setAnimKey((k) => k + 1)
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="text-3xl flex-shrink-0">☀️</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">
          Morning Run Thought
        </div>
        <motion.p
          key={animKey}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic"
        >
          &ldquo;{DAILY_JOYS[idx]}&rdquo;
        </motion.p>
      </div>
      <button
        onClick={nextJoy}
        className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-300 transition-colors border border-amber-200 dark:border-amber-700"
      >
        Next →
      </button>
    </div>
  )
}

// ─── Singapore Hub helpers ────────────────────────────────────────────────────

function getNextHoliday() {
  const today = new Date().toISOString().split('T')[0]
  return SG_HOLIDAYS.find((h) => h.date >= today) || null
}

function getNextWednesday() {
  const d = new Date()
  const day = d.getDay() // 0 Sun … 6 Sat
  const diff = day === 3 ? 0 : (3 - day + 7) % 7
  d.setDate(d.getDate() + diff)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function WeatherWidget() {
  const [wx, setWx] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetch('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast')
      .then((r) => r.json())
      .then((data) => {
        const item = data.items?.[0]
        if (!item) { setErr(true); return }
        const g = item.general
        setWx({
          forecast: g?.forecast || '',
          tempLow: g?.temperature?.low,
          tempHigh: g?.temperature?.high,
          humLow: g?.relative_humidity?.low,
          humHigh: g?.relative_humidity?.high,
        })
      })
      .catch(() => setErr(true))
  }, [])

  const icon = !wx ? '🌤️'
    : /thunder/i.test(wx.forecast) ? '⛈️'
    : /rain|shower/i.test(wx.forecast) ? '🌧️'
    : /cloud/i.test(wx.forecast) ? '⛅'
    : /fair|sunny/i.test(wx.forecast) ? '☀️'
    : '🌤️'

  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Weather · Singapore
          </div>
          <div className="text-sm text-gray-800 dark:text-gray-200 truncate">
            {err
              ? 'Unable to load'
              : wx
              ? `${wx.tempLow}–${wx.tempHigh}°C · ${wx.forecast}`
              : 'Loading…'}
          </div>
          {wx && (
            <div className="text-xs text-gray-400">
              {wx.humLow}–{wx.humHigh}% humidity
            </div>
          )}
        </div>
      </div>
      <a
        href="https://www.nea.gov.sg/weather"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 text-xs text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      >
        NEA ↗
      </a>
    </div>
  )
}

function NextHolidayRow() {
  const h = getNextHoliday()
  if (!h) return null
  const daysAway = Math.max(
    0,
    Math.ceil((new Date(h.date + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24))
  )
  const label = daysAway === 0 ? 'Today! 🎉' : daysAway === 1 ? 'Tomorrow' : `${daysAway}d away`
  const dateStr = new Date(h.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2.5">
        <span className="text-lg">🗓️</span>
        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Next Public Holiday
          </div>
          <div className="text-sm text-gray-800 dark:text-gray-200">
            {h.name}{h.note ? ` · ${h.note}` : ''} — {dateStr}
          </div>
        </div>
      </div>
      <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
        {label}
      </span>
    </div>
  )
}

function TeamLunchRow({ lunch }) {
  const nextWed = getNextWednesday()
  const dateLabel = lunch?.date
    ? new Date(lunch.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : nextWed

  return (
    <div className="flex items-start justify-between gap-3 py-3 px-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-start gap-2.5 min-w-0">
        <span className="text-lg flex-shrink-0 mt-0.5">🍱</span>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Wednesday Team Lunch
          </div>
          <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
            {dateLabel}
            {lunch?.location ? ` · ${lunch.location}` : ' · Location TBD'}
          </div>
          {lunch?.notes && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {lunch.notes}
            </div>
          )}
          {!lunch && (
            <div className="text-xs text-gray-400 mt-0.5">
              Add <code className="font-mono">NOTION_DB_TEAM_LUNCH</code> to update via Notion
            </div>
          )}
        </div>
      </div>
      <a
        href="https://www.notion.so"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-1"
      >
        Edit ↗
      </a>
    </div>
  )
}

function SGHub({ lunch }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Hub header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 dark:bg-teal-900/30 border-b border-teal-100 dark:border-teal-800">
        <span className="text-sm">🇸🇬</span>
        <span className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">
          Singapore Hub
        </span>
        <span className="ml-auto text-xs text-teal-500 dark:text-teal-500 italic">personal dashboard</span>
      </div>

      {/* Romans 6:14 */}
      <div className="flex items-start gap-3 py-3 px-4 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900">
        <span className="text-base flex-shrink-0 mt-0.5">✝️</span>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
            Romans 6:14
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
            &ldquo;For sin shall not have dominion over you: for ye are not under the law, but under grace.&rdquo;
          </p>
        </div>
      </div>

      {/* WhatsApp quick link */}
      <div className="flex items-center justify-between gap-3 py-3 px-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">💬</span>
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              WhatsApp
            </div>
            <div className="text-sm text-gray-800 dark:text-gray-200 font-mono">+65 8822-0383</div>
          </div>
        </div>
        <a
          href="https://wa.me/6588220383"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
        >
          Chat ↗
        </a>
      </div>

      {/* Weather */}
      <WeatherWidget />

      {/* Next holiday */}
      <NextHolidayRow />

      {/* Team lunch */}
      <TeamLunchRow lunch={lunch} />
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
  const [nowItems, recentUpdates, teamLunch] = await Promise.all([
    getNowStatus(),
    getRecentJournalEntries(5),
    getTeamLunch(),
  ])
  return {
    props: {
      nowItems: nowItems.length ? nowItems : fallbackNow,
      recentUpdates,
      teamLunch: teamLunch || null,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home({ nowItems, recentUpdates, teamLunch }) {
  const { t, locale } = useTranslation()

  const NAV_LINKS = [
    { href: '/calendar', label: { en: 'Activity Log', zh: '活動日誌', ja: 'ログ' }[locale] || 'Activity Log' },
    { href: '/journal', label: { en: 'Journal', zh: '日誌', ja: '日記' }[locale] || 'Journal' },
    { href: '/timeline', label: { en: 'Timeline', zh: '時間軸', ja: '年表' }[locale] || 'Timeline' },
    { href: '/singapore/food', label: { en: 'Food', zh: '美食', ja: '食記' }[locale] || 'Food' },
    { href: '/singapore/adventures', label: { en: 'Adventures', zh: '旅程', ja: '冒険' }[locale] || 'Adventures' },
    { href: '/projects', label: { en: 'Projects', zh: '專案', ja: 'プロジェクト' }[locale] || 'Projects' },
  ]

  return (
    <>
      <PageSeo
        title={siteMetadata.title}
        description={siteMetadata.description}
        url={siteMetadata.siteUrl}
      />

      <div className="pt-10 pb-16 space-y-14">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <FlipAvatar />
          <div className="space-y-2 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              Yomi
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed">
              {t('home.bio')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              ↑ hover the avatar
            </p>
            <div className="flex items-center gap-2 flex-wrap pt-1">
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
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 transition-colors"
              >
                ✉️ Email
              </a>
            </div>
          </div>
        </div>

        {/* ── Three Chapters ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Three Chapters
            </h2>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            <Link
              href="/timeline"
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Full timeline →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CHAPTERS.map((ch, i) => (
              <ChapterCard key={ch.num} chapter={ch} index={i} />
            ))}
          </div>
        </div>

        {/* ── Life in Motion ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Life in Motion
            </h2>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Learner — narrow */}
            <LifeCard card={LIFE_CARDS[0]} index={0} />
            {/* Explorer — wide on sm */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className={`group rounded-2xl border p-5 flex flex-col gap-3 ${LIFE_CARDS[1].bg} ${LIFE_CARDS[1].border} sm:col-span-2 lg:col-span-2`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl leading-none">{LIFE_CARDS[1].emoji}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium flex-shrink-0 ${LIFE_CARDS[1].tagBg}`}>
                  {LIFE_CARDS[1].tag}
                </span>
              </div>
              <div>
                <h3 className={`font-bold text-base leading-tight ${LIFE_CARDS[1].accent}`}>
                  {LIFE_CARDS[1].title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{LIFE_CARDS[1].subtitle}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{LIFE_CARDS[1].body}</p>
              <Link
                href="/singapore/food"
                className={`text-xs font-medium self-start hover:underline ${LIFE_CARDS[1].accent}`}
              >
                See food log →
              </Link>
            </motion.div>

            {/* Limits — wide on sm */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className={`group rounded-2xl border p-5 flex flex-col gap-3 ${LIFE_CARDS[2].bg} ${LIFE_CARDS[2].border} sm:col-span-2 lg:col-span-2`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl leading-none">{LIFE_CARDS[2].emoji}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium flex-shrink-0 ${LIFE_CARDS[2].tagBg}`}>
                  {LIFE_CARDS[2].tag}
                </span>
              </div>
              <div>
                <h3 className={`font-bold text-base leading-tight ${LIFE_CARDS[2].accent}`}>
                  {LIFE_CARDS[2].title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{LIFE_CARDS[2].subtitle}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{LIFE_CARDS[2].body}</p>
            </motion.div>
            {/* Builder — narrow */}
            <LifeCard card={LIFE_CARDS[3]} index={3} />
          </div>
        </div>

        {/* ── Memoir showcase ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-800"
        >
          {/* Warm gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/50 dark:via-orange-950/40 dark:to-rose-950/40" />

          {/* Decorative large book */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-9xl select-none pointer-events-none"
            style={{ opacity: 0.07 }}
          >
            📖
          </div>

          <div className="relative z-10 p-8 sm:p-10">
            <div className="max-w-xl space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  The Memoir Project
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-mono">
                  in progress
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-snug">
                31 Years.&nbsp;3 Cities.
                <br />
                <span className="text-amber-600 dark:text-amber-400">1 Unfinished Story.</span>
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                I&apos;m writing about the things I didn&apos;t understand until much later — the bridges
                between identity and place, between who I was told to be and who I chose to become.
                A structured exploration of emotional maturity across three continents.
              </p>

              {/* Quote blocks */}
              <div className="space-y-3 border-l-2 border-amber-300 dark:border-amber-700 pl-4">
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 italic leading-relaxed">
                    「人往往有很多理由不去做一件事，卻常常只有一個理由去做對的事情。」
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    People often have many reasons not to do something, but usually only one reason to do the right thing.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 italic leading-relaxed">
                    「長大的意義是學習與無法改變的關係共處。」
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    The meaning of growing up is learning to coexist with unchangeable relationships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Singapore Hub ────────────────────────────────────────────────── */}
        <SGHub lunch={teamLunch} />

        {/* ── Latest activity ───────────────────────────────────────────────── */}
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

        {/* ── Daily Joy widget ──────────────────────────────────────────────── */}
        <DailyJoyWidget />

        {/* ── Explore nav ───────────────────────────────────────────────────── */}
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

        {/* ── Now section ───────────────────────────────────────────────────── */}
        <NowSection items={nowItems} label={t('home.rightNow')} />

      </div>
    </>
  )
}
