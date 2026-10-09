'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { careers } from '@/lib/content'
import { SectionHead } from './section-head'
import { ArrowUpRight, CheckCircle2, Briefcase, MapPin, Clock, X } from 'lucide-react'

interface Position {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  status: 'active' | 'draft' | 'closed'
}

export function Careers() {
  const root = useRef<HTMLElement>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDept, setSelectedDept] = useState<string>('All')
  const [activeJob, setActiveJob] = useState<Position | null>(null)
  const [isApplying, setIsApplying] = useState<Position | null>(null)

  // Application form state
  const [appForm, setAppForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    portfolioUrl: '',
    linkedinUrl: '',
    coverNote: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  useEffect(() => {
    async function fetchPositions() {
      try {
        const res = await fetch(`${apiUrl}/api/positions`)
        if (res.ok) {
          const data = await res.json()
          if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            setPositions(data.data)
          }
        }
      } catch (err) {
        // Fallback silently if offline
      } finally {
        setLoading(false)
      }
    }
    fetchPositions()
  }, [apiUrl])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root.current,
          { clipPath: 'inset(0% 3% 0% 3%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  const departments = ['All', ...Array.from(new Set(positions.map((p) => p.department)))]
  const filteredPositions =
    selectedDept === 'All' ? positions : positions.filter((p) => p.department === selectedDept)

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isApplying) return
    setSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch(`${apiUrl}/api/applications/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionId: isApplying.id,
          ...appForm
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitted(true)
        setTimeout(() => {
          setIsApplying(null)
          setSubmitted(false)
          setAppForm({
            fullName: '',
            email: '',
            phone: '',
            portfolioUrl: '',
            linkedinUrl: '',
            coverNote: ''
          })
        }, 2200)
      } else {
        setErrorMsg(data.error || 'Failed to submit application. Please try again.')
      }
    } catch (err) {
      setErrorMsg('Could not connect to application server. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      ref={root}
      id="careers"
      data-surface
      aria-labelledby="careers-title"
      className="relative bg-surface px-5 py-24 text-surface-foreground md:px-8 md:py-32"
    >
      <SectionHead
        index="10"
        label="Careers"
        id="careers-title"
        title={['Join the Team That’s', 'Building the Future']}
        intro={careers.body}
        tone="surface"
      />

      {/* Status bar */}
      <div className="mt-16 flex items-center justify-between gap-6 border-y border-surface-line py-7 md:mt-24 md:py-10">
        <p className="flex items-center gap-4 font-display text-[clamp(1.5rem,3.2vw,2.5rem)]">
          <span aria-hidden="true" className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inset-0 animate-ping bg-signal opacity-60 motion-reduce:hidden" />
            <span className="relative h-3 w-3 bg-signal" />
          </span>
          {positions.length > 0 ? `${positions.length} Open Opportunities` : careers.status}
        </p>

        {positions.length > 0 && (
          <span className="hidden sm:inline-block font-mono text-xs text-surface-muted uppercase tracking-wider">
            Rajkot · Worldwide Hybrid
          </span>
        )}
      </div>

      {/* Dynamic Jobs Section */}
      {positions.length > 0 && (
        <div className="mt-12 space-y-8">
          {/* Department Filters */}
          {departments.length > 2 && (
            <div className="flex flex-wrap items-center gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                    selectedDept === dept
                      ? 'bg-signal text-signal-ink font-bold'
                      : 'border border-surface-line text-surface-muted hover:text-surface-foreground hover:border-surface-foreground'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}

          {/* Postings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPositions.map((pos) => (
              <div
                key={pos.id}
                className="group border border-surface-line bg-[#0e0e0d] p-6 transition-all duration-300 hover:border-signal/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs font-mono text-surface-muted mb-3">
                    <span className="text-signal">{pos.department}</span>
                    <span className="border border-surface-line px-2 py-0.5">{pos.type}</span>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-surface-foreground group-hover:text-signal transition-colors">
                    {pos.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-surface-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-signal" />
                      {pos.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pos.experience}
                    </span>
                  </div>

                  <p className="mt-4 text-xs md:text-sm text-[#b8b7b2] line-clamp-2 leading-relaxed">
                    {pos.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-surface-line flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-signal font-medium">{pos.salary}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveJob(pos)}
                      className="px-3 py-1.5 border border-surface-line text-xs font-mono text-surface-foreground hover:border-signal hover:text-signal transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setIsApplying(pos)}
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-signal text-signal-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#ffe066] transition-colors"
                    >
                      Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOB DETAILS MODAL */}
      {activeJob && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0e0e0d] border border-surface-line p-6 md:p-8 my-8 shadow-2xl relative text-surface-foreground">
            <button
              onClick={() => setActiveJob(null)}
              className="absolute top-6 right-6 text-surface-muted hover:text-surface-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-signal uppercase tracking-wider">{activeJob.department}</span>
            <h3 className="text-2xl md:text-3xl font-display font-bold mt-1 text-surface-foreground">
              {activeJob.title}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-surface-muted border-b border-surface-line pb-4">
              <span>{activeJob.location}</span>
              <span>·</span>
              <span>{activeJob.type}</span>
              <span>·</span>
              <span>{activeJob.experience}</span>
              <span>·</span>
              <span className="text-signal">{activeJob.salary}</span>
            </div>

            <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-surface-muted mb-2">About Role</h4>
                <p className="text-sm text-[#b8b7b2] leading-relaxed">{activeJob.description}</p>
              </div>

              {activeJob.responsibilities && activeJob.responsibilities.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-surface-muted mb-2">Key Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-[#b8b7b2]">
                    {activeJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeJob.requirements && activeJob.requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-surface-muted mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-[#b8b7b2]">
                    {activeJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-5 border-t border-surface-line flex justify-end gap-3">
              <button
                onClick={() => setActiveJob(null)}
                className="px-4 py-2 border border-surface-line text-xs font-mono text-surface-muted hover:text-surface-foreground"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const job = activeJob
                  setActiveJob(null)
                  setIsApplying(job)
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-signal text-signal-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#ffe066]"
              >
                Apply for this Role <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOB APPLICATION MODAL */}
      {isApplying && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0e0e0d] border border-surface-line p-6 md:p-8 my-8 shadow-2xl relative text-surface-foreground">
            <button
              onClick={() => setIsApplying(null)}
              className="absolute top-6 right-6 text-surface-muted hover:text-surface-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-signal uppercase tracking-wider">Application</span>
            <h3 className="text-xl md:text-2xl font-display font-bold mt-1 text-surface-foreground">
              {isApplying.title}
            </h3>
            <p className="text-xs font-mono text-surface-muted mt-1">
              TechAwaken Intelligence · {isApplying.location}
            </p>

            {submitted ? (
              <div className="my-10 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-signal mx-auto animate-bounce" />
                <h4 className="font-display text-xl font-bold">Application Received!</h4>
                <p className="text-xs font-mono text-surface-muted">
                  Our talent acquisition team will review your application and reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-surface-muted mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={appForm.fullName}
                    onChange={(e) => setAppForm({ ...appForm, fullName: e.target.value })}
                    className="w-full bg-[#171716] border border-surface-line px-3.5 py-2 text-xs text-surface-foreground focus:outline-none focus:border-signal font-mono"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-surface-muted mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={appForm.email}
                      onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                      className="w-full bg-[#171716] border border-surface-line px-3.5 py-2 text-xs text-surface-foreground focus:outline-none focus:border-signal font-mono"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-surface-muted mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={appForm.phone}
                      onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                      className="w-full bg-[#171716] border border-surface-line px-3.5 py-2 text-xs text-surface-foreground focus:outline-none focus:border-signal font-mono"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-surface-muted mb-1">
                      Portfolio / GitHub URL
                    </label>
                    <input
                      type="url"
                      value={appForm.portfolioUrl}
                      onChange={(e) => setAppForm({ ...appForm, portfolioUrl: e.target.value })}
                      className="w-full bg-[#171716] border border-surface-line px-3.5 py-2 text-xs text-surface-foreground focus:outline-none focus:border-signal font-mono"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-surface-muted mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={appForm.linkedinUrl}
                      onChange={(e) => setAppForm({ ...appForm, linkedinUrl: e.target.value })}
                      className="w-full bg-[#171716] border border-surface-line px-3.5 py-2 text-xs text-surface-foreground focus:outline-none focus:border-signal font-mono"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-surface-muted mb-1">
                    Cover Note / Brief Intro
                  </label>
                  <textarea
                    rows={3}
                    value={appForm.coverNote}
                    onChange={(e) => setAppForm({ ...appForm, coverNote: e.target.value })}
                    className="w-full bg-[#171716] border border-surface-line px-3.5 py-2 text-xs text-surface-foreground focus:outline-none focus:border-signal font-mono"
                    placeholder="Tell us why you'd be a great fit for this role..."
                  />
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-surface-line">
                  <button
                    type="button"
                    onClick={() => setIsApplying(null)}
                    className="px-4 py-2 border border-surface-line text-xs font-mono text-surface-muted hover:text-surface-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-signal text-signal-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#ffe066]"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
