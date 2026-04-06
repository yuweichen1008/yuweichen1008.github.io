import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import AdventureCard from '@/components/AdventureCard'
import { getAdventures } from '@/lib/notion'

export async function getStaticProps() {
  const adventures = await getAdventures()
  return { props: { adventures } }
}

export default function Adventures({ adventures }) {
  const completed = adventures.filter((a) => a.status === 'completed')
  const planned = adventures.filter((a) => a.status === 'planned')
  const considering = adventures.filter((a) => a.status === 'considering')

  return (
    <>
      <PageSeo
        title={`Adventures - ${siteMetadata.author}`}
        description="Nearby escapes from Singapore. Batam, Bintan, JB, Bali, Bangkok, and beyond."
        url={`${siteMetadata.siteUrl}/singapore/adventures`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <a href="/singapore" className="hover:text-blue-500">Singapore</a>
            {' / '}
            <span>Adventures</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            🗺️ Adventures
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Southeast Asia from SG. Everything within a 2-hour flight.
          </p>
        </div>

        <div className="py-8 space-y-10">
          {completed.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                ✅ Done ({completed.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((a) => <AdventureCard key={a.id} {...a} />)}
              </div>
            </section>
          )}

          {planned.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                📋 Planned ({planned.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {planned.map((a) => <AdventureCard key={a.id} {...a} />)}
              </div>
            </section>
          )}

          {considering.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                🤔 Considering ({considering.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {considering.map((a) => <AdventureCard key={a.id} {...a} />)}
              </div>
            </section>
          )}

          {adventures.length === 0 && (
            <p className="text-gray-400 text-center py-12">Planning in progress — check back soon.</p>
          )}
        </div>
      </div>
    </>
  )
}
