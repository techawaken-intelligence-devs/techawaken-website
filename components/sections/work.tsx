'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap, FINE, MOTION_OK, useGSAP } from '@/lib/gsap'
import { work, workIntro, type WorkItem } from '@/lib/content'
import { SectionHead } from './section-head'

/** Drawn stand-in for projects without photography: a line chart or an API mesh. */
function Diagram({ kind }: { kind: NonNullable<WorkItem['diagram']> }) {
  const grid = Array.from({ length: 9 })
  return (
    <svg
      viewBox="-30 -36 460 552"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full text-surface-foreground"
      aria-hidden="true"
    >
      {grid.map((_, i) => (
        <line key={`h${i}`} x1="0" x2="400" y1={i * 60} y2={i * 60} stroke="currentColor" strokeOpacity="0.08" />
      ))}
      {grid.map((_, i) => (
        <line key={`v${i}`} y1="0" y2="480" x1={i * 50} x2={i * 50} stroke="currentColor" strokeOpacity="0.08" />
      ))}
      {kind === 'graph' ? (
        <>
          <polyline
            data-draw
            points="30,380 80,340 130,356 180,280 230,300 280,210 330,230 370,140"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.9"
            strokeWidth="1.5"
          />
          <polyline
            points="30,410 80,396 130,400 180,360 230,372 280,330 330,338 370,300"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          {[
            [180, 280],
            [280, 210],
            [370, 140],
          ].map(([x, y]) => (
            <rect key={x} data-node x={x - 4} y={y - 4} width="8" height="8" fill="var(--signal)" />
          ))}
          {[60, 110, 160, 210, 260, 310, 360].map((x, i) => (
            <rect
              key={x}
              data-bar
              x={x - 7}
              y={440 - (i % 3 === 0 ? 40 : 20 + i * 4)}
              width="14"
              height={i % 3 === 0 ? 40 : 20 + i * 4}
              fill="currentColor"
              fillOpacity="0.18"
            />
          ))}
          <text x="30" y="60" fill="currentColor" fillOpacity="0.5" fontFamily="var(--font-jetbrains)" fontSize="11" letterSpacing="1">
            REAL-TIME · PERFORMANCE
          </text>
        </>
      ) : (
        <>
          {[
            [80, 110],
            [320, 90],
            [60, 360],
            [340, 380],
            [200, 60],
            [200, 430],
          ].map(([x, y], i) => (
            <g key={i}>
              <line data-draw x1="200" y1="240" x2={x} y2={y} stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
              <rect data-node x={x - 5} y={y - 5} width="10" height="10" fill="none" stroke="currentColor" strokeOpacity="0.9" />
            </g>
          ))}
          <rect x="176" y="216" width="48" height="48" fill="var(--signal)" />
          <rect x="164" y="204" width="72" height="72" fill="none" stroke="var(--signal)" strokeOpacity="0.6" />
          <text x="30" y="60" fill="currentColor" fillOpacity="0.5" fontFamily="var(--font-jetbrains)" fontSize="11" letterSpacing="1">
            PAYMENTS · LOGISTICS · TOOLS
          </text>
        </>
      )}
    </svg>
  )
}

export function Work() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-work]').forEach((card) => {
          const media = card.querySelector('[data-work-media]')
          const img = card.querySelector('[data-work-img]')
          gsap.fromTo(
            media,
            { clipPath: 'inset(16% 10% 16% 10%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 40%', scrub: true },
            },
          )
          gsap.fromTo(
            img,
            { yPercent: -7, scale: 1.18 },
            {
              yPercent: 7,
              scale: 1.06,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
          const lines = card.querySelectorAll<SVGGeometryElement>('[data-draw]')
          if (lines.length) {
            lines.forEach((l) => {
              const len = l.getTotalLength()
              gsap.set(l, { strokeDasharray: len, strokeDashoffset: len })
            })
            const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 70%' } })
            tl.to(lines, { strokeDashoffset: 0, duration: 1.6, ease: 'expo.inOut', stagger: 0.08 })
              .from(card.querySelectorAll('[data-node]'), { scale: 0, transformOrigin: 'center', duration: 0.6, stagger: 0.05 }, '-=0.8')
            const bars = card.querySelectorAll('[data-bar]')
            if (bars.length) tl.from(bars, { scaleY: 0, transformOrigin: 'bottom', duration: 0.8, stagger: 0.04 }, '<')
          }
        })
      })
      // Cursor parallax inside each visual — pointer devices only.
      mm.add(`${MOTION_OK} and ${FINE}`, () => {
        const cleanups: (() => void)[] = []
        gsap.utils.toArray<HTMLElement>('[data-work]').forEach((card) => {
          const inner = card.querySelector<HTMLElement>('[data-work-inner]')
          const media = card.querySelector<HTMLElement>('[data-work-media]')
          if (!inner || !media) return
          const xTo = gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'power3.out' })
          const yTo = gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'power3.out' })
          const move = (e: PointerEvent) => {
            const r = media.getBoundingClientRect()
            xTo(((e.clientX - r.left) / r.width - 0.5) * -22)
            yTo(((e.clientY - r.top) / r.height - 0.5) * -22)
          }
          const leave = () => {
            xTo(0)
            yTo(0)
          }
          media.addEventListener('pointermove', move)
          media.addEventListener('pointerleave', leave)
          cleanups.push(() => {
            media.removeEventListener('pointermove', move)
            media.removeEventListener('pointerleave', leave)
          })
        })
        return () => cleanups.forEach((c) => c())
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative px-5 py-24 md:px-8 md:py-32">
      <SectionHead index="04" label="Our Work" id="work-title" title={['Projects That', 'Drive Real Results']} intro={workIntro.body} />

      <ul className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-12 md:gap-y-24">
        {work.map((w, i) => (
          <li
            key={w.title}
            data-work
            className={i % 2 === 0 ? 'md:col-span-7' : 'md:col-span-5 md:col-start-8 md:mt-40'}
          >
            <article className="group block" aria-labelledby={`work-${i}`}>
              <div data-work-media data-cursor="View" className="relative aspect-[4/5] overflow-hidden bg-surface md:aspect-[5/6]">
                <div data-work-img className="absolute -inset-4">
                  <div data-work-inner className="absolute inset-0">
                    {w.image ? (
                      <Image
                        src={w.image}
                        alt={w.alt ?? ''}
                        fill
                        sizes="(min-width: 768px) 55vw, 100vw"
                        className="object-cover grayscale transition-[filter] duration-700 ease-signal group-hover:grayscale-0"
                      />
                    ) : (
                      <Diagram kind={w.diagram ?? 'graph'} />
                    )}
                  </div>
                </div>
                <span className="absolute left-4 top-4 bg-background px-2 py-1.5 label text-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-signal transition-transform duration-700 ease-signal group-hover:scale-x-100"
                />
              </div>
              <div className="mt-5 border-t border-line pt-4 transition-transform duration-500 ease-signal group-hover:translate-x-1">
                <p className="label text-muted-foreground">{w.category}</p>
                <h3 id={`work-${i}`} className="mt-3 text-[1.75rem] font-semibold leading-[1.1] tracking-tight md:text-[2.4rem]">
                  <span className="bg-[linear-gradient(var(--signal),var(--signal))] bg-[length:0%_0.35em] bg-[position:0_90%] bg-no-repeat transition-[background-size] duration-700 ease-signal group-hover:bg-[length:100%_0.35em] dark:bg-none dark:transition-colors dark:group-hover:text-signal">
                    {w.title}
                  </span>
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
