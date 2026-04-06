import { useState } from 'react'
import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import FoodCard from '@/components/FoodCard'
import FilterPills from '@/components/FilterPills'
import { getFoodLog } from '@/lib/notion'

export async function getStaticProps() {
  const places = await getFoodLog()
  return { props: { places } }
}

const FILTER_OPTIONS = [
  { value: 'Star', label: 'Michelin Star', emoji: '⭐' },
  { value: 'Bib Gourmand', label: 'Bib Gourmand', emoji: '😋' },
  { value: 'Recommended', label: 'Recommended', emoji: '✓' },
  { value: 'Hawker', label: 'Hawker', emoji: '🏪' },
  { value: 'None', label: 'Casual', emoji: '🍽️' },
]

export default function SingaporeFood({ places }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? places : places.filter((p) => p.michelinStatus === filter)

  return (
    <>
      <PageSeo
        title={`Food - ${siteMetadata.author}`}
        description="Michelin stars, bib gourmands, hawker heroes. Every place worth returning to in Singapore."
        url={`${siteMetadata.siteUrl}/singapore/food`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <a href="/singapore" className="hover:text-blue-500">Singapore</a>
            {' / '}
            <span>Food</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            🍜 Food Log
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {places.length} places visited. Michelin guide and beyond.
          </p>
          <FilterPills options={FILTER_OPTIONS} active={filter} onChange={setFilter} />
        </div>

        <div className="py-8">
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No entries yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((place) => (
                <FoodCard key={place.id} {...place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
