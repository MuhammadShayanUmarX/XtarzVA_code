import { XtarzLogoMark } from './XtarzLogo'
import { cn } from '../../lib/utils'

/** @deprecated Use XtarzLogoMark or XtarzLogo instead. */
export function StaticLogo({ className }: { className?: string }) {
  return <XtarzLogoMark className={cn('w-10 h-10', className)} />
}
