// Source of truth: https://techawakenintelligence.com — copy kept verbatim.

export const company = {
  name: 'TechAwaken Intelligence',
  legal: 'TechAwaken Intelligence Pvt. Ltd.',
  email: 'techawakenintelligence@gmail.com',
  phone: '+91 92655 67843',
  phoneHref: 'tel:+919265567843',
  location: 'Rajkot, Gujarat, India · Worldwide',
  tagline: 'Building intelligent technology solutions that transform businesses worldwide — from Rajkot to every corner of the globe.',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/techawaken-intelligence-b27953415' },
    { label: 'Twitter / X', href: 'https://x.com/techawekan' },
    { label: 'Instagram', href: 'https://www.instagram.com/techawaken_intelligence' },
  ],
}

export const nav = [
  { label: 'Home', href: '#hero' },
  { label: 'Our Expertise', href: '#expertise' },
  { label: 'Our Products', href: '#products' },
  { label: 'Our Work', href: '#work' },
  { label: 'Who We Are', href: '#about' },
  { label: 'Life at TechAwaken', href: '#life' },
  { label: 'Careers', href: '#careers' },
  { label: "Let's Talk", href: '#contact' },
]

export const hero = {
  eyebrow: 'TechAwaken Intelligence Pvt. Ltd.',
  body: 'We build modern SaaS products, AI-driven solutions, and scalable software for businesses that demand excellence — serving clients worldwide.',
  kicker: 'Your vision, our engineering.',
  stats: [
    { value: 2, pad: 1, suffix: '', label: 'Products Built' },
    { value: 15, pad: 1, suffix: '+', label: 'Technologies' },
    { value: 2026, pad: 4, suffix: '', label: 'Founded' },
  ],
}

export const statement = {
  lead: 'Building the Future of Business Software',
  domains: ['SaaS', 'AI', 'Enterprise', 'Mobile', 'Cloud'],
  tags: ['AI Solutions', 'Full-Stack', 'Cloud & DevOps', 'Mobile Apps', 'IoT'],
}

export const expertise = {
  title: 'Full-Spectrum Technology Services',
  intro: 'From ideation to deployment — we bring deep expertise across every layer of the technology stack.',
}

export const services = [
  { title: 'AI Solutions', full: 'Artificial Intelligence (AI) Solutions', body: 'ML, NLP, predictive analytics, and intelligent automation for real business outcomes.' },
  { title: 'Software Development', body: 'Custom software engineered for performance, reliability, and enterprise scale.' },
  { title: 'Mobile App Development', body: 'Native and cross-platform Android & iOS apps that delight users and grow businesses.' },
  { title: 'Full-Stack Development', body: 'End-to-end web solutions from database architecture to polished frontend experiences.' },
  { title: 'Cloud & DevOps', full: 'Cloud & DevOps Solutions', body: 'CI/CD pipelines, containers, and cloud infrastructure on Azure & AWS.' },
  { title: 'Microsoft Development', body: '.NET apps, Azure integrations, and enterprise Microsoft ecosystem solutions.' },
  { title: 'Web Applications', full: 'Web Application Development', body: 'Scalable, secure, high-performance web apps built with modern frameworks.' },
  { title: 'IoT Solutions', body: 'Connected device ecosystems, sensor data pipelines, and smart automation.' },
  { title: 'UI/UX Design', body: 'Research-backed interfaces that balance beauty with usability for products people love.' },
  { title: 'API & Integration', full: 'API Development & Integration', body: 'RESTful and GraphQL APIs, third-party integrations, microservices architecture.' },
  { title: 'CMS Development', full: 'CMS Development & Customization', body: 'Custom CMS builds and major platform customizations for content-heavy products.' },
  { title: 'SEO & Digital Marketing', body: 'Data-driven strategies that attract, convert, and retain customers at scale.' },
  { title: 'MVP & POC Development', body: 'Rapid prototyping and lean validation builds before committing to full development.' },
  { title: 'Maintenance & Support', full: 'Software Maintenance & Support', body: 'Ongoing technical support, monitoring, and iterative improvements for existing systems.' },
] as { title: string; full?: string; body: string }[]

