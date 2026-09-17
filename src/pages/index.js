import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'
import { NowSection } from '@/components/StepsWidget'
import TrainerCard from '@/components/TrainerCard'
import QuestLog from '@/components/QuestLog'
import fallbackNow from '@/data/nowData'
import { useTranslation } from '@/lib/i18n'
import { CATEGORY_CONFIG } from '@/lib/categoryConfig'
import SG_HOLIDAYS from '@/data/sgHolidays'

const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false })

// ─── Static data ──────────────────────────────────────────────────────────────

const CHAPTERS = [
  {
    num: '01',
    flag: '🇹🇼',
    location: 'Taiwan',
    period: '1993 – 2023',
    tagline: 'Silicon & Night Markets',
    body: 'Seven years verifying ASIC designs at Hsinchu Science Park. The discipline of finding one bug in a billion cycles stays with you.',
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
    tagline: 'AI Infrastructure Layer',
    body: 'Moved to SV to be closer to where AI is being built. Learned what it means to ship without sacrificing correctness. Connected verification rigour to ML systems.',
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
    tagline: 'AI Integration & the Level 33 Quest',
    body: 'Working in Singapore and building with AI every day. Southeast Asia is where AI is being deployed now, and the next region could be anywhere: Japan, the UK, the Netherlands or Canada.',
    from: 'from-teal-400',
    to: 'to-emerald-300',
    ringColor: 'ring-teal-300 dark:ring-teal-700',
    dark: false,
  },
]

const SKILL_ENTRIES = [
  {
    no: '001',
    type: 'Psychic',
    icon: '🔮',
    label: 'AI Integration · LLM Apps',
    years: 'Main',
    pct: 72,
    barColor: 'bg-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    typeBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    body: 'Plugging LLMs into real products: API integration, prompt and context design, structured outputs, and shipping AI features that hold up in production.',
  },
  {
    no: '002',
    type: 'Dragon',
    icon: '🐉',
    label: 'RAG & Evaluation',
    years: 'Core',
    pct: 65,
    barColor: 'bg-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    typeBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
    body: 'Retrieval pipelines, embeddings, LLM-as-judge and RAGAS-style evals. Coverage-driven testing for AI, the same way chips get signed off.',
  },
  {
    no: '003',
    type: 'Electric',
    icon: '⚡',
    label: 'Agents & Automation',
    years: 'Rising',
    pct: 58,
    barColor: 'bg-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    typeBg: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
    body: 'Tool-using agents and workflow automation that connect AI to the systems teams already use, with guardrails and observability built in.',
  },
  {
    no: '004',
    type: 'Steel',
    icon: '🔩',
    label: 'Verification / Hardware',
    years: '7 yr',
    pct: 87,
    barColor: 'bg-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-800/40',
    border: 'border-gray-200 dark:border-gray-700',
    typeBg: 'bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600',
    body: 'ASIC functional verification, SoC testbench architecture, DV methodology. Hsinchu Science Park through Silicon Valley. 7 years of finding the one bug in a billion cycles.',
  },
  {
    no: '005',
    type: 'Fairy',
    icon: '🌸',
    label: 'Japanese · N2 track',
    years: 'N2−9',
    pct: 60,
    barColor: 'bg-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    border: 'border-pink-200 dark:border-pink-800',
    typeBg: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-700',
    body: 'Sat JLPT N2 in Jul 2026 and missed by just 9 points. Daily Anki, weekly immersion, still climbing. A real edge for Japan-market AI and tech projects.',
  },
  {
    no: '006',
    type: 'Flying',
    icon: '✈️',
    label: 'Global Operator',
    years: '3 ctry',
    pct: 55,
    barColor: 'bg-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    typeBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    body: 'Taiwan, Silicon Valley, Singapore. English, Mandarin, Japanese. Comfortable shipping with teams across time zones, and open to the next region.',
  },
]


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
          Region {chapter.num}
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

// ─── Pokédex skill card ───────────────────────────────────────────────────────

