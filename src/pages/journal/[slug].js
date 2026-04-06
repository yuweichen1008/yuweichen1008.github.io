import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import JournalPostLayout from '@/layouts/JournalPostLayout'
import { getJournalEntries, getJournalEntry } from '@/lib/notion'

export async function getStaticPaths() {
  const entries = await getJournalEntries()
  return {
    paths: entries.map((e) => ({ params: { slug: e.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const entry = await getJournalEntry(params.slug)
  if (!entry) return { notFound: true }
  return { props: { entry } }
}

export default function JournalPost({ entry }) {
  return (
    <>
      <PageSeo
        title={`${entry.title} - ${siteMetadata.author}`}
        description={entry.summary || entry.title}
        url={`${siteMetadata.siteUrl}/journal/${entry.slug}`}
      />
      <JournalPostLayout entry={entry} />
    </>
  )
}
