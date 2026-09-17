import { motion } from 'framer-motion'
import quest from '@/data/questData'
import useNow from '@/lib/useNow'

const DAY = 1000 * 60 * 60 * 24
const toDate = (iso) => new Date(iso + 'T00:00:00')

function fmt(iso) {
  return toDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function QuestLog({ buildTime }) {
  const now = useNow(buildTime)
  const start = toDate(quest.start)
  const end = toDate(quest.end)
  const pct = Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)))
  const dayNo = Math.min(
    Math.ceil((end - start) / DAY),
    Math.max(0, Math.floor((now - start) / DAY) + 1)
  )
  const totalDays = Math.ceil((end - start) / DAY)
  const cleared = quest.objectives.filter((o) => o.done).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl border-4 border-gray-900 dark:border-gray-200 bg-white dark:bg-gray-900 pixel-shadow"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-900 dark:bg-gray-200 flex-wrap">
        <span className="font-pixel text-[10px] sm:text-xs text-yellow-300 dark:text-purple-700">
          ★ Quest Log
        </span>
        <span className="font-pixel text-[9px] text-gray-300 dark:text-gray-700">
          {fmt(quest.start)} → {fmt(quest.end)}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            {quest.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Main quest before and after turning 33: go all in on AI, level up every stat, and keep
            doors open across the globe.
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-pixel text-[8px] uppercase text-gray-500 dark:text-gray-400">
              Day {dayNo}/{totalDays}
            </span>
            <span className="font-pixel text-[8px] text-gray-500 dark:text-gray-400">
              {cleared}/{quest.objectives.length} cleared
            </span>
          </div>
          <div className="h-3 rounded-sm border-2 border-gray-900 dark:border-gray-200 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quest.checkpoints.map((c) => {
            const days = Math.ceil((toDate(c.date) - now) / DAY)
            const status = days > 1 ? `${days} days` : days === 1 ? 'Tomorrow' : days === 0 ? 'Today!' : 'Cleared ✓'
            return (
              <div
                key={c.date}
                className="flex items-center gap-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 px-3 py-2.5"
              >
                <span className="text-2xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{c.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{fmt(c.date)}</div>
                </div>
                <span className="font-pixel text-[9px] text-purple-600 dark:text-purple-400 flex-shrink-0">
                  {status}
                </span>
              </div>
            )
          })}
        </div>

        {/* Objectives */}
        <ul className="space-y-2">
          {quest.objectives.map((o) => (
            <li key={o.id} className="flex items-start gap-3 text-sm">
              <span
                className={`mt-0.5 w-4 h-4 flex-shrink-0 border-2 flex items-center justify-center text-[10px] leading-none ${
                  o.done
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-400 dark:border-gray-500'
                }`}
              >
                {o.done ? '✓' : ''}
              </span>
              <span className="flex-shrink-0">{o.icon}</span>
              <span
                className={
                  o.done
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {o.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
