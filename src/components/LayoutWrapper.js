import { useRouter } from 'next/router'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'

const LayoutWrapper = ({ children }) => {
  const { pathname } = useRouter()

  return (
    <SectionContainer>
      <div className="flex flex-col justify-between min-h-screen">
        <header className="flex items-center justify-between py-8 border-b border-gray-100 dark:border-gray-800">
          <Link href="/" aria-label="Home">
            <span className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <span>🦙</span>
              <span>{siteMetadata.headerTitle}</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <nav className="hidden sm:flex items-center">
              {headerNavLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.title}
                  </Link>
                )
              })}
            </nav>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>

        <main className="flex-1 py-8">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
