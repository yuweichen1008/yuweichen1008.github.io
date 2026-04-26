import { useState, useEffect } from 'react'

// SG arrival date (first day in Singapore)
const SG_ARRIVAL = new Date('2026-03-31T00:00:00+08:00')
// JLPT N2 exam date
const JLPT_DATE = new Date('2026-07-05T09:00:00+08:00')

function daysUntil(target) {
  const now = new Date()
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)))
}

function daysSince(start) {
  const now = new Date()
  return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)))
}

function jlptProgress() {
  const now = new Date()
  const total = JLPT_DATE - SG_ARRIVAL
  const elapsed = Math.min(Math.max(now - SG_ARRIVAL, 0), total)
  return Math.round((elapsed / total) * 100)
}

function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setDate(midnight.getDate() + 1)
  midnight.setHours(0, 0, 0, 0)
  return midnight - now
}

function getValues() {
  return {
    jlptDays: daysUntil(JLPT_DATE),
    sgDays: daysSince(SG_ARRIVAL),
    progress: jlptProgress(),
  }
}

function Stat({ emoji, label, value, sub }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-2xl flex-shrink-0">{emoji}</span>
      <div className="min-w-0">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider leading-none mb-0.5">
          {label}
        </div>
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-none">
          {value}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>
      </div>
    </div>
  )
}

export default function CountdownBanner() {
  const [values, setValues] = useState(getValues)

  useEffect(() => {
    let timeoutId = setTimeout(function tick() {
      setValues(getValues())
      timeoutId = setTimeout(tick, msUntilMidnight())
    }, msUntilMidnight())
    return () => clearTimeout(timeoutId)
  }, [])

  const { jlptDays, sgDays, progress } = values

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex flex-wrap gap-6 px-5 py-4 bg-gray-50 dark:bg-gray-800">
        <Stat
          emoji="🇯🇵"
          label="JLPT N2"
          value={jlptDays === 0 ? 'Today!' : `${jlptDays}d`}
          sub="Jul 5, 2026 · keep going"
        />
        <div className="w-px bg-gray-200 dark:bg-gray-700 self-stretch hidden sm:block" />
        <Stat
          emoji="🇸🇬"
          label="In Singapore"
          value={`${sgDays}d`}
          sub="Since Mar 31 · extending"
        />
      </div>

      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>🛬 Mar 31</span>
          <span className="font-medium text-gray-500 dark:text-gray-400">{progress}% to JLPT</span>
          <span>🎌 Jul 5</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
