'use client'

import { useRef } from 'react'
import { gsap, DESKTOP, MOTION_OK, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type Props = {
  index: string
  label: string
  id: string
  title: [string, string]
  intro?: string
  tone?: 'default' | 'surface'
  className?: string
}

/** Two-line display heading: first line solid, second outlined — the system's signature rhythm. */
export function SectionHead({ index, label, id, title, intro, tone = 'default', className }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean }
        if (!motion) return
        gsap.from('[data-head-line]', {
          yPercent: 105,
          duration: 1.2,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: 'top 85%' },
        })
        gsap.from('[data-head-label]', {
          opacity: 0,
          x: -12,
          duration: 0.9,
          scrollTrigger: { trigger: root.current, start: 'top 85%' },
        })
        if (desktop) {
          // Headings fade and lift away as they reach the top edge (transform/opacity only).
          gsap.to('[data-head-title]', {
            opacity: 0.25,
            yPercent: -8,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 12%', end: 'bottom -10%', scrub: true },
          })
        }
      })
    },
    { scope: root },
  )

  const muted = tone === 'surface' ? 'text-surface-muted' : 'text-muted-foreground'

  return (
    <div ref={root} className={cn('grid gap-6 md:grid-cols-12', className)}>
      <p data-head-label className={cn('label md:col-span-3 md:pt-3', muted)}>
        ({index}) — {label}
      </p>
      <div className="md:col-span-9">
        <h2 id={id} data-head-title className="font-display text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.08]">
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-head-line className="block">{title[0]}</span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-head-line className="block text-outline">{title[1]}</span>
          </span>
        </h2>
        {intro && (
          <p data-reveal className={cn('mt-8 max-w-xl text-pretty text-lg leading-relaxed md:mt-10 md:text-xl', muted)}>
            {intro}
          </p>
        )}
      </div>
    </div>
  )
}
