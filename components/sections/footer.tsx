'use client'

import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { company, footer, products } from '@/lib/content'

const WORD = 'TechAwaken'

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-wm-char]', {
          yPercent: 100,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: { trigger: '[data-wordmark]', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        })
      })
    },
    { scope: root },
  )

  const col = 'label text-muted-foreground'
  const link = 'group relative inline-block text-sm'
  const underline = (
    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 ease-signal group-hover:scale-x-100" />
  )

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line px-5 pt-16 md:px-8 md:pt-20">
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-12">
        <div className="sm:col-span-2 md:col-span-12 lg:col-span-3">
          <p className="max-w-sm text-pretty text-lg leading-relaxed">{company.tagline}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {company.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className={link}>
                  {s.label}
                  {underline}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Footer services" className="md:col-span-3 lg:col-span-2">
          <p className={col}>Services</p>
          <ul className="mt-4 grid gap-y-2">
            {footer.services.map((s) => (
              <li key={s}>
                <a href="#expertise" className={link}>
                  {s}
                  {underline}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer products" className="md:col-span-3 lg:col-span-2">
          <p className={col}>Products</p>
          <ul className="mt-4 grid gap-y-2">
            {products.map((p) => (
              <li key={p.id}>
                <a href="#products" className={link}>
                  {p.name}
                  {underline}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className={link}>
                Request Demo
                {underline}
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label="Footer company" className="md:col-span-3 lg:col-span-2">
          <p className={col}>Company</p>
          <ul className="mt-4 grid gap-y-2">
            {footer.company.map((c) => (
              <li key={c.href}>
                <a href={c.href} className={link}>
                  {c.label}
                  {underline}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sm:col-span-2 md:col-span-3">
          <p className={col}>Contact</p>
          <ul className="mt-4 grid gap-y-2 text-sm">
            <li>
              <a href={`mailto:${company.email}`} className={`${link} break-words`}>
                {company.email}
                {underline}
              </a>
            </li>
            <li>
              <a href={company.phoneHref} className={link}>
                {company.phone}
                {underline}
              </a>
            </li>
            <li className="text-muted-foreground">{company.location}</li>
          </ul>
        </div>
      </div>

      <p
        aria-hidden="true"
        data-wordmark
        className="mt-16 flex select-none overflow-hidden whitespace-nowrap font-display text-[calc((100vw-2.5rem)/5.5)] leading-[0.78] md:text-[calc((100vw-4rem)/5.5)] md:mt-24"
      >
        {WORD.split('').map((c, i) => (
          <span key={i} data-wm-char className={`inline-block ${i >= 4 ? 'text-outline' : ''}`}>
            {c}
          </span>
        ))}
      </p>

      <div className="flex flex-col gap-2 border-t border-line py-5 label text-muted-foreground md:flex-row md:justify-between">
        <span>
          © {new Date().getFullYear()} {company.legal}. {footer.copyright}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-signal" />
          {footer.hq}
        </span>
      </div>
    </footer>
  )
}
