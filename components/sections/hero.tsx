'use client'

import { useRef } from 'react'
import { gsap, MOTION_OK, onSiteReady, useGSAP } from '@/lib/gsap'
import { hero } from '@/lib/content'
import { ParticleField } from '@/components/system/particle-field'
import { CountUp, Magnetic } from '@/components/system/motion'
import { scrollToTarget, useLenis } from '@/components/system/smooth-scroll'

const lines: { text: string; className?: string; drift: number }[] = [
  { text: 'Transforming', drift: -3 },
  { text: 'Businesses', className: 'pl-[2vw] sm:pl-[4vw]', drift: 4 },
  { text: 'Through', className: 'pl-[1vw]', drift: -2 },
  { text: 'Intelligent', className: 'text-outline pl-[3vw] sm:pl-[6vw] lg:pl-[8vw]', drift: 6 },
  { text: 'Technology', className: 'pl-[2vw]', drift: -4 },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const lenis = useLenis()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.set('[data-hero-meta]', { opacity: 0, y: 14 })
        gsap.set('[data-hero-rule]', { scaleX: 0, transformOrigin: 'left' })

        const intro = gsap.timeline({ paused: true })
        intro
          .to('[data-hero-line]', { y: 0, duration: 1.35, stagger: 0.075, ease: 'expo.out' })
          .to('[data-hero-rule]', { scaleX: 1, duration: 1.3, ease: 'expo.inOut' }, 0.35)
          .to('[data-hero-meta]', { opacity: 1, y: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out' }, 0.55)
        const off = onSiteReady(() => intro.play())

        const exit = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-hero-content]', { yPercent: -14, opacity: 0.1, ease: 'none', scrollTrigger: exit })
        // Lines peel apart horizontally as the hero leaves — type exiting the frame.
        gsap.utils.toArray<HTMLElement>('[data-hero-line]').forEach((line, i) => {
          gsap.to(line, { xPercent: lines[i].drift, ease: 'none', scrollTrigger: exit })
        })
        gsap.to('[data-outline-fill]', {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: '45% top', scrub: true },
        })
        gsap.to(progress, { current: 1, ease: 'none', scrollTrigger: exit })
        return off
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-hero-line]', { y: 0 })
      })
    },
    { scope: root },
  )

  const go = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault()
    scrollToTarget(lenis, hash)
  }

  return (
    <section
      ref={root}
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <ParticleField shape="sphere" progressRef={progress} centerX={0.7} assemble />

      <div data-hero-content className="relative flex flex-1 flex-col justify-end px-5 pb-6 pt-28 md:px-8 md:pb-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 md:mb-8">
          <div className="flex items-center gap-3" data-hero-meta>
            <span aria-hidden="true" className="h-2 w-2 bg-signal" />
            <p className="label text-muted-foreground">{hero.eyebrow}</p>
          </div>
          <dl data-hero-meta className="flex gap-7 md:gap-10">
            {hero.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1.5">
                <dt className="label text-muted-foreground">{s.label}</dt>
                <dd className="font-display text-2xl leading-none md:text-3xl">
                  <CountUp to={s.value} pad={s.pad} suffix={s.suffix} onReady />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <h1
          id="hero-title"
          className="font-display text-[clamp(2.5rem,5.8vw,5rem)] leading-[0.98] tracking-[-0.035em]"
        >
          {lines.map((line) => (
            <span key={line.text} className="block overflow-hidden pb-[0.04em]">
              <span data-hero-line className={`relative block will-change-transform ${line.className ?? ''}`}>
                {line.text}
                {line.text === 'Intelligent' && (
                  <span
                    aria-hidden="true"
                    data-outline-fill
                    className="absolute inset-0 pl-[6vw] text-foreground sm:pl-[14vw] [-webkit-text-fill-color:currentColor] [-webkit-text-stroke:0] lg:pl-[18vw] dark:text-signal"
                    style={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                  >
                    {line.text}
                  </span>
                )}
              </span>
            </span>
          ))}
        </h1>

        <div data-hero-rule className="mt-7 h-px w-full bg-line-strong md:mt-9" />

        <div className="mt-5 grid gap-6 md:grid-cols-12 md:items-end">
          <p data-hero-meta className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:col-span-5">
            {hero.body} <span className="font-medium text-foreground">{hero.kicker}</span>
          </p>
          <div data-hero-meta className="flex flex-wrap items-center gap-3 md:col-span-4 md:col-start-7">
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => go(e, '#contact')}
                data-cursor="Open"
                className="group relative inline-flex h-12 items-center gap-3 overflow-hidden bg-foreground px-6 label text-background"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-500 ease-signal group-hover:scale-y-100" />
                <span className="relative transition-colors duration-300 group-hover:text-signal-ink">{"Let's Talk"}</span>
                <span aria-hidden="true" className="relative transition-[color,transform] duration-500 ease-signal group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-ink">
                  ↗
                </span>
              </a>
            </Magnetic>
            <a
              href="#expertise"
              onClick={(e) => go(e, '#expertise')}
              data-cursor="Open"
              className="group inline-flex h-12 items-center gap-3 border border-line-strong px-6 label text-foreground transition-colors duration-300 hover:border-foreground"
            >
              Explore Services
              <span aria-hidden="true" className="transition-transform duration-500 ease-signal group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
          <div data-hero-meta className="hidden items-center justify-end gap-3 md:col-span-2 md:col-start-11 md:flex">
            <span className="label text-muted-foreground">Scroll</span>
            <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-line-strong">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-signal)_infinite] bg-foreground" />
            </span>
          </div>
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}
