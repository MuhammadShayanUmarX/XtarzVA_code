import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function RouteLoader() {
 const location = useLocation()
 const [isLoading, setIsLoading] = useState(false)
 const minDisplayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
 const prevPathRef = useRef(location.pathname)

 useEffect(() => {
 if (location.pathname !== prevPathRef.current) {
 prevPathRef.current = location.pathname
 
 setIsLoading(true)

 if (minDisplayTimeoutRef.current) {
 clearTimeout(minDisplayTimeoutRef.current)
 }

 minDisplayTimeoutRef.current = setTimeout(() => {
 setIsLoading(false)
 }, 500)
 }

 return () => {
 if (minDisplayTimeoutRef.current) {
 clearTimeout(minDisplayTimeoutRef.current)
 }
 }
 }, [location.pathname])

 return (
 <AnimatePresence>
 {isLoading && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 z-[9999] bg-landing-bg/90 backdrop-blur-md flex flex-col items-center justify-center"
 >
 <Loader2 className="w-14 h-14 text-landing-accent animate-spin mb-4" />
 <p className="text-[11px] font-black text-landing-secondary tracking-tight">
 Initializing Next Sequence...
 </p>
 </motion.div>
 )}
 </AnimatePresence>
 )
}
