// const withPlugins = require('next-compose-plugins');
// const withOptimizedImages = require('next-optimized-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = {
  basePath: '/yuweichen1008',
  assetPrefix: '/yuweichen1008',
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
            publicPath: '/yuweichen1008/_next',
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
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/blog': { page: '/blog' },
      '/projects': { page: '/projects' },
      '/tags': { page: '/tags'},
      '/404': { page: '/404'},
      // '//hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      // '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      // '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  },
}