export const productsIntro = {
  title: 'Software Products Built for Industry',
  body: 'Purpose-built software solutions that solve real operational challenges for businesses across the world.',
}

export type Product = {
  id: string
  split: [string, string]
  name: string
  sector: string
  summary: string
  audience: string[]
  modules: string[]
  challenge: string
  solution: string
  pricingLead: string
  pricingModel: string
  pricingRest: string
  stack: string[]
  /** CTA on the product showcase; `primary` is the case-study CTA. */
  cardPrimary: string
  primary: string
  secondary: string
}

export const products: Product[] = [
  {
    id: 'buildcart',
    split: ['Build', 'Cart'],
    name: 'BuildCart',
    sector: 'Business Management Software',
    summary:
      'A modern business management software for wholesale, retail, and project-driven building material businesses. Manage inventory, sales, purchases, quotations, billing, orders, suppliers, customers, and complete operations from one unified platform. One-time licensed software built for the construction ecosystem.',
    audience: ['Building Material Dealers', 'Hardware Stores', 'Cement & Steel Suppliers', 'Retail & Wholesale', 'Architects & Developers', 'Builders & Contractors'],
    modules: ['Inventory Management', 'Purchase & Sales Orders', 'Quotation Builder', 'Billing & Invoicing', 'Supplier Management', 'Customer CRM', 'Business Reports', 'Stock Tracking'],
    challenge:
      'Building material dealers, wholesalers, architects, builders, and contractors worldwide rely on manual processes — paper ledgers, Excel sheets, WhatsApp orders — creating errors, delays, and lost revenue. There was no affordable, purpose-built software for this industry.',
    solution:
      'BuildCart is a comprehensive business management software designed exclusively for the construction materials ecosystem. It replaces fragmented workflows with one unified platform covering the complete business cycle — from supplier purchase to customer billing.',
    pricingLead: 'BuildCart is available as a',
    pricingModel: 'one-time licensed purchase',
    pricingRest: '— no recurring subscription fees. Pay once, own it fully. Includes setup assistance and initial training for your team.',
    stack: ['PHP / Laravel', 'MySQL', 'React', 'REST API'],
    cardPrimary: 'Get a Demo',
    primary: 'Book a Demo',
    secondary: 'Contact Us',
  },
  {
    id: 'opticsaas',
    split: ['Optic', 'SaaS'],
    name: 'OpticSaaS',
    sector: 'SaaS · Subscription Model',
    summary:
      'A cloud-based SaaS ERP designed specifically for optical stores and eyewear businesses. Manage inventory, customer records, prescriptions, sales, billing, and complete store operations — all on a simple monthly subscription. No heavy upfront cost, always up to date.',
    audience: ['Optical Stores', 'Eyewear Retailers', 'Optical Chains', 'Optometrists', 'Vision Care Businesses'],
    modules: ['Prescription Management', 'Frame & Lens Inventory', 'Billing & Invoicing', 'Customer Records', 'Purchase Orders', 'Sales Returns', 'Store Analytics', 'Follow-up Reminders'],
    challenge:
      'Optical stores across India manage customer prescriptions, lens inventory, frame collections, billing, and follow-up appointments using manual registers or generic software never designed for their needs — resulting in lost prescriptions, billing errors, poor stock control, and missed customer follow-ups.',
    solution:
      'OpticSaaS is a cloud-based SaaS ERP designed exclusively for the optical industry. Store owners subscribe monthly and get instant access to a fully managed, always-updated platform — no server setup, no IT team required. Just log in and run your store.',
    pricingLead: 'OpticSaaS runs on a',
    pricingModel: 'monthly subscription model',
    pricingRest: '. Affordable tiered plans based on store size, number of users, and features. Start small, scale as you grow — with zero upfront hardware or server costs.',
    stack: ['React / Next.js', 'Node.js', 'PostgreSQL', 'AWS', 'Multi-tenant Architecture'],
    cardPrimary: 'Start Free Trial',
    primary: 'Start Free Trial',
    secondary: 'View Pricing',
  },
]

