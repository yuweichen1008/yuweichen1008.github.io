const accentClasses = {
  red: {
    border: 'border-red-400 dark:border-red-500',
    tag: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    heading: 'text-red-500 dark:text-red-400',
  },
  blue: {
    border: 'border-blue-400 dark:border-blue-500',
    tag: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    heading: 'text-blue-500 dark:text-blue-400',
  },
  green: {
    border: 'border-green-400 dark:border-green-500',
    tag: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    heading: 'text-green-500 dark:text-green-400',
  },
}

export default function CityChapter({ city, flag, years, headline, body, accentColor, tags, flip }) {
  const accent = accentClasses[accentColor] || accentClasses.blue

  return (
    <div
      className={`py-12 border-l-4 pl-6 ${accent.border} ${
        flip ? 'xl:pl-0 xl:pr-6 xl:border-l-0 xl:border-r-4' : ''
      }`}
    >
      <div className={`flex flex-col gap-6 ${flip ? 'xl:flex-row-reverse' : 'xl:flex-row'}`}>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{flag}</span>
            <div>
              <h2 className={`text-2xl font-bold ${accent.heading}`}>{city}</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{years}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {headline}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{body}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-medium px-2 py-1 rounded-full ${accent.tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
