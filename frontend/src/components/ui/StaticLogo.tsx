import { cn } from '../../lib/utils'

export function StaticLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("w-10 h-10 drop-shadow-[0_0_15px_rgba(79,110,247,0.4)]", className)}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f6ef7" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Background Glow */}
      <circle cx="50" cy="50" r="40" fill="#4f6ef7" fillOpacity="0.05" />
      
      {/* The Ring */}
      <circle 
        cx="50" cy="50" r="42" 
        stroke="url(#logo-grad)" 
        strokeWidth="1" 
        strokeDasharray="4 4"
        className="opacity-40"
      />
      
      {/* The X - Arm 1 */}
      <rect 
        x="44" y="20" width="12" height="60" rx="4" 
        fill="url(#logo-grad)" 
        transform="rotate(45 50 50)" 
        filter="url(#glow)"
      />
      
      {/* The X - Arm 2 */}
      <rect 
        x="44" y="20" width="12" height="60" rx="4" 
        fill="url(#logo-grad)" 
        transform="rotate(-45 50 50)" 
        filter="url(#glow)"
      />

      {/* Central Star */}
      <path 
        d="M50 42L52 50L50 58L48 50L50 42Z" 
        fill="white" 
        className="drop-shadow-[0_0_5px_white]"
      />
    </svg>
  )
}