export const workIntro = {
  title: 'Projects That Drive Real Results',
  body: 'A selection of solutions we’ve engineered across industries — each built to solve meaningful problems at scale.',
}

export type WorkItem = {
  title: string
  category: string
  body: string
  image?: string
  alt?: string
  /** Drawn technical diagram used when there is no photograph. */
  diagram?: 'graph' | 'network'
}

export const work: WorkItem[] = [
  {
    title: 'BuildCart — Building Materials ERP',
    category: 'Business Software',
    body: 'Inventory and operations management for building material dealers, wholesalers, builders, architects, and contractors.',
    image: '/images/work-materials.webp',
    alt: 'Stacked steel rebar and cement bags in a warehouse lit by a single beam of yellow light',
  },
  {
    title: 'OpticSaaS — Optical Store Management',
    category: 'Cloud ERP',
    body: 'Cloud-based business management with prescription and inventory tracking.',
    image: '/images/work-optics.webp',
    alt: 'Macro photograph of eyeglass lenses and a black frame with a yellow light reflection',
  },
  {
    title: 'Business Intelligence Dashboard',
    category: 'AI Automation',
    body: 'AI-powered analytics giving real-time insights into business performance metrics.',
    diagram: 'graph',
  },
  {
    title: 'Field Sales & Order Management App',
    category: 'Mobile App',
    body: 'Cross-platform app enabling sales teams to manage orders and clients on the go.',
    image: '/images/work-mobile.webp',
    alt: 'Hand holding a glowing smartphone at night with yellow city lights behind',
  },
  {
    title: 'Enterprise Azure Cloud Migration',
    category: 'Cloud Migration',
    body: 'Seamless migration of legacy systems to Azure with zero downtime.',
    image: '/images/work-cloud.webp',
    alt: 'Dark server room corridor with a yellow light strip along the floor',
  },
  {
    title: 'Multi-Platform API Ecosystem',
    category: 'API Integration',
    body: 'Unified API layer connecting payments, logistics, and third-party business tools.',
    diagram: 'network',
  },
]

export const about = {
  title: ['Awaken the Potential in', 'Your Technology'] as [string, string],
  paragraphs: [
    'TechAwaken Intelligence Pvt. Ltd. is a modern technology company building innovative software products and delivering intelligent technology solutions that transform how businesses operate and grow — worldwide.',
    'We combine deep technical expertise with a genuine understanding of business challenges — giving our clients both the technical precision of an engineering firm and the strategic thinking of a global growth partner.',
    'From early-stage startups seeking their first MVP to established enterprises modernizing critical systems, we bring the same commitment: build it right, build it scalable, build it for the long term.',
  ],
  mission: 'Democratize intelligent technology for businesses of every size, everywhere.',
  vision: 'Be the most trusted technology partner for innovative businesses globally.',
  values: [
    { title: 'Quality', body: 'Every line of code, every design decision reflects our commitment to excellence.' },
    { title: 'Partnership', body: 'We invest in your success as dedicated long-term technology partners.' },
  ],
  facts: [
    { value: '2026', label: 'Founded — Fresh, Agile & Ambitious', count: 0 },
    { value: '2', label: 'Products Built & Actively Growing', count: 2 },
    { value: '15+', label: 'Technologies in Our Stack', count: 15 },
    { value: 'Global', label: 'Worldwide Platform — Serving Clients Globally', count: 0 },
    { value: '< 24h', label: 'Average Response Time', count: 0 },
  ],
}

