'use client'

import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, DESKTOP, MOTION_OK, useGSAP } from '@/lib/gsap'
import { expertise, services } from '@/lib/content'
import { SectionHead } from './section-head'

export function Expertise() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-service]')
      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        items.forEach((item) => {
          gsap.from(item.querySelector('[data-service-title]'), {
            yPercent: 70,
            opacity: 0,
            duration: 1,
            scrollTrigger: { trigger: item, start: 'top 92%' },
          })
        })
        gsap.from('[data-service-rule]', {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.2,
          ease: 'expo.inOut',
          stagger: 0.04,
          scrollTrigger: { trigger: '[data-services]', start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  const current = services[active]
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section ref={root} id="expertise" aria-labelledby="expertise-title" className="relative px-5 py-24 md:px-8 md:py-32">
      <SectionHead
        index="02"
        label="Our Expertise"
        id="expertise-title"
        title={['Full-Spectrum', 'Technology Services']}
        intro={expertise.intro}
      />

      <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12">
        <ol data-services className="lg:col-span-7">
          {services.map((s, i) => (
            <li key={s.title} data-service className="relative" onPointerEnter={() => setActive(i)}>
              <span aria-hidden="true" data-service-rule className="absolute inset-x-0 top-0 h-px bg-line" />
              <div className="py-4 md:py-5">
                <div className="flex items-baseline gap-4 md:gap-5">
                  <span
                    className={`label w-7 shrink-0 transition-colors duration-300 ${
                      active === i ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                  <h3 className="overflow-hidden">
                    <span
                      data-service-title
                      className={`block font-display text-[clamp(1.5rem,3.2vw,2.5rem)] transition-[color,transform] duration-500 ease-signal ${
                        active === i ? 'text-foreground lg:translate-x-3' : 'lg:text-outline lg:text-muted-foreground'
                      }`}
                    >
                      {s.title}
                    </span>
                  </h3>
                  <span
                    aria-hidden="true"
                    className={`ml-auto hidden h-2.5 w-2.5 shrink-0 bg-signal transition-transform duration-500 ease-signal lg:block ${
                      active === i ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </div>
                <p className="mt-2 max-w-lg pl-11 leading-relaxed text-muted-foreground lg:hidden">
                  {s.full && <span className="mb-1 block font-medium text-foreground">{s.full}</span>}
                  {s.body}
                </p>
              </div>
            </li>
          ))}
          <li aria-hidden="true" className="h-px bg-line" />
        </ol>

        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-28" aria-live="polite">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <span className="label text-muted-foreground">Capability</span>
              <span className="label tabular-nums text-foreground">
                {pad(active + 1)} / {pad(services.length)}
              </span>
            </div>

            <div className="relative mt-6 h-[5.5rem] overflow-hidden">
              <p
                key={`n-${active}`}
                aria-hidden="true"
                className="absolute inset-0 font-display text-[5.5rem] leading-[1] tabular-nums animate-in fade-in slide-in-from-bottom-8 duration-700 ease-signal"
              >
                <span className="text-outline">{pad(active + 1)[0]}</span>
                {pad(active + 1)[1]}
              </p>
            </div>

            <div key={active} className="min-h-[11rem] animate-in fade-in slide-in-from-bottom-3 duration-700 ease-signal">
              <p className="mt-6 text-2xl font-semibold tracking-tight">{current.full ?? current.title}</p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{current.body}</p>
            </div>

            {/* Capability matrix: where this service sits in the full catalogue. */}
            <div aria-hidden="true" className="relative mt-8">
              <div className="grid grid-cols-7 gap-px border border-line bg-line">
                {services.map((_, i) => (
                  <span
                    key={i}
                    className={`relative flex h-9 items-end p-1 font-mono text-[9px] leading-none transition-colors duration-500 ${
                      i === active ? 'bg-signal text-signal-ink' : i < active ? 'bg-muted text-muted-foreground' : 'bg-background text-muted-foreground'
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                ))}
              </div>
              <span
                className="pointer-events-none absolute -bottom-3 -top-3 w-px bg-foreground/40 transition-[left] duration-700 ease-signal"
                style={{ left: `calc(${((active % 7) + 0.5) / 7} * 100%)` }}
              />
              <span
                className="pointer-events-none absolute -left-3 -right-3 h-px bg-foreground/40 transition-[top] duration-700 ease-signal"
                style={{ top: `calc(${(Math.floor(active / 7) + 0.5) / 2} * 100%)` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
