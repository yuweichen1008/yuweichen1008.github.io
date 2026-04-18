import { useState } from 'react'
import { CATEGORY_CONFIG } from '@/lib/categoryConfig'

const SPRINT_START = new Date('2026-04-01')
const SPRINT_END   = new Date('2026-07-04')

// Key milestone dates shown with a ⭐ ring and highlighted in the day panel
const MILESTONES = {
  '2026-03-31': { title: 'Arrived in Singapore', emoji: '✈️', desc: 'Left Silicon Valley, touched down in Singapore for the next chapter.' },
  '2026-04-01': { title: '96-Day Sprint Begins', emoji: '🏁', desc: 'Apr 1 → Jul 4. 96 days documented before flying home.' },
  '2026-07-04': { title: 'Flight to Taipei', emoji: '✈️', desc: 'Flying back to Taiwan after 96 days in Singapore.' },
  '2026-07-05': { title: 'JLPT N2 Exam Day', emoji: '🎌', desc: 'Sitting the JLPT N2 in Taipei. The 90-day study stack comes down to this.' },
}

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

// Show Apr 2026 through at least Jul 2026, extending dynamically to current month + 1
function getMonthsToShow() {
  const startYear = 2026, startMonth = 3 // April (month index 3)
  const minEndYear = 2026, minEndMonth = 6 // July (month index 6)
  const today = new Date()
  let endYear = today.getFullYear()
  let endMonth = today.getMonth() + 1
  if (endMonth > 11) { endMonth -= 12; endYear++ }
  if (endYear < minEndYear || (endYear === minEndYear && endMonth < minEndMonth)) {
    endYear = minEndYear; endMonth = minEndMonth
  }
  const months = []
  let y = startYear, m = startMonth
  while (y < endYear || (y === endYear && m <= endMonth)) {
    months.push({ year: y, month: m })
    m++; if (m > 11) { m = 0; y++ }
  }
  return months
}

// ─── Month Grid ───────────────────────────────────────────────────────────────

