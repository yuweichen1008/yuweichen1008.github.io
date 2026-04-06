import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { useTranslation } from '@/lib/i18n'

const footerLinks = [
  { href: '/life', key: 'life' },
  { href: '/timeline', key: 'timeline' },
  { href: '/calendar', key: 'calendar' },
  { href: '/journal', key: 'journal' },
  { href: '/singapore', key: 'singapore' },
  { href: '/projects', key: 'projects' },
  { href: '/blog', key: 'blog' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-16 pt-10 pb-8">
      <div className="flex flex-col sm:flex-row justify-between gap-10">
        {/* Brand */}
        <div className="space-y-4 max-w-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <span>🦙</span>
            <span>{siteMetadata.headerTitle}</span>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {t('footer.tagline')}
          </p>
          <div className="flex items-center gap-3">
            <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
            <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
            <SocialIcon kind="instagram" href={siteMetadata.instagram} size={5} />
            <a
              href={siteMetadata.skyreal}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-75 transition-opacity"
            >
              SkyReal
            </a>
          </div>
        </div>

        {/* Nav */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            {t('footer.pages')}
          </div>
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
            {footerLinks.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-500">
        <span>{siteMetadata.author} · © {new Date().getFullYear()}</span>
        <span>{t('footer.built')}</span>
      </div>
    </footer>
  )
}
