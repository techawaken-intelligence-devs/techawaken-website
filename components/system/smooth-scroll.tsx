'use client'

import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

/** Shared handle so non-React code (marquees, preloader) can read velocity / lock scroll. */
export let lenisInstance: Lenis | null = null

export function scrollToTarget(lenis: Lenis | null, hash: string) {
  const el = hash === '#hero' || hash === '#top' ? document.body : document.querySelector<HTMLElement>(hash)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, {
      offset: 0,
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  if (hash !== '#top') history.replaceState(null, '', hash)
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    document.documentElement.dataset.ready = 'true'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    // Wheel/trackpad is smoothed; touch stays fully native (syncTouch off) so
    // iOS Safari and Android keep their own momentum and rubber-banding.
    const instance = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      autoRaf: false,
    })

    instance.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    lenisInstance = instance
    setLenis(instance)

    // Same-page anchor links anywhere (footer, inline copy) use the eased scroll.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')!
      if (hash.length < 2) return
      e.preventDefault()
      scrollToTarget(instance, hash)
    }
    document.addEventListener('click', onClick)

    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    window.addEventListener('ta:ready', refresh)

    // Deep link (#work etc.) — jump once layout has settled.
    if (location.hash.length > 1) {
      const target = location.hash
      window.setTimeout(() => {
        const el = document.querySelector<HTMLElement>(target)
        if (el) instance.scrollTo(el, { immediate: true })
      }, 60)
    }

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('load', refresh)
      window.removeEventListener('ta:ready', refresh)
      gsap.ticker.remove(raf)
      instance.destroy()
      lenisInstance = null
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
