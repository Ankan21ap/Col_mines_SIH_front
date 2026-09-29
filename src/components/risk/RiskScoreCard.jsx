import React from 'react'

/**
 * RiskScoreCard — Displays a mine's AI risk score with circular gauge
 */
export default function RiskScoreCard({ score, level, mineName, compact = false }) {
  const isHigh  = level === 'high' || score >= 75
  const isMed   = level === 'medium' || (score >= 50 && score < 75)

  const color      = isHigh ? '#EF4444' : isMed ? '#F59E0B' : '#10B981'
  const bgClass    = isHigh ? 'bg-red-500/10 border-red-500/30'
                   : isMed  ? 'bg-amber-500/10 border-amber-500/30'
                   :          'bg-emerald-500/10 border-emerald-500/30'
  const textClass  = isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
  const levelLabel = isHigh ? '🔴 HIGH RISK' : isMed ? '🟡 MEDIUM RISK' : '🟢 LOW RISK'

  // SVG circular gauge
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (score / 100) * circumference

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${bgClass}`}>
        <span className={`text-lg font-black font-mono ${textClass}`}>{score}</span>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold">Risk</p>
          <p className={`text-[10px] font-bold ${textClass}`}>{level?.toUpperCase()}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border p-6 ${bgClass} space-y-4`}>
      {mineName && (
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{mineName}</p>
      )}

      {/* Circular gauge */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            {/* Track */}
            <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            {/* Progress */}
            <circle
              cx="48" cy="48" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black font-mono ${textClass}`}>{score}</span>
            <span className="text-[9px] text-slate-400 font-bold">/ 100</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className={`text-sm font-black ${textClass}`}>{levelLabel}</p>
          <p className="text-xs text-slate-400">AI-computed risk index</p>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Deterministic weighted scoring across<br/>violations, actions, and inspection trend.
          </p>
        </div>
      </div>
    </div>
  )
}
