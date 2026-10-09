'use client'

import { useRef, useState } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { company, contact } from '@/lib/content'
import { Magnetic } from '@/components/system/motion'

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-contact-line]', {
          yPercent: 105,
          duration: 1.25,
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-contact-title]', start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  // Same delivery as the live site: Web3Forms, same payload shape.
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (k: string) => String(data.get(k) ?? '').trim()
    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contact.web3formsKey,
          name: get('name'),
          email: get('email'),
          subject: `${get('subject')} — TechAwaken Website Inquiry`,
          phone: get('phone') || 'Not provided',
          message: get('message'),
          from_name: 'TechAwaken Website',
        }),
      })
      let json: { success?: boolean | string } = {}
      try {
        json = await res.json()
      } catch {}
      setStatus(res.ok && (json.success === true || json.success === 'true' || res.status === 200) ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    formRef.current?.reset()
    setStatus('idle')
  }

  return (
    <section ref={root} id="contact" aria-labelledby="contact-title" className="relative px-5 py-24 md:px-8 md:py-32">
      <p className="label text-muted-foreground">(11) — Let’s Talk</p>
      <h2 id="contact-title" data-contact-title className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.08]">
        <span className="block overflow-hidden pb-[0.04em]">
          <span data-contact-line className="block">Ready to Build</span>
        </span>
        <span className="block overflow-hidden pb-[0.04em]">
          <span data-contact-line className="block">
            <span className="text-outline">Something</span> <span className="mark">Extraordinary?</span>
          </span>
        </span>
      </h2>

      <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-12">
        <div className="flex flex-col gap-8 md:col-span-4">
          <p data-reveal className="text-pretty text-lg leading-relaxed">{contact.intro}</p>
          <ContactLine label="Email" href={`mailto:${company.email}`} value={company.email} />
          <ContactLine label="Phone" href={company.phoneHref} value={company.phone} />
          <div data-reveal>
            <p className="label text-muted-foreground">Location</p>
            <p className="mt-2 text-lg font-medium">{company.location}</p>
          </div>
          <div data-reveal className="border-l-2 border-signal pl-4">
            <p className="label text-foreground">Fast Response Guaranteed</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{contact.response}</p>
          </div>
          <div data-reveal>
            <p className="label text-muted-foreground">Follow us</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {company.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 font-medium">
                    <span className="relative">
                      {s.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 ease-signal group-hover:scale-x-100" />
                    </span>
                    <span aria-hidden="true" className="text-sm transition-transform duration-500 ease-signal group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form
          ref={formRef}
          data-reveal
          onSubmit={onSubmit}
          hidden={status === 'sent'}
          className="md:col-span-7 md:col-start-6"
        >
          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
            <Field label="Name" name="name" autoComplete="name" required />
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            <Field label="Subject" name="subject" required />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
          </div>
          <div className="group relative mt-9">
            <label htmlFor="message" className="label text-muted-foreground transition-colors group-focus-within:text-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="mt-3 block w-full resize-none border-b border-line-strong bg-transparent py-2 text-lg outline-none"
            />
            <span aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-signal group-focus-within:scale-x-100 dark:bg-signal" />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Magnetic>
              <button
                type="submit"
                disabled={status === 'sending'}
                data-cursor="Open"
                className="group relative inline-flex h-14 items-center gap-3 overflow-hidden bg-foreground px-8 label text-background disabled:opacity-60"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-500 ease-signal group-hover:scale-y-100" />
                <span className="relative transition-colors duration-300 group-hover:text-signal-ink">
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </span>
                <span aria-hidden="true" className="relative transition-[color,transform] duration-500 ease-signal group-hover:translate-x-1 group-hover:text-signal-ink">
                  →
                </span>
              </button>
            </Magnetic>
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
              {status === 'error' && (
                <>
                  ⚠️ Something went wrong. Please try again or email us at{' '}
                  <a href={`mailto:${company.email}`} className="text-foreground underline decoration-signal decoration-2 underline-offset-4">
                    {company.email}
                  </a>
                </>
              )}
            </p>
          </div>
        </form>

        {status === 'sent' && (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-start justify-center border-t-2 border-signal pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 md:col-span-7 md:col-start-6"
          >
            <p className="label text-muted-foreground">✅</p>
            <p className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.75rem)]">Message Sent!</p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
            <button
              type="button"
              onClick={reset}
              className="group mt-8 inline-flex h-12 items-center gap-3 border border-line-strong px-6 label text-foreground transition-colors duration-300 hover:border-foreground"
            >
              Send Another Message
              <span aria-hidden="true" className="transition-transform duration-500 ease-signal group-hover:translate-x-1">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function ContactLine({ label, href, value }: { label: string; href: string; value: string }) {
  return (
    <div data-reveal>
      <p className="label text-muted-foreground">{label}</p>
      <a href={href} className="group relative mt-2 inline-block break-all text-lg font-medium">
        {value}
        <span className="absolute -bottom-0.5 left-0 h-px w-full bg-line-strong" />
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 ease-signal group-hover:scale-x-100" />
      </a>
    </div>
  )
}

function Field({ label, name, ...props }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="group relative">
      <label htmlFor={name} className="label text-muted-foreground transition-colors group-focus-within:text-foreground">
        {label}
        {props.required && <span className="text-muted-foreground"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        {...props}
        className="mt-3 block w-full border-b border-line-strong bg-transparent py-2 text-lg outline-none"
      />
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-signal group-focus-within:scale-x-100 dark:bg-signal" />
    </div>
  )
}
