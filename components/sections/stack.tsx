'use client'

import { useState, useMemo, useRef } from 'react'
import { Layout, Server, Cloud, Database, Search, X, CheckCircle2, ShieldCheck, Zap, Layers } from 'lucide-react'
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap'
import { stackDomains, stackIntro } from '@/lib/content'

const domainIcons: Record<string, typeof Layout> = {
  Layout,
  Server,
  Cloud,
  Database,
}

const TOTAL_TOOLS = stackDomains.reduce((sum, d) => sum + d.tools.length, 0)

export function Stack() {
  const root = useRef<HTMLElement>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // GSAP scroll-triggered entrance animation
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-stack-card]', {
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '[data-stack-grid]',
            start: 'top 85%',
          },
        })
      })
    },
    { scope: root },
  )

  // Filter & Search logic
  const filteredDomains = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return stackDomains
      .map((domain) => {
        const matchesCategory =
          activeFilter === 'all' || domain.shortTitle.toLowerCase() === activeFilter.toLowerCase()

        if (!matchesCategory) return null

        if (!query) return domain

        const domainMatches =
          domain.domain.toLowerCase().includes(query) || domain.description.toLowerCase().includes(query)
        const matchingTools = domain.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.role.toLowerCase().includes(query) ||
            t.tag.toLowerCase().includes(query),
        )

        if (domainMatches) return domain
        if (matchingTools.length > 0) return { ...domain, tools: matchingTools }
        return null
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)
  }, [activeFilter, searchQuery])

  const visibleToolCount = filteredDomains.reduce((sum, d) => sum + d.tools.length, 0)

  return (
    <section
      ref={root}
      id="tech"
      aria-labelledby="stack-title"
      className="relative border-y border-line py-20 md:py-28"
    >
      <div className="px-5 md:px-8">
        {/* Section Header */}
        <div className="grid gap-8 md:grid-cols-12">
          <p className="label text-muted-foreground md:col-span-3 md:pt-2">(07) — Technology Stack</p>

          <div className="md:col-span-5">
            <h2
              id="stack-title"
              data-reveal
              className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.04em]"
            >
              Modern Tools for <span className="mark">Modern Problems</span>
            </h2>
            <p data-reveal className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              {stackIntro.body} All technologies are actively deployed across our production applications, visible and organized so you can evaluate our technical depth immediately.
            </p>
          </div>

          {/* Quick Metrics */}
          <dl data-reveal className="flex flex-wrap gap-7 md:col-span-4 md:justify-end md:self-end">
            {[
              { v: `${TOTAL_TOOLS}+`, l: 'Total Technologies' },
              { v: String(stackDomains.length), l: 'Core Domains' },
              { v: '100%', l: 'Production Ready' },
            ].map((s) => (
              <div key={s.l} className="flex flex-col-reverse gap-1.5">
                <dt className="label text-muted-foreground">{s.l}</dt>
                <dd className="font-display text-3xl leading-none text-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 md:mt-16 md:flex-row md:items-center md:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter technologies by domain">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              className={`flex items-center gap-2 border px-3.5 py-1.5 label transition-all duration-200 cursor-pointer ${
                activeFilter === 'all'
                  ? 'border-foreground bg-foreground text-background font-semibold'
                  : 'border-line bg-secondary/30 text-muted-foreground hover:border-line-strong hover:text-foreground'
              }`}
            >
              <span>All Stacks</span>
              <span
                className={`px-1.5 py-0.5 text-[9px] ${
                  activeFilter === 'all' ? 'bg-signal text-signal-ink font-bold' : 'bg-background text-muted-foreground'
                }`}
              >
                {TOTAL_TOOLS}
              </span>
            </button>

            {stackDomains.map((d) => {
              const isSelected = activeFilter.toLowerCase() === d.shortTitle.toLowerCase()
              return (
                <button
                  key={d.shortTitle}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveFilter(isSelected ? 'all' : d.shortTitle)}
                  className={`flex items-center gap-2 border px-3.5 py-1.5 label transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-foreground bg-foreground text-background font-semibold'
                      : 'border-line bg-secondary/30 text-muted-foreground hover:border-line-strong hover:text-foreground'
                  }`}
                >
                  <span>{d.shortTitle}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[9px] ${
                      isSelected ? 'bg-signal text-signal-ink font-bold' : 'bg-background text-muted-foreground'
                    }`}
                  >
                    {d.tools.length}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech stack (e.g. React, Redis)..."
              aria-label="Search technologies"
              className="w-full border border-line bg-secondary/20 py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-foreground focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter State Note */}
        {(searchQuery || activeFilter !== 'all') && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{visibleToolCount}</strong> of {TOTAL_TOOLS} technologies
              {searchQuery && (
                <>
                  {' '}
                  matching &ldquo;<span className="text-foreground">{searchQuery}</span>&rdquo;
                </>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveFilter('all')
              }}
              className="label text-xs underline underline-offset-4 hover:text-foreground cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Main Bento Cards Grid - All Visible Simultaneously */}
        {filteredDomains.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center border border-dashed border-line py-16 text-center">
            <Search className="h-8 w-8 text-muted-foreground/60" />
            <p className="mt-3 font-medium text-foreground">No technologies matched your query</p>
            <p className="mt-1 text-xs text-muted-foreground">Try searching for a different framework, language, or database.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveFilter('all')
              }}
              className="mt-4 border border-line px-4 py-2 label text-xs hover:border-foreground cursor-pointer transition-colors"
            >
              View Full Tech Stack
            </button>
          </div>
        ) : (
          <div
            data-stack-grid
            className={`mt-8 grid gap-6 ${
              filteredDomains.length === 1
                ? 'grid-cols-1 max-w-2xl mx-auto'
                : filteredDomains.length === 2
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
            }`}
          >
            {filteredDomains.map((domain) => {
              const IconComponent = domainIcons[domain.icon] ?? Layers

              return (
                <div
                  key={domain.domain}
                  data-stack-card
                  className="group relative flex flex-col justify-between border border-line bg-secondary/15 p-6 transition-all duration-300 hover:border-foreground/40 hover:bg-secondary/35"
                >
                  {/* Top Animated Accent Beam */}
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-line overflow-hidden">
                    <div className="h-full w-full bg-signal -translate-x-full transition-transform duration-700 ease-signal group-hover:translate-x-0" />
                  </div>

                  <div>
                    {/* Domain Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="label text-[10px] text-muted-foreground tracking-widest">{domain.code}</span>
                        <h3 className="mt-1.5 font-display text-2xl tracking-tight text-foreground">
                          {domain.shortTitle}
                        </h3>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-background text-foreground transition-colors duration-300 group-hover:border-foreground/50 group-hover:bg-foreground group-hover:text-background">
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {domain.description}
                    </p>

                    {/* Divider Rule */}
                    <div className="my-5 h-px w-full bg-line/60" />

                    {/* Tools Grid / List - All 6 visible per domain with full readability */}
                    <div className="flex flex-col gap-2.5">
                      {domain.tools.map((tool) => (
                        <div
                          key={tool.name}
                          className="group/tool relative flex flex-col justify-center border border-line/70 bg-background/90 px-3.5 py-2.5 transition-all duration-200 hover:border-foreground/40 hover:bg-background hover:shadow-xs"
                        >
                          {/* Row 1: Status dot, Tool Name, and Tag Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 ${
                                  tool.featured
                                    ? 'bg-signal group-hover/tool:scale-125'
                                    : 'bg-muted-foreground/40 group-hover/tool:bg-signal group-hover/tool:scale-125'
                                }`}
                              />
                              <span className="font-semibold text-sm tracking-tight text-foreground whitespace-nowrap">
                                {tool.name}
                              </span>
                            </div>

                            {/* Tag Badge */}
                            <span className="shrink-0 border border-line bg-secondary/40 px-1.5 py-0.5 label text-[9px] text-muted-foreground group-hover/tool:border-line-strong group-hover/tool:text-foreground transition-colors">
                              {tool.tag}
                            </span>
                          </div>

                          {/* Row 2: Tool Role Description */}
                          <div className="mt-1 pl-3.5">
                            <span className="block text-[11px] text-muted-foreground transition-colors group-hover/tool:text-foreground/80">
                              {tool.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-3.5 text-[11px] text-muted-foreground">
                    <span className="label text-[10px]">{domain.tools.length} Production Tools</span>
                    <span className="flex items-center gap-1 text-[10px] text-foreground font-medium">
                      <CheckCircle2 className="h-3 w-3 text-signal" /> Verified Stack
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom Architectural Pillars Strip */}
        <div className="mt-12 grid gap-4 border-t border-line pt-10 sm:grid-cols-3 md:mt-16">
          <div className="group relative border border-line bg-secondary/10 p-5 transition-colors hover:border-line-strong hover:bg-secondary/25">
            <div className="flex items-center gap-2.5">
              <Zap className="h-4 w-4 text-signal" />
              <h4 className="font-semibold text-sm tracking-tight text-foreground">High Concurrency & Low Latency</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Edge routing, serverless micro-runtimes, and microsecond Redis caching ensure instantaneous response times under load.
            </p>
          </div>

          <div className="group relative border border-line bg-secondary/10 p-5 transition-colors hover:border-line-strong hover:bg-secondary/25">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-signal" />
              <h4 className="font-semibold text-sm tracking-tight text-foreground">Strict Type-Safe Contracts</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              End-to-end typing via TypeScript and schema validation ensures zero runtime type discrepancies across the entire pipeline.
            </p>
          </div>

          <div className="group relative border border-line bg-secondary/10 p-5 transition-colors hover:border-line-strong hover:bg-secondary/25">
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-signal" />
              <h4 className="font-semibold text-sm tracking-tight text-foreground">Zero Vendor Lock-In</h4>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Standardized Docker containerization and open protocols allow portable deployment across AWS, Azure, GCP, or on-premise clusters.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
