import React from 'react'
import { useRBAC } from '../../context/RBACContext.jsx'
import { ROLE_COLORS } from '../../utils/permissions.js'
import Emblem from './Emblem.jsx'

export default function MinistryHeroBanner({
  title,
  subtitle,
  badgeText,
  stats = [],
  actionButton,
  backgroundImage = '/assets/coal_mine_hero.jpg',
}) {
  const { user, roleLabel } = useRBAC()
  const roleColor = user ? ROLE_COLORS[user.role] : { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' }

  return (
    <div className="relative rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl shadow-black/40 bg-slate-900">
      {/* Background Image with Dark Industrial Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60 backdrop-blur-[2px]" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#F59E0B 1px, transparent 1px), linear-gradient(90deg, #F59E0B 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
              Government of India • Ministry of Coal
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}>
              {roleLabel}
            </span>
            {badgeText && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/80 text-slate-300 border border-slate-700">
                {badgeText}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Emblem size="md" variant="gold" showText={false} className="hidden sm:flex" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {title || 'National Coal Mine Governance & Intelligence Platform'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal leading-relaxed">
                {subtitle || 'Ministry of Coal & DGMS statutory mine surveillance, compliance intelligence and risk monitoring center.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Stats & Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
          {actionButton && <div>{actionButton}</div>}

          {stats.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {stats.map((st, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-right"
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">{st.label}</p>
                  <p className="text-base sm:text-lg font-black text-amber-400 font-mono leading-tight">{st.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
