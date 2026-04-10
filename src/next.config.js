// const withPlugins = require('next-compose-plugins');
// const withOptimizedImages = require('next-optimized-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['pages', 'components', 'lib', 'layouts', 'scripts'],
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: process.env.NEXT_PUBLIC_BASE_PATH + '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    if (!dev && !isServer) {
      // Replace React with Preact only in client production build
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }

    return config
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite to prevent a problem when deploying at vercel
        // which directs a user to the index.xml instead of index.html
        // https://github.com/timlrx/tailwind-nextjs-starter-blog/issues/16
        {
          source: '/',
          destination: '/index',
        },
      ],
    }
  },
  images: {
    loader: 'imgix',
    domains: ['https://yuweichen1008.github.io'],
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // Enumerate journal slugs from Notion and local markdown
    let journalPaths = {}
    try {
      const { getJournalEntries } = require('./lib/notion')
      const entries = await getJournalEntries()
      entries.forEach((entry) => {
        if (entry.slug) {
          journalPaths[`/journal/${entry.slug}`] = {
            page: '/journal/[slug]',
            query: { slug: entry.slug },
          }
        }
      })
    } catch (e) {
      console.warn('[exportPathMap] Could not fetch Notion journal entries:', e.message)
    }
    try {
      const { getLocalJournalEntries } = require('./lib/localJournal')
      const localEntries = getLocalJournalEntries()
      localEntries.forEach((entry) => {
        if (entry.slug && !journalPaths[`/journal/${entry.slug}`]) {
          journalPaths[`/journal/${entry.slug}`] = {
            page: '/journal/[slug]',
            query: { slug: entry.slug },
          }
        }
      })
    } catch (e) {
      console.warn('[exportPathMap] Could not read local journal entries:', e.message)
    }

    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/blog': { page: '/blog' },
      '/projects': { page: '/projects' },
      '/tags': { page: '/tags' },
      '/404': { page: '/404' },
      // New pages
      '/life': { page: '/life' },
      '/calendar': { page: '/calendar' },
      '/journal': { page: '/journal' },
      '/timeline': { page: '/timeline' },
      '/singapore': { page: '/singapore' },
      '/singapore/food': { page: '/singapore/food' },
      '/singapore/adventures': { page: '/singapore/adventures' },
      '/debug': { page: '/debug' },
      // Dynamic journal entry routes
      ...journalPaths,
    }
  },
}
