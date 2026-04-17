const CATEGORY_CONFIG = {
  food:          { emoji: '🍜', label: 'Food',          dotColor: 'bg-orange-400', pillColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  exercise:      { emoji: '🏃', label: 'Exercise',      dotColor: 'bg-blue-400',   pillColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  friends:       { emoji: '👥', label: 'Friends',       dotColor: 'bg-pink-400',   pillColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' },
  learning:      { emoji: '📚', label: 'Learning',      dotColor: 'bg-purple-400', pillColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  work:          { emoji: '💼', label: 'Work',          dotColor: 'bg-yellow-400', pillColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  entertainment: { emoji: '🎬', label: 'Entertainment', dotColor: 'bg-red-400',    pillColor: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  adventure:     { emoji: '🗺️', label: 'Adventure',     dotColor: 'bg-green-400',  pillColor: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  picks:         { emoji: '🌟', label: 'Picks',          dotColor: 'bg-indigo-400', pillColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' },
}

const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', rough: '😔' }
const MOOD_LABEL = { great: 'Great', good: 'Good', okay: 'Okay', rough: 'Rough' }

module.exports = { CATEGORY_CONFIG, MOOD_EMOJI, MOOD_LABEL }
