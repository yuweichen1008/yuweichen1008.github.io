import { useState, useEffect } from 'react'

const TAIWAN_DATE = new Date('2026-07-04T00:00:00+08:00')
const JLPT_DATE = new Date('2026-07-05T09:00:00+08:00')
const SPRINT_START = new Date('2026-04-01T00:00:00+08:00')
const SPRINT_END = new Date('2026-07-04T00:00:00+08:00')

function daysUntil(target) {
  const now = new Date()
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)))
}

function sprintProgress() {
  const now = new Date()
  const total = SPRINT_END - SPRINT_START
  const elapsed = Math.min(Math.max(now - SPRINT_START, 0), total)
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
    taiwanDays: daysUntil(TAIWAN_DATE),
    jlptDays: daysUntil(JLPT_DATE),
    progress: sprintProgress(),
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
    // Values only change once per day — schedule update at next midnight
    let timeoutId = setTimeout(function tick() {
      setValues(getValues())
      timeoutId = setTimeout(tick, msUntilMidnight())
    }, msUntilMidnight())
    return () => clearTimeout(timeoutId)
  }, [])

  const { taiwanDays, jlptDays, progress } = values

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Stats row */}
      <div className="flex flex-wrap gap-6 px-5 py-4 bg-gray-50 dark:bg-gray-800">
        <Stat
          emoji="✈️"
          label="Back to Taiwan"
          value={taiwanDays === 0 ? 'Today!' : `${taiwanDays}d`}
          sub="Jul 4, 2026"
        />
        <div className="w-px bg-gray-200 dark:bg-gray-700 self-stretch hidden sm:block" />
        <Stat
          emoji="🇯🇵"
          label="JLPT N2"
          value={jlptDays === 0 ? 'Today!' : `${jlptDays}d`}
          sub="Jul 5, 2026"
        />
        <div className="w-px bg-gray-200 dark:bg-gray-700 self-stretch hidden sm:block" />
        <Stat
          emoji="📅"
          label="Sprint"
          value={`${progress}%`}
          sub="Apr 1 → Jul 4"
        />
      </div>

      {/* Progress bar */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Apr 1</span>
          <span className="font-medium text-gray-500 dark:text-gray-400">{progress}% complete</span>
          <span>Jul 4</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
