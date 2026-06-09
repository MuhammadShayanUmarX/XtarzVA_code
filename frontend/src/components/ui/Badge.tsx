import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "outline" | "emerald" | "amber" | "rose" | "cyan" | "violet"
}

function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  const variants = {
    primary: "bg-accent-primary/10 text-accent-primary border-accent-primary/20",
    secondary: "bg-brand-800 text-brand-300 border-white/5",
    outline: "bg-transparent text-white border-white/10",
    emerald: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20",
    amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/20",
    rose: "bg-accent-rose/10 text-accent-rose border-accent-rose/20",
    cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20",
    violet: "bg-accent-violet/10 text-accent-violet border-accent-violet/20",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
