import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full space-y-8 glass-panel p-12 border-accent-rose/20 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-accent-rose shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
             
             <div className="w-20 h-20 rounded-3xl bg-accent-rose/10 border border-accent-rose/20 flex items-center justify-center text-accent-rose mx-auto animate-pulse">
                <AlertTriangle size={40} />
             </div>

             <div className="space-y-4">
                <h1 className="text-3xl font-black text-white tracking-tight">System Protocol Failure</h1>
                <p className="text-brand-500 font-medium leading-relaxed">
                   An unexpected anomaly has occurred in the core runtime. Our agents are currently re-routing to stabilize the platform.
                </p>
                {this.state.error && (
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-accent-rose/70 text-left overflow-auto max-h-32 custom-scrollbar">
                    {this.state.error.message}
                  </div>
                )}
             </div>

             <div className="flex flex-col gap-3 pt-4">
                <button 
                  onClick={this.handleReset}
                  className="w-full h-14 bg-white text-brand-950 rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                >
                   <RefreshCcw size={18} />
                   Restart Core OS
                </button>
                <a 
                  href="/"
                  className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                >
                   <Home size={18} />
                   Return to Nexus
                </a>
             </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
