const MICHELIN_BADGE = {
  Star: { label: '⭐ Michelin Star', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  'Bib Gourmand': { label: '😋 Bib Gourmand', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  Recommended: { label: '✓ Recommended', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  Hawker: { label: '🏪 Hawker', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  None: null,
}

function Stars({ rating }) {
  if (!rating) return null
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function FoodCard({ name, cuisine, michelinStatus, neighborhood, rating, visitDate, notes, photo, mapsUrl }) {
  const badge = MICHELIN_BADGE[michelinStatus]
  const date = visitDate
    ? new Date(visitDate + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : ''

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow">
      {photo && (
        <img src={photo} alt={name} className="w-full h-40 object-cover" />
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug">{name}</h3>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
          {cuisine && <span>{cuisine}</span>}
          {neighborhood && (
            <>
              <span>·</span>
              <span>{neighborhood}</span>
            </>
          )}
          {date && (
            <>
              <span>·</span>
              <span>{date}</span>
            </>
          )}
        </div>
        <Stars rating={rating} />
        {notes && <p className="text-sm text-gray-500 dark:text-gray-400">{notes}</p>}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1"
          >
            📍 View on Maps
          </a>
        )}
      </div>
    </div>
  )
}
