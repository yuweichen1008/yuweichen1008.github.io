import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Image from 'next/image'
import { PageSeo } from '@/components/SEO'
import Link from '@/components/Link'

export default function About() {
  return (
    <>
      <PageSeo
        title={`About - ${siteMetadata.author}`}
        description={`About me - ${siteMetadata.author}`}
        url={`${siteMetadata.siteUrl}/about`}
      />
      <div className="divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center pt-8 space-x-2">
            <Image
              src={siteMetadata.image}
              alt="avatar"
              width="192px"
              height="192px"
              className="w-48 h-48 rounded-full"
            />
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">
              {siteMetadata.author}
            </h3>
            <div className="text-gray-500 dark:text-gray-400">Software Engineer</div>
            <div className="text-gray-500 dark:text-gray-400">Singapore</div>
            <div className="flex pt-6 space-x-3">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
              <SocialIcon kind="github" href={siteMetadata.github} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
            </div>
          </div>
          <div className="pt-8 pb-8 prose dark:prose-dark max-w-none xl:col-span-2">
            <p>
              Hey, I&apos;m Yuwei — 32, originally from Taiwan, currently based in Singapore after a
              few years in Silicon Valley.
            </p>
            <p>
              By day I work in tech. By night I&apos;m chasing Michelin stars at hawker centres,
              logging km on the pavement, and grinding through JLPT N2 kanji. I&apos;m flying back
              to Taiwan on July 4th and documenting every day until then.
            </p>
            <p>
              This site is my living journal — food, adventures, Japanese study, and
              whatever else I stumble into in this city.
            </p>
            <p>
              <Link href="/life" className="text-blue-500 hover:text-blue-600">
                Read the full story →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
