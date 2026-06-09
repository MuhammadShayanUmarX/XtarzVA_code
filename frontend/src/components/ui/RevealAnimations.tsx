import { useState, useEffect, ReactNode } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface FadeInProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  className?: string
  width?: "fit-content" | "100%"
}

export function FadeIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.5,
  className,
  width = "fit-content"
}: FadeInProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 24 : direction === 'down' ? -24 : 0,
      x: direction === 'left' ? 24 : direction === 'right' ? -24 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    }
  }

  return (
    <div ref={ref} style={{ width, position: 'relative' }} className={className}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={controls}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function CountUp({ value, suffix = "", prefix = "", duration = 1.5 }: { value: number, suffix?: string, prefix?: string, duration?: number }) {
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
   const [displayValue, setDisplayValue] = useState(0)

   useEffect(() => {
      if (inView) {
         let start = 0
         const end = value
         const totalMiliseconds = duration * 1000
         const incrementTime = 20
         const totalSteps = totalMiliseconds / incrementTime
         const increment = end / totalSteps

         const timer = setInterval(() => {
            start += increment
            if (start >= end) {
               setDisplayValue(end)
               clearInterval(timer)
            } else {
               setDisplayValue(Math.floor(start))
            }
         }, incrementTime)
         return () => clearInterval(timer)
      }
   }, [inView, value, duration])

   return (
      <span ref={ref} className="tabular-nums">
         {prefix}{displayValue.toLocaleString()}{suffix}
      </span>
   )
}
