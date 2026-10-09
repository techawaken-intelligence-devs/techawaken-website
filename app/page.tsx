import { SiteHeader } from '@/components/system/site-header'
import { Hero } from '@/components/sections/hero'
import { Statement } from '@/components/sections/statement'
import { Expertise } from '@/components/sections/expertise'
import { Products } from '@/components/sections/products'
import { Work } from '@/components/sections/work'
import { About } from '@/components/sections/about'
import { Why } from '@/components/sections/why'
import { Stack } from '@/components/sections/stack'
import { Process } from '@/components/sections/process'
import { Life } from '@/components/sections/life'
import { Careers } from '@/components/sections/careers'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/sections/footer'

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-signal focus:px-4 focus:py-2 focus:text-signal-ink"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Statement />
        <Expertise />
        <Products />
        <Work />
        <About />
        <Why />
        <Stack />
        <Process />
        <Life />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
