import Mail from './mail.svg'
import Github from './github.svg'
import Youtube from './youtube.svg'
import Linkedin from './linkedin.svg'
import Instagram from './instagram.svg'
import SkyReal from './skyreal.svg'

const components = {
  mail: Mail,
  github: Github,
  youtube: Youtube,
  linkedin: Linkedin,
  instagram: Instagram,
  skyreal: SkyReal,
}

const SIZE_CLASS = {
  4: 'h-4 w-4',
  5: 'h-5 w-5',
  6: 'h-6 w-6',
  7: 'h-7 w-7',
  8: 'h-8 w-8',
}

const SocialIcon = ({ kind, href, size = 6 }) => {
  if (!href) return null
  const SocialSvg = components[kind]
  if (!SocialSvg) return null

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      aria-label={kind}
      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg className={`fill-current ${SIZE_CLASS[size] || 'h-6 w-6'}`} />
    </a>
  )
}

export default SocialIcon
