'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
  gsap.defaults({ ease: 'expo.out', duration: 0.9 })
  // Several tweens target optional parts (diagram bars, per-card extras).
  gsap.config({ nullTargetWarn: false })
  // iOS Safari resizes the viewport as the URL bar collapses; refreshing on that
  // makes pinned sections jump. Only refresh on real width/orientation changes.
  ScrollTrigger.config({ ignoreMobileResize: true })
}

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 1024px)'
export const FINE = '(hover: hover) and (pointer: fine)'

/** Fires once the preloader has lifted (or immediately when there is none). */
export const READY_EVENT = 'ta:ready'

export function onSiteReady(cb: () => void) {
  if (typeof document === 'undefined') return () => {}
  if (document.documentElement.dataset.intro === 'done') {
    cb()
    return () => {}
  }
  window.addEventListener(READY_EVENT, cb, { once: true })
  return () => window.removeEventListener(READY_EVENT, cb)
}

export { gsap, ScrollTrigger, useGSAP }