export const why = {
  title: 'Why Leading Businesses Choose Us',
  intro: 'We don’t just write code — we solve problems, think strategically, and build systems built to last.',
  reasons: [
    { title: 'Innovation First', body: 'We stay ahead of the curve, adopting AI, cloud-native architecture, and modern frameworks before they become industry standard.' },
    { title: 'Proven Reliability', body: 'Consistent delivery, transparent communication, and full accountability at every stage of your project lifecycle.' },
    { title: 'Modern Technologies', body: 'Full-stack expertise across React, Next.js, Python, Node.js, .NET, Azure, AWS, and all the tools that define modern software.' },
    { title: 'Scalable Architecture', body: 'Systems designed to grow with your business — from 10 users to 10 million, without painful rewrites.' },
    { title: 'Business Understanding', body: 'We invest time understanding your domain, workflows, and goals before writing a single line of code — whether you’re a local business or a global enterprise.' },
    { title: 'Long-Term Support', body: 'Post-launch maintenance, performance optimization, and feature evolution — we’re in it for the long run.' },
  ],
}

export const stackIntro = {
  title: 'Modern Tools for Modern Problems',
  body: 'A carefully curated stack built for performance, maintainability, and scale.',
}

export interface StackTool {
  name: string
  role: string
  tag: string
  featured?: boolean
}

export interface StackDomain {
  domain: string
  shortTitle: string
  code: string
  subtitle: string
  description: string
  icon: 'Layout' | 'Server' | 'Cloud' | 'Database'
  tools: StackTool[]
}

export const stackDomains: StackDomain[] = [
  {
    domain: 'Frontend Architecture',
    shortTitle: 'Frontend',
    code: '01 / UI & CLIENT',
    subtitle: 'Reactive & Type-Safe',
    description: 'High-FPS user interfaces, SSR architectures, and responsive web systems engineered for performance and fluid UX.',
    icon: 'Layout',
    tools: [
      { name: 'React', role: 'Component Architecture', tag: 'UI Library', featured: true },
      { name: 'Next.js', role: 'Full-Stack SSR & Edge', tag: 'SSR / Edge', featured: true },
      { name: 'TypeScript', role: 'End-to-End Type Safety', tag: 'Strict Types', featured: true },
      { name: 'Tailwind CSS', role: 'Utility-First Styling', tag: 'Design System' },
      { name: 'Vue.js', role: 'Progressive Web Apps', tag: 'Reactive' },
      { name: 'Angular', role: 'Enterprise Frontend', tag: 'Enterprise' },
    ],
  },
  {
    domain: 'Backend & Microservices',
    shortTitle: 'Backend',
    code: '02 / CORE & APIS',
    subtitle: 'High Throughput & Distributed',
    description: 'Resilient API gateways, asynchronous microservices, and high-performance server runtimes built for heavy concurrency.',
    icon: 'Server',
    tools: [
      { name: 'Python', role: 'AI, ML & Automation', tag: 'AI & Core', featured: true },
      { name: 'Node.js', role: 'Asynchronous Event I/O', tag: 'Runtime', featured: true },
      { name: '.NET', role: 'Enterprise Core Services', tag: 'Enterprise', featured: true },
      { name: 'FastAPI', role: 'High-Speed REST Endpoints', tag: 'Async API', featured: true },
      { name: 'GraphQL', role: 'Declarative Data Layer', tag: 'Graph API' },
      { name: 'PHP / Laravel', role: 'Rapid Web Applications', tag: 'Full-Stack' },
    ],
  },
  {
    domain: 'Cloud & Infrastructure',
    shortTitle: 'Cloud',
    code: '03 / DEVOPS & EDGE',
    subtitle: 'Multi-Cloud & Orchestration',
    description: 'Elastic multi-region infrastructure, containerized deployments, zero-downtime CI/CD, and global CDN caching.',
    icon: 'Cloud',
    tools: [
      { name: 'AWS', role: 'Global Cloud Infrastructure', tag: 'Cloud Infra', featured: true },
      { name: 'Microsoft Azure', role: 'Enterprise Cloud Solutions', tag: 'Cloud Suite' },
      { name: 'Docker', role: 'Container Standardization', tag: 'Containers', featured: true },
      { name: 'Kubernetes', role: 'Cluster Scale & Failover', tag: 'DevOps', featured: true },
      { name: 'Vercel', role: 'Edge Deployments & CDN', tag: 'Edge CDN' },
      { name: 'Firebase', role: 'Realtime Backend & Auth', tag: 'BaaS' },
    ],
  },
  {
    domain: 'Databases & Storage',
    shortTitle: 'Databases',
    code: '04 / DATA & CACHE',
    subtitle: 'ACID & Microsecond Reads',
    description: 'High-integrity relational data, distributed NoSQL document models, in-memory caching, and type-safe schema migrations.',
    icon: 'Database',
    tools: [
      { name: 'PostgreSQL', role: 'Relational & Vector Engine', tag: 'ACID SQL', featured: true },
      { name: 'MongoDB', role: 'Scalable Document Store', tag: 'NoSQL' },
      { name: 'Redis', role: 'In-Memory Microsecond Cache', tag: 'Cache', featured: true },
      { name: 'Supabase', role: 'Postgres & Realtime Subscriptions', tag: 'Realtime' },
      { name: 'Prisma', role: 'Type-Safe ORM & Client', tag: 'ORM', featured: true },
      { name: 'MySQL', role: 'Proven Structured Storage', tag: 'SQL' },
    ],
  },
]

