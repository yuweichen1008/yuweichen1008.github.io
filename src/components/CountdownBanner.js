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

function CountdownItem({ emoji, label, days, date }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-3xl">{emoji}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {days === 0 ? 'Today!' : `${days} days`}
        </div>
        <div className="text-xs text-gray-400">{date}</div>
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
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 mb-8">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <CountdownItem emoji="✈️" label="Back to Taiwan" days={taiwanDays} date="Jul 4, 2026" />
        <CountdownItem emoji="🇯🇵" label="JLPT N2 Exam" days={jlptDays} date="Jul 5, 2026" />
        <div className="flex items-center gap-3">
          <div className="text-3xl">📅</div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
              Apr 1 → Jul 4 Sprint
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{progress}%</div>
            <div className="text-xs text-gray-400">95 days</div>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Apr 1</span>
        <span>Jul 4</span>
      </div>
    </div>
  )
}
