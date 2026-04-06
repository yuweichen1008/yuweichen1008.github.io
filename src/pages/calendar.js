import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import CountdownBanner from '@/components/CountdownBanner'
import CalendarGrid from '@/components/CalendarGrid'
import { getJournalEntries } from '@/lib/notion'

export async function getStaticProps() {
  const entries = await getJournalEntries()
  return {
    props: { entries },
  }
}

export default function Calendar({ entries }) {
  return (
    <>
      <PageSeo
        title={`Calendar - ${siteMetadata.author}`}
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
          <CalendarGrid entries={entries} />
        </div>
      </div>
    </>
  )
}