export const stack: { domain: string; tools: string[] }[] = [
  { domain: 'Frontend', tools: ['React', 'Next.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Vue.js'] },
  { domain: 'Backend', tools: ['Python', 'Node.js', '.NET', 'PHP / Laravel', 'GraphQL', 'FastAPI'] },
  { domain: 'Cloud', tools: ['Microsoft Azure', 'AWS', 'Docker', 'Kubernetes', 'Firebase', 'Vercel'] },
  { domain: 'Databases', tools: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Prisma'] },
]

export const processIntro = {
  title: 'How We Build Great Products Together',
  body: 'A structured, transparent process that keeps you informed and in control at every stage.',
}

export const process = ['Discovery', 'Planning', 'Design', 'Development', 'Testing', 'Deployment', 'Support']

export const life = {
  title: 'A Place Where Talent Awakens',
  intro: 'We’re building more than software — we’re building a culture where smart people do their best work.',
  pillars: [
    { title: 'Growth Without Ceiling', body: 'We invest in your skills, fund your learning, and create pathways that match your ambition — whether technical, product, or leadership.' },
    { title: 'Innovation Culture', body: 'New ideas are welcomed, prototyped, and shipped. Your best thinking belongs here.' },
    { title: 'Collaborative Team', body: 'Cross-functional teams working with clarity, respect, and shared ownership of outcomes.' },
    { title: 'Continuous Learning', body: 'Regular tech talks, certifications, mentorship, and exposure to cutting-edge projects.' },
    { title: 'Work-Life Balance', body: 'Flexible culture that respects your time and energy — because your best work needs a balanced life.' },
  ],
}

export const careers = {
  title: 'Join the Team That’s Building the Future',
  body: 'We’re a growing team of builders, thinkers, and doers. If you love technology and want to work on products that matter, we’d love to connect with you.',
  status: 'Positions coming soon',
}

export const contact = {
  title: 'Ready to Build Something Extraordinary?',
  intro: 'Whether you have a project in mind, a product idea, or simply want to understand what’s possible — we’re ready to listen.',
  // Public Web3Forms key, as shipped in the live site's bundle.
  web3formsKey: '90f8f697-255e-40cc-85bc-8d814a719e4c',
  response: 'We typically respond to all inquiries within 24 hours. For urgent projects, reach us directly on phone.',
}

export const footer = {
  services: ['AI Solutions', 'Software Development', 'Mobile Apps', 'Cloud & DevOps', 'UI/UX Design', 'Digital Marketing'],
  company: [
    { label: 'Who We Are', href: '#about' },
    { label: 'Our Work', href: '#work' },
    { label: 'Life at TechAwaken', href: '#life' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact Us', href: '#contact' },
  ],
  copyright: 'All rights reserved.',
  hq: 'Worldwide Platform · Headquartered in Rajkot, Gujarat, India',
}
