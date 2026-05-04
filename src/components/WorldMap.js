import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import fowData from '@/data/fowData'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const VISITED = new Set(fowData.visitedCountryCodes)

export default function WorldMap() {
  const [tooltip, setTooltip] = useState(null)

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-sm">🌍</span>
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-gray-600 dark:text-gray-400">
            Fog of World
          </span>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
          {fowData.stats.countries} countries · {fowData.stats.cities} cities
        </span>
      </div>

      {/* Map */}
      <div className="relative bg-gray-50 dark:bg-gray-900" style={{ paddingBottom: '50%' }}>
        <div className="absolute inset-0">
          <ComposableMap
            projectionConfig={{ scale: 140, center: [20, 5] }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isVisited = VISITED.has(Number(geo.id))
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isVisited ? '#14b8a6' : '#e5e7eb'}
                        stroke="#fff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            fill: isVisited ? '#0d9488' : '#d1d5db',
                            outline: 'none',
                            cursor: isVisited ? 'pointer' : 'default',
                          },
                          pressed: { outline: 'none' },
                        }}
                      />
                    )
                  })
                }
              </Geographies>

              {/* City dots */}
              {fowData.highlights.map(({ name, lat, lng }) => (
                <Marker
                  key={name}
                  coordinates={[lng, lat]}
                  onMouseEnter={() => setTooltip(name)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <circle
                    r={3}
                    fill="#f59e0b"
                    stroke="#fff"
                    strokeWidth={1}
                    style={{ cursor: 'pointer' }}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip */}
          {tooltip && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-mono px-2.5 py-1 rounded-lg shadow pointer-events-none">
              {tooltip}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-teal-500 flex-shrink-0" />
          Visited
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-200 flex-shrink-0" />
          Yet to explore
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
          Cities
        </span>
      </div>
    </div>
  )
}
