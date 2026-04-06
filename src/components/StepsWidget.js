const STEP_GOAL = 10000

const CATEGORY_EMOJI = {
  reading: '📚',
  listening: '🎵',
  watching: '📺',
  eating: '🍽️',
  learning: '✏️',
  doing: '🎯',
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function StepBar({ steps }) {
  const pct = Math.min(100, Math.round((steps / STEP_GOAL) * 100))
  const color =
    pct >= 100 ? 'bg-green-500' : pct >= 70 ? 'bg-blue-500' : 'bg-orange-400'

  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-2xl flex-shrink-0">🦶</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {steps.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            / {STEP_GOAL.toLocaleString()} goal
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className={`${color} h-1.5 rounded-full transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0 w-10 text-right">
        {pct}%
      </span>
    </div>
  )
}

export function StepsWidget({ stats }) {
  const today = stats && stats[0]
  const steps = today?.steps

  if (!steps) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 py-1">
        <span>🦶</span>
        <span>No step data yet — add to Notion DailyStats</span>
      </div>
    )
  }

  // Last 7 days for the sparkline (up to 7 bars)
  const week = stats.slice(0, 7).reverse()

  return (
    <div className="space-y-3">
      <StepBar steps={steps} />
      {week.length > 1 && (
        <div className="flex items-end gap-1 h-8">
          {week.map((day, i) => {
            const h = day.steps ? Math.max(4, Math.round((day.steps / STEP_GOAL) * 32)) : 2
            const isToday = i === week.length - 1
            return (
              <div
                key={day.id}
                title={`${day.date}: ${day.steps?.toLocaleString() || 0} steps`}
                className={`flex-1 rounded-sm ${
                  isToday
                    ? 'bg-blue-500'
                    : (day.steps || 0) >= STEP_GOAL
                    ? 'bg-green-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                style={{ height: `${h}px` }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Now Section ──────────────────────────────────────────────────────────────

function NowCard({ item }) {
  const emoji = CATEGORY_EMOJI[item.category] || '🎯'
  const content = (
    <div className="flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <span className="text-xl flex-shrink-0 mt-0.5">{emoji}</span>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">
          {item.category}
        </div>
        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug">
          {item.name}
        </div>
        {item.notes && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
            {item.notes}
          </div>
        )}
      </div>
    </div>
  )

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return content
}

export function NowSection({ items }) {
  if (!items || !items.length) return null
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
        Right now
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => (
          <NowCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
