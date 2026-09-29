import React from 'react'

/**
 * StatCard — Dashboard metric tile
 */
export default function StatCard({ label, value, sub, icon, trend, color = 'amber', onClick }) {
  const colors = {
    amber: { bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20', icon: 'bg-amber-500/20 text-amber-400', text: 'text-amber-400' },
    blue: { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', icon: 'bg-blue-500/20 text-blue-400', text: 'text-blue-400' },
    emerald: { bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', icon: 'bg-emerald-500/20 text-emerald-400', text: 'text-emerald-400' },
    red: { bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', icon: 'bg-red-500/20 text-red-400', text: 'text-red-400' },
    violet: { bg: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/20', icon: 'bg-violet-500/20 text-violet-400', text: 'text-violet-400' },
    slate: { bg: 'from-slate-700/30 to-slate-700/10', border: 'border-slate-700/50', icon: 'bg-slate-700/50 text-slate-400', text: 'text-slate-400' },
  }
  const c = colors[color] || colors.amber

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200
        ${c.bg} ${c.border}
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{label}</p>
          <p className="mt-1.5 text-3xl font-bold text-white leading-none">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
          {trend !== undefined && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={trend >= 0 ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
              {Math.abs(trend)}% vs last month
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
            {icon}
          </div>
        )}
      </div>
      {/* Decorative gradient orb */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20 bg-current ${c.text}`} />
    </div>
  )
}
