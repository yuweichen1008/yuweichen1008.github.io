import { useState } from 'react'
import { CATEGORY_CONFIG } from '@/lib/categoryConfig'

const SPRINT_START = new Date('2026-04-01')
const SPRINT_END = new Date('2026-07-04')

function localDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

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

function buildCalEventIndex(calEvents) {
  const idx = {}
  calEvents.forEach((ev) => {
    if (!ev.date) return
    if (!idx[ev.date]) idx[ev.date] = []
    idx[ev.date].push(ev)
  })
  return idx
}

function MonthGrid({ year, month, dateIndex, calEventIndex, onDayClick, selectedDate }) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long' })
  const today = localDateStr(new Date())

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} />)
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const dateStr = localDateStr(date)
    const isInSprint = date >= SPRINT_START && date <= SPRINT_END
    const isToday = dateStr === today
    const isSelected = dateStr === selectedDate
    const entries = dateIndex[dateStr] || []
    const calEvs = calEventIndex[dateStr] || []
    const categories = [...new Set(entries.flatMap((e) => e.categories || []))]
    const hasEntries = entries.length > 0
    const hasCalEvents = calEvs.length > 0

    cells.push(
      <button
        key={d}
        onClick={() => isInSprint && onDayClick(dateStr)}
        className={[
          'relative p-1 rounded-lg text-left transition-all min-h-12',
          isInSprint ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'opacity-30 cursor-default',
          isToday ? 'ring-2 ring-blue-500' : '',
          isSelected ? 'bg-blue-50 dark:bg-blue-900' : '',
          hasEntries || hasCalEvents ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700' : '',
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
        <div className="flex flex-wrap gap-0.5 mt-0.5">
          {/* GCal event dot — purple, shown first */}
          {hasCalEvents && (
            <span
              title={calEvs.map((e) => e.title).join(', ')}
              className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"
            />
          )}
          {/* Journal category dots */}
          {categories.slice(0, 3).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat]
            if (!cfg) return null
            return (
              <span
                key={cat}
                title={cfg.label}
                className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} flex-shrink-0`}
              />
            )
          })}
          {categories.length > 3 && (
            <span className="text-gray-400 text-xs leading-none">+</span>
          )}
        </div>
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

function DayDetailPanel({ dateStr, entries, calEvs, onClose }) {
  const hasAnything = (entries && entries.length) || (calEvs && calEvs.length)
  if (!hasAnything) return null

  const date = new Date(dateStr + 'T00:00:00')
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const allCategories = [...new Set((entries || []).flatMap((e) => e.categories || []))]

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

      {/* GCal events */}
      {calEvs && calEvs.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-500 mb-1">
            📅 Events
          </div>
          {calEvs.map((ev) => (
            <div key={ev.id} className="flex gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900 border border-purple-100 dark:border-purple-800">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {ev.url ? (
                    <a href={ev.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 dark:hover:text-purple-400">
                      {ev.title}
                    </a>
                  ) : ev.title}
                </div>
                {!ev.isAllDay && ev.startTime && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {ev.startTime}{ev.endTime ? ` – ${ev.endTime}` : ''}
                  </div>
                )}
                {ev.location && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">📍 {ev.location}</div>
                )}
                {ev.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{ev.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Journal entries */}
      {entries && entries.length > 0 && (
        <div className="space-y-3">
          {calEvs && calEvs.length > 0 && (
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              📓 Journal
            </div>
          )}
          {entries.map((entry) => (
            <div key={entry.id} className="border-t border-gray-100 dark:border-gray-700 pt-3 first:border-0 first:pt-0">
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
      )}
    </div>
  )
}

const MONTHS = [
  { year: 2026, month: 3 }, // April
  { year: 2026, month: 4 }, // May
  { year: 2026, month: 5 }, // June
  { year: 2026, month: 6 }, // July (partial)
]

export default function CalendarGrid({ entries = [], calEvents = [] }) {
  const [selectedDate, setSelectedDate] = useState(null)

  const dateIndex = buildDateIndex(entries)
  const calEventIndex = buildCalEventIndex(calEvents)
  const selectedEntries = selectedDate ? dateIndex[selectedDate] || [] : []
  const selectedCalEvs = selectedDate ? calEventIndex[selectedDate] || [] : []

  const totalLogged = Object.keys(dateIndex).length

  function handleDayClick(dateStr) {
    setSelectedDate(selectedDate === dateStr ? null : dateStr)
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        {/* GCal dot */}
        <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          📅 GCal event
        </span>
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`} />
            {cfg.emoji} {cfg.label}
          </span>
        ))}
        <span className="ml-auto text-sm font-medium text-gray-500 dark:text-gray-400">
          {totalLogged} / 95 days logged
        </span>
      </div>

      {MONTHS.map(({ year, month }) => (
        <MonthGrid
          key={`${year}-${month}`}
          year={year}
          month={month}
          dateIndex={dateIndex}
          calEventIndex={calEventIndex}
          onDayClick={handleDayClick}
          selectedDate={selectedDate}
        />
      ))}

      {selectedDate && (
        <DayDetailPanel
          dateStr={selectedDate}
          entries={selectedEntries}
          calEvs={selectedCalEvs}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}
