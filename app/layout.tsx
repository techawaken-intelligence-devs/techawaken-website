import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo, JetBrains_Mono } from 'next/font/google'
import { SmoothScroll } from '@/components/system/smooth-scroll'
import { Cursor } from '@/components/system/cursor'
import { Preloader } from '@/components/system/preloader'
import { RevealSystem, ScrollProgress } from '@/components/system/motion'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const siteUrl = 'https://techawaken.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TechAwaken Intelligence | Intelligent Software, AI Solutions & Enterprise SaaS',
    template: '%s | TechAwaken Intelligence',
  },
  description:
    'TechAwaken Intelligence delivers enterprise-grade software engineering, custom AI solutions, SaaS products, and scalable cloud architectures. Makers of BuildCart and OpticSaaS.',
  keywords: [
    'AI Solutions',
    'Enterprise Software',
    'SaaS Development',
    'Full-Stack Engineering',
    'Cloud Architecture',
    'Machine Learning',
    'Next.js Development',
    'React',
    'Python AI',
    'TechAwaken Intelligence',
    'BuildCart',
    'OpticSaaS',
  ],
  authors: [{ name: 'TechAwaken Intelligence Pvt. Ltd.', url: siteUrl }],
  creator: 'TechAwaken Intelligence',
  publisher: 'TechAwaken Intelligence Pvt. Ltd.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TechAwaken Intelligence',
    title: 'TechAwaken Intelligence — Transforming Businesses Through Intelligent Technology',
    description:
      'We build modern SaaS products, AI-driven solutions, and scalable software for businesses that demand excellence — serving clients worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TechAwaken Intelligence — Enterprise Software & AI Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechAwaken Intelligence — Transforming Businesses Through Intelligent Technology',
    description:
      'Enterprise SaaS products, AI-driven solutions, and scalable software for businesses worldwide.',
    creator: '@techawekan',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#070707' },
  ],
}

const themeScript = `(function(){try{var d=document.documentElement;var s=localStorage.getItem('ta-theme');var dark=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(dark)d.classList.add('dark');try{if(sessionStorage.getItem('ta-intro'))d.classList.add('intro-skip')}catch(e){}if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!d.dataset.ready){d.classList.remove('motion')}},4000)}}catch(e){}})();`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'TechAwaken Intelligence Pvt. Ltd.',
      alternateName: 'TechAwaken',
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      description:
        'Enterprise SaaS products, AI-driven solutions, and scalable software engineered for businesses that demand excellence.',
      email: 'techawakenintelligence@gmail.com',
      telephone: '+919265567843',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Rajkot',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://www.linkedin.com/in/techawaken-intelligence-b27953415',
        'https://x.com/techawekan',
        'https://www.instagram.com/techawaken_intelligence',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'TechAwaken Intelligence',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      inLanguage: 'en-US',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <SmoothScroll>
          <Preloader />
          <ScrollProgress />
          {children}
          <RevealSystem />
        </SmoothScroll>
        <Cursor />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
