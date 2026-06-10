import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { Dialog, DialogContent } from '@radix-ui/react-dialog'
import {
  Search, Zap, BarChart2, ShoppingBag, Settings,
  History, Package, Sparkles, ChevronRight, Store, Megaphone, Wand2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CommandPalette({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-[640px] bg-landing-surface border border-landing-divider rounded-3xl shadow-[0_60px_120px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          <Command className="flex flex-col h-full">
            <div className="flex items-center px-6 py-4 border-b border-landing-divider relative group">
              <Search className="w-6 h-6 text-landing-muted group-focus-within:text-landing-accent transition-colors z-10" />
              <Command.Input
                value={searchValue}
                onValueChange={setSearchValue}
                placeholder="Search products, runs, settings..."
                className="flex-1 h-14 bg-transparent border-none outline-none text-white px-4 text-lg placeholder:text-landing-muted z-10 font-medium"
              />
              <div className="text-[10px] font-black text-landing-muted border border-landing-divider px-2 py-1 rounded-lg tracking-tight">
                ESC
              </div>
            </div>

            <Command.List className="max-h-[440px] overflow-y-auto p-4 custom-scrollbar">
              <Command.Empty className="py-12 text-center">
                <p className="text-sm text-landing-muted font-bold">No results found. Try different keywords.</p>
              </Command.Empty>

              <Command.Group heading="Quick Actions" className="text-[11px] font-black text-landing-muted px-4 py-3 tracking-tight">
                <CommandItem icon={Sparkles} label="Product Discovery" sub="Find winning products" onSelect={() => runCommand(() => navigate('/dashboard/products'))} />
                <CommandItem icon={Store} label="Competitor Intel" sub="Research your competition" onSelect={() => runCommand(() => navigate('/dashboard/insights'))} />
                <CommandItem icon={Package} label="Source Suppliers" sub="Find the best margins" onSelect={() => runCommand(() => navigate('/dashboard/sourcing'))} />
                <CommandItem icon={Megaphone} label="Ad Creative" sub="SEO, copy, tags, and Meta ads" onSelect={() => runCommand(() => navigate('/dashboard/ads'))} />
                <CommandItem icon={Wand2} label="Store Builder" sub="Download Shopify theme ZIP" onSelect={() => runCommand(() => navigate('/dashboard/shopify'))} />
              </Command.Group>

              <Command.Group heading="Navigation" className="text-[11px] font-black text-landing-muted px-4 py-3 tracking-tight mt-4">
                <CommandItem icon={BarChart2} label="Analytics" sub="View performance data" onSelect={() => runCommand(() => navigate('/dashboard/analytics'))} />
                <CommandItem icon={History} label="Run History" sub="Browse past scans" onSelect={() => runCommand(() => navigate('/dashboard/runs'))} />
                <CommandItem icon={ShoppingBag} label="Shopify Sync" sub="Manage store connection" onSelect={() => runCommand(() => navigate('/dashboard/shopify'))} />
                <CommandItem icon={Settings} label="Settings" sub="Account and preferences" onSelect={() => runCommand(() => navigate('/dashboard/settings'))} />
              </Command.Group>
            </Command.List>

            <div className="p-4 border-t border-landing-divider bg-white/[0.02] flex items-center justify-between">
              <span className="text-[10px] font-black text-landing-muted tracking-tight">Navigate ↑↓ · Select Enter</span>
            </div>
          </Command>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

function CommandItem({ icon: Icon, label, sub, onSelect }: { icon: React.ElementType; label: string; sub: string; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-landing-secondary aria-selected:bg-white/[0.05] aria-selected:text-white cursor-pointer transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-landing-divider flex items-center justify-center group-aria-selected:border-landing-accent/40 group-aria-selected:text-landing-accent transition-all">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">{label}</p>
          <p className="text-[11px] text-landing-muted font-medium">{sub}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-landing-muted opacity-0 group-aria-selected:opacity-100 transition-all" />
    </Command.Item>
  )
}
