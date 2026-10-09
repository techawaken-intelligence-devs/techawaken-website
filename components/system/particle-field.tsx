'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { onSiteReady } from '@/lib/gsap'

type Shape = 'sphere' | 'plane'

type Props = {
  shape: Shape
  /** 0 → 1, written by a ScrollTrigger. Disperses and fades the field. */
  progressRef?: React.RefObject<number>
  /** Points start scattered and gather into the shape once the intro finishes. */
  assemble?: boolean
  /** Horizontal center as a fraction of width on large screens. */
  centerX?: number
  className?: string
}

export function ParticleField({ shape, progressRef, assemble = false, centerX = 0.5, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const count = shape === 'sphere' ? (coarse ? 650 : 1400) : coarse ? 900 : 2100
    const base = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const signal = new Uint8Array(count)
    const scatter = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      scatter[i * 3] = (Math.random() - 0.5) * 5.2
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 3.2
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 2.4
    }
    // 0 = scattered field, 1 = formed shape
    let formed = assemble && !reduce ? 0 : 1
    let formStart = -1
    const offReady = assemble && !reduce ? onSiteReady(() => (formStart = performance.now())) : () => {}

    if (shape === 'sphere') {
      const golden = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2
        const r = Math.sqrt(1 - y * y)
        const t = i * golden
        base[i * 3] = Math.cos(t) * r
        base[i * 3 + 1] = y
        base[i * 3 + 2] = Math.sin(t) * r
      }
    } else {
      const cols = Math.round(Math.sqrt(count * 2.4))
      const rows = Math.ceil(count / cols)
      for (let i = 0; i < count; i++) {
        const c = i % cols
        const r = Math.floor(i / cols)
        base[i * 3] = (c / (cols - 1)) * 3.6 - 1.8
        base[i * 3 + 1] = 0
        base[i * 3 + 2] = (r / (rows - 1)) * 2 - 1
      }
    }
    for (let i = 0; i < count; i++) {
      seed[i] = Math.random()
      signal[i] = Math.random() < 0.06 ? 1 : 0
    }

    let width = 0
    let height = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let ink = '#0b0b0a'
    let sig = '#ffd21f'
    const readColors = () => {
      const cs = getComputedStyle(canvas)
      ink = cs.getPropertyValue('--foreground').trim() || ink
      sig = cs.getPropertyValue('--signal').trim() || sig
    }
    readColors()
    const mo = new MutationObserver(readColors)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let mx = -9999
    let my = -9999
    let tiltX = 0
    let tiltY = 0
    let targetTiltX = 0
    let targetTiltY = 0
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
      targetTiltY = (mx / width - 0.5) * 0.6
      targetTiltX = (my / height - 0.5) * 0.4
    }
    const onLeave = () => {
      mx = -9999
      my = -9999
      targetTiltX = 0
      targetTiltY = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(frame)
    })
    io.observe(canvas)

    let raf = 0
    let rot = 0
    const start = performance.now()

    const draw = (time: number) => {
      const t = time - start
      const p = Math.min(Math.max(progressRef?.current ?? 0, 0), 1)
      ctx.clearRect(0, 0, width, height)
      if (p >= 0.999) return

      tiltX += (targetTiltX - tiltX) * 0.05
      tiltY += (targetTiltY - tiltY) * 0.05

      const isLarge = width >= 1024
      const cx = width * (isLarge ? centerX : 0.5)
      const cy = height * (shape === 'sphere' ? (isLarge ? 0.5 : 0.42) : 0.6)
      const scale =
        shape === 'sphere'
          ? Math.min(width * (isLarge ? 0.27 : 0.42), height * 0.36)
          : Math.max(width * 0.42, 320)

      const rx = (shape === 'sphere' ? 0.3 : 1.12) + tiltX
      const ry = rot + tiltY
      const cosX = Math.cos(rx)
      const sinX = Math.sin(rx)
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      const radius = 110
      const r2 = radius * radius
      const fade = 1 - p
      if (formed < 1 && formStart >= 0) {
        const k = Math.min((time - formStart) / 2400, 1)
        formed = 1 - Math.pow(1 - k, 4)
      }
      const unformed = 1 - formed

      for (let i = 0; i < count; i++) {
        let x = base[i * 3]
        let y = base[i * 3 + 1]
        let z = base[i * 3 + 2]
        const s = seed[i]

        if (shape === 'sphere') {
          const breathe = 1 + Math.sin(t * 0.0011 + s * 6.283) * 0.018
          const burst = 1 + p * (0.6 + s * 2.6)
          const k = breathe * burst
          x *= k
          y *= k
          z *= k
          y += p * (s - 0.5) * 1.2
        } else {
          y = Math.sin(x * 2.4 + t * 0.0011) * 0.12 + Math.cos(z * 3.1 + t * 0.0008) * 0.09
        }

        if (unformed > 0) {
          const drift = Math.sin(t * 0.0006 + s * 20) * 0.04
          x = x * formed + (scatter[i * 3] + drift) * unformed
          y = y * formed + (scatter[i * 3 + 1] - drift) * unformed
          z = z * formed + scatter[i * 3 + 2] * unformed
        }

        const x1 = x * cosY - z * sinY
        const z1 = x * sinY + z * cosY
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX

        const persp = 3 / Math.max(3 + z2, 0.8)
        let sx = cx + x1 * scale * persp
        let sy = cy + y2 * scale * persp

        const dx = sx - mx
        const dy = sy - my
        const d2 = dx * dx + dy * dy
        if (d2 < r2) {
          const d = Math.sqrt(d2) || 1
          const f = (1 - d / radius) * 26
          sx += (dx / d) * f
          sy += (dy / d) * f
        }

        if (sx < -4 || sx > width + 4 || sy < -4 || sy > height + 4) continue

        const depth = shape === 'sphere' ? 1 - (z2 + 1.4) / 2.8 : 1 - (z2 + 1) / 2
        const alpha = (0.14 + Math.max(depth, 0) * 0.78) * fade * (0.45 + formed * 0.55) * (isLarge || shape !== 'sphere' ? 1 : 0.5)
        const size = (signal[i] ? 2.2 : 1.4) * persp

        ctx.globalAlpha = signal[i] ? Math.min(alpha * 1.3, 1) : alpha
        ctx.fillStyle = signal[i] ? sig : ink
        ctx.fillRect(sx, sy, size, size)
      }
      ctx.globalAlpha = 1
    }

    const frame = (time: number) => {
      if (!visible || document.hidden) {
        raf = 0
        return
      }
      rot += shape === 'sphere' ? 0.0022 : 0.0006
      draw(time)
      raf = requestAnimationFrame(frame)
    }

    if (reduce) {
      draw(performance.now())
    } else {
      raf = requestAnimationFrame(frame)
    }

    const onVisibility = () => {
      if (!document.hidden && visible && !raf && !reduce) raf = requestAnimationFrame(frame)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      offReady()
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [shape, progressRef, centerX, assemble])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  )
}
