import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'

const DB_KEYS = [
  'NOTION_DB_JOURNAL',
  'NOTION_DB_TIMELINE',
  'NOTION_DB_FOOD_LOG',
  'NOTION_DB_ADVENTURES',
  'NOTION_DB_FITNESS',
  'NOTION_DB_DAILY_STATS',
  'NOTION_DB_NOW_STATUS',
  'NOTION_DB_PROJECTS',
  'NOTION_DB_GOALS',
  'NOTION_DB_LIFE',
]

const OTHER_KEYS = [
  'NOTION_TOKEN',
  'GOOGLE_CALENDAR_ICAL_URL',
  'GOOGLE_PLACES_API_KEY',
  'NEXT_PUBLIC_GISCUS_REPO',
]

export async function getStaticProps() {
  const { Client } = require('@notionhq/client')
  const notion = process.env.NOTION_TOKEN
    ? new Client({ auth: process.env.NOTION_TOKEN })
    : null

  const checks = {}

  // Check DB connections
  for (const key of DB_KEYS) {
    const id = process.env[key]
    if (!id) {
      checks[key] = { status: 'missing' }
      continue
    }
    if (!notion) {
      checks[key] = { status: 'error', message: 'NOTION_TOKEN not set' }
      continue
    }
    try {
      const res = await notion.databases.query({ database_id: id, page_size: 1 })
      checks[key] = { status: 'ok', rowCount: res.results.length }
    } catch (e) {
      checks[key] = { status: 'error', message: e.message }
    }
  }

  // Check other env vars (just present/missing — no values)
  const envChecks = {}
  for (const key of OTHER_KEYS) {
    envChecks[key] = !!process.env[key]
  }

  return {
    props: {
      checks,
      envChecks,
      builtAt: new Date().toISOString(),
    },
  }
}

function StatusBadge({ status }) {
  if (status === 'ok') return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">✓ OK</span>
  if (status === 'missing') return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">— not set</span>
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">✗ error</span>
}

export default function Debug({ checks, envChecks, builtAt }) {
  return (
    <>
      <PageSeo
        title={`Debug – ${siteMetadata.title}`}
        description="Notion connection status"
        url={`${siteMetadata.siteUrl}/debug`}
      />
      <div className="pt-6 pb-12 space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            🔧 Notion Debug
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built at: <code className="font-mono">{builtAt}</code>
          </p>
        </div>

        {/* DB checks */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Notion Databases
          </h2>
          <div className="space-y-2">
            {Object.entries(checks).map(([key, result]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <code className="text-sm font-mono text-gray-700 dark:text-gray-300">{key}</code>
                <div className="flex items-center gap-3">
                  {result.status === 'error' && (
                    <span className="text-xs text-red-500 max-w-xs truncate hidden sm:block">
                      {result.message}
                    </span>
                  )}
                  <StatusBadge status={result.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other env vars */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Other Secrets
          </h2>
          <div className="space-y-2">
            {Object.entries(envChecks).map(([key, present]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <code className="text-sm font-mono text-gray-700 dark:text-gray-300">{key}</code>
                <StatusBadge status={present ? 'ok' : 'missing'} />
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          This page is public but not linked from the nav. Refresh after a CI deploy to see updated status.
        </p>
      </div>
    </>
  )
}
