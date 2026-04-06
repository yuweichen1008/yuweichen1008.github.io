// Seed / fallback data for the timeline (used when NOTION_TOKEN is absent)
const timelineEvents = [
  {
    id: '1',
    title: 'Born in Taiwan',
    date: '1993-01-01',
    location: 'Taiwan',
    categories: ['milestone'],
    description: 'Grew up in Taiwan — the beginning of everything.',
    photo: '',
  },
  {
    id: '2',
    title: 'Moved to Silicon Valley',
    date: '2017-01-01',
    location: 'Silicon Valley',
    categories: ['work', 'milestone'],
    description: 'Packed up and moved to the Bay Area to start a tech career.',
    photo: '',
  },
  {
    id: '3',
    title: 'Relocated to Singapore',
    date: '2022-01-01',
    location: 'Singapore',
    categories: ['milestone', 'travel'],
    description: "Moved to Southeast Asia's little red dot for the next chapter.",
    photo: '',
  },
  {
    id: '4',
    title: 'Started learning Japanese',
    date: '2025-01-01',
    location: 'Singapore',
    categories: ['learning', 'milestone'],
    description: 'Committed to reaching JLPT N2 by July 2026.',
    photo: '',
  },
  {
    id: '5',
    title: 'Apr 1 → Jul 4 Documentation Sprint',
    date: '2026-04-01',
    location: 'Singapore',
    categories: ['milestone'],
    description: '95 days documented before flying back to Taiwan.',
    photo: '',
  },
]

export default timelineEvents
