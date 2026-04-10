import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import JournalPostLayout from '@/layouts/JournalPostLayout'
import { getJournalEntries, getJournalEntry } from '@/lib/notion'
import { getLocalJournalEntries, getLocalJournalEntry } from '@/lib/localJournal'
import { serialize } from 'next-mdx-remote/serialize'

export async function getStaticPaths() {
  const [notionEntries, localEntries] = await Promise.all([
    getJournalEntries(),
    Promise.resolve(getLocalJournalEntries()),
  ])
  const seenSlugs = new Set(notionEntries.map((e) => e.slug))
  const allEntries = [...notionEntries, ...localEntries.filter((e) => !seenSlugs.has(e.slug))]
  return {
    paths: allEntries.map((e) => ({ params: { slug: e.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  // Notion first
  const notionEntry = await getJournalEntry(params.slug)
  if (notionEntry) return { props: { entry: notionEntry } }

  // Fall back to local markdown
  const localEntry = getLocalJournalEntry(params.slug)
  if (!localEntry) return { notFound: true }

  const mdxSource = await serialize(localEntry.content)
  return {
    props: {
      entry: {
        id: localEntry.id,
        title: localEntry.title,
        date: localEntry.date,
        slug: localEntry.slug,
        categories: localEntry.categories,
        mood: localEntry.mood,
        summary: localEntry.summary,
        wordCount: localEntry.wordCount,
        source: 'local',
        mdxSource,
      },
    },
  }
}

export default function JournalPost({ entry }) {
  return (
    <>
      <PageSeo
        title={`${entry.title} – ${siteMetadata.author}`}
        description={entry.summary || entry.title}
        url={`${siteMetadata.siteUrl}/journal/${entry.slug}`}
      />
      <JournalPostLayout entry={entry} />
    </>
  )
}
