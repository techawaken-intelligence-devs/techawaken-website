'use client'

import { useEffect, useRef } from 'react'
import { gsap, READY_EVENT } from '@/lib/gsap'
import { lenisInstance } from './smooth-scroll'

const WORD = 'TechAwaken'

function markReady() {
  const d = document.documentElement
  if (d.dataset.intro === 'done') return
  d.dataset.intro = 'done'
  performance.mark?.('ta:ready')
  window.dispatchEvent(new Event(READY_EVENT))
}

/**
 * Short count-up curtain (≈1.1s to hand-off) shown once per session. Hidden by CSS unless the
 * head script flagged `html.motion`, so no-JS / reduced-motion visitors never see it.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    const d = document.documentElement
    const skip =
      !el ||
      !d.classList.contains('motion') ||
      d.classList.contains('intro-skip') ||
      getComputedStyle(el).display === 'none'
    if (skip) {
      markReady()
      return
    }

    try {
      sessionStorage.setItem('ta-intro', '1')
    } catch {}
    window.scrollTo(0, 0)
    const lock = requestAnimationFrame(() => lenisInstance?.stop())

    const state = { n: 0 }
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        el.style.display = 'none'
      },
    })
    tl.from('[data-pl-char]', { yPercent: 110, duration: 0.7, stagger: 0.025 }, 0)
      .to(
        state,
        {
          n: 100,
          duration: 0.75,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(state.n)).padStart(3, '0')
          },
        },
        0.05,
      )
      .fromTo('[data-pl-bar]', { scaleX: 0 }, { scaleX: 1, duration: 0.75, ease: 'power2.inOut' }, 0.05)
      .to('[data-pl-char]', { yPercent: -110, duration: 0.45, ease: 'expo.in', stagger: 0.015 }, 0.8)
      .to('[data-pl-meta]', { opacity: 0, duration: 0.25, ease: 'none' }, 0.8)
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' }, 0.95)
      .add(() => {
        lenisInstance?.start()
        markReady()
      }, 1.1)

    // Never trap the page if something stalls.
    const safety = window.setTimeout(() => {
      lenisInstance?.start()
      markReady()
      el.style.display = 'none'
    }, 4000)

    return () => {
      cancelAnimationFrame(lock)
      window.clearTimeout(safety)
      tl.kill()
      lenisInstance?.start()
      markReady()
    }
  }, [])

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[90] flex flex-col justify-between bg-surface px-5 py-5 text-surface-foreground md:px-8 md:py-6"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div data-pl-meta className="flex items-center justify-between label text-surface-muted">
        <span>Intelligence Pvt. Ltd.</span>
        <span>Rajkot · Worldwide</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <p className="overflow-hidden font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95]">
          {WORD.split('').map((c, i) => (
            <span key={i} data-pl-char className={`inline-block ${i >= 4 ? 'text-signal' : ''}`}>
              {c}
            </span>
          ))}
        </p>
        <p data-pl-meta className="pb-2 font-mono text-sm tabular-nums text-surface-muted md:text-base">
          <span ref={count}>000</span>%
        </p>
      </div>

      <div data-pl-meta className="h-px w-full bg-surface-line">
        <div data-pl-bar className="h-full origin-left bg-signal" style={{ transform: 'scaleX(0)' }} />
      </div>
    </div>
  )
}
