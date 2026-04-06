import { useState, useEffect } from 'react'

const TAIWAN_DATE = new Date('2026-07-04T00:00:00+08:00')
// JLPT N2 is typically first Sunday of July — July 5, 2026
const JLPT_DATE = new Date('2026-07-05T09:00:00+08:00')
const SPRINT_START = new Date('2026-04-01T00:00:00+08:00')
const SPRINT_END = new Date('2026-07-04T00:00:00+08:00')

function daysUntil(target) {
  const now = new Date()
  const diff = target - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function sprintProgress() {
  const now = new Date()
  const total = SPRINT_END - SPRINT_START
  const elapsed = Math.min(Math.max(now - SPRINT_START, 0), total)
  return Math.round((elapsed / total) * 100)
}

export default function CountdownBanner() {
  const [taiwanDays, setTaiwanDays] = useState(daysUntil(TAIWAN_DATE))
  const [jlptDays, setJlptDays] = useState(daysUntil(JLPT_DATE))
  const [progress, setProgress] = useState(sprintProgress())

  useEffect(() => {
    const interval = setInterval(() => {
      setTaiwanDays(daysUntil(TAIWAN_DATE))
      setJlptDays(daysUntil(JLPT_DATE))
      setProgress(sprintProgress())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 mb-8">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        {/* Taiwan countdown */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">✈️</div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
              Back to Taiwan
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {taiwanDays === 0 ? "Today!" : `${taiwanDays} days`}
            </div>
            <div className="text-xs text-gray-400">Jul 4, 2026</div>
          </div>
        </div>

        {/* JLPT N2 countdown */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">🇯🇵</div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
              JLPT N2 Exam
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {jlptDays === 0 ? "Today!" : `${jlptDays} days`}
            </div>
            <div className="text-xs text-gray-400">Jul 5, 2026</div>
          </div>
        </div>

        {/* Sprint stats */}
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

      {/* Progress bar */}
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
