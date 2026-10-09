'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, FINE, MOTION_OK, onSiteReady } from '@/lib/gsap'
import { cn } from '@/lib/utils'

/**
 * One batched observer for every `[data-reveal]` element on the page.
 * Content is visible by default (SSR / no-JS / reduced motion); JS hides only
 * what is still below the fold, then lifts it in.
 * `data-reveal="fade"` skips the vertical travel.
 */
export function RevealSystem() {
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(
      // `lg` here = the pinned horizontal product layout (see products.tsx WIDE).
      { motion: MOTION_OK, lg: '(min-width: 1024px) and (min-height: 700px)' },
      (ctx) => {
        const { motion, lg } = ctx.conditions as { motion: boolean; lg: boolean }
        if (!motion) return
        // Stacked (non-pinned) product panels reveal like everything else below lg.
        const els = gsap.utils.toArray<HTMLElement>(lg ? '[data-reveal]' : '[data-reveal], [data-reveal-mobile]')
        const vh = window.innerHeight
        const pending = els.filter((el) => el.getBoundingClientRect().top > vh * 0.92)
        const from = (el: HTMLElement) => ({
          opacity: 0,
          y: el.dataset.reveal === 'fade' ? 0 : 28,
        })
        pending.forEach((el) => gsap.set(el, from(el)))
        ScrollTrigger.batch(pending, {
          start: 'top 92%',
          once: true,
          interval: 0.08,
          batchMax: 6,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.07,
              overwrite: true,
              clearProps: 'transform',
            }),
        })
      },
    )
    return () => mm.revert()
  }, [])
  return null
}

/** Subtle pull toward the pointer. Pointer-fine devices only. */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia(`${FINE} and ${MOTION_OK}`).matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])

  return (
    <span ref={ref} className={cn('inline-flex will-change-transform', className)}>
      {children}
    </span>
  )
}

/**
 * Counts from 0 to `to` when scrolled into view (or when the intro finishes if
 * `onReady`). Renders the final value on the server so nothing is ever wrong.
 */
export function CountUp({
  to,
  pad = 0,
  suffix = '',
  onReady = false,
  className,
}: {
  to: number
  pad?: number
  suffix?: string
  onReady?: boolean
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const final = String(to).padStart(pad, '0') + suffix

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(MOTION_OK).matches) return
    const start = to >= 1000 ? to - 26 : 0
    const state = { n: start }
    const render = () => {
      el.textContent = String(Math.round(state.n)).padStart(pad, '0') + suffix
    }
    render()
    const run = () =>
      gsap.to(state, { n: to, duration: 1.6, ease: 'power3.out', onUpdate: render, onComplete: render })

    let st: ScrollTrigger | undefined
    let off = () => {}
    if (onReady) {
      off = onSiteReady(() => window.setTimeout(run, 500))
    } else {
      st = ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run })
    }
    return () => {
      off()
      st?.kill()
      el.textContent = final
    }
  }, [to, pad, suffix, onReady, final])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {final}
    </span>
  )
}

/** Thin yellow read-progress line pinned under the header. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        el.style.transform = `scaleX(${self.progress})`
      },
    })
    return () => st.kill()
  }, [])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px]">
      <div ref={ref} className="h-full origin-left bg-signal" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}
