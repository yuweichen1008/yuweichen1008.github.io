import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

// Giscus — free GitHub Discussions-powered comments.
// Setup: https://giscus.app — connect your repo, get the repo/repoId/category/categoryId,
// then set them in src/.env.local (or GitHub Actions secrets) as:
//   NEXT_PUBLIC_GISCUS_REPO=yuweichen1008/yuweichen1008.github.io
//   NEXT_PUBLIC_GISCUS_REPO_ID=<from giscus.app>
//   NEXT_PUBLIC_GISCUS_CATEGORY=Journal
//   NEXT_PUBLIC_GISCUS_CATEGORY_ID=<from giscus.app>

export default function GiscusComments() {
  const ref = useRef(null)
  const { resolvedTheme } = useTheme()
  const giscusTheme = resolvedTheme === 'dark' ? 'dark' : 'light'

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  useEffect(() => {
    if (!ref.current || !repo || !repoId) return

    // Remove any existing giscus iframe before re-inserting (theme change)
    const existing = ref.current.querySelector('iframe.giscus-frame')
    if (existing) {
      // Send theme update message instead of reloading
      existing.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        'https://giscus.app'
      )
      return
    }

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', category || 'General')
    script.setAttribute('data-category-id', categoryId || '')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', giscusTheme)
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')
    script.crossOrigin = 'anonymous'
    script.async = true
    ref.current.appendChild(script)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giscusTheme, repo, repoId])

  if (!repo || !repoId) {
    return (
      <div className="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400">
        💬 Comments coming soon — set up Giscus to enable.{' '}
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Learn how →
        </a>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        💬 Comments
      </h3>
      <div ref={ref} />
    </div>
  )
}
