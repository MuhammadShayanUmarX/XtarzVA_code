import { cn } from '../../lib/utils'

type XtarzLogoMarkProps = {
  className?: string
}

/** Shared brand mark — copper chevron on stone square. */
export function XtarzLogoMark({ className }: XtarzLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-8 h-8 shrink-0', className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" className="fill-landing-elevated" />
      <path
        d="M9 10L16 22L23 10"
        stroke="#E07A3A"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 10H21"
        stroke="#F4A261"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

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
      <XtarzLogoMark className={markClassName} />
      {showText && (
        <span className={cn('font-semibold text-landing-primary tracking-tight', textClassName)}>
          XtarzVA
        </span>
      )}
    </span>
  )
}
