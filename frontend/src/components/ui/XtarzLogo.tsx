import { cn } from '../../lib/utils'

type XtarzLogoProps = {
  className?: string
  markClassName?: string
  showText?: boolean
  textClassName?: string
}

export function XtarzLogo({
  className,
  markClassName,
  showText = true,
  textClassName,
}: XtarzLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('w-8 h-8 shrink-0', markClassName)}
        aria-hidden
      >
        <rect width="32" height="32" rx="8" className="fill-landing-elevated" />
        <path
          d="M9 10L16 22L23 10"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-landing-accent"
        />
        <path
          d="M11 10H21"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          className="text-landing-accentSoft"
        />
      </svg>
      {showText && (
        <span className={cn('font-semibold text-landing-primary tracking-tight', textClassName)}>
          XtarzVA
        </span>
      )}
    </span>
  )
}
