'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { nav, company } from '@/lib/content'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'
import { Magnetic } from './motion'
import { scrollToTarget, useLenis } from './smooth-scroll'

/** Pinned sections are wrapped in a pin-spacer that carries the real scroll length. */
function spacerOf<T extends Element | null>(el: T): T {
  const parent = el?.parentElement
  return (parent?.classList.contains('pin-spacer') ? parent : el) as T
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [current, setCurrent] = useState(0)
  const [onDark, setOnDark] = useState(false)
  const lenis = useLenis()
  const overlayRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        // Hide on meaningful downward travel only; any upward nudge brings it back.
        if (Math.abs(y - last) > 6) {
          setHidden(y > 200 && y > last)
          last = y
        }
        setScrolled(y > 40)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Live section index next to the logo: (03) Our Products
  useEffect(() => {
    const triggers = (nav
      .map((item, i) => {
        const el = spacerOf(document.querySelector(item.href))
        if (!el) return null
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          refreshPriority: -1,
          onToggle: (self) => self.isActive && setCurrent(i),
          onLeaveBack: () => setCurrent(Math.max(0, i - 1)),
        })
      })
      .filter(Boolean) as ScrollTrigger[])
    // Invert the header over dark stages (Products, Careers) so it never disappears.
    const dark = new Set<number>()
    gsap.utils.toArray<HTMLElement>('[data-surface]').map(spacerOf).forEach((el, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 36px',
          end: 'bottom 36px',
          refreshPriority: -1,
          onToggle: (self) => {
            if (self.isActive) dark.add(i)
            else dark.delete(i)
            setOnDark(dark.size > 0)
          },
        }),
      )
    })
    return () => triggers.forEach((t) => t.kill())
  }, [])

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
        .set(overlayRef.current, { visibility: 'visible' })
        .fromTo(
          overlayRef.current,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: reduce ? 0.01 : 0.85 },
        )
        .fromTo(
          '[data-menu-item]',
          { yPercent: 110 },
          { yPercent: 0, duration: reduce ? 0.01 : 0.8, ease: 'expo.out', stagger: 0.04 },
          '-=0.4',
        )
        .fromTo(
          '[data-menu-rule]',
          { scaleX: 0 },
          { scaleX: 1, duration: reduce ? 0.01 : 0.9, ease: 'expo.out', stagger: 0.04 },
          '<',
        )
        .fromTo('[data-menu-meta]', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.6')
    },
    { scope: overlayRef },
  )

  useEffect(() => {
    if (!tl.current) return
    if (open) {
      lenis?.stop()
      tl.current.timeScale(1).play()
      // Move keyboard focus into the overlay once items have arrived.
      window.setTimeout(() => overlayRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }), 450)
    } else {
      lenis?.start()
      tl.current.timeScale(1.7).reverse()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const wasOpen = open
    setOpen(false)
    window.setTimeout(() => scrollToTarget(lenis, href), wasOpen ? 420 : 0)
    if (wasOpen) menuButtonRef.current?.focus()
  }

  const section = nav[current]

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-signal"
        style={
          {
            transform: hidden && !open ? 'translateY(-110%)' : 'translateY(0)',
            ...(onDark && !open
              ? {
                  '--foreground': 'var(--surface-foreground)',
                  '--background': 'var(--surface)',
                  '--muted-foreground': 'var(--surface-muted)',
                  '--line-strong': 'var(--surface-line)',
                }
              : {}),
          } as React.CSSProperties
        }
      >
        <div
          aria-hidden="true"
          className={`header-veil pointer-events-none absolute inset-x-0 top-0 h-[150%] transition-opacity duration-300 ${hidden ? "!opacity-0" : ""} ${
            scrolled && !open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="relative flex items-center justify-between px-5 py-4 md:px-8 md:py-5">
          <div className="flex items-center gap-8">
            <a
              href="#hero"
              onClick={(e) => go(e, '#hero')}
              aria-label={`${company.name} — home`}
              className="relative z-10 text-foreground"
            >
              <Logo />
            </a>
            <p
              aria-hidden="true"
              className={`hidden h-3 overflow-hidden label text-muted-foreground transition-opacity duration-500 lg:block ${
                scrolled && !open ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span key={current} className="block animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="mr-2 inline-block h-1.5 w-1.5 bg-signal align-middle" />
                {section?.label}
              </span>
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 md:gap-6">
            <Magnetic className="hidden sm:inline-flex">
              <a
                href="#contact"
                onClick={(e) => go(e, '#contact')}
                data-cursor="Open"
                className="group flex h-9 items-center gap-2.5 border border-line-strong px-3.5 label text-foreground transition-colors duration-300 hover:border-foreground"
              >
                <span className="relative overflow-hidden">
                  <span className="block transition-transform duration-500 ease-signal group-hover:-translate-y-full">
                    {"Let's talk"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-signal group-hover:translate-y-0"
                  >
                    {"Let's talk"}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-500 ease-signal group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
              </a>
            </Magnetic>
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex h-9 items-center gap-3 label text-foreground"
            >
              <span className="relative hidden h-3 overflow-hidden sm:block">
                <span
                  className="block transition-transform duration-500 ease-signal"
                  style={{ transform: open ? 'translateY(-50%)' : 'none' }}
                >
                  <span className="block h-3">Menu</span>
                  <span className="block h-3">Close</span>
                </span>
              </span>
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span
                  className="absolute left-0 top-0 h-[1.5px] w-full bg-current transition-transform duration-500 ease-signal"
                  style={{ transform: open ? 'translateY(5px) rotate(45deg)' : 'none' }}
                />
                <span
                  className="absolute bottom-0 right-0 h-[1.5px] bg-current transition-all duration-500 ease-signal group-hover:w-full"
                  style={{
                    width: open ? '100%' : '60%',
                    transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none',
                  }}
                />
              </span>
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={overlayRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        className="invisible fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        data-lenis-prevent
      >
        <nav aria-label="Primary" className="flex flex-1 flex-col justify-center px-5 pb-6 pt-24 md:px-8">
          <ol className="grid md:grid-cols-2 md:gap-x-12">
            {nav.map((item, i) => (
              <li key={item.href} className="relative overflow-hidden">
                <a
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  data-menu-item
                  aria-current={current === i ? 'true' : undefined}
                  className="group flex items-baseline gap-4 py-2.5 md:py-3"
                >
                  <span
                    className={`label w-7 shrink-0 transition-colors duration-300 ${
                      current === i ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-[clamp(1.5rem,4vw,2.5rem)] transition-transform duration-500 ease-signal group-hover:translate-x-3">
                    <span className="relative inline-block">
                      <span className="block transition-opacity duration-300 group-hover:opacity-0">{item.label}</span>
                      <span aria-hidden="true" className="absolute inset-0 block text-outline opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {item.label}
                      </span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`ml-auto h-2 w-2 shrink-0 bg-signal transition-transform duration-500 ease-signal group-hover:scale-100 ${
                      current === i ? 'scale-100' : 'scale-0'
                    }`}
                  />
                </a>
                <span aria-hidden="true" data-menu-rule className="block h-px origin-left bg-line" />
              </li>
            ))}
          </ol>
        </nav>
        <div
          data-menu-meta
          className="flex flex-col gap-3 px-5 py-6 label text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
            <a href={`mailto:${company.email}`} className="transition-colors hover:text-foreground">
              {company.email}
            </a>
            <a href={company.phoneHref} className="transition-colors hover:text-foreground">
              {company.phone}
            </a>
          </div>
          <div className="flex gap-6">
            {company.socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
