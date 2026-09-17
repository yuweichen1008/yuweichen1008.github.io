// Seed / fallback data for the timeline (used when NOTION_TOKEN is absent)
// Images: put files in src/public/static/images/timeline/ and reference as shown below.
// The BASE prefix handles the /yuweichen1008 basePath on GitHub Pages.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

const timelineEvents = [
  {
    id: '1',
    slug: 'born-in-taiwan',
    title: 'Born in Taiwan',
    date: '1993-10-08',
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
    id: '8b',
    slug: 'left-the-us',
    title: 'Left the US',
    date: '2025-11-11',
    location: 'Silicon Valley',
    categories: ['milestone', 'travel'],
    description: 'Closed the Silicon Valley chapter and headed back to Asia.',
    photo: '',
    translations: {
      zh: {
        title: '離開美國',
        description: '結束矽谷篇章，回到亞洲。',
      },
      ja: {
        title: 'アメリカを離れる',
        description: 'シリコンバレーの章を閉じ、アジアへ戻った。',
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
  {
    id: '9',
    slug: 'back-to-taiwan-july',
    title: 'Trip back to Taiwan · #1',
    date: '2026-07-03',
    location: 'Taiwan',
    categories: ['travel'],
    description: 'First trip back to Taiwan since relocating to Singapore.',
    photo: '',
    translations: {
      zh: {
        title: '回台灣 · 第1趟',
        description: '移居新加坡後第一次回台灣。',
      },
      ja: {
        title: '台湾へ帰省 · 1回目',
        description: 'シンガポール移住後、初めての台湾帰省。',
      },
    },
  },
  {
    id: '10',
    slug: 'jlpt-n2-exam-day',
    title: 'Sat the JLPT N2 · 9 points short',
    date: '2026-07-05',
    location: 'Taiwan',
    categories: ['learning', 'milestone'],
    description: 'Missed the pass line by just 9 points. Close enough to know the method works, and to keep going.',
    photo: '',
    translations: {
      zh: {
        title: '參加JLPT N2 · 差9分',
        description: '只差9分就合格。夠接近，證明方法有效，也值得繼續。',
      },
      ja: {
        title: 'JLPT N2を受験 · あと9点',
        description: '合格まであと9点。方法が正しいと分かるほど近く、続ける理由には十分。',
      },
    },
  },
  {
    id: '11',
    slug: 'tokyo-trip',
    title: 'Tokyo',
    date: '2026-07-31',
    location: 'Tokyo',
    categories: ['travel'],
    description: 'Jul 31 → Aug 4. Five days in Tokyo, putting the Japanese to work.',
    photo: '',
    translations: {
      zh: {
        title: '東京',
        description: '7月31日→8月4日。在東京五天，實際使用日文。',
      },
      ja: {
        title: '東京',
        description: '7月31日→8月4日。東京で5日間、日本語を実戦で使う。',
      },
    },
  },
  {
    id: '12',
    slug: 'back-to-taiwan-august',
    title: 'Trip back to Taiwan · #2',
    date: '2026-08-22',
    location: 'Taiwan',
    categories: ['travel'],
    description: 'Aug 22 → 23. A quick weekend back home.',
    photo: '',
    translations: {
      zh: {
        title: '回台灣 · 第2趟',
        description: '8月22日→23日。短暫的週末回家。',
      },
      ja: {
        title: '台湾へ帰省 · 2回目',
        description: '8月22日→23日。週末だけの短い帰省。',
      },
    },
  },
  {
    id: '13',
    slug: 'back-to-taiwan-september',
    title: 'Trip back to Taiwan · #3',
    date: '2026-09-12',
    location: 'Taiwan',
    categories: ['travel'],
    description: 'An overnight family visit. Three trips home since the move to Singapore.',
    photo: '',
    translations: {
      zh: {
        title: '回台灣 · 第3趟',
        description: '一晚的家庭探訪。移居新加坡後已回台三次。',
      },
      ja: {
        title: '台湾へ帰省 · 3回目',
        description: '一泊の家族訪問。シンガポール移住後、3回目の帰省。',
      },
    },
  },
  {
    id: '14',
    slug: 'level-33-quest',
    title: 'Sep 17 → Nov 11 · The Level 33 Quest',
    date: '2026-09-17',
    location: 'Singapore',
    categories: ['milestone', 'work'],
    description: 'Eight weeks, one big build, done together. Ship something great with AI, train hard, and keep doors open worldwide.',
    photo: '',
    translations: {
      zh: {
        title: '9月17日→11月11日 · Lv.33 任務',
        description: '八週、一個大作品、一起完成。用AI做出很棒的東西、認真鍛鍊，並持續向世界敞開大門。',
      },
      ja: {
        title: '9月17日→11月11日 · Lv.33 クエスト',
        description: '8週間、ひとつの大きなビルドを一緒に。AIで最高のものを作り、鍛え、世界への扉を開き続ける。',
      },
    },
  },
  {
    id: '15',
    slug: 'turning-33',
    title: 'Level up · Turning 33',
    date: '2026-10-08',
    location: 'Singapore',
    categories: ['milestone'],
    description: 'Lv. 32 → Lv. 33. Three countries, three languages, one engineer who keeps evolving.',
    photo: '',
    translations: {
      zh: {
        title: '升級 · 33歲',
        description: 'Lv.32 → Lv.33。三個國家、三種語言，一個持續進化的工程師。',
      },
      ja: {
        title: 'レベルアップ · 33歳に',
        description: 'Lv.32 → Lv.33。3つの国、3つの言語、進化し続けるエンジニア。',
      },
    },
  },
  {
    id: '16',
    slug: 'one-year-since-leaving-us',
    title: 'One year since leaving the US',
    date: '2026-11-11',
    location: 'Singapore',
    categories: ['milestone'],
    description: 'Twelve months since leaving the Bay Area. The Level 33 Quest wraps up, and the next chapter starts here.',
    photo: '',
    translations: {
      zh: {
        title: '離開美國滿一年',
        description: '離開灣區滿十二個月。Lv.33 任務完成，下一章從這裡開始。',
      },
      ja: {
        title: 'アメリカを離れて1年',
        description: 'ベイエリアを離れて12か月。Lv.33 クエスト達成、次の章はここから。',
      },
    },
  },
]

// Support both CJS require() (next.config.js) and ESM import (pages)
module.exports = timelineEvents
module.exports.default = timelineEvents