function SkillCard({ skill, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: (index % 2) * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className={`rounded-2xl border p-5 flex flex-col gap-3 ${skill.bg} ${skill.border}`}
    >
      {/* Pokédex header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          No.{skill.no}
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${skill.typeBg}`}>
          <span>{skill.icon}</span>
          <span>{skill.type}</span>
        </span>
      </div>

      {/* Label */}
      <h3 className="font-bold text-base leading-tight text-gray-900 dark:text-gray-100">
        {skill.label}
      </h3>

      {/* Stat bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full ${skill.barColor}`} style={{ width: `${skill.pct}%` }} />
        </div>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 flex-shrink-0 w-8 text-right">
          {skill.years}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
        {skill.body}
      </p>
    </motion.div>
  )
}

// ─── Singapore Hub helpers ────────────────────────────────────────────────────

function getNextHoliday() {
  const today = new Date().toISOString().split('T')[0]
  return SG_HOLIDAYS.find((h) => h.date >= today) || null
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

function SGHub() {
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

      {/* Weather */}
      <WeatherWidget />

      {/* Next holiday */}
      <NextHolidayRow />
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
  const { getLocalJournalEntries } = require('@/lib/localJournal')
  const allEntries = getLocalJournalEntries()
  const recentUpdates = allEntries
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
  return {
    props: { nowItems: fallbackNow, recentUpdates, buildTime: new Date().toISOString() },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home({ nowItems, recentUpdates, buildTime }) {
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
        <TrainerCard buildTime={buildTime} />

        {/* ── Level 33 Quest ───────────────────────────────────────────────── */}
        <QuestLog buildTime={buildTime} />

        {/* ── Three Chapters ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-pixel text-[10px] uppercase text-gray-500 dark:text-gray-400">
              ▶ Regions Unlocked
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

        {/* ── Skills Pokédex ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-pixel text-[10px] uppercase text-gray-500 dark:text-gray-400">
              ▶ Pokédex · {t('home.skills')}
            </h2>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILL_ENTRIES.map((skill, i) => (
              <SkillCard key={skill.no} skill={skill} index={i} />
            ))}
          </div>
        </div>

        {/* ── Consulting ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden border border-teal-200 dark:border-teal-800"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-teal-950/50 dark:via-blue-950/40 dark:to-indigo-950/40" />
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-9xl select-none pointer-events-none"
            style={{ opacity: 0.07 }}
          >
            🧠
          </div>

          <div className="relative z-10 p-8 sm:p-10">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                  ★ {t('home.consulting')}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 font-mono">
                  Open to opportunities
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-snug">
                AI Integration +<br />
                <span className="text-teal-600 dark:text-teal-400">Technical Strategy</span>
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                My move set: Silicon Valley pedigree, hardware-grade rigour, three languages, and a
                full-time focus on getting AI working inside real products.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { icon: '🧠', title: 'AI Integration', desc: 'LLMs wired into your product, data and workflows, from prototype to production.' },
                  { icon: '🤖', title: 'Agents & Automation', desc: 'Tool-using agents and AI workflows that remove repetitive work, with guardrails.' },
                  { icon: '🔬', title: 'Eval & Verification', desc: 'RAG and LLM evaluation with the coverage mindset of silicon sign-off.' },
                  { icon: '🇯🇵', title: 'Japan Bridge', desc: 'Technical liaison for Japanese-market AI projects. Near-N2 Japanese, engineering background.' },
                ].map((s) => (
                  <div
                    key={s.title}
                    className="rounded-xl border border-teal-200 dark:border-teal-700 bg-white/60 dark:bg-gray-900/60 p-4"
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-2">{s.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={siteMetadata.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                >
                  Book a call →
                </a>
                <a
                  href={`mailto:${siteMetadata.email}`}
                  className="text-xs font-medium px-4 py-2 rounded-xl border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:border-teal-400 dark:hover:border-teal-500 transition-colors"
                >
                  Send an email →
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Singapore Hub ────────────────────────────────────────────────── */}
        <SGHub />

        {/* ── Fog of World map ──────────────────────────────────────────────── */}
        <WorldMap />

        {/* ── Latest activity ───────────────────────────────────────────────── */}
        {recentUpdates.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-pixel text-[10px] uppercase text-gray-500 dark:text-gray-400">
                ▶ {t('home.latest')}
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
