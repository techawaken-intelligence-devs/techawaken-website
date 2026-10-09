'use client'

import { useRef } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'

// Must match the `wide:` variant in globals.css.
const WIDE = '(min-width: 1024px) and (min-height: 700px)'
import { products, productsIntro, type Product } from '@/lib/content'
import { scrollToTarget, useLenis } from '@/components/system/smooth-scroll'
import { ParticleField } from '@/components/system/particle-field'
import { CaseStudy, type CaseStudyHandle } from './case-study'

function ProductPanel({ product, index }: { product: Product; index: number }) {
  const study = useRef<CaseStudyHandle>(null)
  const lenis = useLenis()

  return (
    <article
      data-product
      aria-labelledby={`${product.id}-title`}
      className="relative flex min-h-[100svh] w-full shrink-0 flex-col justify-between gap-10 border-t border-surface-line px-5 pb-10 pt-24 md:px-8 wide:w-screen wide:border-l wide:border-t-0 wide:gap-6 wide:pt-24"
    >
      <div data-reveal-mobile className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="label text-surface-muted">
          Product {String(index + 1).padStart(2, '0')} — {product.sector}
        </p>
        <ul aria-label={`${product.name} technology stack`} className="flex flex-wrap gap-1.5">
          {product.stack.map((t) => (
            <li key={t} className="border border-surface-line px-2 py-1 label text-surface-muted">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <h3
        id={`${product.id}-title`}
        className="font-display text-[clamp(2.5rem,6.5vw,4.75rem)] wide:text-[clamp(2.25rem,min(6vw,8vh),4.75rem)] leading-[0.98]"
      >
        <span data-split-a className="block">{product.split[0]}</span>
        <span data-split-b className="block pl-[4vw] sm:pl-[6vw] text-signal">{product.split[1]}</span>
        <span className="sr-only">{product.name}</span>
      </h3>

      <div data-reveal-mobile className="grid gap-8 border-t border-surface-line pt-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-pretty leading-relaxed lg:text-[0.95rem] xl:text-base">{product.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget(lenis, '#contact')
              }}
              data-cursor="Open"
              className="group relative inline-flex h-11 items-center gap-3 overflow-hidden bg-signal px-5 label text-signal-ink"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-surface-foreground transition-transform duration-500 ease-signal group-hover:scale-y-100" />
              <span className="relative">{product.cardPrimary}</span>
              <span aria-hidden="true" className="relative transition-transform duration-500 ease-signal group-hover:translate-x-1">→</span>
            </a>
            <button
              type="button"
              onClick={() => study.current?.open()}
              data-cursor="Open"
              className="group inline-flex h-11 items-center gap-2 border border-surface-line px-5 label text-surface-foreground transition-colors duration-300 hover:border-surface-foreground"
            >
              Case Study
              <span aria-hidden="true" className="transition-transform duration-500 ease-signal group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </button>
          </div>
        </div>
        <div className="md:col-span-4 md:col-start-7">
          <p className="label text-surface-muted">Key Modules</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {product.modules.map((m) => (
              <li key={m} className="flex items-center gap-2 text-sm">
                <span aria-hidden="true" className="h-1 w-1 shrink-0 bg-signal" />
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2 md:col-start-11">
          <p className="label text-surface-muted">Who It’s For</p>
          <ul className="mt-4 grid gap-1.5 text-sm text-surface-muted">
            {product.audience.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      <CaseStudy ref={study} product={product} index={index} />
    </article>
  )
}


export function Products() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // The dark stage opens out of the light page rather than butting against it.
        gsap.fromTo(
          root.current,
          { clipPath: 'inset(0% 3% 0% 3%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true },
          },
        )
        gsap.from('[data-products-intro] > *', {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 1.1,
          scrollTrigger: { trigger: root.current, start: 'top 60%' },
        })
      })
      mm.add(`${MOTION_OK} and ${WIDE}`, () => {
        const panels = gsap.utils.toArray<HTMLElement>('[data-product]')
        const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        panels.forEach((panel) => {
          gsap.from(panel.querySelector('[data-split-b]'), {
            xPercent: 30,
            ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'left left', scrub: true },
          })
          gsap.from(panel.querySelector('[data-split-a]'), {
            xPercent: -12,
            ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'left left', scrub: true },
          })
        })
        gsap.to('[data-product-progress]', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="products"
      data-surface
      aria-labelledby="products-title"
      className="relative overflow-hidden bg-surface text-surface-foreground"
    >
      <div ref={track} className="flex flex-col wide:w-max wide:flex-row">
        <div className="relative flex min-h-[80svh] w-full shrink-0 flex-col justify-between overflow-hidden px-5 pb-10 pt-24 md:px-8 wide:min-h-[100svh] wide:w-[70vw] wide:pt-24">
          <div className="absolute inset-0 opacity-70 [--foreground:var(--surface-foreground)]">
            <ParticleField shape="plane" />
          </div>
          <p className="relative label text-surface-muted">(03) — Our Products</p>
          <div data-products-intro className="relative">
            <h2 id="products-title" className="font-display text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.08]">
              Software Products
              <br />
              <span className="text-outline">Built for Industry</span>
            </h2>
            <p className="mt-6 max-w-sm text-pretty leading-relaxed text-surface-muted">{productsIntro.body}</p>
            <p className="mt-8 hidden items-center gap-3 label text-surface-muted wide:flex">
              <span aria-hidden="true" className="h-px w-10 bg-signal" />
              Scroll to explore
            </p>
          </div>
        </div>
        {products.map((p, i) => (
          <ProductPanel key={p.id} product={p} index={i} />
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-x-5 bottom-4 hidden h-px bg-surface-line md:inset-x-8 wide:block">
        <div data-product-progress className="h-full origin-left scale-x-0 bg-signal" />
      </div>
    </section>
  )
}
