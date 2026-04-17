// Seed / fallback data for the timeline (used when NOTION_TOKEN is absent)
// Images: put files in src/public/static/images/timeline/ and reference as shown below.
// The BASE prefix handles the /yuweichen1008 basePath on GitHub Pages.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

const timelineEvents = [
  {
    id: '1',
    slug: 'born-in-taiwan',
    title: 'Born in Taiwan',
    date: '1993-01-01',
    location: 'Taiwan',
    categories: ['milestone'],
    description: 'Grew up in Taiwan — the beginning of everything.',
    photo: `${BASE}/static/images/timeline/born-in-taiwan.jpg`,
  },
  {
    id: '2',
    slug: 'start-college',
    title: 'Started college',
    date: '2012-08-01',
    location: 'Taiwan',
    categories: ['learning', 'milestone'],
    description: 'Started my undergraduate studies in Taiwan, majoring in Mechanical Engineering.',
    photo: '',
  },
  {
    id: '3',
    slug: 'start-graduate-school',
    title: 'Started graduate school',
    date: '2016-08-01',
    location: 'Taiwan',
    categories: ['learning', 'milestone'],
    description: 'Started my graduate studies in Taiwan, focusing on Electronics Engineering.',
    photo: '',
  },
  {
    id: '4',
    slug: 'hsinchu-science-park',
    title: 'Working in Hsinchu Science Park',
    date: '2018-12-01',
    location: 'Taiwan',
    categories: ['work', 'milestone'],
    description: "Started my career in the heart of Taiwan's tech industry.",
    photo: '',
  },
  {
    id: '5',
    slug: 'silicon-valley',
    title: 'Moved to Silicon Valley',
    date: '2023-01-11',
    location: 'Silicon Valley',
    categories: ['work', 'milestone'],
    description: 'Packed up and moved to the Bay Area to start a tech career.',
    photo: '',
  },
  {
    id: '6',
    slug: 'learning-japanese',
    title: 'Started learning Japanese',
    date: '2025-01-01',
    location: 'Silicon Valley',
    categories: ['learning', 'milestone'],
    description: 'Committed to reaching JLPT N2 by July 2026.',
    photo: '',
  },
  {
    id: '7',
    slug: 'singapore',
    title: 'Relocated to Singapore',
    date: '2026-03-31',
    location: 'Singapore',
    categories: ['milestone', 'travel'],
    description: "Moved to Southeast Asia's little red dot for the next chapter.",
    photo: '',
  },
  {
    id: '8',
    slug: 'singapore-sprint',
    title: 'Apr 1 → Jul 5 · 96-Day Sprint',
    date: '2026-04-01',
    location: 'Singapore',
    categories: ['milestone'],
    description: '96 days documented before JLPT N2 and flying back to Taiwan.',
    photo: '',
  },
]

export default timelineEvents
