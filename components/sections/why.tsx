'use client'

import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { why } from '@/lib/content'
import { SectionHead } from './section-head'

export function Why() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-reason-rule]', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.2,
          ease: 'expo.inOut',
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-reasons]', start: 'top 80%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="why" aria-labelledby="why-title" className="relative border-t border-line px-5 py-24 md:px-8 md:py-32">
      <SectionHead index="06" label="Why TechAwaken" id="why-title" title={['Why Leading Businesses', 'Choose Us']} intro={why.intro} />

      <ol data-reasons className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
        {why.reasons.map((r, i) => (
          <li key={r.title} data-reveal className="group">
            <div className="relative h-px bg-line">
              <div data-reason-rule className="absolute inset-0 bg-foreground" />
              <div className="absolute inset-y-0 left-0 w-0 bg-signal transition-[width] duration-700 ease-signal group-hover:w-full" />
            </div>
            <p className="mt-4 label text-muted-foreground">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight transition-transform duration-500 ease-signal group-hover:translate-x-1">
              {r.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{r.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
