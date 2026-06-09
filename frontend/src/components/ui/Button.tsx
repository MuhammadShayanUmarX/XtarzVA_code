import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "../../lib/utils"

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "emerald"
  size?: "sm" | "md" | "lg" | "xl" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-cta text-white shadow-glow hover:brightness-110",
      secondary: "bg-brand-800 text-white border border-white/10 hover:bg-brand-700",
      ghost: "bg-transparent text-brand-400 hover:text-white hover:bg-white/5",
      outline: "bg-transparent text-white border border-white/10 hover:border-accent-primary/50 hover:bg-accent-primary/5",
      danger: "bg-accent-rose text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:brightness-110",
      emerald: "bg-accent-emerald text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110",
    }

    const sizes = {
      sm: "h-8 px-3 text-[12px] font-bold",
      md: "h-10 px-5 text-[14px] font-bold",
      lg: "h-12 px-8 text-[15px] font-bold",
      xl: "h-15 px-10 text-[17px] font-bold",
      icon: "h-10 w-10 flex items-center justify-center",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] group cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
