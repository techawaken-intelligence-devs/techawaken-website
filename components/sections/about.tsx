'use client'

import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { about } from '@/lib/content'
import { CountUp } from '@/components/system/motion'
import { SectionHead } from './section-head'

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-mv-rule]', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.4,
          ease: 'expo.inOut',
          stagger: 0.15,
          scrollTrigger: { trigger: '[data-mv]', start: 'top 80%' },
        })
        gsap.from('[data-mv-line]', {
          yPercent: 100,
          duration: 1.2,
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-mv]', start: 'top 80%' },
        })
        gsap.from('[data-fact-rule]', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.2,
          ease: 'expo.inOut',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-facts]', start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  const [lead, ...rest] = about.paragraphs

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="relative px-5 py-24 md:px-8 md:py-32">
      <SectionHead index="05" label="Who We Are" id="about-title" title={about.title} />

      <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12">
        <p data-reveal className="text-pretty text-2xl font-medium leading-snug tracking-tight md:col-span-8 md:col-start-4 md:text-[2rem]">
          {lead}
        </p>
        {rest.map((p, i) => (
          <p
            key={i}
            data-reveal
            className={`text-pretty text-lg leading-relaxed text-muted-foreground md:col-span-4 ${i === 0 ? 'md:col-start-4' : ''}`}
          >
            {p}
          </p>
        ))}
      </div>

      <div data-mv className="mt-20 grid gap-12 md:mt-28 md:grid-cols-2 md:gap-8">
        {[
          { label: 'Mission', body: about.mission },
          { label: 'Vision', body: about.vision },
        ].map((b) => (
          <div key={b.label}>
            <div className="relative h-px bg-line">
              <span data-mv-rule className="absolute inset-y-0 left-0 w-1/3 bg-signal" />
            </div>
            <p className="mt-5 label text-muted-foreground">{b.label}</p>
            <p className="mt-5 overflow-hidden text-balance text-[clamp(1.25rem,2.2vw,1.85rem)] font-medium leading-[1.25] tracking-[-0.02em]">
              <span data-mv-line className="block">{b.body}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-10 sm:grid-cols-2 md:mt-20 md:grid-cols-12">
        {about.values.map((v, i) => (
          <div key={v.title} data-reveal className={i === 0 ? 'md:col-span-4 md:col-start-1' : 'md:col-span-4 md:col-start-7'}>
            <p className="flex items-center gap-3 text-xl font-semibold tracking-tight">
              <span aria-hidden="true" className="h-2 w-2 bg-signal" />
              {v.title}
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>

      <dl data-facts className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-28 lg:grid-cols-5">
        {about.facts.map((f) => (
          <div key={f.label} className="flex flex-col">
            <span aria-hidden="true" data-fact-rule className="h-px w-full bg-foreground" />
            <dd className="order-2 mt-5 font-display text-[clamp(2rem,3.4vw,2.75rem)] leading-none">
              {f.count ? <CountUp to={f.count} pad={1} suffix={f.value.endsWith('+') ? '+' : ''} /> : f.value}
            </dd>
            <dt className="order-3 mt-3 max-w-[16rem] text-sm leading-snug text-muted-foreground">{f.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
