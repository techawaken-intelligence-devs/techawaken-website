'use client'

import { useRef } from 'react'
import { gsap, DESKTOP, MOTION_OK, useGSAP } from '@/lib/gsap'
import { products, statement } from '@/lib/content'

const words = statement.lead.split(' ')
const highlighted = new Set(['Business', 'Software'])

export function Statement() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean }
        if (!motion) return
        gsap.fromTo(
          '[data-word]',
          { opacity: 0.1, yPercent: 12 },
          {
            opacity: 1,
            yPercent: 0,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: { trigger: '[data-statement]', start: 'top 85%', end: 'bottom 55%', scrub: 0.6 },
          },
        )
        gsap.from('[data-domain]', {
          opacity: 0,
          x: -16,
          stagger: 0.06,
          duration: 0.8,
          scrollTrigger: { trigger: '[data-domains]', start: 'top 90%' },
        })
        // The band travels against the scroll direction, row two travels with it.
        gsap.fromTo(
          '[data-band="a"]',
          { xPercent: 0 },
          { xPercent: -22, ease: 'none', scrollTrigger: { trigger: '[data-bands]', start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        gsap.fromTo(
          '[data-band="b"]',
          { xPercent: -22 },
          { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '[data-bands]', start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    },
    { scope: root },
  )

  const band = Array.from({ length: 6 })

  return (
    <section ref={root} aria-labelledby="statement-title" className="relative overflow-hidden pt-24 md:pt-36">
      <div className="grid gap-8 px-5 md:grid-cols-12 md:px-8">
        <p className="label text-muted-foreground md:col-span-3 md:pt-4">(01) — What we do</p>
        <div className="md:col-span-9">
          <h2
            id="statement-title"
            data-statement
            className="text-balance text-[clamp(1.85rem,3.6vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.03em]"
          >
            {words.map((w, i) => (
              <span key={i} data-word className={`inline-block ${highlighted.has(w) ? 'mark' : ''}`}>
                {w}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
          <ul data-domains className="mt-10 flex flex-wrap gap-x-7 gap-y-3 md:mt-14">
            {statement.domains.map((d) => (
              <li key={d} data-domain className="flex items-center gap-2.5 label text-foreground">
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-9">
            <ul data-reveal className="flex flex-wrap content-start gap-2 md:col-span-4">
              {statement.tags.map((t) => (
                <li
                  key={t}
                  className="border border-line-strong px-3 py-2 label text-foreground transition-colors duration-300 hover:border-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
            <ul data-reveal className="md:col-span-5">
              {products.map((p) => (
                <li key={p.id} className="border-t border-line last:border-b">
                  <a
                    href="#products"
                    data-cursor="Open"
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-display text-3xl transition-transform duration-500 ease-signal group-hover:translate-x-1 md:text-4xl">
                        {p.name}
                      </span>
                      <span className="label text-muted-foreground">{p.sector}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center border border-line-strong transition-[background-color,border-color,transform] duration-500 ease-signal group-hover:translate-x-1 group-hover:border-signal group-hover:bg-signal group-hover:text-signal-ink"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div data-bands aria-hidden="true" className="mt-20 select-none md:mt-32">
        {(['a', 'b'] as const).map((row) => (
          <div key={row} className="flex overflow-hidden border-t border-line py-2 last:border-b md:py-3">
            <div data-band={row} className="flex w-max shrink-0 will-change-transform">
              {band.map((_, i) => (
                <span
                  key={i}
                  className={`flex items-center gap-[2.5vw] pr-[2.5vw] font-display text-[clamp(1.75rem,3.8vw,3.25rem)] ${
                    (i + (row === 'b' ? 1 : 0)) % 2 ? 'text-outline' : ''
                  }`}
                >
                  {row === 'a' ? 'Our Expertise' : 'Full Spectrum'}
                  <span className="h-[0.12em] w-[0.12em] bg-signal" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
