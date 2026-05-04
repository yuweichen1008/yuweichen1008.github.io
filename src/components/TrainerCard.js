import { motion } from 'framer-motion'
import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'

const TYPES = [
  { label: 'Electric', icon: '⚡', bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700' },
  { label: 'Psychic',  icon: '🔮', bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700' },
  { label: 'Steel',    icon: '🔩', bg: 'bg-gray-100 dark:bg-gray-700/60',     text: 'text-gray-600 dark:text-gray-300',   border: 'border-gray-200 dark:border-gray-600' },
  { label: 'Dragon',   icon: '🐉', bg: 'bg-blue-100 dark:bg-blue-900/40',     text: 'text-blue-700 dark:text-blue-300',   border: 'border-blue-200 dark:border-blue-700' },
]

const STATS = [
  { label: 'Verification', value: '7 yr', pct: 87, color: 'bg-yellow-400' },
  { label: 'AI / Systems', value: '2 yr', pct: 30, color: 'bg-purple-400' },
  { label: 'Japanese',     value: 'N2',   pct: 65, color: 'bg-gray-400' },
  { label: 'SV Startup',   value: '2 yr', pct: 30, color: 'bg-blue-400' },
]

export default function TrainerCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
    >
      {/* Color stripe */}
      <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500" />

      <div className="p-5 sm:p-6 space-y-5">
        {/* Card header label */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Trainer Card
          </span>
          <span className="text-xs font-mono text-gray-400 dark:text-gray-500">#YW-001</span>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md ring-4 ring-white dark:ring-gray-900">
            <span className="text-xl font-bold text-white tracking-tight select-none">YW</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
              Yomi · Yu-Wei Chen
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Verification Engineer → AI Specialist
            </p>
            <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-0.5">
              Singapore · Ex–Silicon Valley
            </p>
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
        </div>

        {/* Stats */}
        <div className="space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Trainer Stats
          </div>
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-24 text-xs font-mono text-gray-600 dark:text-gray-400 flex-shrink-0">
                {s.label}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${s.color}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className="w-8 text-xs font-mono text-gray-500 dark:text-gray-400 text-right flex-shrink-0">
                {s.value}
              </span>
            </div>
          ))}
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
            Book a call →
          </a>
          <a
            href={`mailto:${siteMetadata.email}`}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            Email →
          </a>
        </div>
      </div>
    </motion.div>
  )
}
