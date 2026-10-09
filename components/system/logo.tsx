import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span aria-hidden="true" className="relative block h-5 w-5">
        <span className="absolute inset-0 border-[1.5px] border-current" />
        <span className="absolute bottom-0 left-0 h-2 w-2 bg-signal" />
      </span>
      <span className="font-display text-[1.35rem] leading-none tracking-tight">
        TechAwaken
      </span>
    </span>
  )
}
