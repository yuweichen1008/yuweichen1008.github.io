import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

const footerLinks = [
  { href: '/life', label: 'Life' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/journal', label: 'Journal' },
  { href: '/singapore', label: 'Singapore' },
  { href: '/fitness', label: 'Fitness' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between gap-8">
        {/* Brand + socials */}
        <div className="space-y-3">
          <Link href="/" className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            yuwei.life
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            32. Documenting life in Singapore before flying home to Taiwan on Jul 4.
          </p>
          <div className="flex items-center gap-3">
            <SocialIcon kind="github" href={siteMetadata.github} size="5" />
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="5" />
            <SocialIcon kind="youtube" href={siteMetadata.youtube} size="5" />
            <SocialIcon kind="instagram" href={siteMetadata.instagram} size="5" />
            <a
              href={siteMetadata.skyreal}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-400 transition-colors"
            >
              SkyReal 🚀
            </a>
          </div>
        </div>

        {/* Nav links */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
            Pages
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
            {footerLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-500">
        <span>{siteMetadata.author} · © {new Date().getFullYear()}</span>
        <span>Built with Next.js + Tailwind · Hosted on GitHub Pages</span>
      </div>
    </footer>
  )
}
