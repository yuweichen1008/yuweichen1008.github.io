import { motion } from 'framer-motion'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import quest from '@/data/questData'
import useNow from '@/lib/useNow'

const DAY = 1000 * 60 * 60 * 24

const TYPES = [
  { label: 'Psychic',  icon: '🔮', bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700' },
  { label: 'Electric', icon: '⚡', bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700' },
  { label: 'Steel',    icon: '🔩', bg: 'bg-gray-100 dark:bg-gray-700/60',     text: 'text-gray-600 dark:text-gray-300',   border: 'border-gray-200 dark:border-gray-600' },
]

const EVOLUTION = [
  { icon: '🔬', name: 'Verification Engineer', state: 'past' },
  { icon: '🤖', name: 'AI Integration Engineer', state: 'current' },
  { icon: '✨', name: 'AI Architect', state: 'next' },
]

const MOVES = [
  { energy: '🔮⚡', name: 'LLM Integration', desc: 'Wires frontier models into real products, APIs and workflows.', power: 90 },
  { energy: '🔮🔮', name: 'RAG + Eval Judge', desc: 'Retrieval pipelines with measurable quality, not vibes.', power: 80 },
  { energy: '⚡', name: 'Agent Automation', desc: 'Tool-using agents that take repetitive work off the team.', power: 70 },
  { energy: '🔩🔩', name: 'Verification Mindset', desc: 'Finds the one bug in a billion cycles before it ships.', power: 120 },
]

const STATS = [
  { label: 'AI / Integration', value: 'Main', pct: 72, color: 'bg-purple-400' },
  { label: 'Verification',     value: '7 yr', pct: 87, color: 'bg-yellow-400' },
  { label: 'Japanese',         value: '~N2',  pct: 60, color: 'bg-gray-400' },
  { label: 'Global reach',     value: '3 ctry', pct: 55, color: 'bg-blue-400' },
]

function levelInfo(now) {
  const bd = new Date(quest.birthday + 'T00:00:00')
  let last = new Date(now.getFullYear(), bd.getMonth(), bd.getDate())
  if (last > now) last = new Date(now.getFullYear() - 1, bd.getMonth(), bd.getDate())
  const next = new Date(last.getFullYear() + 1, bd.getMonth(), bd.getDate())
  return {
    level: last.getFullYear() - bd.getFullYear(),
    exp: Math.round(((now - last) / (next - last)) * 100),
    daysToNext: Math.ceil((next - now) / DAY),
  }
}

function Pokeball({ children }) {
  return (
    <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-900 dark:border-gray-100 shadow-md">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-red-500" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-900" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-8 h-8 rounded-full bg-white border-4 border-gray-900 flex items-center justify-center text-[9px] font-extrabold text-gray-900 select-none">
          {children}
        </span>
      </div>
    </div>
  )
}

export default function TrainerCard({ buildTime }) {
  const now = useNow(buildTime)
  const { level, exp, daysToNext } = levelInfo(now)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-3xl p-1.5 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-500 shadow-lg"
    >
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
        <div className="h-1.5 bg-gradient-to-r from-purple-500 via-yellow-400 to-blue-500" />

        <div className="p-5 sm:p-6 space-y-5">
          {/* Card header */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-pixel text-[9px] uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Trainer Card
            </span>
            <span className="font-pixel text-[9px] text-gray-400 dark:text-gray-500">#YW-1008</span>
          </div>

          {/* Avatar + name + level */}
          <div className="flex items-center gap-4">
            <Pokeball>YW</Pokeball>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
                  Yomi · Yu-Wei Chen
                </h1>
                <span className="font-pixel text-xs text-purple-600 dark:text-purple-400">
                  Lv.{level}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                AI Integration Engineer · Verification roots
              </p>
              <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">
                Singapore · Ex–Silicon Valley · Open worldwide
              </p>
            </div>
          </div>

          {/* EXP bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-pixel text-[8px] uppercase text-gray-500 dark:text-gray-400">EXP</span>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                {daysToNext}d to Lv.{level + 1} · Oct 8
              </span>
            </div>
            <div className="h-2.5 rounded-sm border-2 border-gray-900 dark:border-gray-200 bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700"
                style={{ width: `${exp}%` }}
              />
            </div>
          </div>

          {/* Type badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {TYPES.map((t) => (
              <span
                key={t.label}
                className={`inline-flex items-center gap-1 text-xs font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${t.bg} ${t.text} ${t.border}`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </span>
            ))}
            <span className="text-xs italic text-gray-500 dark:text-gray-400">
              Silicon-grade rigour, trilingual charm, always shipping.
            </span>
          </div>

          {/* Evolution chain */}
          <div>
            <div className="font-pixel text-[8px] uppercase text-gray-400 dark:text-gray-500 mb-2">
              Evolution
            </div>
            <div className="flex items-stretch gap-1.5 text-xs">
              {EVOLUTION.map((e, i) => (
                <div key={e.name} className="flex items-center gap-1.5 flex-1 min-w-0">
                  {i > 0 && <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">▶</span>}
                  <div
                    className={`flex-1 min-w-0 rounded-lg px-2 py-1.5 text-center ${
                      e.state === 'current'
                        ? 'bg-purple-100 dark:bg-purple-900/40 border-2 border-purple-400 text-purple-800 dark:text-purple-200 font-bold'
                        : e.state === 'next'
                        ? 'border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                        : 'bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <div className="text-base leading-none">{e.icon}</div>
                    <div className="mt-1 leading-tight">{e.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moves */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-b border-gray-100 dark:border-gray-800">
            {MOVES.map((m) => (
              <div key={m.name} className="flex items-center gap-3 py-2">
                <span className="w-10 flex-shrink-0 text-sm">{m.energy}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{m.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{m.desc}</div>
                </div>
                <span className="font-pixel text-xs text-gray-800 dark:text-gray-200 flex-shrink-0">
                  {m.power}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="space-y-2.5">
            <div className="font-pixel text-[8px] uppercase text-gray-400 dark:text-gray-500">
              Trainer Stats
            </div>
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-28 text-xs font-mono text-gray-600 dark:text-gray-400 flex-shrink-0">
                  {s.label}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
                <span className="w-12 text-xs font-mono text-gray-500 dark:text-gray-400 text-right flex-shrink-0">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Card footer: weakness / resistance / languages */}
          <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <div>
              <div className="font-bold text-gray-700 dark:text-gray-300">Weakness</div>
              <div>Good ramen ×2</div>
            </div>
            <div>
              <div className="font-bold text-gray-700 dark:text-gray-300">Resistance</div>
              <div>Flaky demos −30</div>
            </div>
            <div>
              <div className="font-bold text-gray-700 dark:text-gray-300">Languages</div>
              <div>EN · 中文 · 日本語</div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 flex-wrap pt-1">
            <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <a
              href={siteMetadata.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white transition-colors"
            >
              ▶ Challenge me · Book a call
            </a>
            <a
              href={`mailto:${siteMetadata.email}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              Email →
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
