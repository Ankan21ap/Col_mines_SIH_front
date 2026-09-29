import React from 'react'

/**
 * Badge — Status / severity / role indicator pill
 */
export default function Badge({ label, variant = 'default', size = 'sm', dot = false }) {
  const variants = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-slate-700/30 text-slate-500 border-slate-600/30',
    critical: 'bg-red-500/15 text-red-400 border-red-500/30',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    compliant: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    violation: 'bg-red-500/15 text-red-400 border-red-500/30',
    observation: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    pending: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
    maintenance: 'bg-slate-600/30 text-slate-400 border-slate-600/40',
    open: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    overdue: 'bg-red-500/15 text-red-400 border-red-500/30',
    admin: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    inspector: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    safety: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    manager: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    corporate: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    regulatory: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    corporate_regulatory: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  }

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  const dotColors = {
    active: 'bg-emerald-400',
    critical: 'bg-red-400',
    high: 'bg-orange-400',
    medium: 'bg-amber-400',
    low: 'bg-blue-400',
    pending: 'bg-violet-400',
    maintenance: 'bg-slate-500',
    default: 'bg-slate-400',
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${variants[variant] || variants.default} ${sizes[size]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />}
      {label}
    </span>
  )
}
