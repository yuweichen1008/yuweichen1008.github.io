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
            <div className="text-gray-500 dark:text-gray-400">Verification Engineer → AI Builder</div>
            <div className="text-gray-500 dark:text-gray-400">Singapore</div>
            <div className="flex pt-6 space-x-3">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
              <SocialIcon kind="github" href={siteMetadata.github} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
            </div>
          </div>
          <div className="pt-8 pb-8 prose dark:prose-dark max-w-none xl:col-span-2">
            <p>
              Hey, I&apos;m Yuwei (Yomi) — Taiwan-born, Silicon Valley-shaped, now working in
              Singapore, and turning 33 this October 8th.
            </p>
            <p>
              I spent seven years making sure chips work before they ship — ASIC/SoC verification
              from Hsinchu Science Park to the Bay Area. Now I bring that same rigour to AI: building
              systems that are fast, useful, and actually trustworthy.
            </p>
            <p>
              I speak English, Mandarin and Japanese (sat JLPT N2 in July 2026 and missed by 9 points,
              so the next attempt is personal). I run on hawker food and good coffee, and I&apos;m
              happiest when I&apos;m learning something hard with people I like.
            </p>
            <p>
              Right now I&apos;m on the <strong>Level 33 Quest</strong>: from September 17 to November
              11, one year after leaving the US, to build something great, get in the best shape of
              my life, and walk into 33 as the sharpest version of me yet. I&apos;m also open to
              opportunities worldwide, with conversations in Japan, the UK, the Netherlands and
              Canada. Want to build something together?{' '}
              <a href={siteMetadata.calendly} className="text-blue-500 hover:text-blue-600">
                Let&apos;s talk →
              </a>
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
