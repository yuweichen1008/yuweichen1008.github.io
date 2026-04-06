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
      <SocialSvg
        className={`fill-current h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon
