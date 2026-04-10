import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'
import CountdownBanner from '@/components/CountdownBanner'
import CalendarGrid from '@/components/CalendarGrid'
import { getJournalEntries } from '@/lib/notion'
import { getCalendarEvents } from '@/lib/gcal'

export async function getStaticProps() {
  const hasNotion = !!process.env.NOTION_TOKEN
  const [entries, calEvents] = await Promise.all([
    getJournalEntries(),
    getCalendarEvents(process.env.GOOGLE_CALENDAR_ICAL_URL),
  ])
  return { props: { entries, calEvents, hasNotion } }
}

export default function Calendar({ entries, calEvents, hasNotion }) {
  return (
    <>
      <PageSeo
        title={`Calendar – ${siteMetadata.title}`}
        description="95 days documented. Apr 1 → Jul 4, 2026. Singapore life before flying back to Taiwan."
        url={`${siteMetadata.siteUrl}/calendar`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Apr 1 → Jul 4
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            95 days in Singapore. Every day counts.
          </p>
        </div>
        <div className="py-8">
          <CountdownBanner />
          {!hasNotion && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 text-sm text-yellow-800 dark:text-yellow-200">
              Notion not connected — add <code className="font-mono">NOTION_TOKEN</code> to{' '}
              <code className="font-mono">.env.local</code> to see journal entries. Check{' '}
              <Link href="/debug" className="underline">the debug page</Link> for status.
            </div>
          )}
          <CalendarGrid entries={entries} calEvents={calEvents} />
        </div>
      </div>
    </>
  )
}
