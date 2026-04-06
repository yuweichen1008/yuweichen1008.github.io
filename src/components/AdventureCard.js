const STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  considering: { label: 'Considering', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
}

export default function AdventureCard({ name, country, status, dates, transportNotes, notes, linkedEntry, photo }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.considering
  const date = dates
    ? new Date(dates + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    : ''

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-md transition-shadow">
      {photo && <img src={photo} alt={name} className="w-full h-36 object-cover" />}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
          {country && <span>{country}</span>}
          {date && (
            <>
              <span>·</span>
              <span>{date}</span>
            </>
          )}
        </div>
        {transportNotes && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🚌 {transportNotes}
          </p>
        )}
        {notes && <p className="text-sm text-gray-500 dark:text-gray-400">{notes}</p>}
        {linkedEntry && (
          <a
            href={linkedEntry}
            className="text-sm text-blue-500 hover:text-blue-600 inline-block"
          >
            Read trip notes →
          </a>
        )}
      </div>
    </div>
  )
}
