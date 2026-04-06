import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import JournalListLayout from '@/layouts/JournalListLayout'
import { getJournalEntries } from '@/lib/notion'

export async function getStaticProps() {
  const entries = await getJournalEntries()
  // Sort newest first
  entries.sort((a, b) => new Date(b.date) - new Date(a.date))
  return {
    props: { entries },
  }
}

export default function Journal({ entries }) {
  return (
    <>
      <PageSeo
        title={`Journal - ${siteMetadata.author}`}
        description="Day-to-day life in Singapore. Food, runs, friends, Japanese study, and more."
        url={`${siteMetadata.siteUrl}/journal`}
      />
      <JournalListLayout entries={entries} />
    </>
  )
}
