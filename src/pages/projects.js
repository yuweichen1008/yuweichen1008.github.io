import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Ruby: '#701516',
}

function relativeDate(dateStr) {
  const d = new Date(dateStr)
  const days = Math.floor((Date.now() - d) / 86400000)
  if (days < 1) return 'today'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function RepoCard({ repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {repo.name}
        </span>
        <svg
          className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 flex-1 leading-relaxed mb-4 line-clamp-2">
        {repo.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: LANG_COLORS[repo.language] || '#8b949e' }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && <span>★ {repo.stars}</span>}
        <span className="ml-auto">{relativeDate(repo.updatedAt)}</span>
      </div>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {repo.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </a>
  )
}

export async function getStaticProps() {
  let repos = []
  try {
    const res = await fetch(
      'https://api.github.com/users/yuweichen1008/repos?type=public&sort=updated&per_page=50',
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    )
    if (res.ok) {
      const data = await res.json()
      repos = data
        .filter((r) => !r.fork && r.description)
        .sort(
          (a, b) =>
            b.stargazers_count - a.stargazers_count ||
            new Date(b.pushed_at) - new Date(a.pushed_at)
        )
        .slice(0, 12)
        .map((r) => ({
          name: r.name,
          description: r.description,
          url: r.html_url,
          homepage: r.homepage || '',
          language: r.language || '',
          stars: r.stargazers_count,
          forks: r.forks_count,
          updatedAt: r.pushed_at,
          topics: r.topics || [],
        }))
    }
  } catch (e) {
    console.warn('[projects] GitHub API error:', e.message)
  }
  return { props: { repos } }
}

export default function Projects({ repos }) {
  return (
    <>
      <PageSeo
        title={`Projects – ${siteMetadata.title}`}
        description="Open source projects and things I've built — from web to mobile to AI, across Silicon Valley, Taiwan, and Singapore."
        url={`${siteMetadata.siteUrl}/projects`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Things I&apos;ve built — from Silicon Valley to Singapore. Open source and in public.
          </p>
        </div>

        <div className="py-10">
          {repos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Loading repos from GitHub...
              </p>
              <a
                href="https://github.com/yuweichen1008"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-500 hover:underline text-sm"
              >
                View directly on GitHub →
              </a>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {repos.map((repo) => (
                  <RepoCard key={repo.name} repo={repo} />
                ))}
              </div>
              <div className="mt-10 text-center">
                <a
                  href="https://github.com/yuweichen1008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg hover:border-gray-400 dark:hover:border-gray-500"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  View all on GitHub
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
