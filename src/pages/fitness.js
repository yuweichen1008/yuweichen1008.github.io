import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { getFitnessLog } from '@/lib/notion'

const TYPE_EMOJI = {
  Run: '🏃',
  Cycle: '🚴',
  Swim: '🏊',
  Hike: '🥾',
  Gym: '🏋️',
}

function StatCard({ label, value, unit }) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        {value}
        <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </div>
  )
}

// Pure SVG weekly bar chart — last 8 weeks
function WeeklyChart({ activities }) {
  if (!activities.length) return null

  // Group by ISO week
  const weekMap = {}
  activities.forEach((a) => {
    if (!a.date || !a.distance) return
    const d = new Date(a.date + 'T00:00:00')
    const startOfWeek = new Date(d)
    startOfWeek.setDate(d.getDate() - d.getDay())
    const key = startOfWeek.toISOString().split('T')[0]
    weekMap[key] = (weekMap[key] || 0) + (a.distance || 0)
  })

  const weeks = Object.entries(weekMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-8)

  if (!weeks.length) return null

  const maxKm = Math.max(...weeks.map(([, km]) => km), 1)
  const chartH = 80
  const barW = 28
  const gap = 8
  const totalW = weeks.length * (barW + gap)

  return (
    <div className="mt-6">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        Weekly km (last 8 weeks)
      </div>
      <svg width={totalW} height={chartH + 20} className="overflow-visible">
        {weeks.map(([weekStart, km], i) => {
          const barH = Math.max(4, (km / maxKm) * chartH)
          const x = i * (barW + gap)
          const label = new Date(weekStart + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
          return (
            <g key={weekStart}>
              <rect
                x={x}
                y={chartH - barH}
                width={barW}
                height={barH}
                rx={4}
                className="fill-blue-400 dark:fill-blue-500"
              />
              <text
                x={x + barW / 2}
                y={chartH + 14}
                textAnchor="middle"
                className="fill-gray-400 text-xs"
                style={{ fontSize: 9 }}
              >
                {label}
              </text>
              <text
                x={x + barW / 2}
                y={chartH - barH - 4}
                textAnchor="middle"
                className="fill-gray-600 dark:fill-gray-400 text-xs"
                style={{ fontSize: 9 }}
              >
                {km.toFixed(1)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export async function getStaticProps() {
  const activities = await getFitnessLog()
  return { props: { activities } }
}

export default function Fitness({ activities }) {
  const now = new Date()
  const weekAgo = new Date(now - 7 * 86400000)
  const monthAgo = new Date(now - 30 * 86400000)
  const yearAgo = new Date(now - 365 * 86400000)

  function totalKm(since) {
    return activities
      .filter((a) => a.date && new Date(a.date + 'T00:00:00') >= since)
      .reduce((sum, a) => sum + (a.distance || 0), 0)
      .toFixed(1)
  }

  const recent = activities.slice(0, 20)

  return (
    <>
      <PageSeo
        title={`Fitness - ${siteMetadata.author}`}
        description="Running, cycling, hiking — activity log from Singapore."
        url={`${siteMetadata.siteUrl}/fitness`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            🏃 Fitness
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Activity log. Every km counts.</p>
        </div>

        <div className="py-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="This week" value={totalKm(weekAgo)} unit="km" />
            <StatCard label="This month" value={totalKm(monthAgo)} unit="km" />
            <StatCard label="This year" value={totalKm(yearAgo)} unit="km" />
          </div>

          {/* Chart */}
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <WeeklyChart activities={activities} />
          </div>

          {/* Activity list */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Recent Activities
            </h2>
            {recent.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No activities logged yet.</p>
            ) : (
              <div className="space-y-3">
                {recent.map((a) => {
                  const date = a.date
                    ? new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                    >
                      <span className="text-2xl flex-shrink-0">
                        {TYPE_EMOJI[a.type] || '🏃'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {a.name || a.type}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{date}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {a.distance && (
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {a.distance} km
                          </div>
                        )}
                        {a.duration && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {a.duration} min
                          </div>
                        )}
                        {a.pace && (
                          <div className="text-xs text-gray-400">{a.pace}</div>
                        )}
                      </div>
                      {a.route && (
                        <a
                          href={a.route}
                          className="text-blue-500 hover:text-blue-600 text-sm flex-shrink-0"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
