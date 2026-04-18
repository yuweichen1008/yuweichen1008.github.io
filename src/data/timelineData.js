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
    photo: `${BASE}/static/images/timeline/born-in-taiwan.png`,
    translations: {
      zh: {
        title: '在台灣出生',
        description: '在台灣長大——一切的起點。',
      },
      ja: {
        title: '台湾で生まれる',
        description: '台湾で育った——すべての始まり。',
      },
    },
  },
  {
    id: '2',
    slug: 'start-college',
    title: 'Started college',
    date: '2012-08-01',
    location: 'Taiwan',
    categories: ['learning', 'milestone'],
    description: 'Started my undergraduate studies in Taiwan, majoring in Mechanical Engineering.',
    photo: `${BASE}/static/images/timeline/college.png`,
    translations: {
      zh: {
        title: '開始大學',
        description: '在台灣開始大學學業，主修機械工程。',
      },
      ja: {
        title: '大学入学',
        description: '台湾で機械工学を専攻して大学での学びを始めた。',
      },
    },
  },
  {
    id: '3',
    slug: 'start-graduate-school',
    title: 'Started graduate school',
    date: '2016-08-01',
    location: 'Taiwan',
    categories: ['learning', 'milestone'],
    description: 'Started my graduate studies in Taiwan, focusing on Electronics Engineering.',
    photo: `${BASE}/static/images/timeline/graduate.jpg`,
    translations: {
      zh: {
        title: '開始研究所',
        description: '在台灣開始研究所學業，專注於電子工程。',
      },
      ja: {
        title: '大学院入学',
        description: '台湾で電子工学に焦点を当てた大学院での学びを始めた。',
      },
    },
  },
  {
    id: '4',
    slug: 'hsinchu-science-park',
    title: 'Working in Hsinchu Science Park',
    date: '2018-12-01',
    location: 'Taiwan',
    categories: ['work', 'milestone'],
    description: "Started my career in the heart of Taiwan's tech industry.",
    photo: `${BASE}/static/images/timeline/work.jpg`,
    translations: {
      zh: {
        title: '在新竹科學園區工作',
        description: '在台灣科技產業的核心地帶開始職業生涯。',
      },
      ja: {
        title: '新竹サイエンスパークで働く',
        description: '台湾のテック産業の中心地でキャリアをスタートした。',
      },
    },
  },
  {
    id: '5',
    slug: 'silicon-valley',
    title: 'Moved to Silicon Valley',
    date: '2023-01-11',
    location: 'Silicon Valley',
    categories: ['work', 'milestone'],
    description: 'Packed up and moved to the Bay Area to start a tech career.',
    photo: `${BASE}/static/images/timeline/silicon_valley.jpg`,
    translations: {
      zh: {
        title: '移居矽谷',
        description: '打包行李，搬到灣區展開科技職業生涯。',
      },
      ja: {
        title: 'シリコンバレーへ移る',
        description: '荷物をまとめ、テックキャリアを始めるためにベイエリアへ移った。',
      },
    },
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
    translations: {
      zh: {
        title: '開始學日文',
        description: '立志在2026年7月前達到JLPT N2。',
      },
      ja: {
        title: '日本語の勉強を始める',
        description: '2026年7月までにJLPT N2を取得することを決意した。',
      },
    },
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
    translations: {
      zh: {
        title: '移居新加坡',
        description: '搬到東南亞的小紅點，開啟下一章。',
      },
      ja: {
        title: 'シンガポールへ移住',
        description: '東南アジアの小さな赤い点へ移り、次の章を始めた。',
      },
    },
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
    translations: {
      zh: {
        title: '4月1日→7月5日 · 96天衝刺',
        description: '在JLPT N2考試和回台灣之前，記錄的96天。',
      },
      ja: {
        title: '4月1日→7月5日 · 96日間スプリント',
        description: 'JLPT N2と台湾帰国前の96日間の記録。',
      },
    },
  },
]

// Support both CJS require() (next.config.js) and ESM import (pages)
module.exports = timelineEvents
module.exports.default = timelineEvents
