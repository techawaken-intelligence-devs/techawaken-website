'use client'

import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, MOTION_OK, useGSAP } from '@/lib/gsap'
import { process, processIntro } from '@/lib/content'
import { SectionHead } from './section-head'

export function Process() {
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-step]').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => self.isActive && setStep(i),
        })
      })
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-process-line]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-steps]', start: 'top 60%', end: 'bottom 60%', scrub: true },
          },
        )
        gsap.utils.toArray<HTMLElement>('[data-step-title]').forEach((el) => {
          gsap.from(el, { yPercent: 100, duration: 1, scrollTrigger: { trigger: el, start: 'top 92%' } })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="process" aria-labelledby="process-title" className="relative px-5 py-24 md:px-8 md:py-32">
      <SectionHead
        index="08"
        label="Development Process"
        id="process-title"
        title={['How We Build Great', 'Products Together']}
        intro={processIntro.body}
      />

      <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
        <div className="hidden md:col-span-4 md:block">
          <div className="sticky top-28">
            <p aria-hidden="true" className="relative h-[clamp(4.5rem,8vw,7rem)] overflow-hidden font-display text-[clamp(4.5rem,8vw,7rem)] leading-[1] tabular-nums">
              <span className="text-outline">0</span>
              <span key={step} className="inline-block animate-in fade-in slide-in-from-bottom-16 duration-700 ease-signal">
                {step + 1}
              </span>
            </p>
            <p className="mt-2 label text-muted-foreground">
              Step {step + 1} of {process.length} — <span className="text-foreground">{process[step]}</span>
            </p>
          </div>
        </div>

        <ol data-steps className="relative md:col-span-7 md:col-start-6">
          <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px bg-line" />
          <span aria-hidden="true" data-process-line className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-foreground" />
          {process.map((p, i) => (
            <li key={p} data-step className="relative pb-10 pl-10 last:pb-0 md:pb-14">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-2 h-[11px] w-[11px] border transition-colors duration-500 ${
                  i <= step ? 'border-foreground bg-signal' : 'border-line-strong bg-background'
                }`}
              />
              <p className="label text-muted-foreground">Step {String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-3 overflow-hidden">
                <span
                  data-step-title
                  className={`block font-display text-[clamp(1.75rem,3.4vw,2.75rem)] transition-colors duration-500 ${
                    i === step ? 'text-foreground' : 'md:text-outline md:text-muted-foreground'
                  }`}
                >
                  {p}
                </span>
              </h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
