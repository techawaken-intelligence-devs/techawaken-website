'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { life } from '@/lib/content'
import { SectionHead } from './section-head'

export function Life() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-life-media]',
          { clipPath: 'inset(10% 18% 10% 18%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: '[data-life-media]', start: 'top 95%', end: 'center 55%', scrub: true },
          },
        )
        gsap.fromTo(
          '[data-life-img]',
          { scale: 1.22 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-life-media]', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.from('[data-pillar-rule]', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.2,
          ease: 'expo.inOut',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-pillars]', start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="life" aria-labelledby="life-title" className="relative px-5 py-24 md:px-8 md:py-32">
      <SectionHead index="09" label="Life at TechAwaken" id="life-title" title={['A Place Where', 'Talent Awakens']} intro={life.intro} />

      <div data-life-media data-cursor="View" className="relative mt-14 aspect-[4/5] overflow-hidden bg-muted sm:aspect-[16/9] md:mt-20">
        <div data-life-img className="absolute inset-0">
          <Image
            src="/images/life-studio.webp"
            alt="A product team talking through a system architecture diagram drawn on a whiteboard wall"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <ol data-pillars className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-5">
        {life.pillars.map((p, i) => (
          <li key={p.title} data-reveal>
            <span aria-hidden="true" data-pillar-rule className="block h-px bg-foreground" />
            <p className="mt-4 flex items-center gap-2 label text-muted-foreground">
              <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
              {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{p.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
