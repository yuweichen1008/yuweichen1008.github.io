import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import JournalListLayout from '@/layouts/JournalListLayout'
import { getJournalEntries } from '@/lib/notion'
import { getLocalJournalEntries } from '@/lib/localJournal'

export async function getStaticProps() {
  const [notionEntries, localEntries] = await Promise.all([
    getJournalEntries(),
    Promise.resolve(getLocalJournalEntries()),
  ])
  // Notion wins on slug conflicts; merge and sort newest first
  const seenSlugs = new Set(notionEntries.map((e) => e.slug))
  const merged = [...notionEntries, ...localEntries.filter((e) => !seenSlugs.has(e.slug))]
  merged.sort((a, b) => new Date(b.date) - new Date(a.date))
  return { props: { entries: merged } }
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