function MonthGrid({ year, month, dateIndex, calEventIndex, onDayClick, selectedDate }) {
  const daysInMonth  = getDaysInMonth(year, month)
  const firstDay     = getFirstDayOfMonth(year, month)
  const monthName    = new Date(year, month, 1).toLocaleString('en-US', { month: 'long' })
  const todayStr     = localDateStr(new Date())
  const todayDate    = new Date(); todayDate.setHours(0, 0, 0, 0)

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} />)

  for (let d = 1; d <= daysInMonth; d++) {
    const date      = new Date(year, month, d)
    const dateStr   = localDateStr(date)
    const isPast    = date <= todayDate
    const isToday   = dateStr === todayStr
    const isSelected = dateStr === selectedDate
    const isMilestone = !!MILESTONES[dateStr]
    const isInSprint  = date >= SPRINT_START && date <= SPRINT_END
    const entries   = dateIndex[dateStr] || []
    const calEvs    = calEventIndex[dateStr] || []
    const categories = [...new Set(entries.flatMap((e) => e.categories || []))]
    const hasData   = entries.length > 0 || calEvs.length > 0
    const clickable = isPast || isToday || hasData

    cells.push(
      <button
        key={d}
        onClick={() => clickable && onDayClick(dateStr)}
        className={[
          'relative p-1 rounded-lg text-left transition-all min-h-[48px]',
          clickable
            ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'opacity-20 cursor-default',
          isToday     ? 'ring-2 ring-blue-500' : '',
          isMilestone ? 'ring-2 ring-amber-400' : '',
          isSelected  ? 'bg-blue-50 dark:bg-blue-900/40' : '',
          isInSprint && !isSelected && !isToday ? 'bg-green-50/60 dark:bg-green-900/10' : '',
          hasData     ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700' : '',
        ].filter(Boolean).join(' ')}
      >
        <span className={`text-xs font-medium ${
          isToday ? 'text-blue-600 dark:text-blue-400' :
          isPast  ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
        }`}>
          {d}
        </span>
        {isMilestone && (
          <span className="absolute top-0.5 right-0.5 text-xs leading-none select-none">⭐</span>
        )}
        <div className="flex flex-wrap gap-0.5 mt-0.5">
          {calEvs.length > 0 && (
            <span title={calEvs.map((e) => e.title).join(', ')} className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
          )}
          {categories.slice(0, 3).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat]
            if (!cfg) return null
            return <span key={cat} title={cfg.label} className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} flex-shrink-0`} />
          })}
          {categories.length > 3 && <span className="text-gray-400 text-[10px] leading-none">+</span>}
        </div>
      </button>
    )
  }

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {monthName} {year}
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>
    </div>
  )
}

// ─── Heatmap View ────────────────────────────────────────────────────────────

function HeatmapView({ dateIndex, calEventIndex, onDayClick, selectedDate }) {
  const todayDate = new Date(); todayDate.setHours(0, 0, 0, 0)

  // Start from the Sunday on or before Apr 1, 2026
  const anchor = new Date('2026-04-01')
  anchor.setDate(anchor.getDate() - anchor.getDay())

  // End: 2 weeks past today, rounded to Saturday
  const end = new Date(todayDate)
  end.setDate(end.getDate() + 14)
  end.setDate(end.getDate() + (6 - end.getDay()))

  // Build weeks
  const weeks = []
  let cur = new Date(anchor)
  while (cur <= end) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const ds    = localDateStr(cur)
      const count = (dateIndex[ds]?.length || 0) + (calEventIndex[ds]?.length || 0)
      week.push({
        dateStr:     ds,
        count,
        isMilestone: !!MILESTONES[ds],
        isFuture:    cur > todayDate,
        month:       cur.getMonth(),
        day:         cur.getDate(),
      })
      cur = new Date(cur); cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }

  // Month label at each new month boundary
  const monthLabelAt = {}
  weeks.forEach((week, wi) => {
    const first = week[0]
    const prev  = wi > 0 ? weeks[wi - 1][0] : null
    if (!prev || prev.month !== first.month) {
      monthLabelAt[wi] = new Date(2026, first.month, 1).toLocaleString('en-US', { month: 'short' })
    }
  })

  function cellColor(count, isFuture) {
    if (isFuture || count === 0) return 'bg-gray-100 dark:bg-gray-700'
    if (count === 1) return 'bg-emerald-200 dark:bg-emerald-900'
    if (count <= 3)  return 'bg-emerald-400 dark:bg-emerald-700'
    return 'bg-emerald-600 dark:bg-emerald-500'
  }

  const totalLogged = Object.keys(dateIndex).filter((d) => {
    const dt = new Date(d + 'T00:00:00')
    return dt >= new Date('2026-04-01') && dt <= todayDate
  }).length

  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex flex-col gap-1 min-w-max">
        {/* Month labels */}
        <div className="flex gap-1 ml-8">
          {weeks.map((_, wi) => (
            <div key={wi} className="w-3 text-xs text-gray-400 leading-3 overflow-visible whitespace-nowrap">
              {monthLabelAt[wi] || ''}
            </div>
          ))}
        </div>

        {/* Day-of-week labels + grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 justify-start pt-0">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((lbl, i) => (
              <div key={i} className={`w-3 h-3 text-xs text-gray-400 flex items-center ${i % 2 === 1 ? '' : 'invisible'}`}>
                {lbl}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <button
                  key={day.dateStr}
                  onClick={() => !day.isFuture && onDayClick(day.dateStr)}
                  title={`${day.dateStr}${day.count > 0 ? ` · ${day.count} entr${day.count === 1 ? 'y' : 'ies'}` : ''}${day.isMilestone ? ` · ⭐ ${MILESTONES[day.dateStr].title}` : ''}`}
                  className={[
                    'w-3 h-3 rounded-sm transition-opacity',
                    cellColor(day.count, day.isFuture),
                    day.isMilestone  ? 'ring-1 ring-amber-400' : '',
                    day.dateStr === selectedDate ? 'ring-1 ring-blue-500' : '',
                    !day.isFuture    ? 'cursor-pointer hover:opacity-75' : 'cursor-default',
                  ].filter(Boolean).join(' ')}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-2 ml-8">
          <span className="text-xs text-gray-400">Less</span>
          {[
            'bg-gray-100 dark:bg-gray-700',
            'bg-emerald-200 dark:bg-emerald-900',
            'bg-emerald-400 dark:bg-emerald-700',
            'bg-emerald-600 dark:bg-emerald-500',
          ].map((cls, i) => (
            <span key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
          ))}
          <span className="text-xs text-gray-400">More</span>
          <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
            {totalLogged} day{totalLogged !== 1 ? 's' : ''} with entries
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Day Detail Panel ────────────────────────────────────────────────────────

function DayDetailPanel({ dateStr, entries, calEvs, onClose }) {
  const hasAnything = (entries && entries.length) || (calEvs && calEvs.length)
  const milestone   = MILESTONES[dateStr]

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
                <span key={cat} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {cfg.emoji} {cfg.label}
                </span>
              )
            })}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none ml-4">×</button>
      </div>

      {/* Milestone card */}
      {milestone && (
        <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{milestone.emoji}</span>
            <div>
              <div className="font-bold text-amber-900 dark:text-amber-100 text-sm">
                ⭐ {milestone.title}
              </div>
              {milestone.desc && (
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">{milestone.desc}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!hasAnything && !milestone && (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          Nothing logged for this day yet.
        </p>
      )}

      {/* GCal events */}
      {calEvs && calEvs.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-500 mb-1">📅 Events</div>
          {calEvs.map((ev) => (
            <div key={ev.id} className="flex gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {ev.url
                    ? <a href={ev.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">{ev.title}</a>
                    : ev.title}
                </div>
                {!ev.isAllDay && ev.startTime && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {ev.startTime}{ev.endTime ? ` – ${ev.endTime}` : ''}
                  </div>
                )}
                {ev.location && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">📍 {ev.location}</div>}
                {ev.description && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{ev.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Journal entries */}
      {entries && entries.length > 0 && (
        <div className="space-y-3">
          {calEvs && calEvs.length > 0 && (
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">📓 Journal</div>
          )}
          {entries.map((entry) => (
            <div key={entry.id} className="border-t border-gray-100 dark:border-gray-700 pt-3 first:border-0 first:pt-0">
              <div className="font-medium text-gray-800 dark:text-gray-200">{entry.title}</div>
              {entry.mood && (
                <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mt-1 mb-1">
                  {entry.mood}
                </span>
              )}
              {entry.summary && <p className="text-sm text-gray-500 dark:text-gray-400">{entry.summary}</p>}
              {entry.slug && (
                <a href={`/journal/${entry.slug}`} className="text-xs text-blue-500 hover:text-blue-600 mt-1 inline-block">
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

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function CalendarGrid({ entries = [], calEvents = [] }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [view, setView] = useState('calendar') // 'calendar' | 'heatmap'

  const dateIndex    = buildDateIndex(entries)
  const calEventIndex = buildCalEventIndex(calEvents)
  const selectedEntries = selectedDate ? dateIndex[selectedDate] || [] : []
  const selectedCalEvs  = selectedDate ? calEventIndex[selectedDate] || [] : []
  const months = getMonthsToShow()

  const totalLogged = Object.keys(dateIndex).length

  function handleDayClick(dateStr) {
    setSelectedDate(selectedDate === dateStr ? null : dateStr)
  }

  return (
    <div>
      {/* Header bar: legend + view toggle */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          GCal event
        </span>
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor}`} />
            {cfg.emoji} {cfg.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <span className="text-amber-400 text-xs">⭐</span>
          Milestone
        </span>

        {/* Spacer + view toggle */}
        <div className="ml-auto flex items-center gap-1 bg-white dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
          {[
            { id: 'calendar', label: '📅 Calendar' },
            { id: 'heatmap',  label: '🟩 Heatmap' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={[
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                view === v.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
              ].join(' ')}
            >
              {v.label}
            </button>
          ))}
        </div>

        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">
          {totalLogged} days logged
        </span>
      </div>

      {/* Views */}
      {view === 'calendar' && (
        <>
          {months.map(({ year, month }) => (
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
        </>
      )}

      {view === 'heatmap' && (
        <HeatmapView
          dateIndex={dateIndex}
          calEventIndex={calEventIndex}
          onDayClick={handleDayClick}
          selectedDate={selectedDate}
        />
      )}

      {/* Day detail panel — shown in both views */}
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
