'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !document.documentElement.classList.contains('dark')
    const apply = () => {
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('ta-theme', next ? 'dark' : 'light')
      setDark(next)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> }
    }
    if (reduce) {
      apply()
      return
    }
    if (!doc.startViewTransition) {
      // No View Transitions (older Safari, Firefox): crossfade colours instead of snapping.
      const root = document.documentElement
      root.classList.add('theme-fade')
      apply()
      window.setTimeout(() => root.classList.remove('theme-fade'), 650)
      return
    }

    const x = e.clientX || window.innerWidth - 40
    const y = e.clientY || 40
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = doc.startViewTransition(apply)
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'group relative flex h-9 items-center gap-2 px-1 label text-foreground',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="relative block h-3.5 w-3.5 overflow-hidden rounded-full border border-foreground"
      >
        <span className="absolute inset-y-0 left-1/2 right-0 bg-foreground transition-transform duration-500 ease-signal group-hover:translate-x-[-50%]" />
      </span>
      <span className="hidden sm:inline" suppressHydrationWarning>
        {dark === null ? 'Theme' : dark ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}
