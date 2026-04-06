export default function FilterPills({ options, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          active === 'all'
            ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All
      </button>
      {options.map(({ value, label, emoji }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            active === value
              ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {emoji && `${emoji} `}{label}
        </button>
      ))}
    </div>
  )
}
