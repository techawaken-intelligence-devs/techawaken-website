'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { type Product } from '@/lib/content'
import { lenisInstance, scrollToTarget } from '@/components/system/smooth-scroll'

export type CaseStudyHandle = { open: (focus?: 'pricing') => void }

export const CaseStudy = forwardRef<CaseStudyHandle, { product: Product; index: number }>(function CaseStudy(
  { product, index },
  ref,
) {
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const pricing = useRef<HTMLDivElement>(null)
  const closing = useRef(false)

  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useImperativeHandle(ref, () => ({
    open(focus) {
      const d = dialog.current
      if (!d || d.open) return
      lenisInstance?.stop()
      d.showModal()
      panel.current?.scrollTo({ top: 0 })
      if (!reduce()) {
        gsap.fromTo(d, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' })
        gsap.fromTo(
          d.querySelectorAll('[data-cs-item]'),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, delay: 0.35, ease: 'expo.out' },
        )
      }
      if (focus === 'pricing') {
        window.setTimeout(() => pricing.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 700)
      }
    },
  }))

  const close = (after?: () => void) => {
    const d = dialog.current
    if (!d || closing.current) return
    closing.current = true
    const done = () => {
      d.close()
      closing.current = false
      lenisInstance?.start()
      after?.()
    }
    if (reduce()) return done()
    gsap.to(d, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: done })
  }

  const titleId = `${product.id}-case-title`
  const toContact = (e?: React.MouseEvent) => {
    e?.preventDefault()
    close(() => scrollToTarget(lenisInstance, '#contact'))
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="case-study fixed inset-0 m-0 h-[100dvh] w-full bg-background p-0 text-foreground"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close()
      }}
    >
      <div ref={panel} data-lenis-prevent className="h-full overflow-y-auto overscroll-contain">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-background px-5 py-4 md:px-8">
          <p className="label text-muted-foreground">
            Case study {String(index + 1).padStart(2, '0')} — {product.sector}
          </p>
          <button
            type="button"
            onClick={() => close()}
            className="group flex h-9 items-center gap-3 label text-foreground"
            autoFocus
          >
            Close
            <span aria-hidden="true" className="relative block h-3 w-3">
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full rotate-45 bg-current transition-transform duration-500 ease-signal group-hover:rotate-[135deg]" />
              <span className="absolute left-0 top-1/2 h-[1.5px] w-full -rotate-45 bg-current transition-transform duration-500 ease-signal group-hover:rotate-45" />
            </span>
          </button>
        </div>

        <div className="px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14">
          <h3 id={titleId} data-cs-item className="font-display text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[0.98]">
            {product.split[0]}
            <span className="text-outline">{product.split[1]}</span>
          </h3>

          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-8">
            <div data-cs-item className="md:col-span-5">
              <p className="label text-muted-foreground">The Challenge</p>
              <p className="mt-4 text-lg leading-relaxed">{product.challenge}</p>
            </div>
            <div data-cs-item className="md:col-span-5 md:col-start-8">
              <p className="label text-muted-foreground">Our Solution</p>
              <p className="mt-4 text-lg leading-relaxed">{product.solution}</p>
            </div>

            <div data-cs-item className="border-t border-line pt-6 md:col-span-5">
              <p className="label text-muted-foreground">Key Modules</p>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {product.modules.map((m) => (
                  <li key={m} className="flex items-center gap-2.5">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-signal" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div data-cs-item className="border-t border-line pt-6 md:col-span-5 md:col-start-8">
              <p className="label text-muted-foreground">Who It’s For</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.audience.map((a) => (
                  <li key={a} className="border border-line-strong px-3 py-2 label text-foreground">
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div ref={pricing} data-cs-item className="border-t border-line pt-6 md:col-span-5">
              <p className="label text-muted-foreground">Pricing Model</p>
              <p className="mt-4 text-lg leading-relaxed">
                {product.pricingLead} <span className="mark font-semibold">{product.pricingModel}</span>
                {product.pricingRest.startsWith('.') ? '' : ' '}
                {product.pricingRest}
              </p>
            </div>
            <div data-cs-item className="border-t border-line pt-6 md:col-span-5 md:col-start-8">
              <p className="label text-muted-foreground">Technology Stack</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.stack.map((t) => (
                  <li key={t} className="bg-foreground px-3 py-2 label text-background">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-cs-item className="mt-14 flex flex-wrap gap-3 border-t border-line pt-8">
            <a
              href="#contact"
              onClick={toContact}
              className="group relative inline-flex h-12 items-center gap-3 overflow-hidden bg-foreground px-6 label text-background"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-500 ease-signal group-hover:scale-y-100" />
              <span className="relative transition-colors duration-300 group-hover:text-signal-ink">{product.primary}</span>
              <span aria-hidden="true" className="relative transition-[color,transform] duration-500 ease-signal group-hover:translate-x-1 group-hover:text-signal-ink">→</span>
            </a>
            <button
              type="button"
              onClick={() =>
                toContact()
              }
              className="inline-flex h-12 items-center border border-line-strong px-6 label text-foreground transition-colors duration-300 hover:border-foreground"
            >
              {product.secondary}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
})
