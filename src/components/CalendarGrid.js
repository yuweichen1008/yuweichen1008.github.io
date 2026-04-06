import { useState } from 'react'

const CATEGORY_CONFIG = {
  food: { emoji: '🍜', color: 'bg-orange-400', label: 'Food' },
  exercise: { emoji: '🏃', color: 'bg-blue-400', label: 'Exercise' },
  friends: { emoji: '👥', color: 'bg-pink-400', label: 'Friends' },
  learning: { emoji: '📚', color: 'bg-purple-400', label: 'Learning' },
  work: { emoji: '💼', color: 'bg-yellow-400', label: 'Work' },
  entertainment: { emoji: '🎬', color: 'bg-red-400', label: 'Entertainment' },
  adventure: { emoji: '🗺️', color: 'bg-green-400', label: 'Adventure' },
}

const SPRINT_START = new Date('2026-04-01')
const SPRINT_END = new Date('2026-07-04')

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

// Build an index: dateStr -> array of journal entries
function buildDateIndex(entries) {
  const idx = {}
  entries.forEach((entry) => {
    const d = entry.date?.split('T')[0]
    if (d) {
      if (!idx[d]) idx[d] = []
      idx[d].push(entry)
    }
  })
  return idx
}

function MonthGrid({ year, month, dateIndex, onDayClick, selectedDate }) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long' })
  const today = formatDate(new Date())

  const cells = []
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const dateStr = formatDate(date)
    const isInSprint = date >= SPRINT_START && date <= SPRINT_END
    const isToday = dateStr === today
    const isSelected = dateStr === selectedDate
    const entries = dateIndex[dateStr] || []
    const categories = [...new Set(entries.flatMap((e) => e.categories || []))]
    const hasEntries = entries.length > 0

    cells.push(
      <button
        key={d}
        onClick={() => isInSprint && onDayClick(dateStr, entries)}
        className={[
          'relative p-1 rounded-lg text-left transition-all min-h-12',
          isInSprint ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'opacity-30 cursor-default',
          isToday ? 'ring-2 ring-blue-500' : '',
          isSelected ? 'bg-blue-50 dark:bg-blue-900' : '',
          hasEntries ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700' : '',
        ].join(' ')}
      >
        <span
          className={`text-xs font-medium ${
            isToday
              ? 'text-blue-600 dark:text-blue-400'
              : isInSprint
              ? 'text-gray-700 dark:text-gray-300'
              : 'text-gray-400'
          }`}
        >
          {d}
        </span>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-0.5 mt-0.5">
            {categories.slice(0, 4).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat]
              if (!cfg) return null
              return (
                <span
                  key={cat}
                  title={cfg.label}
                  className={`w-1.5 h-1.5 rounded-full ${cfg.color} flex-shrink-0`}
                />
              )
            })}
            {categories.length > 4 && (
              <span className="text-gray-400 text-xs leading-none">+</span>
            )}
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{monthName}</h3>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>
    </div>
  )
}

function DayDetailPanel({ dateStr, entries, onClose }) {
  if (!entries || !entries.length) return null
  const date = new Date(dateStr + 'T00:00:00')
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const allCategories = [...new Set(entries.flatMap((e) => e.categories || []))]

  return (
    <div className="mt-6 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-bold text-gray-900 dark:text-gray-100">{formatted}</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {allCategories.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat]
              if (!cfg) return null
              return (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {cfg.emoji} {cfg.label}
                </span>
              )
            })}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
        >
          ×
        </button>
      </div>
      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="border-t border-gray-100 dark:border-gray-700 pt-3">
            <div className="font-medium text-gray-800 dark:text-gray-200">{entry.title}</div>
            {entry.mood && (
              <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mt-1 mb-1">
                mood: {entry.mood}
              </span>
            )}
            {entry.summary && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{entry.summary}</p>
            )}
            {entry.slug && (
              <a
                href={`/journal/${entry.slug}`}
                className="text-xs text-blue-500 hover:text-blue-600 mt-1 inline-block"
              >
                Read entry →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CalendarGrid({ entries = [] }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEntries, setSelectedEntries] = useState([])

  const dateIndex = buildDateIndex(entries)

  const months = [
    { year: 2026, month: 3 }, // April
    { year: 2026, month: 4 }, // May
    { year: 2026, month: 5 }, // June
    { year: 2026, month: 6 }, // July (partial)
  ]

  function handleDayClick(dateStr, dayEntries) {
    if (selectedDate === dateStr) {
      setSelectedDate(null)
      setSelectedEntries([])
    } else {
      setSelectedDate(dateStr)
      setSelectedEntries(dayEntries)
    }
  }

  const totalLogged = Object.keys(dateIndex).filter((d) => {
    const date = new Date(d + 'T00:00:00')
    return date >= SPRINT_START && date <= SPRINT_END
  }).length

  return (
    <div>
      {/* Category legend */}
      <div className="flex flex-wrap gap-3 mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
            {cfg.emoji} {cfg.label}
          </span>
        ))}
        <span className="ml-auto text-sm font-medium text-gray-500 dark:text-gray-400">
          {totalLogged} / 95 days logged
        </span>
      </div>

      {/* Calendar grids */}
      {months.map(({ year, month }) => (
        <MonthGrid
          key={`${year}-${month}`}
          year={year}
          month={month}
          dateIndex={dateIndex}
          onDayClick={handleDayClick}
          selectedDate={selectedDate}
        />
      ))}

      {/* Day detail panel */}
      {selectedDate && (
        <DayDetailPanel
          dateStr={selectedDate}
          entries={selectedEntries}
          onClose={() => {
            setSelectedDate(null)
            setSelectedEntries([])
          }}
        />
      )}
    </div>
  )
}
