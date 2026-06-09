import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "glass" | "subtle" | "outline" | "elevated" | "accent"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", ...props }, ref) => {
    const variants = {
      glass: "bg-white/[0.03] backdrop-blur-xl border border-white/5",
      subtle: "bg-brand-900/40 border border-white/5",
      outline: "bg-transparent border border-white/10",
      elevated: "bg-brand-900 border border-white/10 shadow-2xl",
      accent: "bg-accent-primary/5 border border-accent-primary/20",
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl overflow-hidden",
          variants[variant],
          className
        )}
        {...(props as any)}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }
